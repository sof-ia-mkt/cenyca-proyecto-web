// POST /admin/leads/api/retry/[id]
// Reintenta enviar a Emma un lead que falló previamente.
// Protegido por proxy.ts (basic auth en /admin/*).

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { enviarLeadAEmmaServer, type EmmaServerPayload } from "@/lib/emma-server";

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
};

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json(
      { ok: false, message: "ID inválido." },
      { status: 400 },
    );
  }

  // Cargar el lead
  const rows = (await sql`
    SELECT id, nombre, telefono, email, carrera, plantel, ciudad, turno, mensaje,
           source, emma_status
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
      { ok: false, message: "Este lead ya fue enviado a Emma." },
      { status: 409 },
    );
  }

  // Reintentar Emma
  const payload: EmmaServerPayload = {
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
  const result = await enviarLeadAEmmaServer(payload);

  if (result.ok) {
    await sql`
      UPDATE leads
         SET emma_status = 'sent',
             emma_sent_at = NOW(),
             emma_error = NULL,
             emma_attempts = emma_attempts + 1
       WHERE id = ${id}
    `;
    return NextResponse.json({ ok: true });
  }

  const finalStatus = result.reason === "invalid_phone" ? "invalid" : "failed";
  const errMsg = `${result.reason}: ${result.message}`.slice(0, 1000);
  await sql`
    UPDATE leads
       SET emma_status = ${finalStatus},
           emma_error = ${errMsg},
           emma_attempts = emma_attempts + 1
     WHERE id = ${id}
  `;
  return NextResponse.json(
    { ok: false, reason: result.reason, message: result.message },
    { status: 502 },
  );
}
