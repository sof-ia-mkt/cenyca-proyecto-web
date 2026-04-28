"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Divisor de capítulo entre secciones.
 *
 *   ─────  02 / LICENCIATURAS  ─────
 *
 * Las hairlines se dibujan desde el centro hacia afuera y el label hace
 * fade-in con un ligero translateY. Diseñado para insertarse en el flujo
 * del HomePage entre cada sección.
 */
export default function SectionDivider({
  chapter,
  label,
  accent = "#00D4FF",
  bg = "transparent",
  dark = false,
}: {
  chapter: string;
  label: string;
  /** Color del número y de las hairlines */
  accent?: string;
  /** Color de fondo del divisor — debe coincidir con la sección que sigue */
  bg?: string;
  /** Si la sección que sigue tiene fondo oscuro, usa textColor blanco */
  dark?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const textColor = dark ? "rgba(255,255,255,0.55)" : "#76777E";
  const dividerOpacity = dark ? 0.55 : 0.45;

  return (
    <div ref={ref} style={{ backgroundColor: bg }} className="py-12 md:py-16 px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-5">
        {/* Hairline izquierda — se dibuja desde el centro hacia afuera */}
        <motion.div
          aria-hidden
          className="h-px flex-1 max-w-[200px]"
          style={{
            background: `linear-gradient(to right, transparent, ${accent})`,
            opacity: dividerOpacity,
            transformOrigin: "right center",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Capítulo + label centrado */}
        <motion.div
          className="flex items-center gap-2 whitespace-nowrap"
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-black tabular-nums"
            style={{
              color: accent,
              fontSize: "15px",
              letterSpacing: "-0.02em",
            }}
          >
            {chapter}
          </span>
          <span style={{ color: textColor, opacity: 0.4, fontSize: "13px" }}>/</span>
          <span
            className="font-bold uppercase tracking-[0.3em]"
            style={{ color: textColor, fontSize: "10px" }}
          >
            {label}
          </span>
        </motion.div>

        {/* Hairline derecha — se dibuja desde el centro hacia afuera */}
        <motion.div
          aria-hidden
          className="h-px flex-1 max-w-[200px]"
          style={{
            background: `linear-gradient(to left, transparent, ${accent})`,
            opacity: dividerOpacity,
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
