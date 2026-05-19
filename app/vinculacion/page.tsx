import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Factory,
  Trophy,
  Heart,
  GraduationCap,
  Users,
  Lightbulb,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  FadeUp,
  FadeLeft,
  FadeRight,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/app/components/ScrollReveal";
import { client } from "@/sanity/lib/client";
import { configuracionQuery, vinculacionPageQuery } from "@/sanity/lib/queries";

type Configuracion = { contacto?: { whatsapp?: string } };

type ImagenSanity = {
  imagenUrl?: string;
  imagenAlt?: string;
  imagenLqip?: string;
};

type VinculacionData = {
  heroKicker?: string;
  heroTitulo?: string;
  heroDescripcion?: string;
  rector?: {
    nombre?: string;
    cargo?: string;
    cita?: string;
  } & ImagenSanity;
  pilaresKicker?: string;
  pilaresTitulo?: string;
  pilares?: ({
    icono?: string;
    titulo?: string;
    descripcion?: string;
    aliados?: string[];
  } & ImagenSanity)[];
  galeriaTitulo?: string;
  galeriaDescripcion?: string;
  galeria?: ({
    titulo?: string;
    empresa?: string;
  } & ImagenSanity)[];
  ctaKicker?: string;
  ctaTitulo?: string;
  ctaDescripcion?: string;
  ctaMensajeWhatsapp?: string;
};

const ICONS: Record<string, LucideIcon> = {
  Factory,
  Trophy,
  Heart,
  GraduationCap,
  Users,
  Lightbulb,
  Globe,
};

// ── Fallbacks (cuando Sanity aún no tiene contenido) ──────────────────────────
const DEFAULTS: Required<Pick<
  VinculacionData,
  | "heroKicker"
  | "heroTitulo"
  | "heroDescripcion"
  | "pilaresKicker"
  | "pilaresTitulo"
  | "galeriaTitulo"
  | "galeriaDescripcion"
  | "ctaKicker"
  | "ctaTitulo"
  | "ctaDescripcion"
  | "ctaMensajeWhatsapp"
