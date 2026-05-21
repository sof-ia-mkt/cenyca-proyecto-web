"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Foto = { url: string; alt?: string };

export default function CampusCarrusel({
  photos,
  altBase = "Campus",
  showCaption = true,
}: {
  photos: Foto[];
  altBase?: string;
  showCaption?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
      // Calcula la card "más a la izquierda visible" para mover el dot activo
      const card = el.querySelector<HTMLElement>("[data-campus-card]");
      if (card) {
        const step = card.offsetWidth + 16;
        setActiveIdx(Math.round(el.scrollLeft / step));
      }
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [photos.length]);

  function go(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-campus-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function scrollToIdx(i: number) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-campus-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollTo({ left: i * step, behavior: "smooth" });
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] py-24 text-center text-white/40 text-sm">
        Sube fotos al campus en Sanity para ver la galería.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Flechas (md+) */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!canPrev}
            aria-label="Foto anterior"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#00D4FF] text-[#121B33] items-center justify-center shadow-[0_8px_24px_rgba(0,212,255,0.45)] hover:bg-[#33DDFF] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!canNext}
            aria-label="Siguiente foto"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#00D4FF] text-[#121B33] items-center justify-center shadow-[0_8px_24px_rgba(0,212,255,0.45)] hover:bg-[#33DDFF] hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => (
          <div
            key={p.url + i}
            data-campus-card
            className="group relative shrink-0 snap-start rounded-2xl overflow-hidden bg-[#0E1530]
                       w-[85%] sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2.5rem)/3)]
                       aspect-[4/3]"
          >
            <Image
              src={p.url}
              alt={p.alt || `${altBase} — foto ${i + 1}`}
              fill
              sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Título (alt) — sin overlay, las fotos ya vienen con su propio tratamiento */}
            {showCaption && p.alt && (
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <h4
                  className="text-white font-extrabold uppercase tracking-wide text-base md:text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]"
                  style={{ letterSpacing: "0.02em" }}
                >
                  {p.alt}
                </h4>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dots indicador de scroll — wrapper de 44x44 para tap target accesible */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-1 mt-4">
          {photos.map((_, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Ir a foto ${i + 1}`}
                onClick={() => scrollToIdx(i)}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full group"
              >
                <span
                  aria-hidden
                  className="rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{
                    width: isActive ? 14 : 10,
                    height: isActive ? 14 : 10,
                    background: isActive
                      ? "#00D4FF"
                      : "rgba(0,212,255,0.25)",
                    boxShadow: isActive
                      ? "0 0 12px rgba(0,212,255,0.6)"
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
