"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Calendar, Clock, type LucideIcon } from "lucide-react";
import {
  FadeLeft,
  FadeRight,
  StaggerContainer,
  StaggerItem,
  WordReveal,
} from "./ScrollReveal";

// ─── Datos ────────────────────────────────────────────────────────────────────

const MODALIDAD_FEATURED = {
  tag: "Escolarizada",
  dia: "Lunes a viernes",
  horario: "Turno matutino",
  descripcion:
    "La experiencia universitaria completa. Vive el campus, convive con tus compañeros y construye tu red profesional desde el primer cuatrimestre.",
  highlight:
    "Diseñada para quienes buscan formación de tiempo completo y vida universitaria activa.",
  icon: GraduationCap,
};

type ModalidadFlex = {
  tag: string;
  dia: string;
  horario: string;
  descripcion: string;
  icon: LucideIcon;
  promo?: { label: string };
};

const MODALIDADES_FLEX: ModalidadFlex[] = [
  {
    tag: "Martes",
    dia: "Un solo día",
    horario: "Una vez por semana",
    descripcion:
      "Combina tu carrera con tu trabajo, familia o emprendimiento. Solo un día y sigues con tu vida.",
    icon: Calendar,
    promo: { label: "Precio Preferencial" },
  },
  {
    tag: "Ejecutivo",
    dia: "Sábado o domingo",
    horario: "Fin de semana",
    descripcion:
      "Para profesionistas con compromisos de lunes a viernes. Dedica el fin de semana a tu próximo nivel.",
    icon: Clock,
  },
];

// ─── Ícono animado (F1: scale + bounce on viewport entry) ────────────────────

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

// ─── Sección ──────────────────────────────────────────────────────────────────