>> & {
  rector: NonNullable<VinculacionData["rector"]>;
  pilares: NonNullable<VinculacionData["pilares"]>;
  galeria: NonNullable<VinculacionData["galeria"]>;
} = {
  heroKicker: "Alianzas estratégicas",
  heroTitulo: "Vinculación",
  heroDescripcion:
    "Construimos puentes sólidos entre la academia y el mundo real, porque creemos que la mejor forma de aprender es junto a quienes ya están transformando la región.",
  rector: {
    nombre: "Ing. José Alfredo Sánchez Herrera",
    cargo: "Rector · CENYCA Universidad",
    cita:
      '"La vinculación no es un complemento de nuestra misión — es parte esencial de ella. Cuando una empresa abre sus puertas a nuestros estudiantes, cuando un organismo confía en nuestro talento, cuando la industria y la academia se sientan en la misma mesa, ocurre algo extraordinario: el aprendizaje se vuelve real. En CENYCA trabajamos cada día para fortalecer estos puentes, porque sabemos que el profesionista que se forma junto al sector productivo es quien verdaderamente transforma su comunidad."',
    imagenUrl: "/vinculacion/rector.jpg",
    imagenAlt: "Ing. José Alfredo Sánchez Herrera — Rector de CENYCA",
  },
  pilaresKicker: "Nuestras áreas de colaboración",
  pilaresTitulo: "Tres pilares de vinculación",
  pilares: [
    {
      icono: "Factory",
      titulo: "Industria y manufactura",
      descripcion:
        "Trabajamos junto a las empresas más importantes del sector industrial de Baja California para ofrecer a nuestros estudiantes prácticas reales, proyectos colaborativos y acceso directo al mercado laboral.",
      aliados: ["ENGEL", "HASCO", "Sybridge Technologies"],
      imagenUrl: "/vinculacion/innovate-baja-connect.jpg",
      imagenAlt: "Innovate Baja Connect — ENGEL · HASCO · Sybridge",
    },
    {
      icono: "Trophy",
      titulo: "Deporte y cultura",
      descripcion:
        "Impulsamos el talento más allá del aula. Nuestros convenios con organizaciones deportivas abren oportunidades únicas de desarrollo profesional y personal para toda la comunidad CENYCA.",
      aliados: ["Club Deportivo Zonkeys", "CIBACOPA"],
      imagenUrl: "/vinculacion/convenio-zonkeys.jpg",
      imagenAlt: "Firma de convenio — Club Deportivo Zonkeys",
    },
    {
      icono: "Heart",
      titulo: "Responsabilidad social",
      descripcion:
        "Formamos ciudadanos comprometidos. A través de proyectos de vinculación social, nuestros estudiantes aplican su conocimiento para transformar comunidades y generar impacto real en la región.",
      aliados: ["ICF International Community Foundation", "Consejo Técnico Escolar"],
      imagenUrl: "/vinculacion/gastronomia-icf.jpg",
      imagenAlt: "Estudiantes de Gastronomía con ICF",
    },
  ],
  galeriaTitulo: "Momentos de alianza",
  galeriaDescripcion:
    "Cada firma, cada evento y cada proyecto representa un paso más en nuestra apuesta por una educación conectada al mundo real.",
  galeria: [
    {
      titulo: "Innovate Baja Connect en el auditorio de CENYCA",
      empresa: "ENGEL · HASCO · Sybridge",
      imagenUrl: "/vinculacion/innovate-baja-connect.jpg",
      imagenAlt: "Innovate Baja Connect",
    },
    {
      titulo: "Firma de convenio con Zonkeys",
      empresa: "Club Deportivo Zonkeys",
      imagenUrl: "/vinculacion/convenio-zonkeys.jpg",
      imagenAlt: "Firma de convenio con Zonkeys",
    },
    {
      titulo: "Estudiantes de Gastronomía con ICF",
      empresa: "International Community Foundation",
      imagenUrl: "/vinculacion/gastronomia-icf.jpg",
      imagenAlt: "Estudiantes de Gastronomía con ICF",
    },
    {
      titulo: "Consejo Técnico Escolar de Zona",
      empresa: "Sector Educativo",
      imagenUrl: "/vinculacion/consejo-tecnico.jpg",
      imagenAlt: "Consejo Técnico Escolar",
    },
    {
      titulo: "Visita a laboratorio de manufactura",
      empresa: "Industria regional",
      imagenUrl: "/vinculacion/visita-manufactura.jpg",
      imagenAlt: "Visita a laboratorio",
    },
  ],
  ctaKicker: "¿Quieres ser parte?",
  ctaTitulo: "Vincula tu empresa con CENYCA",
  ctaDescripcion:
    "Accede a talento formado para la industria, desarrolla proyectos colaborativos y forma parte de una red de aliados que está transformando Baja California.",
  ctaMensajeWhatsapp:
    "Hola, mi empresa está interesada en establecer un convenio de vinculación con CENYCA Universidad.",
};

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vinculación | CENYCA Universidad",
  description:
    "Conoce los convenios, alianzas y programas de vinculación de CENYCA Universidad con la industria, el deporte y la sociedad en Baja California.",
  openGraph: {
    title: "Vinculación | CENYCA Universidad",
    description:
      "Alianzas estratégicas entre CENYCA y el sector productivo, deportivo y social de Baja California.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinculación | CENYCA Universidad",
  },
};

