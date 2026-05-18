"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sanityImg } from "@/sanity/lib/image-url";

export type HeroSlide = {
  titulo: string;
  subtitulo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  imagenUrl: string;
  imagenLqip?: string;
};

function AnimatedText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

// Tiempo entre cambios de slide (ms). 6s es un buen balance: no apresura al lector
// pero mantiene movimiento en la página.
const SLIDE_INTERVAL_MS = 6000;

export default function HeroAnimado({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  // Lazy-load del resto de slides: solo el primero entra en el HTML inicial,
  // los demás se montan después de 2s (cuando ya pasó LCP). Esto evita que el
  // browser pelee 5 imágenes de ~150KB a la vez y mejora LCP de ~8s a ~2s.
  const [allMounted, setAllMounted] = useState(false);

  // Precalcula las URLs optimizadas una sola vez (evita recomputar en cada render).
  // 1920 cubre desktop 1080p retina @ x1.0 sin desperdiciar bytes en mobile.
  // Reducir de 2560 → 1920 baja peso ~44% y mejora LCP móvil significativamente.
  const slideImages = slides
    .map((s) => sanityImg(s.imagenUrl, 1920))
    .filter((u): u is string => Boolean(u));
  const hasMultiple = slideImages.length > 1;
  const visibleImages = allMounted ? slideImages : slideImages.slice(0, 1);

  // Montar el resto de slides 2s después del primer paint (post-LCP)
  useEffect(() => {
    if (!hasMultiple) return;
    const id = setTimeout(() => setAllMounted(true), 2000);
    return () => clearTimeout(id);
  }, [hasMultiple]);

  // Parallax sutil con el mouse
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setOffset({
        x: ((e.clientX - cx) / r.width) * 20,
        y: ((e.clientY - cy) / r.height) * 20,
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Rotación automática del carrusel
  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % slideImages.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasMultiple, slideImages.length]);

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#121B33]"
    >
      {slideImages.length > 0 && (
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ x: offset.x, y: offset.y }}
          transition={{ type: "spring", stiffness: 40, damping: 18, mass: 0.8 }}
        >
          {/* Apila todas las imágenes y cruza opacidades.
              El primer slide usa <img fetchPriority="high"> para que el browser
              lo descubra de inmediato (background-image se descubre tarde, mata LCP). */}
          {visibleImages.map((src, i) => (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === currentIndex ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                aria-hidden
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover object-center scale-110"
                style={{ opacity: 0.6, mixBlendMode: "luminosity" }}
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#121B33]/20 via-transparent to-[#121B33]/60" />
        </motion.div>
      )}

      {/* Scan-line sweep (one-shot on mount).
          Anima `y` (transform) en vez de `top` para evitar CLS. */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[4px] z-20 pointer-events-none will-change-transform"
        style={{
          background: "linear-gradient(90deg, transparent, #00D4FF, transparent)",
          boxShadow: "0 0 30px #00D4FF, 0 0 60px rgba(0,212,255,0.4)",
        }}
        initial={{ y: "-200%", opacity: 0 }}
        animate={{ y: "100vh", opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <h1
          className="text-white mb-8 font-extrabold"
          style={{
            fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          <AnimatedText
            text="Donde tu potencial"
            delay={0.2}
            className="block"
          />
          <AnimatedText
            text="se vuelve éxito."
            delay={0.9}
            className="block text-[#00D4FF]"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
          className="text-white/75 mb-10 font-montserrat uppercase tracking-[0.18em] text-xs sm:text-sm"
        >
          CENYCA Universidad <span className="text-white/30 mx-2">·</span> La universidad líder de la región
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/licenciaturas"
            className="group relative px-8 py-4 bg-white text-[#121B33] font-bold rounded-full transition-all hover:pr-12 inline-flex items-center"
          >
            Explorar Programas
            <ArrowRight
              size={18}
              className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all"
            />
          </Link>
          <Link
            href="/#planteles"
            className="px-8 py-4 text-white font-bold border border-white/30 rounded-full hover:bg-white/10 transition-colors"
          >
            Agendar recorrido en campus
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
