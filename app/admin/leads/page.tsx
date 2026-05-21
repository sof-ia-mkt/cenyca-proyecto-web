// Panel administrativo de leads.
//
// Protegido por basic auth vía proxy.ts (reusa STUDIO_USERNAME y
// STUDIO_PASSWORD). Render server-side para que la lista no se exponga
// al cliente hasta pasar auth.
//
// Funciones:
//   - Lista paginada de leads (50 por página por defecto)
//   - Filtros por estado de Emma y por source/plantel
//   - Botón para reenviar a Emma los leads fallidos
//   - Link para exportar CSV con los filtros aplicados

import { sql } from "@/lib/db";
import { LeadAdminTable } from "./LeadAdminTable";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = {
  title: "Leads — Admin CENYCA",
  robots: { index: false, follow: false },
};

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

type StatsRow = {
  total: number;
  sent: number;
  failed: number;
  invalid: number;
  pending: number;
  ultimos_7_dias: number;
};

type SearchParams = {
  status?: string;
  plantel?: string;
  source?: string;
  page?: string;
  q?: string;
};

const PAGE_SIZE = 50;

async function fetchLeads(params: SearchParams) {
  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const status = params.status?.trim() || "";
  const plantel = params.plantel?.trim() || "";
  const source = params.source?.trim() || "";
  const q = params.q?.trim() || "";
  const qLike = q ? `%${q}%` : "";

  // Query con filtros condicionales. Usamos `OR ... IS NULL`-style con
  // strings vacíos para mantener una query parametrizada simple.
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
     LIMIT ${PAGE_SIZE}
    OFFSET ${offset}
  `) as LeadRow[];

  const countRow = (await sql`
    SELECT COUNT(*)::int AS total
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
  `) as Array<{ total: number }>;
  const total = countRow[0]?.total ?? 0;

  return { rows, total, page };
}

async function fetchStats(): Promise<StatsRow> {
  const rows = (await sql`
    SELECT
      COUNT(*)::int                                                            AS total,
      COUNT(*) FILTER (WHERE emma_status = 'sent')::int                        AS sent,
      COUNT(*) FILTER (WHERE emma_status = 'failed')::int                      AS failed,
      COUNT(*) FILTER (WHERE emma_status = 'invalid')::int                     AS invalid,
      COUNT(*) FILTER (WHERE emma_status = 'pending')::int                     AS pending,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int     AS ultimos_7_dias
    FROM leads
  `) as StatsRow[];
  return (
    rows[0] || { total: 0, sent: 0, failed: 0, invalid: 0, pending: 0, ultimos_7_dias: 0 }
  );
}

async function fetchSources(): Promise<string[]> {
  const rows = (await sql`
    SELECT DISTINCT source FROM leads WHERE source IS NOT NULL ORDER BY source
  `) as Array<{ source: string }>;
  return rows.map((r) => r.source);
}

export default async function LeadsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [{ rows, total, page }, stats, sources] = await Promise.all([
    fetchLeads(params),
    fetchStats(),
    fetchSources(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[#0E1530] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <p className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
            Admin · Prospectos
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold">Leads CENYCA</h1>
          <p className="text-white/55 text-sm mt-2">
            Respaldo interno de prospectos capturados desde la web. Sincronizado con Emma.
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <StatCard label="Total" value={stats.total} color="#FFFFFF" />
          <StatCard label="Últimos 7 días" value={stats.ultimos_7_dias} color="#00D4FF" />
          <StatCard label="Enviados a Emma" value={stats.sent} color="#22C55E" />
          <StatCard label="Pendientes" value={stats.pending} color="#FACC15" />
          <StatCard label="Fallidos" value={stats.failed} color="#F87171" />
          <StatCard label="Inválidos" value={stats.invalid} color="#A78BFA" />
        </section>

        <LeadAdminTable
          rows={rows}
          page={page}
          totalPages={totalPages}
          total={total}
          sources={sources}
          params={params}
        />
      </div>
    </main>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/45 font-semibold">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1 tabular-nums" style={{ color }}>
        {value.toLocaleString("es-MX")}
      </p>
    </div>
  );
}
