export const revalidate = 0;

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, configuracionQuery } from "@/sanity/lib/queries";
import { sanityImg } from "@/sanity/lib/image-url";
import { FadeUp, FadeLeft, FadeRight } from "@/app/components/ScrollReveal";
import FormularioLead from "@/app/components/FormularioLead";

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
  const nombresCarreras = carreras.map((c) => c.nombre);

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
      <FormularioLead carreras={nombresCarreras} />
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function HeaderOferta() {
  return (
    <section className="relative bg-[#F9F9FB] pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-12">
      <div className="relative max-w-screen-2xl mx-auto">
        <FadeUp>
          <p className="text-[#76777E] font-semibold text-[11px] tracking-[0.3em] uppercase mb-8">
            Catálogo Académico · 2026
          </p>
        </FadeUp>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <FadeLeft className="lg:col-span-7">
            <h1
              className="font-extrabold text-[#121B33]"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
              }}
            >
              Oferta Académica.
            </h1>
          </FadeLeft>
          <FadeRight className="lg:col-span-5 lg:pb-4">
            <p className="text-[#45464D] text-base md:text-lg leading-relaxed max-w-md">
              Programas con validez oficial SEP, diseñados para responder a las
              necesidades del mercado laboral del noroeste de México.
            </p>
          </FadeRight>
        </div>
        {/* Divisor editorial */}
        <FadeUp delay={0.15}>
          <div className="mt-16 md:mt-20 h-px bg-[#121B33]/10" />
        </FadeUp>
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
    <section className="bg-[#F9F9FB] pb-28 md:pb-36 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <BloqueOferta
          href="/ingenierias"
          imagen={imgIngenierias}
          numero="01"
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
          numero="02"
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
  numero,
  label,
  titulo,
  tagline,
  descripcion,
  total,
  delay,
}: {
  href: string;
  imagen?: string;
  numero: string;
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
        className="group relative block overflow-hidden rounded-3xl bg-[#121B33] min-h-[620px] md:min-h-[680px]"
      >
        {imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
            style={{ backgroundImage: `url(${imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E2D4A] to-[#121B33]" />
        )}
        {/* Gradiente editorial — más suave y elegante */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1024] via-[#0a1024]/55 to-transparent" />

        {/* Número gigante de fondo (estilo revista) */}
        <span
          aria-hidden
          className="absolute -top-6 md:-top-10 right-2 md:right-8 font-extrabold text-white/[0.07] leading-none select-none pointer-events-none"
          style={{
            fontSize: "clamp(12rem, 22vw, 22rem)",
            letterSpacing: "-0.05em",
          }}
        >
          {numero}
        </span>

        {/* Top row: contador discreto */}
        <div className="relative z-10 flex justify-end p-8 md:p-10">
          <span className="text-white/55 text-[11px] tracking-[0.25em] uppercase font-semibold">
            {total} {total === 1 ? "Programa" : "Programas"}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
          <p className="text-[#00D4FF] text-[11px] font-semibold tracking-[0.3em] uppercase mb-5">
            {label}
          </p>
          <h2
            className="text-white font-extrabold mb-4"
            style={{
              fontSize: "clamp(2.4rem, 4.2vw, 3.8rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            {titulo}
          </h2>
          <p className="text-white/75 text-[13px] md:text-sm uppercase tracking-[0.18em] mb-5 font-medium">
            {tagline}
          </p>
          <p className="text-white/65 text-base leading-relaxed max-w-md mb-8">
            {descripcion}
          </p>
          <span className="inline-flex items-center gap-2 text-[#00D4FF] font-bold text-sm uppercase tracking-[0.18em] group-hover:gap-4 transition-all duration-300">
            Explorar programas
            <ArrowRight size={16} strokeWidth={2.5} />
          </span>
        </div>
      </Link>
    </FadeUp>
  );
}

// ─── Franja Próximamente — timeline horizontal ────────────────────────────────

function FranjaProximamente() {
  const futuros = [
    { num: "03", label: "Bachillerato", nota: "Modelo cuatrimestral con doble titulación" },
    { num: "04", label: "Posgrados",    nota: "Maestrías y especialidades en áreas estratégicas" },
    { num: "05", label: "Educación Continua", nota: "Diplomados y certificaciones ejecutivas" },
  ];

  return (
    <section className="bg-white py-24 md:py-28 px-6 md:px-12 border-t border-[#121B33]/8">
      <div className="max-w-screen-2xl mx-auto">
        <FadeUp>
          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase">
              Roadmap 2026
            </span>
            <span className="h-px flex-1 bg-[#121B33]/10 max-w-[200px]" />
          </div>
          <h2
            className="text-[#121B33] font-extrabold mb-14 max-w-3xl"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
              letterSpacing: "-0.025em",
              lineHeight: 1.08,
            }}
          >
            Pronto, más niveles de formación.
          </h2>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#121B33]/10 border border-[#121B33]/10 rounded-2xl overflow-hidden">
            {futuros.map((f) => (
              <div
                key={f.label}
                className="bg-white px-7 py-8 md:px-9 md:py-10 hover:bg-[#F9F9FB] transition-colors"
              >
                <p className="text-[#76777E] text-[10px] font-bold tracking-[0.3em] uppercase mb-5">
                  {f.num}
                </p>
                <h3
                  className="text-[#121B33] font-extrabold mb-2"
                  style={{ fontSize: "1.45rem", letterSpacing: "-0.02em" }}
                >
                  {f.label}
                </h3>
                <p className="text-[#45464D] text-sm leading-relaxed">
                  {f.nota}
                </p>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

