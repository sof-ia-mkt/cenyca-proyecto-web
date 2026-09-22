// POST /admin/leads/api/retry/[id]
// Reintenta entregar al Dashboard de inscripciones un lead que falló.
// Protegido por proxy.ts (basic auth en /admin/*).

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { enviarLeadADashboard, type DashboardLeadPayload } from "@/lib/dashboard-server";
import {
  credencialesValidas,
  origenAjeno,
  respuestaNoAutorizado,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  nombre: string;
  telefono: string;
  email: string | null;
  carrera: string | null;
  plantel: string | null;
  ciudad: string | null;
  turno: string | null;
  mensaje: string | null;
  source: string;
  emma_status: string;
  emma_attempts: number;
};

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await credencialesValidas(req.headers.get("authorization")))) {
    return respuestaNoAutorizado();
  }
  // Basic Auth viaja sola en un formulario cross-site: sin esto, una página
  // ajena podría disparar reenvíos con las credenciales ya cacheadas.
  if (origenAjeno(req.headers.get("sec-fetch-site"))) {
    return NextResponse.json(
      { ok: false, message: "Origen no permitido." },
      { status: 403 },
    );
  }

  const { id } = await ctx.params;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json(
      { ok: false, message: "ID inválido." },
      { status: 400 },
    );
  }

  // Bloqueo optimista sobre emma_attempts. Antes eran un SELECT y luego un
  // UPDATE sin condición, así que dos clics seguidos (o un reintento mientras
  // el envío original seguía en vuelo) entregaban el mismo lead dos veces.
  //
  // Se lee el contador y se incrementa exigiendo que siga igual: si otra
  // petición ganó la carrera, esta actualiza 0 filas y se detiene. No se usa
  // un estado "en curso" a propósito: si la función se cayera a mitad del
  // envío, el lead quedaría atrapado en ese estado, invisible para el panel
  // y sin forma de reintentarlo. Así, ante una caída sigue en 'failed' y
  // se puede volver a intentar.
  const rows = (await sql`
    SELECT id, nombre, telefono, email, carrera, plantel, ciudad, turno, mensaje,
           source, emma_status, emma_attempts
      FROM leads
     WHERE id = ${id}
     LIMIT 1
  `) as LeadRow[];
  const lead = rows[0];
  if (!lead) {
    return NextResponse.json(
      { ok: false, message: "Lead no encontrado." },
      { status: 404 },
    );
  }
  if (lead.emma_status === "sent") {
    return NextResponse.json(
      { ok: false, message: "Este lead ya fue entregado al dashboard." },
      { status: 409 },
    );
  }

  const reclamado = (await sql`
    UPDATE leads
       SET emma_attempts = emma_attempts + 1
     WHERE id = ${id}
       AND emma_attempts = ${lead.emma_attempts}
       AND emma_status IN ('failed', 'invalid', 'pending')
    RETURNING id
  `) as Array<{ id: string }>;

  if (reclamado.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Ya hay un reintento en curso para este lead." },
      { status: 409 },
    );
  }

  // Reintentar la entrega al dashboard
  const payload: DashboardLeadPayload = {
    telefono: lead.telefono,
    nombre: lead.nombre,
    email: lead.email || undefined,
    carrera: lead.carrera || undefined,
    plantel: lead.plantel || undefined,
    ciudad: lead.ciudad || undefined,
    turno: lead.turno || undefined,
    mensaje: lead.mensaje || undefined,
    source: lead.source,
  };
  const result = await enviarLeadADashboard(payload);

  if (result.ok) {
    await sql`
      UPDATE leads
         SET emma_status = 'sent',
             emma_sent_at = NOW(),
             emma_error = NULL
       WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true });
  }

  const finalStatus = result.reason === "invalid_phone" ? "invalid" : "failed";
  const errMsg = `${result.reason}: ${result.message}`.slice(0, 1000);
  await sql`
    UPDATE leads
       SET emma_status = ${finalStatus},
           emma_error = ${errMsg}
     WHERE id = ${id}
  `;
  return NextResponse.json(
    { ok: false, reason: result.reason, message: result.message },
    { status: 502 },
  );
}
