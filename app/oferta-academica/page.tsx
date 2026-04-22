export const revalidate = 0;

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, configuracionQuery } from "@/sanity/lib/queries";
import { sanityImg } from "@/sanity/lib/image-url";
import { FadeUp, FadeLeft, FadeRight } from "@/app/components/ScrollReveal";

type Carrera = { _id: string; nombre: string; area: string };

type Configuracion = {
  imagenesOferta?: {
    ingenierias?: string;
    licenciaturas?: string;
  };
};

export default async function OfertaAcademicaPage() {
  const [carreras, config] = await Promise.all([
    client.fetch<Carrera[]>(todasCarrerasQuery),
    client.fetch<Configuracion>(configuracionQuery),
  ]);

  const totalIngenierias = carreras.filter((c) => c.area === "ingenieria").length;
  const totalLicenciaturas = carreras.length - totalIngenierias;

  const imgIngenierias = sanityImg(config?.imagenesOferta?.ingenierias, 1600);
  const imgLicenciaturas = sanityImg(config?.imagenesOferta?.licenciaturas, 1600);

  return (
    <>
      <HeaderOferta />
      <BloquesPrincipales
        imgIngenierias={imgIngenierias}
        imgLicenciaturas={imgLicenciaturas}
        totalIngenierias={totalIngenierias}
        totalLicenciaturas={totalLicenciaturas}
      />
      <FranjaProximamente />
      <CtaInferior />
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function HeaderOferta() {
  return (
    <section className="relative overflow-hidden bg-[#F9F9FB] pt-40 pb-28 px-6 md:px-12">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#121B33 1px, transparent 1px), linear-gradient(90deg, #121B33 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <FadeLeft className="lg:col-span-7">
          <p className="text-[#00D4FF] font-mono text-xs tracking-[0.25em] uppercase mb-6">
            Catálogo · 2026
          </p>
          <h1
            className="font-extrabold text-[#121B33]"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            Oferta Académica.
          </h1>
        </FadeLeft>
        <FadeRight className="lg:col-span-5">
          <p className="text-[#45464D] text-lg leading-relaxed max-w-md">
            Programas con validez oficial SEP, diseñados para responder a las
            necesidades del mercado laboral del noroeste de México.
          </p>
        </FadeRight>
      </div>
    </section>
  );
}

// ─── Bloques principales ──────────────────────────────────────────────────────

function BloquesPrincipales({
  imgIngenierias,
  imgLicenciaturas,
  totalIngenierias,
  totalLicenciaturas,
}: {
  imgIngenierias?: string;
  imgLicenciaturas?: string;
  totalIngenierias: number;
  totalLicenciaturas: number;
}) {
  return (
    <section className="bg-[#F9F9FB] pb-32 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <BloqueOferta
          href="/ingenierias"
          imagen={imgIngenierias}
          codigo="01"
          label="Área de Ingeniería"
          titulo="Ingenierías"
          tagline="Robótica · Software · Industria · Energía"
          descripcion="Formación técnica de élite para liderar la transformación industrial y tecnológica del noroeste."
          total={totalIngenierias}
          delay={0}
        />
        <BloqueOferta
          href="/licenciaturas"
          imagen={imgLicenciaturas}
          codigo="02"
          label="Área Profesional"
          titulo="Licenciaturas"
          tagline="Negocios · Derecho · Ciencias Sociales · Educación"
          descripcion="Programas ejecutivos con horarios flexibles, diseñados para profesionistas en activo."
          total={totalLicenciaturas}
          delay={0.15}
        />
      </div>
    </section>
  );
}

function BloqueOferta({
  href,
  imagen,
  codigo,
  label,
  titulo,
  tagline,
  descripcion,
  total,
  delay,
}: {
  href: string;
  imagen?: string;
  codigo: string;
  label: string;
  titulo: string;
  tagline: string;
  descripcion: string;
  total: number;
  delay: number;
}) {
  return (
    <FadeUp delay={delay}>
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-2xl bg-[#121B33] min-h-[640px]"
      >
        {imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[900ms] ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E2D4A] to-[#121B33]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121B33] via-[#121B33]/70 to-[#121B33]/20" />

        {/* Corner markers */}
        <CornerMarker className="top-6 left-6" />
        <CornerMarker className="top-6 right-6" rotate={90} />
        <CornerMarker className="bottom-6 right-6" rotate={180} />
        <CornerMarker className="bottom-6 left-6" rotate={270} />

        {/* Top row: codigo + total */}
        <div className="relative z-10 flex justify-between items-start p-10 md:p-12">
          <span className="text-[#00D4FF] font-mono text-xs tracking-[0.25em]">
            {codigo}
          </span>
          <span className="text-white/50 font-mono text-xs tracking-[0.2em] uppercase">
            {total} Programas
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-12 z-10">
          <p className="text-[#00D4FF] font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
            {label}
          </p>
          <h2
            className="text-white font-extrabold mb-3"
            style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.02 }}
          >
            {titulo}
          </h2>
          <p className="text-white/70 text-sm uppercase tracking-widest mb-6">
            {tagline}
          </p>
          <p className="text-white/60 text-base leading-relaxed max-w-md mb-8">
            {descripcion}
          </p>
          <span className="inline-flex items-center gap-2 text-[#00D4FF] font-bold text-sm uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
            Explorar programas <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </FadeUp>
  );
}

function CornerMarker({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <div
      aria-hidden
      className={`absolute ${className} w-3 h-3 z-10`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#00D4FF]/60" />
      <div className="absolute top-0 left-0 w-[1px] h-full bg-[#00D4FF]/60" />
    </div>
  );
}

// ─── Franja Próximamente ──────────────────────────────────────────────────────

function FranjaProximamente() {
  const futuros = ["Bachillerato", "Posgrados", "Educación Continua"];

  return (
    <section className="bg-[#121B33] py-24 px-6 md:px-12 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#00D4FF 1px, transparent 1px), linear-gradient(90deg, #00D4FF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative max-w-screen-2xl mx-auto">
        <FadeUp>
          <p className="text-[#00D4FF] font-mono text-xs tracking-[0.25em] uppercase mb-6">
            En construcción · Roadmap 2026
          </p>
          <h2
            className="text-white font-extrabold mb-12 max-w-2xl"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Pronto, más niveles de formación.
          </h2>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="flex flex-wrap gap-4">
            {futuros.map((f, i) => (
              <div
                key={f}
                className="flex items-baseline gap-3 border border-white/10 rounded-full px-6 py-3"
              >
                <span className="text-[#E9C176] font-mono text-[10px] tracking-widest">
                  {String(i + 3).padStart(2, "0")}
                </span>
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── CTA Inferior ─────────────────────────────────────────────────────────────

function CtaInferior() {
  return (
    <section className="py-32 bg-[#F9F9FB] relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 text-center relative z-10">
        <FadeUp>
          <p className="text-[#00D4FF] font-mono text-xs tracking-[0.25em] uppercase mb-6">
            ¿No sabes qué estudiar?
          </p>
          <h2
            className="font-extrabold text-[#121B33] mb-10"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            Hablemos. Te orientamos sin compromiso.
          </h2>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="inline-flex flex-col sm:flex-row gap-5">
            <a
              href="https://inscripciones.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121B33] text-white px-10 py-5 rounded-full font-bold text-base hover:bg-[#3D4660] transition-all"
            >
              Iniciar Aplicación
            </a>
            <a
              href="https://wa.me/526632093980"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#121B33] px-10 py-5 rounded-full font-bold text-base border border-[#76777E] hover:bg-[#E8E8EA] transition-all"
            >
              Hablar con un Mentor
            </a>
          </div>
        </FadeUp>
      </div>

      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E9C176]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00D4FF]/15 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
