// Revalida cada 60s — los cambios en Sanity (promoción, galería, descripciones, etc.)
// se reflejan en producción en menos de 1 min sin necesidad de redeploy.
export const revalidate = 60;

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GraduationCap,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { carreraBySlugQuery, configuracionQuery, todasCarrerasQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";
import { breadcrumbJsonLd } from "@/lib/jsonLd";
import BeneficioIcon from "@/components/BeneficioIcon";
import StatsCounter, { type Stat } from "@/components/StatsCounter";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";
import LazySelfHostedVideo from "@/components/LazySelfHostedVideo";
import GaleriaPrograma, { type GaleriaItem } from "@/components/GaleriaPrograma";
import PromocionFormulario, { type PromocionConfig } from "@/components/PromocionFormulario";
import BloqueInversion, { type InversionConfig } from "@/components/BloqueInversion";
import RedesSocialesCTA, { type RedesSociales } from "@/components/RedesSocialesCTA";

// ─── Mapeos UI ────────────────────────────────────────────────────────────────

const AREA_LABEL: Record<string, string> = {
  "ingenieria":       "Ingeniería",
  "negocios":         "Negocios",
  "ciencias-sociales":"Ciencias Sociales",
  "gastronomia":      "Gastronomía",
  "educacion":        "Educación",
  "ciencias-salud":   "Ciencias de la Salud",
};

const GRADO_LABEL: Record<string, string> = {
  "licenciatura": "Licenciatura",
  "ingenieria":   "Ingeniería",
  "especialidad": "Especialidad",
  "maestria":     "Maestría",
};

const MODALIDAD_LABEL: Record<string, string> = {
  "escolarizado": "Escolarizado",
  "ejecutivo":    "Ejecutivo (Horario Flexible)",
  "en-linea":     "En Línea",
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Beneficio = { _key: string; icono?: string; titulo: string; descripcion?: string };

type Carrera = {
  _id: string;
  nombre: string;
  slug: string;
  area: string;
  grado: string;
  modalidades: string[];
  duracion: string;
  descripcionCorta: string;
  descripcionLarga?: PortableTextBlock[];
  beneficios?: Beneficio[];
  perfilEgresado?: string[];
  campoLaboral?: string[];
  color?: string;
  imagenUrl?: string;
  imagenAlt?: string;
  imagenLqip?: string;
  galeria?: GaleriaItem[];
  inversion?: InversionConfig;
  seo?: { titulo?: string; descripcion?: string; imagenUrl?: string };
};

type VideoTestimonial = {
  videoArchivoUrl?: string | null;
  youtubeId?: string | null;
  kicker?: string;
  titulo?: string;
  subtitulo?: string;
  nombreEgresado?: string;
  descripcionEgresado?: string;
  thumbnailUrl?: string | null;
};

type Configuracion = {
  contacto?: { whatsapp?: string };
  sistemas?: { inscripciones?: string };
  redesSociales?: RedesSociales;
  stats?: Stat[];
  videoTestimonial?: VideoTestimonial | null;
  promocionInscripcion?: PromocionConfig;
};

// ─── PortableText renderer ────────────────────────────────────────────────────

const descripcionLargaComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-montserrat text-[#444] text-base sm:text-lg leading-[1.8] mb-5 text-justify hyphens-auto">{children}</p>
    ),
    h2: ({ children }) => (
      <h3 className="font-bebas text-[#121B33] text-3xl sm:text-4xl tracking-wide mt-10 mb-4">{children}</h3>
    ),
    h3: ({ children }) => (
      <h4 className="font-montserrat font-bold text-[#121B33] text-xl mt-8 mb-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--accent)] pl-6 italic font-montserrat text-[#555] my-8">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2 mb-5 font-montserrat text-[#444]">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-5 font-montserrat text-[#444]">{children}</ol>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-[#121B33]">{children}</strong>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
};

// ─── generateStaticParams ─────────────────────────────────────────────────────

export async function generateStaticParams() {
  const carreras = await client.fetch<{ slug: string }[]>(
    todasCarrerasQuery,
    {},
    { next: { revalidate: 3600 } }
  );
  return carreras.map((c) => ({ slug: c.slug }));
}

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const carrera = await client.fetch<Carrera>(carreraBySlugQuery, { slug });
  if (!carrera) return { title: "Carrera no encontrada" };

  const title = carrera.seo?.titulo ?? carrera.nombre;
  const description = carrera.seo?.descripcion ?? carrera.descripcionCorta;
  const ogImage = carrera.seo?.imagenUrl ?? carrera.imagenUrl;
  const url = `/carreras/${carrera.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: carrera.nombre }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function CarreraPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const [carrera, config] = await Promise.all([
    client.fetch<Carrera>(carreraBySlugQuery, { slug }),
    client.fetch<Configuracion>(configuracionQuery),
  ]);

  if (!carrera) notFound();

  const whatsapp = config?.contacto?.whatsapp ?? "526632093980";
  const inscripciones = config?.sistemas?.inscripciones ?? "https://inscripciones.cenyca.edu.mx";
  const areaLabel = AREA_LABEL[carrera.area] ?? carrera.area;
  const gradoLabel = GRADO_LABEL[carrera.grado] ?? carrera.grado;
  const accent = carrera.color || "#00D4FF";
  const accentStyle = { "--accent": accent } as CSSProperties;
  const hasDescripcionLarga = Array.isArray(carrera.descripcionLarga) && carrera.descripcionLarga.length > 0;

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: carrera.nombre,
    description: carrera.descripcionCorta,
    provider: {
      "@type": "EducationalOrganization",
      name: "CENYCA Universidad",
      sameAs: SITE_URL,
    },
    educationalCredentialAwarded: gradoLabel,
    inLanguage: "es-MX",
    ...(carrera.imagenUrl ? { image: carrera.imagenUrl } : {}),
  };

  // Breadcrumbs para SERP de Google: Inicio › Carreras › <Nombre>
  // El segundo crumb apunta a /licenciaturas o /ingenierias según grado.
  const carrerasIndexUrl =
    carrera.grado === "ingenieria" ? "/ingenierias" : "/licenciaturas";
  const carrerasIndexLabel =
    carrera.grado === "ingenieria" ? "Ingenierías" : "Licenciaturas";
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Inicio", url: "/" },
    { name: carrerasIndexLabel, url: carrerasIndexUrl },
    { name: carrera.nombre, url: `/carreras/${carrera.slug}` },
  ]);

  return (
    <div style={accentStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {/* ── HERO SPLIT ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] overflow-hidden">
        {/* Halo radial detrás del texto */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
          {/* Breadcrumb */}
          <Link
            href="/licenciaturas"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[var(--accent)] font-montserrat text-sm mb-10 transition-colors"
          >
            <ArrowLeft size={14} /> Todas las carreras
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Columna texto */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="flex flex-wrap gap-2 mb-5">
                <span
                  className="font-montserrat text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: `${accent}26`, color: accent }}
                >
                  {areaLabel}
                </span>
                {gradoLabel.toLowerCase() !== areaLabel.toLowerCase() && (
                  <span className="bg-white/10 text-white/70 font-montserrat text-xs px-3 py-1 rounded-full">
                    {gradoLabel}
                  </span>
                )}
              </div>

              <h1 className="font-bebas text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide leading-[0.95] mb-6 text-balance">
                {carrera.nombre}
              </h1>

              <p className="font-montserrat text-white/70 text-lg max-w-2xl leading-relaxed text-pretty">
                {carrera.descripcionCorta}
              </p>

              {/* CTAs (solo desktop — en mobile están en la tarjeta) */}
              <div className="hidden lg:flex flex-row gap-4 mt-10">
                <a
                  href={inscripciones}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-montserrat font-bold px-7 py-3.5 rounded-full transition-colors duration-300"
                  style={{ backgroundColor: accent, color: "#121B33" }}
                >
                  <GraduationCap size={18} />
                  Inscribirme ahora
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hola, me interesa la ${gradoLabel} en ${carrera.nombre}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-montserrat font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors duration-300"
                >
                  <MessageCircle size={18} />
                  Solicitar información
                </a>
              </div>
            </div>

            {/* Columna imagen + tarjeta sticky */}
            <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="relative">
                {/* Imagen de la carrera */}
                {carrera.imagenUrl ? (
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white/5">
                    <Image
                      src={carrera.imagenUrl}
                      alt={carrera.imagenAlt ?? carrera.nombre}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      placeholder={carrera.imagenLqip ? "blur" : "empty"}
                      blurDataURL={carrera.imagenLqip}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121B33]/60 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div
                    className="aspect-[4/5] w-full rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${accent}40 0%, #121B33 80%)` }}
                  />
                )}

                {/* Tarjeta de info clave */}
                <div className="mt-6 lg:absolute lg:-bottom-10 lg:left-6 lg:right-6 lg:mt-0">
                  <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-7">
                    <dl className="space-y-4">
                      {carrera.duracion && (
                        <div className="flex items-start gap-3">
                          <Clock size={18} className="mt-0.5 text-[#121B33]/40" strokeWidth={1.75} />
                          <div className="flex-1">
                            <dt className="font-montserrat text-[11px] uppercase tracking-wider text-[#666]">Duración</dt>
                            <dd className="font-montserrat text-sm font-semibold text-[#121B33] mt-0.5">
                              {carrera.duracion}
                            </dd>
                          </div>
                        </div>
                      )}
                      {carrera.modalidades && carrera.modalidades.length > 0 && (
                        <div className="flex items-start gap-3">
                          <GraduationCap size={18} className="mt-0.5 text-[#121B33]/40" strokeWidth={1.75} />
                          <div className="flex-1">
                            <dt className="font-montserrat text-[11px] uppercase tracking-wider text-[#666]">
                              Modalidades
                            </dt>
                            <dd className="font-montserrat text-sm font-semibold text-[#121B33] mt-0.5">
                              {carrera.modalidades.map((m) => MODALIDAD_LABEL[m] ?? m).join(" · ")}
                            </dd>
                          </div>
                        </div>
                      )}
                    </dl>

                    {/* CTAs mobile/tablet */}
                    <div className="lg:hidden flex flex-col gap-3 mt-6">
                      <a
                        href={inscripciones}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 font-montserrat font-bold px-6 py-3 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: accent, color: "#121B33" }}
                      >
                        <GraduationCap size={18} />
                        Inscribirme ahora
                      </a>
                      <a
                        href={`https://wa.me/${whatsapp}?text=Hola, me interesa la ${gradoLabel} en ${carrera.nombre}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 border border-[#121B33]/15 text-[#121B33] font-montserrat font-semibold px-6 py-3 rounded-full hover:bg-[#F5F5F5] transition-colors duration-300"
                      >
                        <MessageCircle size={18} />
                        Solicitar información
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESCRIPCIÓN LARGA ─────────────────────────────────────────────── */}
      {hasDescripcionLarga && (
        <section className="bg-white pt-32 lg:pt-40 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
              Acerca del programa
            </span>
            <div className="mt-2 h-px w-14 bg-[var(--accent)] mb-8" />
            <PortableText value={carrera.descripcionLarga!} components={descripcionLargaComponents} />
          </div>
        </section>
      )}

      {/* ── BENEFICIOS ────────────────────────────────────────────────────── */}
      {carrera.beneficios && carrera.beneficios.length > 0 && (
        <section className={`bg-white px-4 sm:px-6 lg:px-8 pb-24 ${hasDescripcionLarga ? "pt-4" : "pt-32 lg:pt-40"}`}>
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <span className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                Por qué CENYCA
              </span>
              <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 text-balance">
                Lo que distingue a esta {gradoLabel.toLowerCase()}
              </h2>
            </div>

            <div
              className={`grid gap-px bg-[#E8E8E8] ${
                carrera.beneficios.length === 4
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : carrera.beneficios.length === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {carrera.beneficios.map((b, i) => (
                <div
                  key={b._key}
                  className="group bg-white p-8 hover:bg-[#FAFAFA] transition-colors duration-300"
                >
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-bebas text-5xl tracking-wider leading-none"
                      style={{ color: accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: `${accent}1A`, color: accent }}
                    >
                      <BeneficioIcon titulo={b.titulo} className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="font-montserrat font-bold text-[#121B33] text-lg leading-snug mb-2 text-balance">
                    {b.titulo}
                  </h3>
                  {b.descripcion && (
                    <p className="font-montserrat text-[#666] text-sm leading-relaxed text-pretty">
                      {b.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROMOCIÓN / FORMULARIO DE INSCRIPCIÓN ─────────────────────────── */}
      {config?.promocionInscripcion?.activa && (
        <PromocionFormulario
          carreraSlug={carrera.slug}
          carreraNombre={carrera.nombre}
          gradoLabel={gradoLabel}
          promo={config.promocionInscripcion}
          whatsappFallback={whatsapp}
          accent={accent}
        />
      )}

      {/* ── GALERÍA DEL PROGRAMA ──────────────────────────────────────────── */}
      {carrera.galeria && carrera.galeria.length > 0 && (
        <GaleriaPrograma items={carrera.galeria} carreraNombre={carrera.nombre} accent={accent} />
      )}

      {/* ── INVERSIÓN / COSTOS POR CARRERA ───────────────────────────────── */}
      {carrera.inversion?.activa && (
        <BloqueInversion
          data={carrera.inversion}
          promo={config?.promocionInscripcion}
          accent={accent}
        />
      )}

      {/* ── STATS GLOBALES ────────────────────────────────────────────────── */}
      {config?.stats && config.stats.length > 0 && (
        <div className="bg-[#F5F5F5]">
          <StatsCounter stats={config.stats} />
        </div>
      )}

      {/* ── PERFIL DE EGRESADO ────────────────────────────────────────────── */}
      {carrera.perfilEgresado && carrera.perfilEgresado.length > 0 && (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
              <div className="lg:col-span-5">
                <span className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                  Perfil de egresado
                </span>
                <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 mb-5 text-balance">
                  Al egresar, serás capaz de…
                </h2>
                <p className="font-montserrat text-[#666] leading-relaxed text-pretty">
                  Competencias y habilidades que formarás durante tu {gradoLabel.toLowerCase()} en {carrera.nombre}.
                </p>
              </div>
              <ul className="lg:col-span-7 space-y-4">
                {carrera.perfilEgresado.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 items-start p-5 bg-[#FAFAFA] rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-[#EEE]"
                  >
                    <CheckCircle2
                      size={22}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: accent }}
                      strokeWidth={2}
                    />
                    <span className="font-montserrat text-[#333] text-[15px] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── CAMPO LABORAL ─────────────────────────────────────────────────── */}
      {carrera.campoLaboral && carrera.campoLaboral.length > 0 && (
        <section className="bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-10 blur-3xl"
            style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
          />
          <div className="relative max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <span className="font-montserrat text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: accent }}>
                Tu futuro profesional
              </span>
              <h2 className="font-bebas text-white text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 text-balance">
                Dónde podrás trabajar
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {carrera.campoLaboral.map((campo, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                >
                  <Briefcase
                    size={18}
                    className="mt-0.5 flex-shrink-0 transition-colors"
                    style={{ color: accent }}
                    strokeWidth={1.75}
                  />
                  <span className="font-montserrat text-white/85 text-sm leading-snug">{campo}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEO TESTIMONIAL ─────────────────────────────────────────────── */}
      {(config?.videoTestimonial?.videoArchivoUrl || config?.videoTestimonial?.youtubeId) && (
        <section className="bg-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-12">
              {config.videoTestimonial!.kicker && (
                <span className="font-montserrat text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                  {config.videoTestimonial!.kicker}
                </span>
              )}
              {config.videoTestimonial!.titulo && (
                <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 text-balance">
                  {config.videoTestimonial!.titulo}
                </h2>
              )}
              {config.videoTestimonial!.subtitulo && (
                <p className="font-montserrat text-[#666] text-base sm:text-lg leading-relaxed mt-5 text-pretty">
                  {config.videoTestimonial!.subtitulo}
                </p>
              )}
            </div>

            {/* Archivo MP4 self-hosted gana sobre YouTube — sin branding y cero JS externo. */}
            {config.videoTestimonial!.videoArchivoUrl ? (
              <LazySelfHostedVideo
                videoUrl={config.videoTestimonial!.videoArchivoUrl}
                title={config.videoTestimonial!.titulo ?? "Testimonio CENYCA"}
                posterUrl={config.videoTestimonial!.thumbnailUrl}
              />
            ) : (
              <LazyYouTubeEmbed
                youtubeId={config.videoTestimonial!.youtubeId!}
                title={config.videoTestimonial!.titulo ?? "Testimonio CENYCA"}
                thumbnailUrl={config.videoTestimonial!.thumbnailUrl}
              />
            )}

            {(config.videoTestimonial!.nombreEgresado || config.videoTestimonial!.descripcionEgresado) && (
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1 sm:gap-3 text-center">
                {config.videoTestimonial!.nombreEgresado && (
                  <span className="font-montserrat font-bold text-[#121B33]">
                    {config.videoTestimonial!.nombreEgresado}
                  </span>
                )}
                {config.videoTestimonial!.descripcionEgresado && (
                  <>
                    <span className="hidden sm:inline text-[#666]">·</span>
                    <span className="font-montserrat text-[#666] text-sm">
                      {config.videoTestimonial!.descripcionEgresado}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── REDES SOCIALES + MINI CTA WHATSAPP ────────────────────────────── */}
      <RedesSocialesCTA
        redes={config?.redesSociales}
        whatsapp={whatsapp}
        carreraNombre={carrera.nombre}
        gradoLabel={gradoLabel}
        accent={accent}
      />
    </div>
  );
}
