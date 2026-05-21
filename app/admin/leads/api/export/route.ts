// GET /admin/leads/api/export
// Exporta a CSV los leads que matchean los filtros actuales del panel.
// Protegido por proxy.ts (basic auth en /admin/*).
//
// Filtros soportados (query params): status, plantel, source, q.
// Sin paginación: devuelve TODO lo que matchea — el panel admin es uso
// interno y los volúmenes son manejables.

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  created_at: string;
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
  emma_sent_at: string | null;
  emma_error: string | null;
  emma_attempts: number;
};

// Escapa un valor para CSV (RFC 4180): envuelve en comillas si contiene
// coma, comillas o saltos de línea; las comillas internas se duplican.
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCsvRow(values: Array<string | number | null | undefined>): string {
  return values.map(csvCell).join(",");
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const status = sp.get("status")?.trim() || "";
  const plantel = sp.get("plantel")?.trim() || "";
  const source = sp.get("source")?.trim() || "";
  const q = sp.get("q")?.trim() || "";
  const qLike = q ? `%${q}%` : "";

  const rows = (await sql`
    SELECT id, created_at, nombre, telefono, email, carrera, plantel, ciudad,
           turno, mensaje, source, emma_status, emma_sent_at, emma_error, emma_attempts
      FROM leads
     WHERE (${status} = '' OR emma_status = ${status})
       AND (${plantel} = '' OR plantel = ${plantel})
       AND (${source} = '' OR source = ${source})
       AND (
             ${qLike} = ''
             OR nombre ILIKE ${qLike}
             OR telefono ILIKE ${qLike}
             OR email ILIKE ${qLike}
           )
     ORDER BY created_at DESC
  `) as LeadRow[];

  const header = toCsvRow([
    "id",
    "created_at",
    "nombre",
    "telefono",
    "email",
    "carrera",
    "plantel",
    "ciudad",
    "turno",
    "mensaje",
    "source",
    "emma_status",
    "emma_sent_at",
    "emma_error",
    "emma_attempts",
  ]);

  const body = rows
    .map((r) =>
      toCsvRow([
        r.id,
        r.created_at,
        r.nombre,
        r.telefono,
        r.email,
        r.carrera,
        r.plantel,
        r.ciudad,
        r.turno,
        r.mensaje,
        r.source,
        r.emma_status,
        r.emma_sent_at,
        r.emma_error,
        r.emma_attempts,
      ]),
    )
    .join("\n");

  // BOM al inicio para que Excel detecte UTF-8 con acentos correctamente.
  const csv = "\uFEFF" + header + "\n" + body + (body ? "\n" : "");

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
