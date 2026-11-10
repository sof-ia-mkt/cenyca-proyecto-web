// POST /api/leads — endpoint server-side para captura de prospectos.
//
// Flujo (dual-write):
//   1. Valida payload (mismas reglas que tenía lib/emma.ts).
//   2. INSERT en Neon con emma_status='pending'. SIEMPRE se ejecuta —
//      aunque el dashboard esté caído, el lead queda respaldado.
//   3. POST al Dashboard de inscripciones (plataforma propia).
//   4. UPDATE del registro con emma_status final (sent | failed).
//
// (La columna se sigue llamando emma_status por historia — desde jul 2026
// significa "entregado al dashboard". El CRM Emma de Novai fue apagado.)
//
// Si paso 2 falla, devolvemos 503 al cliente. Si paso 3 falla pero
// paso 2 sí guardó, devolvemos 200 al cliente — el lead está a salvo
// y podemos reintentarlo desde el panel de admin.

import { NextRequest, NextResponse, after } from "next/server";
import { sql } from "@/lib/db";
import { enviarLeadADashboard, type DashboardLeadPayload } from "@/lib/dashboard-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ──────────────────────────────────────────────────────────────────────────────
// CORS — permite que las landing pages estáticas (otro dominio) posteen aquí.
// Solo orígenes propios de CENYCA. El endpoint es público y no devuelve datos
// sensibles; CORS solo frena a otros sitios en el navegador, no a un script: los
// candados reales están en «Candados contra abuso», más abajo.

const ALLOWED_ORIGINS = new Set([
  "https://www.cenycauniversidad.mx",
  "https://cenycauniversidad.mx",
]);

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
  }
  return { Vary: "Origin" };
}

export function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Validación

function esTelefonoValido(tel: string): boolean {
  if (tel.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(tel)) return false; // todos iguales
  if (!/^[2-9]/.test(tel)) return false; // primer dígito 2-9 (lada MX)
  return true;
}

function normalizarTelefono(input: string): string {
  return input.replace(/\D/g, "").slice(-10);
}

type Payload = {
  telefono?: unknown;
  nombre?: unknown;
  email?: unknown;
  carrera?: unknown;
  plantel?: unknown;
  ciudad?: unknown;
  turno?: unknown;
  mensaje?: unknown;
  source?: unknown;
  /** Campo trampa: los formularios lo mandan vacío; un bot lo rellena. */
  campo_extra?: unknown;
};

// ──────────────────────────────────────────────────────────────────────────────
// Candados contra abuso
//
// Este endpoint es público y, al guardar un lead, manda una plantilla de
// WhatsApp desde el número oficial al teléfono que venga en el formulario, con
// el «nombre» dentro del mensaje. Sin candados, un script puede usarlo para
// mandar mensajes (con un enlace en el nombre) a números ajenos.

const MAX_BODY_BYTES = 10_000;

/** Un nombre de persona no trae enlaces ni marcado. */
function nombreSospechoso(nombre: string): boolean {
  return /https?:|www\.|:\/\/|[<>{}\[\]]|\.(com|mx|net|org|io|ly|me|co|xyz|info|link|site)\b/i.test(
    nombre,
  );
}

/** Nombre apto para ir dentro de la plantilla de WhatsApp: solo letras y
 *  separadores de nombre, sin saltos de línea, máximo 60 caracteres. */
