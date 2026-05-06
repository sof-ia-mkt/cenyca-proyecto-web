"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { HistoriaMomento } from "./SeccionHistoria";

const ROTATE_MS = 7000;

export default function HistoriaTimeline({
  momentos,
}: {
  momentos: HistoriaMomento[];
}) {
  // Ordena cronológicamente: 2007 → 2010s → 2019 → 2024 → Hoy
  const sorted = useMemo(() => {
    return [...momentos].sort((a, b) => {
      const ya = parseInt(a.year, 10);
      const yb = parseInt(b.year, 10);
      const va = isNaN(ya) ? (a.year.toLowerCase() === "hoy" ? 9999 : 0) : ya;
      const vb = isNaN(yb) ? (b.year.toLowerCase() === "hoy" ? 9999 : 0) : yb;
      return va - vb;
    });
  }, [momentos]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const total = sorted.length;

  // Auto-advance
  useEffect(() => {
    if (paused || lightbox || total < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % total), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, lightbox, total]);

  // ESC cierra lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  // Bloquea scroll cuando lightbox abierto
  useEffect(() => {
    if (!lightbox) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [lightbox]);

  function go(dir: 1 | -1) {
    setIdx((i) => (i + dir + total) % total);
  }

  const active = sorted[idx];

  if (!active) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage editorial — foto + año display gigante + texto */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-14 items-center mb-14 md:mb-16">
        {/* Foto limpia con crossfade */}
        <div
          className="relative rounded-2xl overflow-hidden bg-[#0E1530] aspect-[16/10] lg:aspect-[5/4] cursor-zoom-in group shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
          onClick={() => setLightbox(true)}
          role="button"
          aria-label={`Ver foto completa: ${active.caption}`}
        >
          {sorted.map((m, i) => (
            <img
              key={i}
              src={m.imagenUrl}
              alt={m.alt || m.caption}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-in-out"
              style={{ opacity: i === idx ? 1 : 0 }}
              aria-hidden={i !== idx}
            />
          ))}

          {/* Indicador "click para ampliar" — solo en hover, sin decoración pesada */}
          <span
            aria-hidden
            className="absolute top-5 right-5 inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 size={11} /> Ampliar
          </span>
        </div>

        {/* Texto editorial: año GIGANTE + título + descripción */}
        <div className="flex flex-col justify-center">
          <span
            key={`year-${idx}`}
            className="block text-[#00D4FF] font-black mb-2"
            style={{
              fontSize: "clamp(4.5rem, 9vw, 8.5rem)",
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              animation: "historiaSlideIn 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {active.year}
          </span>
          <h3
            key={`title-${idx}`}
            className="text-white font-bold mb-5"
            style={{
              fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              animation: "historiaSlideIn 0.55s 0.05s cubic-bezier(0.22, 1, 0.36, 1) backwards",
            }}
          >
            {active.caption}
          </h3>
          {active.descripcion && (
            <p
              key={`desc-${idx}`}
              className="text-white/60 text-base leading-relaxed max-w-md"
              style={{
                animation: "historiaSlideIn 0.55s 0.1s cubic-bezier(0.22, 1, 0.36, 1) backwards",
              }}
            >
              {active.descripcion}
            </p>
          )}
        </div>
      </div>

      {/* Navegación editorial — labels de texto con underline animado */}
      <div className="flex items-center justify-between gap-3 md:gap-6 pt-6 border-t border-white/8">
        {/* Flechas */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Hito anterior"
            className="w-10 h-10 rounded-full text-white/55 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente hito"
            className="w-10 h-10 rounded-full text-white/55 hover:text-white hover:bg-white/5 flex items-center justify-center transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Labels de años + línea del tiempo con puntos */}
        <div className="flex-1 relative px-2">
          <div
            className="grid items-end"
            style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
          >
            {sorted.map((m, i) => {
              const isActive = i === idx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-current={isActive ? "step" : undefined}
                  className="relative flex flex-col items-center gap-3 pb-0 cursor-pointer group"
                >
                  <span
                    className={`text-sm md:text-base font-bold tracking-tight transition-colors duration-300 whitespace-nowrap ${
                      isActive ? "text-white" : "text-white/35 group-hover:text-white/70"
                    }`}
                  >
                    {m.year}
                  </span>
                  {/* Punto del timeline */}
                  <span
                    aria-hidden
                    className="relative flex items-center justify-center"
                    style={{
                      width: isActive ? 14 : 8,
                      height: isActive ? 14 : 8,
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-full transition-all duration-300"
                      style={{
                        background: isActive || i < idx ? "#00D4FF" : "rgba(255,255,255,0.22)",
                        boxShadow: isActive ? "0 0 14px rgba(0,212,255,0.7)" : "none",
                      }}
                    />
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[#00D4FF] opacity-40 animate-ping"
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Línea base + progreso (dibujada al nivel de los puntos) */}
          <div aria-hidden className="absolute left-0 right-0 bottom-[6px] -z-0 px-2">
            <div className="relative h-px">
              <div className="absolute inset-0 bg-white/10" />
              <div
                className="absolute left-0 top-0 h-px bg-[#00D4FF] transition-all duration-700 ease-out"
                style={{
                  width: total > 1 ? `${(idx / (total - 1)) * 100}%` : "0%",
                  boxShadow: "0 0 10px rgba(0,212,255,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Counter discreto */}
        <span className="text-white/30 text-xs tracking-tight font-medium tabular-nums w-12 text-right shrink-0">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Lightbox — foto a pantalla completa */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          style={{ animation: "historiaLightboxIn 0.25s ease-out" }}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Cerrar"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={active.imagenUrl}
            alt={active.alt || active.caption}
            className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style>{`
        @keyframes historiaSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes historiaLightboxIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes historiaUnderline {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </div>
  );
}
