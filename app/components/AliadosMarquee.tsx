"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Aliado = {
  nombre: string;
  sector?: string;
  logo?: string | null;
  destacado?: boolean;
};

const SPEED_DESKTOP = 60; // px/s
const SPEED_MOBILE = 110;

export default function AliadosMarquee({
  aliados,
  kicker,
  texto,
}: {
  aliados: Aliado[];
  kicker: string;
  texto: string;
}) {
  const sorted = [...aliados].sort(
    (a, b) => Number(b.destacado ?? false) - Number(a.destacado ?? false)
  );
  const loop = [...sorted, ...sorted];

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoverRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastDragXRef = useRef(0);
  const lastDragTRef = useRef(0);
  const velocityRef = useRef(0); // px/s, used when releasing for inertia
  const reduceMotionRef = useRef(false);
  const noHoverRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const activeLogoRef = useRef<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = mql.matches;
    const onMql = () => {
      reduceMotionRef.current = mql.matches;
    };
    mql.addEventListener?.("change", onMql);

    const mqlHover = window.matchMedia("(hover: none), (max-width: 767px)");
    noHoverRef.current = mqlHover.matches;
    const onMqlHover = () => {
      noHoverRef.current = mqlHover.matches;
      if (!mqlHover.matches && activeLogoRef.current) {
        activeLogoRef.current.removeAttribute("data-active");
        activeLogoRef.current = null;
      }
    };
    mqlHover.addEventListener?.("change", onMqlHover);

    const measure = () => {
      // El track contiene el array duplicado: la mitad es un loop completo.
      halfWidthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const half = halfWidthRef.current || 1;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const autoSpeed = isMobile ? SPEED_MOBILE : SPEED_DESKTOP;

      if (isDraggingRef.current) {
        // mientras arrastra, el offset lo controla el pointer
      } else if (Math.abs(velocityRef.current) > 5) {
        // inercia tras soltar
        offsetRef.current += velocityRef.current * dt;
        // fricción exponencial
        velocityRef.current *= Math.pow(0.001, dt);
      } else if (!isHoverRef.current && !reduceMotionRef.current) {
        offsetRef.current -= autoSpeed * dt;
      }

      // normalizar dentro de [-half, 0)
      if (offsetRef.current <= -half) offsetRef.current += half;
      if (offsetRef.current > 0) offsetRef.current -= half;

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;

      // En dispositivos sin hover, iluminar el logo más cercano al centro horizontal
      if (noHoverRef.current) {
        const trackRect = track.getBoundingClientRect();
        const cx = window.innerWidth / 2;
        const cy = trackRect.top + trackRect.height / 2;
        const hit = document.elementFromPoint(cx, cy) as HTMLElement | null;
        const logoEl = hit?.closest("[data-logo]") as HTMLElement | null;
        if (logoEl !== activeLogoRef.current) {
          activeLogoRef.current?.removeAttribute("data-active");
          if (logoEl) logoEl.setAttribute("data-active", "true");
          activeLogoRef.current = logoEl;
        }
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mql.removeEventListener?.("change", onMql);
      mqlHover.removeEventListener?.("change", onMqlHover);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastDragXRef.current = e.clientX;
    lastDragTRef.current = performance.now();
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current + dx;

    const now = performance.now();
    const dt = Math.max(0.001, (now - lastDragTRef.current) / 1000);
    velocityRef.current = (e.clientX - lastDragXRef.current) / dt;
    lastDragXRef.current = e.clientX;
    lastDragTRef.current = now;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Aliados de CENYCA"
      className="relative bg-white py-14 overflow-hidden"
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(233,193,118,0.5) 50%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(233,193,118,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="text-center mb-10 px-4">
        <span className="font-montserrat text-[#E9C176] text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">
          {kicker}
        </span>
        <p className="font-montserrat text-[#121B33] text-lg sm:text-2xl font-semibold leading-snug mt-3 max-w-2xl mx-auto text-balance">
          {texto}
        </p>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{
            background: "linear-gradient(90deg, #ffffff, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{
            background: "linear-gradient(270deg, #ffffff, transparent)",
          }}
        />

        <div
          className="select-none"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            touchAction: "pan-y",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => {
            isHoverRef.current = false;
            endDrag(e);
          }}
          onPointerEnter={() => {
            isHoverRef.current = true;
          }}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-14 whitespace-nowrap will-change-transform"
          >
            {loop.map((a, i) => (
              <div
                key={`${a.nombre}-${i}`}
                data-logo
                className="logo-item flex items-center gap-14 shrink-0"
                title={a.nombre}
              >
                {a.logo ? (
                  <span className="relative inline-flex h-16 w-32 sm:h-20 sm:w-40 items-center justify-center">
                    <Image
                      src={a.logo}
                      alt={a.nombre}
                      fill
                      sizes="160px"
                      draggable={false}
                      className="object-contain opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 pointer-events-none"
                    />
                  </span>
                ) : (
                  <span className="font-montserrat font-bold text-[#121B33] text-xl sm:text-2xl uppercase tracking-wider opacity-80 hover:opacity-100 transition-opacity">
                    {a.nombre}
                  </span>
                )}
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[#E9C176] shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.logo-item[data-active="true"] img) {
          filter: none !important;
          opacity: 1 !important;
        }
        :global(.logo-item[data-active="true"] span.font-montserrat) {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}