export default function SeccionModalidades() {
  const FeaturedIcon = MODALIDAD_FEATURED.icon;

  return (
    <section className="py-32 px-6 md:px-12 bg-[#121B33] relative overflow-hidden">
      {/* Glow ambient para profundidad */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D4FF]/10 blur-[120px] pointer-events-none"
      />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <FadeLeft>
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden className="block w-[2px] h-6 bg-[#00D4FF]" />
                <p className="text-[#00D4FF] font-bold tracking-[0.2em] uppercase text-xs">
                  Modalidades · Tu vida marca el ritmo
                </p>
              </div>
            </FadeLeft>
            <h2
              className="font-black text-white"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.75rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              <WordReveal text="Estudia sin pausar" delay={0.15} />{" "}
              <WordReveal
                text="lo que haces hoy"
                delay={0.35}
                className="text-[#00D4FF]"
                underline
              />
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-5 md:max-w-md">
            <FadeRight delay={0.5}>
              <p className="text-white/65 text-xl leading-relaxed">
                Tres modalidades pensadas para etapas de vida distintas.
                Elige la que se acopla a tu trabajo, tu familia y tu energía —
                sin sacrificar calidad académica ni validez SEP.
              </p>
            </FadeRight>
          </div>
        </div>

        {/* Grid asimétrico — Escolarizada grande izq + 2 flex apiladas der */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-fr">
          {/* ── Featured: Escolarizada ───────────────────────────────────── */}
          <StaggerItem className="md:col-span-8 md:row-span-2">
            <div
              className="relative h-full min-h-[420px] md:min-h-[600px] bg-gradient-to-br from-[#0D1428] via-[#152042] to-[#1B2A52] border border-[#00D4FF]/20 backdrop-blur-sm rounded-xl p-10 md:p-12 group overflow-hidden transition-all duration-500 ease-out
                         hover:border-[#00D4FF]/60
                         hover:shadow-[0_0_60px_rgba(0,212,255,0.25),0_25px_60px_rgba(0,0,0,0.4)]
                         hover:[transform:perspective(1200px)_rotateX(2deg)_rotateY(-2deg)_translateY(-6px)]"
            >
              {/* Watermark grande */}
              <span
                aria-hidden
                className="absolute top-8 right-10 text-[#00D4FF]/15 font-black text-7xl md:text-8xl select-none pointer-events-none"
                style={{ letterSpacing: "-0.05em", lineHeight: 1 }}
              >
                01
              </span>

              {/* Glow en hover */}
              <div
                aria-hidden
                className="absolute -top-20 -right-20 w-64 h-64 bg-[#00D4FF]/25 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
              <div
                aria-hidden
                className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#00D4FF]/10 to-transparent blur-2xl pointer-events-none"
              />

              <div className="relative z-10 flex flex-col h-full">
                <AnimatedIcon
                  Icon={FeaturedIcon}
                  size={32}
                  color="#00D4FF"
                  containerClassName="w-16 h-16 rounded-xl flex items-center justify-center bg-[#00D4FF]/15 backdrop-blur-sm border border-[#00D4FF]/30 mb-8"
                />

                <span className="inline-flex items-center gap-2 self-start text-[#00D4FF] font-bold text-[10px] uppercase tracking-[0.3em] mb-5 px-3 py-1.5 rounded-full border border-[#00D4FF]/40 bg-[#00D4FF]/10 backdrop-blur-sm">
                  {MODALIDAD_FEATURED.tag}
                </span>

                <p
                  className="text-white font-extrabold mb-3"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                  }}
                >
                  {MODALIDAD_FEATURED.dia}
                </p>

                <p className="text-[#00D4FF] text-xs uppercase tracking-[0.25em] font-bold mb-8">
                  {MODALIDAD_FEATURED.horario}
                </p>

                <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-xl mb-6">
                  {MODALIDAD_FEATURED.descripcion}
                </p>

                <p className="text-white/50 text-sm italic leading-relaxed max-w-lg mt-auto">
                  {MODALIDAD_FEATURED.highlight}
                </p>
              </div>
            </div>
          </StaggerItem>

          {/* ── Flex modalidades ─────────────────────────────────────────── */}
          {MODALIDADES_FLEX.map((m, i) => {
            const Icon = m.icon;
            const isPromo = !!m.promo;
            // Paleta condicional: dorado para promo, cyan para no promo
            const accent = isPromo ? "#E9C176" : "#00D4FF";
            const accentHexShadow = isPromo ? "233,193,118" : "0,212,255";

            return (
              <StaggerItem key={m.tag} className="md:col-span-4">
                <div
                  className={`relative h-full min-h-[260px] md:min-h-[290px] backdrop-blur-sm rounded-xl p-7 group overflow-hidden transition-all duration-500 ease-out
                              hover:[transform:perspective(1200px)_rotateX(2deg)_rotateY(2deg)_translateY(-4px)]
                              ${
                                isPromo
                                  ? "bg-gradient-to-br from-[#1B2042]/60 via-[#152042]/40 to-[#0D1428]/70 border-2 border-[#E9C176]/40 hover:border-[#E9C176]/85 hover:shadow-[0_0_50px_rgba(233,193,118,0.4),0_20px_50px_rgba(0,0,0,0.4)]"
                                  : "bg-white/[0.04] border border-white/10 hover:bg-white/[0.07] hover:border-[#00D4FF]/60 hover:shadow-[0_0_40px_rgba(0,212,255,0.2),0_20px_50px_rgba(0,0,0,0.3)]"
                              }`}
                >
                  {/* Cinta diagonal "PROMO" sólo en card de Martes */}
                  {isPromo && (
                    <div
                      aria-hidden
                      className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none"
                    >
                      <div
                        className="absolute top-[18px] right-[-30px] rotate-45 bg-gradient-to-r from-[#E9C176] to-[#c19a4a] text-[#121B33] font-extrabold uppercase tracking-[0.25em] py-1.5 px-10 shadow-[0_4px_12px_rgba(233,193,118,0.5)]"
                        style={{ fontSize: "9px" }}
                      >
                        Promo
                      </div>
                    </div>
                  )}

                  {/* Watermark "0X" — color según promo */}
                  <span
                    aria-hidden
                    className="absolute top-4 right-5 font-black text-5xl select-none pointer-events-none"
                    style={{
                      color: isPromo ? "rgba(233,193,118,0.18)" : "rgba(0,212,255,0.15)",
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                    }}
                  >
                    0{i + 2}
                  </span>

                  {/* Glow en hover */}
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: isPromo
                        ? "rgba(233,193,118,0.4)"
                        : "rgba(0,212,255,0.3)",
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <AnimatedIcon
                      Icon={Icon}
                      size={22}
                      color={accent}
                      containerClassName={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        isPromo
                          ? "bg-[#E9C176]/15 border border-[#E9C176]/40"
                          : "bg-[#00D4FF]/10"
                      }`}
                      delay={0.2 + i * 0.1}
                    />

                    {/* Tag + (si promo) badge dorado pulsante */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="inline-block font-bold text-[10px] uppercase tracking-[0.25em]"
                        style={{ color: accent }}
                      >
                        {m.tag}
                      </span>
                      {isPromo && (
                        <motion.span
                          className="inline-block text-[#E9C176] font-extrabold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-[#E9C176]/60 bg-[#E9C176]/15"
                          style={{ fontSize: "9px" }}
                          animate={{
                            opacity: [0.75, 1, 0.75],
                            boxShadow: [
                              `0 0 0 rgba(${accentHexShadow}, 0)`,
                              `0 0 14px rgba(${accentHexShadow}, 0.55)`,
                              `0 0 0 rgba(${accentHexShadow}, 0)`,
                            ],
                          }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {m.promo!.label}
                        </motion.span>
                      )}
                    </div>

                    <p
                      className="text-white text-2xl font-extrabold mb-1"
                      style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
                    >
                      {m.dia}
                    </p>

                    <p
                      className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-4"
                    >
                      {m.horario}
                    </p>

                    <p className="text-white/65 text-sm leading-relaxed mt-auto">
                      {m.descripcion}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
