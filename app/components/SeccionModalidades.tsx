"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionAccentLine from "./SectionAccentLine";
import {
  GraduationCap,
  Calendar,
  Clock,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  FadeUp,
  StaggerContainer,
  StaggerItem,
  WordReveal,
} from "./ScrollReveal";

// ─── Datos ────────────────────────────────────────────────────────────────────

type Modalidad = {
  tag: string;
  /** Texto grande tipo "precio" */
  big: string;
  /** Unidad del big — se renderiza pequeña al lado */
  bigUnit?: string;
  horario: string;
  descripcion: string;
  features: string[];
  icon: LucideIcon;
  /** "Banner" flotante que aparece cuando esta card está activa. */
  pill: string;
};

const MODALIDADES: Modalidad[] = [
  {
    tag: "Escolarizada",
    big: "5 días",
    bigUnit: "/sem",
    horario: "Lunes a viernes · Matutino",
    descripcion:
      "La experiencia universitaria completa. Convive en campus y construye tu red profesional desde el primer cuatrimestre.",
    features: [
      "Clases presenciales L-V",
      "Vida universitaria activa",
      "Tutorías y asesorías presenciales",
      "Eventos académicos y culturales",
      "Networking con compañeros",
    ],
    icon: GraduationCap,
    pill: "Experiencia completa",
  },
  {
    tag: "Un solo día",
    big: "1 día",
    bigUnit: "/sem",
    horario: "Martes · Una vez por semana",
    descripcion:
      "Combina tu carrera con tu trabajo, familia o emprendimiento. Solo un día y sigues con tu vida.",
    features: [
      "Solo un día presencial",
      "Plataforma online 24/7",
      "Material y clases grabadas",
      "Asesorías personalizadas",
      "Validez SEP plena",
    ],
    icon: Calendar,
    pill: "Precio preferencial",
  },
  {
    tag: "Ejecutivo",
    big: "1 día",
    bigUnit: "/fin",
    horario: "Sábado o domingo",
    descripcion:
      "Para profesionistas con compromisos de lunes a viernes. Dedica el fin de semana a tu próximo nivel.",
    features: [
      "Sábado o domingo",
      "Pensado para profesionistas",
      "Plataforma online 24/7",
      "Casos prácticos aplicados",
      "Validez SEP plena",
    ],
    icon: Clock,
    pill: "Para profesionistas",
  },
];

const ROTATE_INTERVAL_MS = 5000;

// ─── Ícono animado ────────────────────────────────────────────────────────────