function nombreParaWhatsApp(nombre: string): string {
  return nombre
    .replace(/[^\p{L}\p{M} .'’-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60)
    .trim();
}

function esEmailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Topes que se cuentan en la base (valen entre instancias, a diferencia del
// contador en memoria de abajo):
const MAX_LEADS_IP_10MIN = 10; // mismo origen: más de esto en 10 min se rechaza
const MAX_LEADS_HORA_PARA_WA = 60; // ráfaga global: se guarda el lead, sin WhatsApp

type Conteos = { ip10: number; tel24: number; hora: number };

/** Cuenta lo ya guardado para decidir. Si la consulta falla devuelve null y el
 *  lead se guarda igual, pero sin WhatsApp (ante la duda no se manda). */
async function contarRecientes(ipHash: string, telefono: string): Promise<Conteos | null> {
  try {
    const filas = (await sql`
      SELECT
        COUNT(*) FILTER (
          WHERE ip_hash = ${ipHash} AND created_at > NOW() - INTERVAL '10 minutes'
        )::int AS ip10,
        COUNT(*) FILTER (WHERE telefono = ${telefono})::int AS tel24,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')::int AS hora
      FROM leads
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `) as Conteos[];
    return filas[0] ?? { ip10: 0, tel24: 0, hora: 0 };
  } catch (err) {
    console.error("[/api/leads] Error al contar recientes:", err);
    return null;
  }
}

function toStr(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

// ──────────────────────────────────────────────────────────────────────────────
// Rate limit en memoria — protección básica contra spam por IP.
// Para producción a escala se usaría Upstash/Redis, pero para nuestro
// volumen (universidad local) esto es suficiente y gratis.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000; // 1 min
const MAX_PER_WINDOW = 5; // 5 submits/min por IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (b.count >= MAX_PER_WINDOW) return false;
  b.count += 1;
  return true;
}

// Limpieza periódica del map (cada 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
}, 5 * 60_000).unref?.();

// ──────────────────────────────────────────────────────────────────────────────
// Helpers de request

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xri = req.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

async function hashIp(ip: string): Promise<string> {
  if (ip === "unknown") return "unknown";
  // SHA256 + salt diaria para evitar correlación cross-day pero permitir
  // detectar duplicados/spam dentro del mismo día.
  const salt = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const data = new TextEncoder().encode(`${ip}|${salt}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

// ──────────────────────────────────────────────────────────────────────────────
// Tipos del registro insertado (lo poco que necesitamos para el UPDATE)

type LeadRow = { id: string };

// ──────────────────────────────────────────────────────────────────────────────
// Handler

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req.headers.get("origin"));
  const reply = (data: unknown, status = 200) =>
    NextResponse.json(data, { status, headers: cors });

  const demasiados = () =>
    reply(
      {
        ok: false,
        reason: "rate_limited",
        message: "Demasiados intentos. Espera un momento e intenta de nuevo.",
      },
      429,
    );

  // 1) Rate limit en memoria (primer filtro, barato; el tope firme se cuenta en
  //    la base más abajo) y tamaño del cuerpo, antes de leerlo.
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) return demasiados();

  const declarado = Number(req.headers.get("content-length") ?? "0");
  if (declarado > MAX_BODY_BYTES) {
    return reply({ ok: false, reason: "invalid_body", message: "Body inválido." }, 413);
  }

  // 2) Parse del body
  let body: Payload;
  try {
    const crudo = await req.text();
    if (crudo.length > MAX_BODY_BYTES) {
      return reply({ ok: false, reason: "invalid_body", message: "Body inválido." }, 413);
    }
    body = JSON.parse(crudo) as Payload;
    if (!body || typeof body !== "object") throw new Error("no es objeto");
  } catch {
    return reply({ ok: false, reason: "invalid_body", message: "Body inválido." }, 400);
  }

  // Campo trampa: una persona no lo ve ni lo llena. Se responde OK para que el
  // bot no sepa que fue descartado; no se guarda nada ni se manda WhatsApp.
  if (typeof body.campo_extra === "string" && body.campo_extra.trim() !== "") {
    console.warn("[/api/leads] Descartado por campo trampa");
    return reply({ ok: true });
  }

  // 3) Validación
  const telefonoRaw = toStr(body.telefono, 50) || "";
  const telefono = normalizarTelefono(telefonoRaw);
  if (!esTelefonoValido(telefono)) {
    return reply(
      {
        ok: false,
        reason: "invalid_phone",
        message: "Verifica tu teléfono. Debe ser un número mexicano válido de 10 dígitos.",
      },
      422,
    );
  }

  const nombre = toStr(body.nombre, 200);
  if (!nombre || nombreSospechoso(nombre)) {
    return reply(
      { ok: false, reason: "invalid_name", message: "Por favor escribe tu nombre completo." },
      422,
    );
  }

  const source = toStr(body.source, 100) || "unknown";
  const emailCrudo = toStr(body.email, 200);
  // Un correo mal escrito no debe costar el prospecto: se guarda sin correo.
  const email = emailCrudo && esEmailValido(emailCrudo) ? emailCrudo : null;
  const carrera = toStr(body.carrera, 200);
  const plantel = toStr(body.plantel, 100);
  const ciudad = toStr(body.ciudad, 100);
  const turno = toStr(body.turno, 100);
  const mensaje = toStr(body.mensaje, 2000);

  const referer = req.headers.get("referer")?.slice(0, 500) || null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
  const ipHash = await hashIp(ip);

  // Topes contados en la base, ANTES de guardar este lead.
  const conteos = await contarRecientes(ipHash, telefono);
  if (conteos && ipHash !== "unknown" && conteos.ip10 >= MAX_LEADS_IP_10MIN) {
    console.warn("[/api/leads] Tope por origen alcanzado:", conteos.ip10);
    return demasiados();
  }
  // El WhatsApp de bienvenida solo sale si: se pudo contar, este teléfono no
  // tuvo otro lead en 24 h (ya recibió su mensaje) y no hay una ráfaga global.
  const waPermitido =
    conteos !== null && conteos.tel24 === 0 && conteos.hora < MAX_LEADS_HORA_PARA_WA;

  // 4) INSERT en Neon — esto es lo crítico. Si falla, devolvemos 503
  //    porque sin respaldo no queremos perder el lead intentando Emma.
  let leadId: string;
  try {
    const inserted = (await sql`
      INSERT INTO leads (
        nombre, telefono, email, carrera, plantel, ciudad, turno, mensaje,
        source, referer, user_agent, ip_hash,
        emma_status
      ) VALUES (
        ${nombre}, ${telefono}, ${email}, ${carrera}, ${plantel}, ${ciudad}, ${turno}, ${mensaje},
        ${source}, ${referer}, ${userAgent}, ${ipHash},
        'pending'
      )
      RETURNING id
    `) as LeadRow[];

    if (!inserted[0]?.id) throw new Error("INSERT no devolvió id");
    leadId = inserted[0].id;
  } catch (err) {
    console.error("[/api/leads] Error INSERT:", err);
    return reply(
      {
        ok: false,
        reason: "server",
        message: "No pudimos guardar tus datos. Intenta de nuevo o escríbenos por WhatsApp.",
      },
      503,
    );
  }

  // 5) Entrega al Dashboard de inscripciones. Aunque falle, el lead ya está
  //    respaldado en Neon y se puede reintentar desde el panel de admin.
  const dashPayload: DashboardLeadPayload = {
    telefono,
    nombre,
    email: email || undefined,
    carrera: carrera || undefined,
    plantel: plantel || undefined,
    ciudad: ciudad || undefined,
    turno: turno || undefined,
    mensaje: mensaje || undefined,
    source,
  };
  const emmaResult = await enviarLeadADashboard(dashPayload);

  // 6) UPDATE del registro con el resultado de Emma
  try {
    if (emmaResult.ok) {
      await sql`
        UPDATE leads
           SET emma_status = 'sent',
               emma_sent_at = NOW(),
               emma_attempts = emma_attempts + 1
         WHERE id = ${leadId}
      `;
    } else {
      const finalStatus = emmaResult.reason === "invalid_phone" ? "invalid" : "failed";
      const errMsg = `${emmaResult.reason}: ${emmaResult.message}`.slice(0, 1000);
      await sql`
        UPDATE leads
           SET emma_status = ${finalStatus},
               emma_error = ${errMsg},
               emma_attempts = emma_attempts + 1
         WHERE id = ${leadId}
      `;
    }
  } catch (err) {
    // No es crítico — el lead está guardado. Log y seguimos.
    console.error("[/api/leads] Error UPDATE emma_status:", err);
  }

  // 7) Respuesta al cliente. Si Emma falló pero ya guardamos en DB,
  //    seguimos respondiendo OK al usuario — su lead no se perdió y
  //    podemos reintentarlo desde admin. Solo devolvemos error si
  //    el problema es del lado del cliente (teléfono inválido).
  if (!emmaResult.ok && emmaResult.reason === "invalid_phone") {
    return reply(
      {
        ok: false,
        reason: "invalid_phone",
        message: "Verifica tu teléfono. Debe ser un número válido.",
      },
      422,
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8) WhatsApp de bienvenida al prospecto (Meta Cloud API, envío directo).
  //
  // Fire-and-forget con after() para que el fetch sobreviva a la respuesta en
  // Vercel serverless. Solo se ejecuta si están las 3 env vars necesarias; si
  // falta alguna, el lead igual se guardó y respondemos OK normal.
  //
  // El número se manda como 52 + 10 dígitos; Meta lo normaliza al wa_id.
  // La plantilla `confirmacion_formulario_web` tiene 1 variable: {{1}} = nombre.
  // ──────────────────────────────────────────────────────────────────────────
  const waToken = process.env.WHATSAPP_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const waTemplate = process.env.WHATSAPP_TEMPLATE_NAME;
  const waVersion = process.env.WHATSAPP_API_VERSION || "v25.0";
  const waLang = process.env.WHATSAPP_LANG_CODE || "es_MX";
  const nombreWa = nombreParaWhatsApp(nombre);
  if (!waPermitido || !nombreWa) {
    console.warn(
      "[/api/leads] WhatsApp de bienvenida omitido:",
      !nombreWa
        ? "nombre sin letras"
        : conteos === null
          ? "no se pudo contar"
          : conteos.tel24 > 0
            ? "teléfono repetido en 24 h"
            : "ráfaga de leads en la última hora",
    );
  } else if (waToken && waPhoneId && waTemplate) {
    after(async () => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/${waVersion}/${waPhoneId}/messages`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${waToken}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: `52${telefono}`,
              type: "template",
              template: {
                name: waTemplate,
                language: { code: waLang },
                components: [
                  {
                    type: "body",
                    parameters: [{ type: "text", text: nombreWa }],
                  },
                ],
              },
            }),
          },
        );
        if (!res.ok) {
          const detail = await res.text();
                console.error("[/api/leads] WhatsApp rechazado:", res.status, detail);
        }
      } catch (err) {
            console.error("[/api/leads] WhatsApp falló:", err);
      }
    });
  }

  return reply({ ok: true });
}