function DiagonalDivider({
  from,
  to,
  flip = false,
}: {
  from: string;
  to: string;
  flip?: boolean;
}) {
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

export default async function VinculacionPage() {
  const [config, data] = await Promise.all([
    client.fetch<Configuracion>(configuracionQuery).catch(() => null),
    client.fetch<VinculacionData | null>(vinculacionPageQuery).catch(() => null),
  ]);

  const whatsapp = config?.contacto?.whatsapp ?? "526641300236";

  const heroKicker = data?.heroKicker || DEFAULTS.heroKicker;
  const heroTitulo = data?.heroTitulo || DEFAULTS.heroTitulo;
  const heroDescripcion = data?.heroDescripcion || DEFAULTS.heroDescripcion;

  const rector = {
    nombre: data?.rector?.nombre || DEFAULTS.rector.nombre!,
    cargo: data?.rector?.cargo || DEFAULTS.rector.cargo!,
    cita: data?.rector?.cita || DEFAULTS.rector.cita!,
    imagenUrl: data?.rector?.imagenUrl || DEFAULTS.rector.imagenUrl!,
    imagenAlt:
      data?.rector?.imagenAlt ||
      data?.rector?.nombre ||
      DEFAULTS.rector.imagenAlt!,
    imagenLqip: data?.rector?.imagenLqip,
  };

  const pilaresKicker = data?.pilaresKicker || DEFAULTS.pilaresKicker;
  const pilaresTitulo = data?.pilaresTitulo || DEFAULTS.pilaresTitulo;
  const pilares =
    data?.pilares && data.pilares.length > 0 ? data.pilares : DEFAULTS.pilares;

  const galeriaTitulo = data?.galeriaTitulo || DEFAULTS.galeriaTitulo;
  const galeriaDescripcion =
    data?.galeriaDescripcion || DEFAULTS.galeriaDescripcion;
  const galeria =
    data?.galeria && data.galeria.length > 0 ? data.galeria : DEFAULTS.galeria;

  const ctaTitulo = data?.ctaTitulo || DEFAULTS.ctaTitulo;
  const ctaDescripcion = data?.ctaDescripcion || DEFAULTS.ctaDescripcion;
  const waMensaje = encodeURIComponent(
    data?.ctaMensajeWhatsapp || DEFAULTS.ctaMensajeWhatsapp
  );

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full border-2 border-[#00D4FF] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full border border-[#00D4FF] -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF]/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <FadeUp>
            <span className="font-montserrat text-[#00D4FF] text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">
              {heroKicker}
            </span>
            <h1 className="font-bebas text-white text-6xl sm:text-7xl lg:text-8xl tracking-wide mb-6">
              {heroTitulo}
            </h1>
            <div className="w-20 h-1 bg-[#00D4FF] rounded mx-auto mb-6" />
            <p className="font-montserrat text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              {heroDescripcion}
            </p>
          </FadeUp>
        </div>
      </section>

      <DiagonalDivider from="#121B33" to="#ffffff" flip />

      {/* ── Mensaje del Rector ────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <FadeLeft className="lg:col-span-2 flex flex-col items-center">
              <div className="w-72 lg:w-full max-w-xs">
                <Image
                  src={rector.imagenUrl}
                  alt={rector.imagenAlt}
                  width={400}
                  height={500}
                  placeholder={rector.imagenLqip ? "blur" : "empty"}
                  blurDataURL={rector.imagenLqip}
                  className="rounded-3xl object-cover w-full aspect-[4/5] shadow-2xl"
                />
                <div className="mt-6 text-center">
                  <p className="font-montserrat font-bold text-[#121B33] text-base">
                    {rector.nombre}
                  </p>
                  <p className="font-montserrat text-[#666] text-xs mt-1 uppercase tracking-wider">
                    {rector.cargo}
                  </p>
                </div>
              </div>
            </FadeLeft>

            <FadeRight className="lg:col-span-3">
              <div className="bg-[#F5F7FF] border border-[#121B33]/10 rounded-3xl p-8 sm:p-10">
                <blockquote className="font-montserrat text-[#333] text-lg sm:text-xl leading-relaxed italic whitespace-pre-line">
                  {rector.cita}
                </blockquote>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-12 h-1 bg-[#00D4FF] rounded" />
                  <p className="font-montserrat font-bold text-[#121B33] text-sm">
                    {rector.nombre}
                  </p>
                </div>
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      <DiagonalDivider from="#ffffff" to="#121B33" />

      {/* ── Pilares ───────────────────────────────────────────────────────── */}
      <section className="bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="font-montserrat text-[#00D4FF] text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              {pilaresKicker}
            </span>
            <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3">
              {pilaresTitulo}
            </h2>
            <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto" />
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pilares.map((pilar) => {
              const Icon = ICONS[pilar.icono || ""] || Factory;
              return (
                <StaggerItem key={pilar.titulo}>
                  <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#00D4FF]/30 transition-all duration-300 h-full flex flex-col">
                    {pilar.imagenUrl && (
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={pilar.imagenUrl}
                          alt={pilar.imagenAlt || pilar.titulo || ""}
                          width={600}
                          height={340}
                          placeholder={pilar.imagenLqip ? "blur" : "empty"}
                          blurDataURL={pilar.imagenLqip}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-8 flex flex-col flex-1">
                      <div className="w-12 h-12 bg-[#00D4FF]/15 rounded-xl flex items-center justify-center mb-5">
                        <Icon size={24} className="text-[#00D4FF]" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-montserrat font-bold text-white text-xl mb-3">
                        {pilar.titulo}
                      </h3>
                      <p className="font-montserrat text-white/60 text-sm leading-relaxed mb-6 flex-1">
                        {pilar.descripcion}
                      </p>
                      {pilar.aliados && pilar.aliados.length > 0 && (
                        <div className="border-t border-white/10 pt-5">
                          <p className="font-montserrat text-[#00D4FF] text-xs uppercase tracking-wider mb-3">
                            Aliados
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {pilar.aliados.map((a) => (
                              <span
                                key={a}
                                className="font-montserrat text-xs text-white/70 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <DiagonalDivider from="#121B33" to="#ffffff" flip />

      {/* ── Galería ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="font-montserrat text-[#121B33]/50 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              Galería
            </span>
            <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-3">
              {galeriaTitulo}
            </h2>
            <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
            <p className="font-montserrat text-[#666] max-w-xl mx-auto text-sm">
              {galeriaDescripcion}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {galeria.map((item, i) => (
              <FadeUp
                key={`${item.titulo}-${i}`}
                delay={i * 0.08}
                className={i === 0 ? "lg:col-span-2" : ""}
              >
                <div className="group relative rounded-2xl overflow-hidden aspect-video cursor-default">
                  {item.imagenUrl && (
                    <Image
                      src={item.imagenUrl}
                      alt={item.imagenAlt || item.titulo || ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      placeholder={item.imagenLqip ? "blur" : "empty"}
                      blurDataURL={item.imagenLqip}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#121B33]/85 via-[#121B33]/20 to-transparent rounded-2xl flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                      <p className="font-montserrat text-white font-semibold text-sm">
                        {item.titulo}
                      </p>
                      {item.empresa && (
                        <p className="font-montserrat text-[#00D4FF] text-xs mt-1">
                          {item.empresa}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <DiagonalDivider from="#ffffff" to="#00D4FF" />

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#00D4FF] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <ScaleIn>
            <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-4">
              {ctaTitulo}
            </h2>
            <p className="font-montserrat text-[#121B33]/70 text-lg mb-10 max-w-xl mx-auto">
              {ctaDescripcion}
            </p>
          </ScaleIn>
          <FadeUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${whatsapp}?text=${waMensaje}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#121B33] text-white font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#1E2D4A] transition-all duration-300 hover:scale-105"
              >
                Contactar por WhatsApp <ArrowRight size={18} />
              </a>
              <Link
                href="/nosotros"
                className="w-full sm:w-auto border-2 border-[#121B33] text-[#121B33] font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#121B33] hover:text-white transition-all duration-300 text-center"
              >
                Conocer CENYCA
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
