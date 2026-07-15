// POST /api/leads — endpoint server-side para captura de prospectos.
//
// Flujo (dual-write):
//   1. Valida payload (mismas reglas que tenía lib/emma.ts).
//   2. INSERT en Neon con emma_status='pending'. SIEMPRE se ejecuta —
//      aunque Emma esté caída, el lead queda respaldado.
//   3. POST a Emma con la key server-only.
//   4. UPDATE del registro con emma_status final (sent | failed | invalid).
//
// Si paso 2 falla, devolvemos 503 al cliente. Si paso 3 falla pero
// paso 2 sí guardó, devolvemos 200 al cliente — el lead está a salvo
// y podemos reintentar a Emma desde el panel de admin.

import { NextRequest, NextResponse, after } from "next/server";
import { sql } from "@/lib/db";
import { enviarLeadAEmmaServer, type EmmaServerPayload } from "@/lib/emma-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ──────────────────────────────────────────────────────────────────────────────
// CORS — permite que las landing pages estáticas (otro dominio) posteen aquí.
// Solo orígenes propios de CENYCA. El endpoint ya es público y rate-limited, y no
// devuelve datos sensibles, pero igual restringimos a nuestros dominios.

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
};

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

  // 1) Parse del body
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return reply({ ok: false, reason: "invalid_body", message: "Body inválido." }, 400);
  }

  // 2) Rate limit
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return reply(
      {
        ok: false,
        reason: "rate_limited",
        message: "Demasiados intentos. Espera un momento e intenta de nuevo.",
      },
      429,
    );
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
  if (!nombre) {
    return reply(
      { ok: false, reason: "invalid_name", message: "Por favor escribe tu nombre completo." },
      422,
    );
  }

  const source = toStr(body.source, 100) || "unknown";
  const email = toStr(body.email, 200);
  const carrera = toStr(body.carrera, 200);
  const plantel = toStr(body.plantel, 100);
  const ciudad = toStr(body.ciudad, 100);
  const turno = toStr(body.turno, 100);
  const mensaje = toStr(body.mensaje, 2000);

  const referer = req.headers.get("referer")?.slice(0, 500) || null;
  const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
  const ipHash = await hashIp(ip);

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
    // eslint-disable-next-line no-console
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

  // 5) Llamada a Emma. Aunque falle, el lead ya está respaldado.
  const emmaPayload: EmmaServerPayload = {
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
  const emmaResult = await enviarLeadAEmmaServer(emmaPayload);

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
    // eslint-disable-next-line no-console
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
  // 8) Espejo al Dashboard de analítica (NO es un CRM, solo reporting).
  //
  // Fire-and-forget: no usamos await. La respuesta al usuario sale ya mismo;
  // el dashboard recibe el lead en paralelo. Si el dashboard está caído o
  // tarda, el form no se afecta — Neon y Emma ya tienen el respaldo.
  //
  // Las dos env vars (URL + TOKEN) son opcionales: si no están seteadas,
  // el bloque ni se ejecuta. Útil para entornos sin dashboard configurado.
  // ──────────────────────────────────────────────────────────────────────────
  const dashboardUrl = process.env.DASHBOARD_WEBHOOK_URL;
  const dashboardToken = process.env.DASHBOARD_WEBHOOK_TOKEN;
  if (dashboardUrl && dashboardToken) {
    // `after()` mantiene viva la función serverless después de responder al
    // usuario hasta que el fetch termine. Antes usábamos fire-and-forget
    // (sin await), pero en Vercel serverless eso muere apenas responde la
    // función, así que el dashboard nunca recibía los leads.
    after(async () => {
      try {
        await fetch(dashboardUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-webhook-token": dashboardToken,
          },
          body: JSON.stringify({
            nombre,
            telefono,
            email,
            fuente: "web",
            campania: source, // ej. "landing-licenciaturas", "promo-becas"
            plantel,           // "Casa Blanca", "Palmas", "Otay", "Tecate"
            // Lo extra queda en la columna `raw` del dashboard para auditoría
            carrera,
            ciudad,
            turno,
            mensaje,
          }),
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[/api/leads] dashboard webhook falló:", err);
      }
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 9) WhatsApp de bienvenida al prospecto (Meta Cloud API, envío directo).
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
  if (waToken && waPhoneId && waTemplate) {
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
                    parameters: [{ type: "text", text: nombre }],
                  },
                ],
              },
            }),
          },
        );
        if (!res.ok) {
          const detail = await res.text();
          // eslint-disable-next-line no-console
          console.error("[/api/leads] WhatsApp rechazado:", res.status, detail);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[/api/leads] WhatsApp falló:", err);
      }
    });
  }

  return reply({ ok: true });
}
