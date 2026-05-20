export const revalidate = 0;

import Link from "next/link";
import ReactDOM from "react-dom";
import {
  BarChart2, DollarSign, Scale, Search, ChefHat, BookOpen,
  MapPin, ArrowRight,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, todosCampusQuery, configuracionQuery, noticiasHomeQuery, historiaHomeQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import HeroAnimado, { type HeroSlide } from "@/app/components/HeroAnimado";
import SeccionHistoria, { type HistoriaData } from "@/app/components/SeccionHistoria";
import SeccionModalidades from "@/app/components/SeccionModalidades";
import CtaContadorClases, { type CicloInicioConfig } from "@/app/components/CtaContadorClases";
import SectionAccentLine from "@/app/components/SectionAccentLine";
import SeccionNoticias, { type NoticiaCard } from "@/app/components/SeccionNoticias";
import CampusCarrusel from "@/app/components/CampusCarrusel";
import { sanityImg } from "@/sanity/lib/image-url";
import { campusJsonLd } from "@/lib/jsonLd";
import {
  FadeUp, FadeLeft, FadeRight,
  StaggerContainer, StaggerItem,
  WordReveal,
} from "@/app/components/ScrollReveal";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Carrera = {
  _id: string; nombre: string; slug: string;
  area: string; grado: string; modalidades: string[];
  descripcionCorta: string; color: string;
  imagenUrl?: string;
  imagenTarjetaUrl?: string;
};

type CampusFoto = { url: string; alt?: string };

type Campus = {
  _id: string; nombre: string; ciudad: string;
  direccion: string; esPrincipal: boolean;
  telefono?: string; horario?: string; urlMaps?: string;
  imagenUrl?: string;
  galeria?: CampusFoto[];
};

type ImagenesPrograma = {
  bachillerato?: string;
  licenciaturas?: string;
  posgrados?: string;
  especialidades?: string;
};

type Configuracion = {
  contacto?: { whatsapp?: string };
  sistemas?: { inscripciones?: string };
  heroSlides?: HeroSlide[];
  imagenesPrograma?: ImagenesPrograma;
  cicloInicio?: CicloInicioConfig;
  promocionInscripcion?: { porcentaje?: number };
};

type NoticiaRaw = {
  _id: string;
  titulo: string;
  slug: { current: string };
  fecha?: string;
  categoria?: string;
  imagen?: { asset?: { _ref?: string } } | null;
};

// ─── Mapeos UI ────────────────────────────────────────────────────────────────

const CIUDAD_LABEL: Record<string, string> = {
  "tijuana":  "Tijuana",
  "tecate":   "Tecate",
};

// ─── Excelencia Académica (Bento de Ingenierías) ──────────────────────────────

const ingenierias = [
  {
    titulo: "Ingeniería Industrial",
    tagline: "Optimización y Sistemas de Valor",
    slug: "ingenieria-industrial",
    span: "md:col-span-8 md:h-[600px]",
    aspect: "aspect-[16/9] md:aspect-auto",
  },
  {
    titulo: "Sistemas",
    tagline: "Arquitectura de Software & AI",
    slug: "ingenieria-en-sistemas-computacionales",
    span: "md:col-span-4",
    aspect: "aspect-square md:aspect-auto md:h-[600px]",
  },
  {
    titulo: "Mecatrónica",
    tagline: "Robótica Avanzada",
    slug: "ingenieria-mecatronica",
    span: "md:col-span-4",
    aspect: "aspect-square md:aspect-auto md:h-[500px]",
  },
  {
    titulo: "Electromecánica",
    tagline: "Energía e Innovación Motriz",
    slug: "ingenieria-electromecanica",
    span: "md:col-span-8 md:h-[500px]",
    aspect: "aspect-[16/9] md:aspect-auto",
  },
] as const;

function SeccionExcelencia({ carreras }: { carreras: Carrera[] }) {
  const imgBySlug = new Map(carreras.map((c) => [c.slug, sanityImg(c.imagenTarjetaUrl ?? c.imagenUrl, 1600)]));
  return (
    <section className="relative py-32 px-6 md:px-12 bg-[#F9F9FB]">
      <SectionAccentLine accent="#00D4FF" position="top" />
      <SectionAccentLine accent="#00D4FF" position="bottom" />
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <FadeLeft>
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden className="block w-[2px] h-6 bg-[#00D4FF]" />
                <p className="text-[#E9C176] font-bold tracking-[0.2em] uppercase text-xs">
                  Líderes en ingeniería · Noroeste
                </p>
              </div>
            </FadeLeft>
            <h2
              className="font-black text-[#121B33]"
              style={{
                fontSize: "clamp(3rem, 6vw, 5.25rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
              }}
            >
              <WordReveal text="La #1 en ingenierías" delay={0.15} />{" "}
              <WordReveal
                text="del noroeste"
                delay={0.35}
                className="text-[#00D4FF]"
                underline
              />
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-5 md:max-w-md">
            <FadeRight delay={0.5}>
              <p className="text-[#45464D] text-xl leading-relaxed text-pretty">
                La universidad de mayor crecimiento en el noroeste de México.
                Formamos a los ingenieros que están construyendo la nueva
                industria de Baja California — desde el aula al piso de planta.
              </p>
            </FadeRight>
            <FadeRight delay={0.65}>
              <Link
                href="/licenciaturas"
                className="group inline-flex items-center gap-2 text-[#00D4FF] font-bold text-sm uppercase tracking-[0.15em] hover:gap-3 transition-all duration-300"
              >
                Ver las 4 ingenierías <ArrowRight size={14} />
              </Link>
            </FadeRight>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {ingenierias.map((ing) => {
            const img = imgBySlug.get(ing.slug);
            return (
              <StaggerItem key={ing.titulo} className={`${ing.span} ${ing.aspect} group relative overflow-hidden rounded-xl bg-[#121B33]`}>
                <Link href={`/carreras/${ing.slug}`} className="block w-full h-full">
                  {img ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E2D4A] to-[#121B33]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-12 left-12 right-12">
                    <h3 className="text-white text-3xl font-bold mb-2" style={{ letterSpacing: "-0.01em" }}>
                      {ing.titulo}
                    </h3>
                    <p className="text-white/70 font-medium tracking-wide uppercase text-xs">
                      {ing.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Lo humano detrás de cada industria (Licenciaturas) ──────────────────────

// Las dos licenciaturas "estrella" comercialmente hablando: tienen mayor demanda
// y reciben tratamiento visual destacado (imagen + copy enriquecido + badge).
const FEATURED_LICENCIATURAS = [
  {
    titulo: "Gastronomía",
    tagline: "Cocina de autor, cultura del sabor y disciplina profesional para la industria restaurantera de Baja California.",
    slug: "gastronomia",
    icon: ChefHat,
  },
  {
    titulo: "Criminología y Criminalística",
    tagline: "Ciencia forense aplicada, investigación criminal y seguridad ciudadana en la frontera.",
    slug: "criminologia-y-criminalistica",
    icon: Search,
  },
] as const;

// Complementarias: orden basado en volumen/reconocimiento de mercado.
const COMPACT_LICENCIATURAS = [
  { titulo: "Derecho",                       tagline: "Argumentación y justicia aplicada", slug: "derecho",                    icon: Scale },
  { titulo: "Administración de Empresas",    tagline: "Estrategia y crecimiento",          slug: "administracion-de-empresas", icon: BarChart2 },
  { titulo: "Contaduría Pública y Finanzas", tagline: "Números que sostienen decisiones",  slug: "contaduria-y-finanzas",      icon: DollarSign },
  { titulo: "Ciencias de la Educación",      tagline: "Formar a quienes forman",           slug: "ciencias-de-la-educacion",   icon: BookOpen },
] as const;

function SeccionLicenciaturas({ carreras }: { carreras: Carrera[] }) {
  const imgBySlug = new Map(carreras.map((c) => [c.slug, sanityImg(c.imagenTarjetaUrl ?? c.imagenUrl, 1600)]));

  return (
    <section className="relative py-32 px-6 md:px-12 bg-white">
      <SectionAccentLine accent="#E9C176" position="top" />
      <SectionAccentLine accent="#E9C176" position="bottom" />
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <div className="max-w-3xl">
            <FadeLeft>
              <div className="flex items-center gap-3 mb-6">
                <span aria-hidden className="block w-[2px] h-6 bg-[#E9C176]" />
                <p className="text-[#E9C176] font-bold tracking-[0.2em] uppercase text-xs">
                  Humanidades · Liderazgo con propósito
                </p>
              </div>
            </FadeLeft>
            <h2
              className="font-black text-[#121B33]"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.75rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              <WordReveal text="Lo humano" delay={0.15} />{" "}
              <WordReveal
                text="detrás de cada industria"
                delay={0.35}
                className="text-[#E9C176]"
                underline
              />
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-5 md:max-w-md">
            <FadeRight delay={0.5}>
              <p className="text-[#45464D] text-xl leading-relaxed text-pretty">
                Detrás de cada industria hay decisiones legales, estrategias de negocio
                y seres humanos que cuidar. Formamos a quienes equilibran el pulso
                humano del crecimiento económico de Baja California.
              </p>
            </FadeRight>
            <FadeRight delay={0.65}>
              <Link
                href="/licenciaturas"
                className="group inline-flex items-center gap-2 text-[#E9C176] font-bold text-sm uppercase tracking-[0.15em] hover:gap-3 transition-all duration-300"
              >
                Ver catálogo de licenciaturas completo <ArrowRight size={14} />
              </Link>
            </FadeRight>
          </div>
        </div>

        {/* Row 1 — Par destacado (50/50) con imagen y copy enriquecido */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {FEATURED_LICENCIATURAS.map((lic) => {
            const img = imgBySlug.get(lic.slug);
            return (
              <StaggerItem
                key={lic.slug}
                className="group relative overflow-hidden rounded-xl bg-[#121B33] aspect-[4/5] md:aspect-auto md:h-[500px]"
              >
                <Link href={`/carreras/${lic.slug}`} className="block w-full h-full">
                  {img ? (
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#E9C176] to-[#8B6A2E]" />
                  )}
                  {/* Gradient más suave en mobile, intenso en desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent md:from-black/85 md:via-black/25" />
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#E9C176]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                    <h3
                      className="text-white font-bold text-2xl md:text-4xl mb-2 md:mb-3"
                      style={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
                    >
                      {lic.titulo}
                    </h3>
                    <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl text-pretty">
                      {lic.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Row 2 — Las compactas con foto de fondo + overlay (mismo tamaño, look premium) */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          {COMPACT_LICENCIATURAS.map((lic) => {
            const img = imgBySlug.get(lic.slug);
            return (
              <StaggerItem key={lic.slug}>
                <Link
                  href={`/carreras/${lic.slug}`}
                  className="group relative block overflow-hidden rounded-xl bg-[#121B33] h-[280px] md:h-[300px] hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(233,193,118,0.25)] transition-all duration-300"
                >
                  {/* Foto de fondo o gradient fallback */}
                  {img ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E9C176] via-[#c19a4a] to-[#5a3f15]" />
                  )}

                  {/* Overlay oscuro para legibilidad */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15"
                  />

                  {/* Glow dorado en hover */}
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-10 w-32 h-32 bg-[#E9C176]/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />

                  <div className="relative z-10 flex flex-col h-full justify-end p-6">
                    <h3
                      className="text-white font-extrabold text-base md:text-lg leading-snug mb-1.5"
                      style={{ letterSpacing: "-0.015em" }}
                    >
                      {lic.titulo}
                    </h3>
                    <p className="text-white/70 text-[13px] leading-relaxed line-clamp-2">
                      {lic.tagline}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Innovation Stats ─────────────────────────────────────────────────────────

// ─── (SeccionModalidades extraído a app/components/SeccionModalidades.tsx) ──

// ─── Planteles ────────────────────────────────────────────────────────────────

function SeccionPlanteles({ campus }: { campus: Campus[] }) {
  const principal = campus.find((c) => c.esPrincipal) ?? campus[0];
  const otros = campus.filter((c) => c._id !== principal?._id);

  return (
    <section
      id="planteles"
      className="bg-[#121B33] py-24 px-6 sm:px-10 lg:px-16 relative overflow-hidden scroll-mt-24"
    >
      <SectionAccentLine accent="#00D4FF" position="top" />
      <SectionAccentLine accent="#00D4FF" position="bottom" />
      <div className="relative z-10 max-w-screen-xl mx-auto">
        {principal && (
          <FadeUp delay={0.05}>
            <CampusHero campus={principal} otros={otros} />
          </FadeUp>
        )}
      </div>
    </section>
  );
}

function CampusHero({ campus: c, otros = [] }: { campus: Campus; otros?: Campus[] }) {
  const ciudadLabel = CIUDAD_LABEL[c.ciudad] ?? c.ciudad;
  // Construye la lista de fotos: principal + galería (sin duplicar la principal).
  const photos: CampusFoto[] = [];
  if (c.imagenUrl) photos.push({ url: c.imagenUrl });
  if (c.galeria?.length) {
    for (const item of c.galeria) {
      if (item?.url && item.url !== c.imagenUrl) photos.push(item);
    }
  }
  return (
    <div>
      {/* Header monumental — pill cyan + headline gigante con glow + línea vertical */}
      <div className="mb-12 md:mb-16 flex gap-6 md:gap-8">
        {/* Línea decorativa vertical */}
        <span
          aria-hidden
          className="hidden md:block w-[2px] shrink-0 self-stretch bg-gradient-to-b from-[#00D4FF] via-[#00D4FF]/40 to-transparent"
        />

        <div className="flex-1">
          {/* Pill cyan */}
          <span className="inline-flex items-center gap-2 bg-[#00D4FF]/15 border border-[#00D4FF]/40 text-[#00D4FF] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.28em] mb-7 shadow-[0_4px_14px_rgba(0,212,255,0.18)]">
            <span aria-hidden>★</span> Campus Principal · {ciudadLabel}
          </span>

          {/* Headline monumental — 2 líneas */}
          <h3
            className="text-white font-black"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 0.98,
            }}
          >
            <span className="block">Diseñado a la altura</span>
            <span
              className="block bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #00D4FF 0%, #00D4FF 35%, #B3F0FF 48%, #FFFFFF 50%, #B3F0FF 52%, #00D4FF 65%, #00D4FF 100%)",
                backgroundSize: "250% 100%",
                animation: "textShimmer 5s ease-in-out infinite",
                filter:
                  "drop-shadow(0 0 22px rgba(0,212,255,0.45)) drop-shadow(0 0 8px rgba(0,212,255,0.4))",
              }}
            >
              de tu ambición.
            </span>
          </h3>
        </div>
      </div>

      {/* Carrusel cinematográfico — auto-rotate + Ken Burns */}
      <CampusCarrusel photos={photos} altBase={c.nombre} />

      {/* CTA + pines de otros planteles */}
      <div className="relative mt-16 md:mt-20">
        {/* Glow ambient detrás */}
        <div
          aria-hidden
          className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-[#00D4FF]/12 blur-[100px] pointer-events-none"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Izquierda — CTA (centrado en mobile, izquierda en lg+) */}
          <div className="text-center lg:text-left">
            {/* Pill admisiones */}
            <span className="inline-flex items-center gap-2 bg-[#00D4FF]/15 border border-[#00D4FF]/40 text-[#00D4FF] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.28em] mb-6 shadow-[0_4px_14px_rgba(0,212,255,0.18)]">
              <span aria-hidden>★</span> Admisiones Septiembre 2026 · Abiertas
            </span>

            {/* Headline en 2 líneas */}
            <h4
              className="text-white font-black mb-4"
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              <span className="block">Donde tu potencial</span>
              <span
                className="block bg-clip-text text-transparent inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(110deg, #00D4FF 0%, #00D4FF 35%, #B3F0FF 48%, #FFFFFF 50%, #B3F0FF 52%, #00D4FF 65%, #00D4FF 100%)",
                  backgroundSize: "250% 100%",
                  animation: "textShimmer 5s ease-in-out infinite",
                  filter:
                    "drop-shadow(0 0 16px rgba(0,212,255,0.4)) drop-shadow(0 0 6px rgba(0,212,255,0.35))",
                }}
              >
                se vuelve éxito.
              </span>
            </h4>

            <p className="text-white/65 text-base md:text-lg mb-8 max-w-xl mx-auto lg:mx-0 text-pretty">
              Conoce el campus en persona antes de inscribirte. Sin costo, sin compromiso.
            </p>

            <a
              href="https://wa.me/526641300236?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20un%20recorrido%20por%20el%20campus%20Casa%20Blanca."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00D4FF] text-[#121B33] px-8 py-4 rounded-full font-extrabold text-sm md:text-base uppercase tracking-wider hover:bg-[#33DDFF] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,212,255,0.55)] shadow-[0_8px_28px_rgba(0,212,255,0.35)] transition-all"
            >
              Agenda tu recorrido <ArrowRight size={18} />
            </a>

            {/* Ubicación Casa Blanca + link Google Maps */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 text-white/60 text-sm">
              <MapPin size={14} className="text-[#00D4FF]" strokeWidth={2} />
              <span>{c.direccion}</span>
              {c.urlMaps && (
                <>
                  <span aria-hidden className="text-white/25">·</span>
                  <a
                    href={c.urlMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#00D4FF] font-bold uppercase tracking-[0.18em] text-xs hover:gap-2 transition-all"
                  >
                    Ver en Google Maps <ArrowRight size={12} />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Derecha — pines de otros planteles. En mobile apila debajo del CTA
              (en lg+ se ubica como columna derecha del grid). */}
          {otros.length > 0 && (
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center justify-center lg:justify-start gap-3">
                <span aria-hidden className="block w-6 h-px bg-white/30" />
                También nos encuentras en
              </p>
              <ul className="space-y-3">
                {otros.map((o) => (
                  <li key={o._id}>
                    <CampusPin campus={o} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function CampusPin({ campus: c }: { campus: Campus }) {
  const ciudad = CIUDAD_LABEL[c.ciudad] ?? c.ciudad;
  const Wrapper = (c.urlMaps ? "a" : "div") as React.ElementType;
  const wrapperProps = c.urlMaps
    ? { href: c.urlMaps, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className="group flex items-start gap-4 bg-white/[0.04] border border-white/10 rounded-xl px-5 py-4 hover:bg-white/[0.08] hover:border-[#00D4FF]/40 transition-all"
    >
      <span className="shrink-0 w-9 h-9 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center group-hover:bg-[#00D4FF]/25 transition-colors">
        <MapPin size={16} className="text-[#00D4FF]" strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <h4
            className="font-bold text-white text-sm"
            style={{ letterSpacing: "-0.01em" }}
          >
            {c.nombre}
          </h4>
          <span className="text-[#00D4FF] text-[9px] font-bold uppercase tracking-[0.22em]">
            {ciudad}
          </span>
        </div>
        <p className="text-white/55 text-xs leading-relaxed">{c.direccion}</p>
      </div>
      {c.urlMaps && (
        <ArrowRight
          size={14}
          className="shrink-0 text-white/30 group-hover:text-[#00D4FF] group-hover:translate-x-0.5 transition-all mt-2"
        />
      )}
    </Wrapper>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default async function HomePage() {
  const [carreras, campus, config, noticiasRaw, historia] = await Promise.all([
    client.fetch<Carrera[]>(todasCarrerasQuery),
    client.fetch<Campus[]>(todosCampusQuery),
    client.fetch<Configuracion>(configuracionQuery),
    client.fetch<NoticiaRaw[]>(noticiasHomeQuery),
    client.fetch<HistoriaData | null>(historiaHomeQuery).catch(() => null),
  ]);

  const noticias: NoticiaCard[] = (noticiasRaw ?? []).map((n) => ({
    _id: n._id,
    titulo: n.titulo,
    slug: n.slug,
    fecha: n.fecha,
    categoria: n.categoria,
    imagenUrl: n.imagen ? urlFor(n.imagen).width(720).height(450).fit("crop").url() : undefined,
  }));

  // Preload del primer slide del hero — LCP candidate.
  // Sin esto el browser lo descubre tarde (background-image / hidratación).
  const heroSlides = config?.heroSlides ?? [];
  const firstHeroSrc = heroSlides[0]?.imagenUrl
    ? sanityImg(heroSlides[0].imagenUrl, 1920)
    : undefined;
  if (firstHeroSrc) {
    ReactDOM.preload(firstHeroSrc, { as: "image", fetchPriority: "high" });
  }

  // JSON-LD CollegeOrUniversity por cada campus → Google Maps + búsquedas
  // locales tipo "universidad en Tijuana cerca de mí".
  const campusLd = campus.map((c) => campusJsonLd({
    nombre: c.nombre,
    ciudad: c.ciudad,
    direccion: c.direccion,
    telefono: c.telefono,
    horario: c.horario,
    urlMaps: c.urlMaps,
    imagenUrl: c.imagenUrl,
  }));

  return (
    <>
      {campusLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <HeroAnimado slides={heroSlides} />
      {historia && <SeccionHistoria data={historia} />}
      {noticias.length > 0 && <SeccionNoticias noticias={noticias} />}
      <SeccionExcelencia carreras={carreras} />
      <SeccionLicenciaturas carreras={carreras} />
      <SeccionModalidades />
      <CtaContadorClases
        data={config?.cicloInicio}
        porcentajeDescuento={config?.promocionInscripcion?.porcentaje ?? 20}
        whatsappFallback={config?.contacto?.whatsapp}
      />
      <SeccionPlanteles campus={campus} />
    </>
  );
}
