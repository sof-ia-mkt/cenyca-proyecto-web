import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { FadeUp, FadeLeft, FadeRight } from "@/app/components/ScrollReveal";
import AnimatedCounter from "@/app/components/AnimatedCounter";
import AreaCarreraGrid, { type CarreraCard } from "@/app/components/AreaCarreraGrid";
import FormularioLead from "@/app/components/FormularioLead";

export type AreaStat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
};

export type AreaValor = {
  Icon: LucideIcon;
  titulo: string;
  desc: string;
};

export default function AreaTemplate({
  kicker,
  titulo,
  descripcion,
  stats,
  valores,
  carreras,
  imagenHero,
  cierreTitulo,
  cierreDescripcion,
}: {
  kicker: string;
  titulo: string;
  descripcion: string;
  stats: AreaStat[];
  valores: AreaValor[];
  carreras: CarreraCard[];
  imagenHero?: string;
  cierreTitulo: string;
  cierreDescripcion?: string;
}) {
  const nombresCarreras = carreras.map((c) => c.nombre);

  return (
    <>
      {/* ── Hero oscuro ──────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] pt-24 md:pt-28 pb-16 md:pb-20 px-6 md:px-12 overflow-hidden">
        {/* Foto de fondo opcional */}
        {imagenHero && (
          <>
            <div
              aria-hidden
              className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
              style={{ backgroundImage: `url(${imagenHero})` }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-[#121B33]/95 via-[#121B33]/80 to-[#121B33]"
            />
          </>
        )}
        {/* Glow ambient */}
        <div
          aria-hidden
          className="absolute -top-20 right-1/4 w-[520px] h-[280px] bg-[#00D4FF]/14 blur-[140px] pointer-events-none"
        />

        <div className="relative max-w-screen-2xl mx-auto">
          {/* Breadcrumb / regreso */}
          <FadeUp>
            <Link
              href="/oferta-academica"
              className="inline-flex items-center gap-2 text-white/55 hover:text-[#00D4FF] text-xs font-semibold tracking-[0.2em] uppercase mb-6 transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={2.5} />
              Oferta académica
            </Link>
          </FadeUp>

          <FadeUp delay={0.05}>
            <p className="text-[#00D4FF] font-bold text-[11px] tracking-[0.3em] uppercase mb-5">
              {kicker}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-14 md:mb-20">
            <FadeLeft className="lg:col-span-7">
              <h1
                className="font-extrabold text-white text-balance"
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                {titulo}
              </h1>
            </FadeLeft>
            <FadeRight className="lg:col-span-5 lg:pb-4">
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md text-pretty">
                {descripcion}
              </p>
            </FadeRight>
          </div>

          {/* Stats */}
          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-[#121B33] px-6 py-7 md:px-8 md:py-9"
                >
                  <p
                    className="text-[#00D4FF] font-extrabold mb-2"
                    style={{
                      fontSize: "clamp(2rem, 3.6vw, 3rem)",
                      letterSpacing: "-0.035em",
                      lineHeight: 1,
                    }}
                  >
                    <AnimatedCounter
                      value={s.value}
                      prefix={s.prefix}
                      suffix={s.suffix}
                    />
                  </p>
                  <p className="text-white/65 text-xs md:text-sm font-medium leading-snug">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Grid de programas ────────────────────────────────────────────── */}
      <section className="bg-[#F9F9FB] py-24 md:py-28 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <FadeUp>
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase">
                Programas activos
              </span>
              <span className="h-px flex-1 bg-[#121B33]/10 max-w-[200px]" />
            </div>
            <h2
              className="text-[#121B33] font-extrabold mb-14 md:mb-16 max-w-3xl text-balance"
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
              }}
            >
              Elige el programa que define tu carrera.
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <AreaCarreraGrid carreras={carreras} />
          </FadeUp>
        </div>
      </section>

      {/* ── Por qué CENYCA ───────────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-28 px-6 md:px-12 border-t border-[#121B33]/8">
        <div className="max-w-screen-2xl mx-auto">
          <FadeUp>
            <div className="flex items-baseline gap-4 mb-3">
              <span className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase">
                Por qué CENYCA
              </span>
              <span className="h-px flex-1 bg-[#121B33]/10 max-w-[200px]" />
            </div>
            <h2
              className="text-[#121B33] font-extrabold mb-14 md:mb-16 max-w-3xl text-balance"
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
              }}
            >
              {cierreTitulo}
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#121B33]/10 border border-[#121B33]/10 rounded-2xl overflow-hidden">
            {valores.map((v, i) => (
              <FadeUp key={v.titulo} delay={i * 0.08}>
                <div className="bg-white px-7 py-9 md:px-8 md:py-10 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/10 flex items-center justify-center mb-5">
                    <v.Icon size={22} className="text-[#0099CC]" strokeWidth={2} />
                  </div>
                  <h3
                    className="text-[#121B33] font-extrabold mb-3 text-balance"
                    style={{ fontSize: "1.2rem", letterSpacing: "-0.02em" }}
                  >
                    {v.titulo}
                  </h3>
                  <p className="text-[#45464D] text-sm leading-relaxed text-pretty">
                    {v.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>

          {cierreDescripcion && (
            <FadeUp delay={0.3}>
              <p className="text-center text-[#76777E] text-sm mt-10 max-w-2xl mx-auto leading-relaxed text-pretty">
                {cierreDescripcion}
              </p>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ── Formulario lead ──────────────────────────────────────────────── */}
      <FormularioLead carreras={nombresCarreras} />
    </>
  );
}
