"use client";

import { useEffect, useState } from "react";
import { Briefcase, X, Plus } from "lucide-react";

export type CampoLaboralItem = {
  titulo: string;
  descripcion?: string;
};

// Acepta el shape nuevo, el string viejo (por si quedó cache ISR de antes de la migración)
// y nulls (por si llega un item vacío desde Sanity).
type RawItem = CampoLaboralItem | string | null | undefined;

type Props = {
  items: RawItem[];
  accent: string;
};

function normalize(raw: RawItem): CampoLaboralItem | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const t = raw.trim();
    return t ? { titulo: t } : null;
  }
  if (typeof raw === "object" && raw.titulo) {
    return { titulo: raw.titulo, descripcion: raw.descripcion };
  }
  return null;
}

export default function CampoLaboralGrid({ items, accent }: Props) {
  const normalized: CampoLaboralItem[] = items
    .map(normalize)
    .filter((x): x is CampoLaboralItem => x !== null);

  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? normalized[openIdx] : null;

  // ESC para cerrar + bloqueo de scroll
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {normalized.map((campo, i) => {
          const tieneDetalle = Boolean(campo.descripcion && campo.descripcion.trim().length > 0);
          const baseClass =
            "group relative flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 transition-all text-left w-full";
          const hoverClass = tieneDetalle
            ? "hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-0.5 cursor-pointer"
            : "hover:bg-white/[0.08] hover:border-white/20";

          const inner = (
            <>
              <Briefcase
                size={18}
                className="mt-0.5 flex-shrink-0 transition-colors"
                style={{ color: accent }}
                strokeWidth={1.75}
              />
              <span className="font-montserrat text-white/85 text-sm leading-snug flex-1">
                {campo.titulo}
              </span>
              {tieneDetalle && (
                <span
                  aria-hidden
                  className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full border border-white/15 text-white/50 group-hover:text-white group-hover:border-white/40 transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <Plus size={14} strokeWidth={2.25} />
                </span>
              )}
            </>
          );

          if (!tieneDetalle) {
            return (
              <div key={i} className={`${baseClass} ${hoverClass}`}>
                {inner}
              </div>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Ver detalle: ${campo.titulo}`}
              className={`${baseClass} ${hoverClass}`}
            >
              {inner}
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.titulo}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          onClick={() => setOpenIdx(null)}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-[fadeIn_180ms_ease-out]"
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0F1729] border border-white/10 rounded-2xl shadow-[0_50px_140px_rgba(0,0,0,0.7)] overflow-hidden animate-[scaleIn_220ms_cubic-bezier(0.22,1,0.36,1)]"
          >
            {/* Accent glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-[280px] h-[280px] rounded-full blur-3xl opacity-30"
              style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
            />

            <button
              type="button"
              onClick={() => setOpenIdx(null)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative px-7 pt-10 pb-9 sm:px-10 sm:pt-12 sm:pb-11">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
                style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
              >
                <Briefcase size={26} style={{ color: accent }} strokeWidth={1.75} />
              </div>

              <p
                className="font-montserrat text-[11px] font-semibold tracking-[0.25em] uppercase mb-3"
                style={{ color: accent }}
              >
                Campo laboral
              </p>

              <h3 className="font-bebas text-white text-3xl sm:text-4xl tracking-wide leading-[1.05] mb-5 text-balance">
                {active.titulo}
              </h3>

              <p className="font-montserrat text-white/75 text-base sm:text-lg leading-relaxed whitespace-pre-line text-pretty">
                {active.descripcion}
              </p>
            </div>
          </div>

          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.96) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
