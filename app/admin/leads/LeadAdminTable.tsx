"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type Lead = {
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

type Params = {
  status?: string;
  plantel?: string;
  source?: string;
  q?: string;
  page?: string;
};

type Props = {
  rows: Lead[];
  page: number;
  totalPages: number;
  total: number;
  sources: string[];
  params: Params;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  sent: { label: "Enviado", color: "#22C55E" },
  pending: { label: "Pendiente", color: "#FACC15" },
  failed: { label: "Fallido", color: "#F87171" },
  invalid: { label: "Inválido", color: "#A78BFA" },
};

const PLANTELES = ["casablanca", "palmas", "otay", "tecate"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LeadAdminTable({
  rows,
  page,
  totalPages,
  total,
  sources,
  params,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [retryingId, setRetryingId] = useState<string | null>(null);

  function updateParam(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    if (key !== "page") sp.delete("page"); // reset page on filter change
    startTransition(() => {
      router.push(`/admin/leads?${sp.toString()}`);
    });
  }

  async function retryLead(id: string) {
    setRetryingId(id);
    try {
      const res = await fetch(`/admin/leads/api/retry/${id}`, { method: "POST" });
      if (res.ok) {
        router.refresh();
      } else {
        let msg = `HTTP ${res.status}`;
        try {
          const data = (await res.json()) as { message?: string };
          if (data.message) msg = data.message;
        } catch {
          /* ignore */
        }
        alert(`No se pudo reenviar: ${msg}`);
      }
    } catch (err) {
      alert(`Error de red: ${err instanceof Error ? err.message : "desconocido"}`);
    } finally {
      setRetryingId(null);
    }
  }

  const exportHref = `/admin/leads/api/export?${searchParams.toString()}`;

  return (
    <>
      {/* Filtros */}
      <section className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <FilterSelect
            label="Estado"
            value={params.status || ""}
            options={[
              { value: "", label: "Todos" },
              { value: "sent", label: "Enviados" },
              { value: "pending", label: "Pendientes" },
              { value: "failed", label: "Fallidos" },
              { value: "invalid", label: "Inválidos" },
            ]}
            onChange={(v) => updateParam("status", v)}
          />
          <FilterSelect
            label="Plantel"
            value={params.plantel || ""}
            options={[
              { value: "", label: "Todos" },
              ...PLANTELES.map((p) => ({ value: p, label: p })),
            ]}
            onChange={(v) => updateParam("plantel", v)}
          />
          <FilterSelect
            label="Source"
            value={params.source || ""}
            options={[
              { value: "", label: "Todos" },
              ...sources.map((s) => ({ value: s, label: s })),
            ]}
            onChange={(v) => updateParam("source", v)}
          />
          <FilterInput
            label="Buscar"
            value={params.q || ""}
            placeholder="nombre, tel, email"
            onChange={(v) => updateParam("q", v)}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/55">
          <span>
            {total.toLocaleString("es-MX")} resultado{total === 1 ? "" : "s"}
            {pending && " · cargando..."}
          </span>
          <a
            href={exportHref}
            className="inline-flex items-center gap-2 bg-[#00D4FF] text-[#0E1530] font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider hover:bg-[#33DDFF] transition-colors"
          >
            ↓ Exportar CSV
          </a>
        </div>
      </section>

      {/* Tabla */}
      <section className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.05] text-white/55 text-[10px] uppercase tracking-wider">
              <tr>
                <Th>Fecha</Th>
                <Th>Nombre</Th>
                <Th>Contacto</Th>
                <Th>Carrera</Th>
                <Th>Plantel</Th>
                <Th>Source</Th>
                <Th>Emma</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-white/40">
                    Sin resultados con los filtros actuales.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const status = STATUS_LABEL[r.emma_status] || {
                    label: r.emma_status,
                    color: "#9CA3AF",
                  };
                  const canRetry = r.emma_status === "failed" || r.emma_status === "pending";
                  return (
                    <tr
                      key={r.id}
                      className="border-t border-white/5 hover:bg-white/[0.03] align-top"
                    >
                      <Td>
                        <span className="text-white/70 tabular-nums whitespace-nowrap">
                          {formatDate(r.created_at)}
                        </span>
                      </Td>
                      <Td>
                        <div className="font-semibold">{r.nombre}</div>
                      </Td>
                      <Td>
                        <div className="text-white/85">{r.telefono}</div>
                        {r.email && <div className="text-white/45 text-xs">{r.email}</div>}
                      </Td>
                      <Td>
                        <div className="text-white/75">{r.carrera || "—"}</div>
                        {r.turno && <div className="text-white/40 text-xs">{r.turno}</div>}
                      </Td>
                      <Td>
                        <div className="capitalize">{r.plantel || "—"}</div>
                        {r.ciudad && <div className="text-white/40 text-xs">{r.ciudad}</div>}
                      </Td>
                      <Td>
                        <code className="text-white/55 text-xs">{r.source}</code>
                      </Td>
                      <Td>
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${status.color}22`,
                            color: status.color,
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.label}
                        </span>
                        {r.emma_attempts > 0 && (
                          <div className="text-white/35 text-[10px] mt-1">
                            {r.emma_attempts} intento{r.emma_attempts === 1 ? "" : "s"}
                          </div>
                        )}
                        {r.emma_error && (
                          <div
                            className="text-white/40 text-[10px] mt-1 max-w-[180px] truncate"
                            title={r.emma_error}
                          >
                            {r.emma_error}
                          </div>
                        )}
                      </Td>
                      <Td>
                        {canRetry && (
                          <button
                            type="button"
                            onClick={() => retryLead(r.id)}
                            disabled={retryingId === r.id}
                            className="text-[11px] bg-white/10 hover:bg-white/20 disabled:opacity-50 px-3 py-1.5 rounded font-semibold transition-colors"
                          >
                            {retryingId === r.id ? "Enviando..." : "Reenviar"}
                          </button>
                        )}
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-6 text-sm">
          <PageButton
            disabled={page <= 1}
            onClick={() => updateParam("page", String(page - 1))}
          >
            ← Anterior
          </PageButton>
          <span className="text-white/55 px-3">
            Página {page} de {totalPages}
          </span>
          <PageButton
            disabled={page >= totalPages}
            onClick={() => updateParam("page", String(page + 1))}
          >
            Siguiente →
          </PageButton>
        </nav>
      )}
    </>
  );
}

// ─ Sub-componentes ────────────────────────────────────────────────────

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 font-semibold">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-white/85">{children}</td>;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-white/55 font-semibold mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00D4FF]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0E1530]">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-white/55 font-semibold mb-1">
        {label}
      </span>
      <input
        type="text"
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== value) onChange(local);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onChange(local);
          }
        }}
        className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#00D4FF] placeholder-white/30"
      />
    </label>
  );
}

function PageButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="px-3 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white/80 hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed text-sm"
    >
      {children}
    </button>
  );
}
