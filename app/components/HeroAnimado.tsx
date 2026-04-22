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

  // Precalcula las URLs optimizadas una sola vez (evita recomputar en cada render)
  const slideImages = slides
    .map((s) => sanityImg(s.imagenUrl, 2560))
    .filter((u): u is string => Boolean(u));
  const hasMultiple = slideImages.length > 1;

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
          {/* Apila todas las imágenes y cruza opacidades — el browser precarga todas */}
          {slideImages.map((src, i) => (
            <motion.div
              key={src}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === currentIndex ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              <div
                className="w-full h-full bg-cover bg-center scale-110"
                style={{ backgroundImage: `url(${src})`, opacity: 0.6, mixBlendMode: "luminosity" }}
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#121B33]/20 via-transparent to-[#121B33]/60" />
        </motion.div>
      )}

      {/* Scan-line sweep (one-shot on mount) */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 h-[4px] z-20 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, #00D4FF, transparent)",
          boxShadow: "0 0 30px #00D4FF, 0 0 60px rgba(0,212,255,0.4)",
        }}
        initial={{ top: "-2%", opacity: 0 }}
        animate={{ top: "102%", opacity: [0, 0.7, 0.7, 0] }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1
          className="text-white mb-10 font-extrabold"
          style={{
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
          }}
        >
          <AnimatedText text="La Ingeniería del Mañana," delay={0.2} />
          <AnimatedText
            text="Diseñada Hoy."
            delay={0.9}
            className="block text-[#F3F3F5] opacity-90"
          />
        </h1>

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
            href="/directorio"
            className="px-8 py-4 text-white font-bold border border-white/30 rounded-full hover:bg-white/10 transition-colors"
          >
            Visitar Campus
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
