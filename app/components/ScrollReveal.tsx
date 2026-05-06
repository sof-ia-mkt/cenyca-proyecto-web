"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── ScrollReveal helpers ─────────────────────────────────────────────────────
// Estrategia actual: animaciones SUTILES de entrada solo para headers de
// sección (FadeUp / FadeLeft / FadeRight / ScaleIn / WordReveal). Los
// contenedores de stagger se quedan como passthrough — los cards/grids
// aparecen sin animación para evitar ruido.
// Todos los reveals usan `once: true` (no re-animan al volver a entrar).

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.55;

// ─── Fade up al entrar en viewport (headers, bloques de texto) ───────────────
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade desde izquierda (kickers, columnas izquierdas) ──────────────────────
export function FadeLeft({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Fade desde derecha (textos auxiliares, CTAs) ────────────────────────────
export function FadeRight({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: 24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Escala sutil (CTAs grandes, números) ────────────────────────────────────
export function ScaleIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ─── Reveal de texto (subtítulos, headlines) ────────────────────────────────
// Versión simple: fade-up del texto completo (sin stagger por palabra para
// evitar el efecto "carga lenta" en headlines largos).
export function WordReveal({
  text,
  delay = 0,
  className = "",
  underline = false,
}: {
  text: string;
  delay?: number;
  className?: string;
  underline?: boolean;
  stagger?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: DURATION, delay, ease: EASE }}
    >
      {text}
      {underline && (
        <motion.span
          aria-hidden
          className="block h-[4px] mt-1 origin-left rounded-full"
          style={{ backgroundColor: "currentColor" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.3, ease: EASE }}
        />
      )}
    </motion.span>
  );
}

// ─── Stagger container/item — passthrough (sin animación) ───────────────────
// Los grids de cards aparecen sin animación para mantener la home sobria.
// Los componentes se conservan para no romper call-sites.
export function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
