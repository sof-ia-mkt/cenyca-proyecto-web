import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap, Award, Users, MapPin,
  CheckCircle, BookOpen, Landmark, Star,
} from "lucide-react";
import { FadeUp, FadeLeft, FadeRight, StaggerContainer, StaggerItem, ScaleIn } from "@/app/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce la historia, misión, visión y valores de CENYCA Universidad — más de 18 años formando profesionistas en Baja California.",
};

// ─── Divisor diagonal ─────────────────────────────────────────────────────────
function DiagonalDivider({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div style={{ lineHeight: 0, marginTop: "-1px", marginBottom: "-1px" }}>
      <svg
        viewBox="0 0 1440 70"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "70px" }}
      >
        <rect width="1440" height="70" fill={to} />
        {flip ? (
          <polygon points="0,0 1440,70 0,70" fill={from} />
        ) : (
          <polygon points="0,0 1440,0 0,70" fill={from} />
        )}
      </svg>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const valores = [
  { Icon: Star,        titulo: "Excelencia",    desc: "Buscamos los más altos estándares académicos en cada programa que ofrecemos." },
  { Icon: Users,       titulo: "Compromiso",    desc: "Con el desarrollo personal y profesional de cada uno de nuestros estudiantes." },
  { Icon: CheckCircle, titulo: "Integridad",    desc: "Formamos profesionistas con valores éticos sólidos para la vida y el trabajo." },
  { Icon: BookOpen,    titulo: "Innovación",    desc: "Actualizamos continuamente nuestros planes de estudio con la industria local." },
  { Icon: Landmark,    titulo: "Pertinencia",   desc: "Respondemos a las necesidades reales del mercado laboral del noroeste del país." },
  { Icon: MapPin,      titulo: "Arraigo regional", desc: "Orgullosos de aportar al crecimiento económico de Baja California." },
];

const logros = [
  { numero: "18+", label: "Años de trayectoria" },
  { numero: "5",   label: "Campus en Baja California" },
  { numero: "10",  label: "Programas académicos" },
  { numero: "RVOE", label: "Reconocimiento oficial SEP" },
];

