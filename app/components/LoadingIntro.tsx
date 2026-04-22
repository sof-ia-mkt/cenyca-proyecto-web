"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * INTRO DE CARGA — "Grid que se materializa"
 *
 * Overlay fullscreen con estética de viewport CAD que cubre el hero
 * durante ~1.4s al primer ingreso de la sesión. Luego hace fade-out
 * (0.4s) revelando la página.
 *
 * Se salta automáticamente si:
 *   - El usuario ya lo vio en esta sesión (sessionStorage)
 *   - El usuario tiene prefers-reduced-motion activado
 *
 * El usuario puede cerrarlo manualmente con click o tecla Escape.
 */

const SESSION_KEY = "cenyca-intro-shown";
const SCANNING_DURATION_MS = 1100;  // cuánto dura la fase "scanning" antes del collapse
const COLLAPSE_DURATION_MS = 300;   // cuánto dura el "collapsing" antes de fade-out

type Phase = "init" | "scanning" | "collapsing" | "done";

export default function LoadingIntro() {
  // "init" = montado pero sin decisión tomada. Renderizamos el fondo
  // sólido para que no haya flash del hero durante la hidratación.
  const [phase, setPhase] = useState<Phase>("init");

  // Decisión inicial: mostrar o saltar
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    if (prefersReduced || alreadyShown) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("scanning");
  }, []);

  const finish = useCallback(() => setPhase("done"), []);

  // Progresión: scanning → collapsing
  useEffect(() => {
    if (phase !== "scanning") return;
    const t = setTimeout(() => setPhase("collapsing"), SCANNING_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Progresión: collapsing → done (efecto separado para que el timer no
  // se cancele al salir de "scanning")
  useEffect(() => {
    if (phase !== "collapsing") return;
    const t = setTimeout(finish, COLLAPSE_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, finish]);

  // Skip manual + bloqueo de scroll mientras la intro esté visible
  useEffect(() => {
    if (phase === "done") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [phase, finish]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          onClick={finish}
          aria-hidden
          className="fixed inset-0 z-[100] bg-[#121B33] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ cursor: phase === "init" ? "default" : "pointer" }}
        >
          {phase !== "init" && (
            <>
              {/* Grid de puntos (retícula CAD) */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(0,212,255,0.35) 1.25px, transparent 1.75px)",
                  backgroundSize: "42px 42px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "collapsing" ? 0 : 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />

              {/* Crosshairs en las 4 esquinas */}
              <Crosshair corner="tl" visible={phase !== "collapsing"} delay={0.1} />
              <Crosshair corner="tr" visible={phase !== "collapsing"} delay={0.15} />
              <Crosshair corner="bl" visible={phase !== "collapsing"} delay={0.2} />
              <Crosshair corner="br" visible={phase !== "collapsing"} delay={0.25} />

              {/* Textos técnicos en las esquinas */}
              <CornerLabel corner="tl" visible={phase !== "collapsing"} delay={0.2}>
                CENYCA.SYSTEM
              </CornerLabel>
              <CornerLabel corner="tr" visible={phase !== "collapsing"} delay={0.25}>
                32.53°N 117.04°W
              </CornerLabel>
              <CornerLabel corner="bl" visible={phase !== "collapsing"} delay={0.3}>
                INIT · MODULES
              </CornerLabel>
              <CornerLabel corner="br" visible={phase !== "collapsing"} delay={0.35}>
                v.2026
              </CornerLabel>

              {/* Scan line que barre de arriba abajo */}
              <motion.div
                className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, #00D4FF, transparent)",
                  boxShadow: "0 0 30px #00D4FF, 0 0 60px rgba(0,212,255,0.4)",
                }}
                initial={{ top: "-2%", opacity: 0 }}
                animate={{ top: "102%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.85, ease: "easeInOut", delay: 0.3 }}
              />

              {/* Logo central — aparece en la fase collapsing */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
                animate={{
                  opacity: phase === "collapsing" ? 1 : 0,
                  scale: phase === "collapsing" ? 1 : 0.88,
                  filter: phase === "collapsing" ? "blur(0px)" : "blur(10px)",
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Image
                  src="/logo.avif"
                  alt=""
                  width={220}
                  height={70}
                  priority
                  className="object-contain"
                />
              </motion.div>

              {/* Flash blanco sutil en el collapse */}
              <motion.div
                className="absolute inset-0 bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === "collapsing" ? [0, 0.1, 0] : 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Subcomponentes ─────────────────────────────────────────────────────────

type Corner = "tl" | "tr" | "bl" | "br";

function Crosshair({ corner, visible, delay }: { corner: Corner; visible: boolean; delay: number }) {
  const pos = {
    tl: "top-6 left-6",
    tr: "top-6 right-6",
    bl: "bottom-6 left-6",
    br: "bottom-6 right-6",
  }[corner];

  const transform = {
    tl: "none",
    tr: "scaleX(-1)",
    bl: "scaleY(-1)",
    br: "scale(-1,-1)",
  }[corner];

  return (
    <motion.div
      className={`absolute ${pos} w-6 h-6`}
      style={{ transform }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00D4FF]/70" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-[#00D4FF]/70" />
      <div className="absolute -top-[2px] -left-[2px] w-[5px] h-[5px] rounded-full border border-[#00D4FF]/70" />
    </motion.div>
  );
}

function CornerLabel({
  corner,
  visible,
  delay,
  children,
}: {
  corner: Corner;
  visible: boolean;
  delay: number;
  children: ReactNode;
}) {
  const pos = {
    tl: "top-8 left-16",
    tr: "top-8 right-16 text-right",
    bl: "bottom-8 left-16",
    br: "bottom-8 right-16 text-right",
  }[corner];

  return (
    <motion.div
      className={`absolute ${pos} font-mono text-[10px] tracking-[0.2em] text-[#00D4FF]/70 uppercase`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}