function AnimatedIcon({
  Icon,
  size,
  color,
  containerClassName,
  delay = 0.15,
}: {
  Icon: LucideIcon;
  size: number;
  color: string;
  containerClassName: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <motion.div
      ref={ref}
      className={containerClassName}
      initial={{ scale: 0, rotate: -45 }}
      animate={inView ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 220, damping: 14, delay }}
    >
      <Icon size={size} color={color} strokeWidth={1.5} />
    </motion.div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ModalidadCard({
  m,
  featured,
  onHover,
  onLeave,
}: {
  m: Modalidad;
  featured: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const Icon = m.icon;

  // Card destacada: dorado. Resto: cyan tenue.
  const accent = featured ? "#E9C176" : "#00D4FF";
  const accentRgb = featured ? "233,193,118" : "0,212,255";

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={onHover}
      className={`relative h-full flex flex-col transition-transform duration-500 ease-out
        ${featured ? "md:scale-[1.04] z-10" : ""}`}
    >
      {/* Pill flotante — solo aparece cuando la card está destacada */}
      <motion.div
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        initial={false}
        animate={{
          opacity: featured ? 1 : 0,
          y: featured ? 0 : -6,
          scale: featured ? 1 : 0.92,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: featured ? "auto" : "none" }}
      >
        <motion.span
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#121B33] bg-[#E9C176] shadow-[0_4px_14px_rgba(233,193,118,0.5)] whitespace-nowrap"
          animate={
            featured
              ? {
                  boxShadow: [
                    `0 4px 14px rgba(${accentRgb}, 0.5)`,
                    `0 4px 24px rgba(${accentRgb}, 0.85)`,
                    `0 4px 14px rgba(${accentRgb}, 0.5)`,
                  ],
                }
              : undefined
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          ★ {m.pill}
        </motion.span>
      </motion.div>

      <div
        className={`relative h-full rounded-2xl p-8 md:p-9 flex flex-col transition-all duration-500 ease-out overflow-hidden
          ${
            featured
              ? "bg-gradient-to-br from-[#1E2A55] via-[#16203F] to-[#0E1530] border-2 border-[#E9C176]/55 shadow-[0_0_40px_rgba(233,193,118,0.18),0_25px_60px_rgba(0,0,0,0.45)] hover:shadow-[0_0_60px_rgba(233,193,118,0.32),0_30px_70px_rgba(0,0,0,0.5)]"
              : "bg-white/[0.035] border border-white/10 hover:bg-white/[0.06] hover:border-[#00D4FF]/45 hover:shadow-[0_0_36px_rgba(0,212,255,0.16),0_18px_44px_rgba(0,0,0,0.3)] hover:-translate-y-1"
          }`}
      >
        {/* Glow esquina superior */}
        <div
          aria-hidden
          className="absolute -top-12 -right-12 w-40 h-40 blur-3xl pointer-events-none transition-opacity duration-500"
          style={{
            background: `rgba(${accentRgb}, ${featured ? 0.25 : 0.12})`,
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <AnimatedIcon
            Icon={Icon}
            size={20}
            color={accent}
            containerClassName={`w-11 h-11 rounded-xl flex items-center justify-center ${
              featured
                ? "bg-[#E9C176]/15 border border-[#E9C176]/35"
                : "bg-[#00D4FF]/10 border border-[#00D4FF]/20"
            }`}
          />
          <span
            className="font-bold text-[11px] uppercase tracking-[0.28em]"
            style={{ color: accent }}
          >
            {m.tag}
          </span>
        </div>

        {/* Big "price-like" */}
        <div className="flex items-end gap-2 mb-1">
          <span
            className="text-white font-black"
            style={{
              fontSize: "clamp(2.6rem, 4.5vw, 3.6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            {m.big}
          </span>
          {m.bigUnit && (
            <span className="text-white/45 text-base font-medium pb-2">
              {m.bigUnit}
            </span>
          )}
        </div>

        {/* Horario */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.28em] mb-5"
          style={{ color: accent, opacity: 0.85 }}
        >
          {m.horario}
        </p>

        {/* Descripción */}
        <p className="text-white/65 text-sm leading-relaxed mb-7">
          {m.descripcion}
        </p>

        {/* CTA — apunta al CtaContadorClases (#contacto) en home para captura del lead */}
        <a
          href="#contacto"
          className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
            ${
              featured
                ? "bg-[#E9C176] text-[#121B33] hover:bg-[#F2D08F] hover:shadow-[0_8px_28px_rgba(233,193,118,0.45)]"
                : "bg-white/8 border border-white/15 text-white hover:bg-white/15 hover:border-[#00D4FF]/60"
            }`}
        >
          Solicitar información
          <ArrowRight className="w-4 h-4" />
        </a>

        {/* Divider */}
        <div className="my-7 h-px bg-white/10" />

        {/* Features */}
        <ul className="space-y-3">
          {m.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-white/75 text-sm">
              <span
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: `rgba(${accentRgb}, 0.15)` }}
              >
                <Check size={12} color={accent} strokeWidth={3} />
              </span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}

// ─── Sección ──────────────────────────────────────────────────────────────────

export default function SeccionModalidades() {
  // Inicia con la card del medio destacada (Un solo día).
  const [activeIdx, setActiveIdx] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  // Card que recibe el spotlight: si hay hover, manda el hover; si no, el ciclo.
  const featuredIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  // Auto-rotación pausada cuando el usuario está sobre alguna card.
  useEffect(() => {
    if (hoveredIdx !== null) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % MODALIDADES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hoveredIdx]);

  return (
    <section className="py-32 px-6 md:px-12 bg-[#121B33] relative overflow-hidden">
      <SectionAccentLine accent="#00D4FF" position="top" />
      <SectionAccentLine accent="#00D4FF" position="bottom" />
      {/* Glow ambient */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#00D4FF]/10 blur-[120px] pointer-events-none"
      />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Header centrado */}
        <FadeUp>
          <div className="flex flex-col items-center text-center mb-16 md:mb-20 gap-5 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <span aria-hidden className="block w-6 h-px bg-[#00D4FF]" />
              <p className="text-[#00D4FF] font-bold tracking-[0.3em] uppercase text-[11px]">
                Modalidades · Tu vida marca el ritmo
              </p>
              <span aria-hidden className="block w-6 h-px bg-[#00D4FF]" />
            </div>

            <h2
              className="font-black text-white"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              <WordReveal text="Estudia sin pausar" delay={0.15} />{" "}
              <WordReveal
                text="lo que haces hoy"
                delay={0.35}
                className="text-[#00D4FF]"
              />
            </h2>

            <p className="text-white/65 text-lg leading-relaxed max-w-2xl">
              Tres modalidades pensadas para etapas de vida distintas. Elige la
              que se acopla a tu trabajo, tu familia y tu energía — sin sacrificar
              calidad académica ni validez SEP.
            </p>
          </div>
        </FadeUp>

        {/* Grid 3 cards — la spotlight rota cada 5s, se pausa con hover */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 md:items-stretch md:pt-4">
          {MODALIDADES.map((m, i) => (
            <StaggerItem key={m.tag}>
              <ModalidadCard
                m={m}
                featured={featuredIdx === i}
                onHover={() => setHoveredIdx(i)}
                onLeave={() => setHoveredIdx(null)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Dots indicador */}
        <div
          className="flex items-center justify-center gap-3 mt-12"
          role="tablist"
          aria-label="Modalidades"
        >
          {MODALIDADES.map((m, i) => {
            const isActive = featuredIdx === i;
            return (
              <button
                key={m.tag}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Destacar ${m.tag}`}
                onClick={() => {
                  setActiveIdx(i);
                  setHoveredIdx(null);
                }}
                className="group relative h-2 transition-all duration-500 rounded-full overflow-hidden"
                style={{
                  width: isActive ? 36 : 10,
                  background: isActive
                    ? "rgba(233,193,118,0.25)"
                    : "rgba(255,255,255,0.15)",
                }}
              >
                {isActive && (
                  <motion.span
                    aria-hidden
                    key={`fill-${activeIdx}-${hoveredIdx}`}
                    className="absolute inset-y-0 left-0 bg-[#E9C176] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{
                      width: hoveredIdx !== null ? "100%" : "100%",
                    }}
                    transition={{
                      duration:
                        hoveredIdx !== null
                          ? 0.4
                          : ROTATE_INTERVAL_MS / 1000,
                      ease: "linear",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