// ─── Página Nosotros ──────────────────────────────────────────────────────────
export default function NosotrosPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-2 border-[#00D4FF] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full border border-[#00D4FF] -translate-x-1/2 translate-y-1/2" />
        </div>
        {/* Línea cyan superior */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF]/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeUp>
            <span className="font-montserrat text-[#00D4FF] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              Institución
            </span>
            <h1 className="font-bebas text-white text-6xl sm:text-7xl lg:text-8xl tracking-wide mb-6">
              Sobre CENYCA
            </h1>
            <div className="w-20 h-1 bg-[#00D4FF] rounded mx-auto mb-6" />
            <p className="font-montserrat text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Más de 18 años formando ingenieros, administradores y profesionistas comprometidos
              con el desarrollo de Baja California y el noroeste de México.
            </p>
          </FadeUp>
        </div>
      </section>

      <DiagonalDivider from="#121B33" to="#ffffff" flip />

      {/* ── Misión y Visión ───────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <FadeLeft>
              <div className="bg-[#121B33] rounded-3xl p-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#00D4FF]/15 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap size={28} className="text-[#00D4FF]" strokeWidth={1.5} />
                </div>
                <h2 className="font-bebas text-white text-4xl tracking-wide mb-4">Misión</h2>
                <p className="font-montserrat text-white/70 leading-relaxed flex-1">
                  Formar profesionistas de excelencia con sólidos conocimientos técnicos,
                  valores éticos y visión empresarial, capaces de impulsar el desarrollo
                  socioeconómico de Baja California y de México, a través de una educación
                  pertinente, flexible e innovadora.
                </p>
              </div>
            </FadeLeft>

            <FadeRight>
              <div className="bg-[#F5F7FF] border border-[#121B33]/10 rounded-3xl p-10 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#121B33]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Award size={28} className="text-[#121B33]" strokeWidth={1.5} />
                </div>
                <h2 className="font-bebas text-[#121B33] text-4xl tracking-wide mb-4">Visión</h2>
                <p className="font-montserrat text-[#444] leading-relaxed flex-1">
                  Ser la universidad privada líder en el noroeste de México, reconocida por
                  la calidad de sus egresados, la pertinencia de sus programas y su estrecha
                  vinculación con el sector productivo e industrial de la región.
                </p>
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      <DiagonalDivider from="#ffffff" to="#121B33" />

      {/* ── Números ───────────────────────────────────────────────────────── */}
      <section className="bg-[#121B33] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {logros.map((l) => (
              <StaggerItem key={l.label}>
                <div className="text-center py-8 px-4 border border-white/10 rounded-2xl hover:border-[#00D4FF]/40 hover:bg-white/5 transition-all duration-300">
                  <div className="font-bebas text-[#00D4FF] text-5xl sm:text-6xl tracking-wide mb-2">
                    {l.numero}
                  </div>
                  <div className="font-montserrat text-white/60 text-sm uppercase tracking-wider">
                    {l.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <DiagonalDivider from="#121B33" to="#ffffff" flip />

      {/* ── Valores ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-3">
              Nuestros Valores
            </h2>
            <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
            <p className="font-montserrat text-[#666] max-w-xl mx-auto">
              Los principios que guían nuestra labor educativa día a día.
            </p>
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v) => (
              <StaggerItem key={v.titulo}>
                <div className="bg-[#F5F7FF] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-[#121B33] rounded-xl flex items-center justify-center mb-4">
                    <v.Icon size={22} color="#00D4FF" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-montserrat font-bold text-[#121B33] text-base mb-2">{v.titulo}</h3>
                  <p className="font-montserrat text-[#666] text-sm leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <DiagonalDivider from="#ffffff" to="#121B33" />

      {/* ── Historia ──────────────────────────────────────────────────────── */}
      <section className="bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#00D4FF]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3">
              Nuestra Historia
            </h2>
            <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto" />
          </FadeUp>

          <div className="space-y-6">
            {[
              {
                año: "Fundación",
                texto:
                  "CENYCA Universidad nació con la visión de ofrecer una alternativa educativa de calidad en Baja California, enfocada en las ingenierías y las ciencias administrativas que el mercado regional demanda.",
              },
              {
                año: "Crecimiento",
                texto:
                  "Con los años hemos expandido nuestra presencia a 5 campus en Tijuana, Tecate y Ensenada, acercando la educación superior a más familias de la región.",
              },
              {
                año: "Reconocimiento",
                texto:
                  "Todos nuestros programas cuentan con Reconocimiento de Validez Oficial de Estudios (RVOE) otorgado por la SEP, garantizando la validez y calidad de tu título a nivel nacional.",
              },
              {
                año: "Hoy",
                texto:
                  "Somos la universidad #1 en ingenierías del noroeste, con miles de egresados trabajando en las empresas más importantes de Baja California y México.",
              },
            ].map((item, i) => (
              <FadeUp key={item.año} delay={i * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="font-bebas text-[#00D4FF] text-lg tracking-wide">{item.año}</span>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#00D4FF] mt-1" />
                    {i < 3 && <div className="w-px flex-1 bg-[#00D4FF]/20 mt-2 min-h-[40px]" />}
                  </div>
                  <p className="font-montserrat text-white/70 leading-relaxed pt-0.5">{item.texto}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <DiagonalDivider from="#121B33" to="#00D4FF" flip />

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#00D4FF] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <ScaleIn>
            <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-4">
              Sé parte de CENYCA
            </h2>
            <p className="font-montserrat text-[#121B33]/70 text-lg mb-10 max-w-xl mx-auto">
              Únete a nuestra comunidad universitaria y construye el futuro que mereces.
            </p>
          </ScaleIn>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/admisiones"
                className="w-full sm:w-auto bg-[#121B33] text-white font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#1E2D4A] transition-all duration-300 hover:scale-105"
              >
                Ver proceso de admisión
              </Link>
              <Link
                href="/becas"
                className="w-full sm:w-auto border-2 border-[#121B33] text-[#121B33] font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#121B33] hover:text-white transition-all duration-300 text-center"
              >
                Conocer becas
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
