"use client";

import { useRef, useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export type NoticiaCard = {
  _id: string;
  titulo: string;
  slug: { current: string };
  fecha?: string;
  categoria?: string;
  imagenUrl?: string;
};

export default function SeccionNoticias({ noticias }: { noticias: NoticiaCard[] }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-100px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const hoy = useSyncExternalStore(
    () => () => {},
    () =>
      new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
        .format(new Date())
        .replace(/\./g, "")
        .toUpperCase(),
    () => "",
  );

  // Items para el ticker — categoría + título de cada noticia. Si hay pocas, se duplica.
  const tickerItems = (() => {
    const base = noticias.map((n) => ({
      cat: (n.categoria || "noticia").toUpperCase(),
      label: n.titulo,
    }));
    if (base.length === 0) return [];
    let out = [...base];
    while (out.length < 8) out = [...out, ...base];
    return out;
  })();

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [noticias.length]);

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-news-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 1.5, behavior: "smooth" });
  }

  if (!noticias || noticias.length === 0) return null;

  return (
    <section className="relative bg-white py-20 md:py-24 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            {/* En vivo */}
            <div className="inline-flex items-center gap-2.5 mb-5">
              <span className="relative flex w-2.5 h-2.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#FF3B3B] opacity-60 animate-ping" />
                <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-[#FF3B3B]" />
              </span>
              <span className="text-[#FF3B3B] font-bold text-[11px] tracking-[0.3em] uppercase">
                En vivo
              </span>
              <span className="text-[#1B2040]/30">·</span>
              <span className="text-[#1B2040]/55 font-mono text-[11px] tracking-[0.2em]">
                {hoy || " "}
              </span>
            </div>

            <h2
              className="font-black text-[#1B2040]"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.98,
              }}
            >
              Descubre lo que sucede{" "}
              <span
                className="bg-clip-text text-transparent inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, #C99A4A 0%, #E9C176 30%, #F6DDA0 47%, #FFF3D0 50%, #F6DDA0 53%, #E9C176 70%, #C99A4A 100%)",
                  backgroundSize: "250% 100%",
                  animation: "textShimmer 4.5s ease-in-out infinite",
                  filter:
                    "drop-shadow(0 0 16px rgba(233,193,118,0.45)) drop-shadow(0 0 5px rgba(233,193,118,0.35))",
                }}
              >
                en tu universidad
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 shrink-0"
          >
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              disabled={!canPrev}
              aria-label="Anterior"
              className="w-12 h-12 rounded-full bg-[#00D4FF] text-[#1B2040] flex items-center justify-center shadow-[0_8px_24px_rgba(0,212,255,0.4)] hover:bg-[#33DDFF] hover:scale-105 disabled:bg-[#1B2040]/10 disabled:text-[#1B2040]/40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              disabled={!canNext}
              aria-label="Siguiente"
              className="w-12 h-12 rounded-full bg-[#00D4FF] text-[#1B2040] flex items-center justify-center shadow-[0_8px_24px_rgba(0,212,255,0.4)] hover:bg-[#33DDFF] hover:scale-105 disabled:bg-[#1B2040]/10 disabled:text-[#1B2040]/40 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </motion.div>
        </div>

        {/* Ticker */}
        {tickerItems.length > 0 && (
          <div
            aria-hidden
            className="relative -mx-6 md:-mx-12 mb-10 md:mb-12 overflow-hidden border-y border-[#1B2040]/8 bg-[#F7F8FB]"
          >
            <div className="flex w-max animate-[noticiasTicker_40s_linear_infinite] py-3">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="flex items-center gap-3 px-5 whitespace-nowrap">
                  <span className="text-[#00D4FF] font-bold text-[10px] tracking-[0.3em] uppercase">
                    {item.cat}
                  </span>
                  <span className="text-[#1B2040]/70 text-sm font-medium">
                    {item.label}
                  </span>
                  <span className="text-[#1B2040]/20 text-base">◆</span>
                </span>
              ))}
            </div>
            {/* fade laterales */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F7F8FB] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F7F8FB] to-transparent" />
          </div>
        )}

        {/* Carousel track + overlay arrows (desktop) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={!canPrev}
            aria-label="Anterior"
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#00D4FF] text-[#1B2040] items-center justify-center shadow-[0_10px_30px_rgba(0,212,255,0.5)] hover:bg-[#33DDFF] hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={!canNext}
            aria-label="Siguiente"
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#00D4FF] text-[#1B2040] items-center justify-center shadow-[0_10px_30px_rgba(0,212,255,0.5)] hover:bg-[#33DDFF] hover:scale-105 disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
          </button>

        <div
          ref={trackRef}
          className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-6 md:-mx-12 px-6 md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {noticias.map((n) => (
            <NoticiaCardItem key={n._id} noticia={n} />
          ))}

          {/* Tail card: ver todas */}
          <Link
            href="/noticias"
            data-news-card
            className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl bg-gradient-to-br from-[#1B2040] to-[#0d1430] text-white flex flex-col items-center justify-center text-center p-8 group hover:from-[#00D4FF] hover:to-[#0099CC] transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center mb-5 transition-colors">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <p className="font-bold text-lg leading-snug mb-2">
              Ver todas las noticias
            </p>
            <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors">
              Explora el archivo completo de CENYCA Comunica
            </p>
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
}

function NoticiaCardItem({ noticia }: { noticia: NoticiaCard }) {
  const fecha = noticia.fecha
    ? new Date(noticia.fecha).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/noticias/${noticia.slug.current}`}
      data-news-card
      className="group snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[360px] rounded-2xl overflow-hidden bg-white border border-[#1B2040]/8 shadow-[0_2px_8px_rgba(27,32,64,0.04)] hover:shadow-[0_12px_32px_rgba(27,32,64,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[16/10] bg-[#F2F3F7] overflow-hidden">
        {noticia.imagenUrl ? (
          <Image
            src={noticia.imagenUrl}
            alt={noticia.titulo}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-15">
            📰
          </div>
        )}
        {noticia.categoria && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B2040] px-2.5 py-1 rounded-full">
            {noticia.categoria}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#1B2040] text-base leading-snug line-clamp-3 group-hover:text-[#00D4FF] transition-colors">
          {noticia.titulo}
        </h3>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-xs text-[#1B2040]/45">{fecha ?? ""}</span>
          <span className="text-[#00D4FF] flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            Leer <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
