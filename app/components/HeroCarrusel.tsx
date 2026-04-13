"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  titulo: string;
  subtitulo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  imagenUrl: string;
  imagenLqip?: string;
};

const INTERVAL = 4000;

export default function HeroCarrusel({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next, total]);

  if (!slides || total === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center bg-[#1B2040]">
        <div className="text-center px-4">
          <h1 className="font-bebas text-white leading-none tracking-wide">
            <span className="block text-5xl sm:text-6xl lg:text-8xl">Tu futuro empieza</span>
            <span className="block text-5xl sm:text-6xl lg:text-8xl text-[#00D4FF]">en CENYCA Universidad</span>
          </h1>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section
      className="relative h-[70vh] min-h-[500px] overflow-hidden bg-[#1B2040]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Imágenes */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={s.imagenUrl}
            alt={s.titulo}
            fill
            className="object-cover"
            priority={i === 0}
            placeholder={s.imagenLqip ? "blur" : "empty"}
            blurDataURL={s.imagenLqip}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-[#1B2040]/55" />

      {/* Contenido del slide */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 sm:px-12">
        <div className="text-center max-w-4xl">
          <h1 className="font-bebas text-white leading-none tracking-wide text-5xl sm:text-6xl lg:text-8xl mb-4">
            {slide.titulo}
          </h1>
          {slide.subtitulo && (
            <p className="font-montserrat text-white/80 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
              {slide.subtitulo}
            </p>
          )}
          {slide.ctaTexto && slide.ctaUrl && (
            <Link
              href={slide.ctaUrl}
              className="inline-block bg-[#00D4FF] text-[#1B2040] font-montserrat font-bold text-base px-10 py-4 rounded-full hover:bg-white transition-all duration-300 hover:scale-105"
            >
              {slide.ctaTexto}
            </Link>
          )}
        </div>
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Slide anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Puntos indicadores */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 h-2.5 bg-[#00D4FF]"
                  : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
