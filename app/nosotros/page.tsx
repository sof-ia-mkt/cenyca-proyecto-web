import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Users, CheckCircle, BookOpen, Landmark, MapPin,
  GraduationCap, Award, Quote, ArrowRight, type LucideIcon,
} from "lucide-react";
import { FadeUp, FadeLeft, FadeRight, ScaleIn } from "@/app/components/ScrollReveal";
import SectionAccentLine from "@/app/components/SectionAccentLine";
import LazySelfHostedVideo from "@/components/LazySelfHostedVideo";
import { client } from "@/sanity/lib/client";
import { nosotrosPageQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "La historia de CENYCA Universidad: de un centro de capacitación en Tijuana en 2007 a una universidad líder en Baja California con 4 campus.",
  openGraph: {
    title: "Nosotros | CENYCA Universidad",
    description:
      "De un sueño a una universidad líder en Baja California. Conoce la historia de CENYCA.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Nosotros | CENYCA Universidad" },
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type GaleriaItem = { imagenUrl?: string; imagenAlt?: string; titulo?: string };
type CampusItem = { nombre?: string; ciudad?: string; direccion?: string; principal?: boolean };
type ValorItem = { icono?: string; titulo?: string; descripcion?: string };

type NosotrosData = {
  heroKicker?: string; heroTitulo?: string; heroFrase?: string;
  heroImagenUrl?: string; heroImagenAlt?: string;
  historiaKicker?: string; historiaTitulo?: string; historiaLead?: string;
  historiaParrafos?: string; historiaCierre?: string;
  directorImagenUrl?: string; directorImagenAlt?: string;
  directorCita?: string; directorNombre?: string; directorCargo?: string;
  cbKicker?: string; cbTitulo?: string; cbDescripcion?: string;
  cbVideo1Url?: string; cbVideo1Label?: string;
  cbVideo2Url?: string; cbVideo2Label?: string;
  cbGaleria?: GaleriaItem[];
  campusKicker?: string; campusTitulo?: string; campusDescripcion?: string;
  campusLista?: CampusItem[];
  mision?: string; vision?: string;
  valoresTitulo?: string; valores?: ValorItem[];
  ctaTitulo?: string; ctaDescripcion?: string;
  ctaBoton1Texto?: string; ctaBoton1Url?: string;
  ctaBoton2Texto?: string; ctaBoton2Url?: string;
};

const ICONOS: Record<string, LucideIcon> = {
  Star, Users, CheckCircle, BookOpen, Landmark, MapPin,
};

// ─── Respaldos (si Sanity aún no tiene contenido) ────────────────────────────

const DEFAULTS = {
  heroKicker: "Nuestra historia",
  heroTitulo: "Lo que un día fue un sueño, hoy es CENYCA.",
  heroFrase:
    "Desde 2007 transformando la educación en la frontera — de un centro de capacitación en Tijuana a una universidad líder en Baja California.",
  heroImagenUrl: "/nosotros/casa-blanca-laboratorio-robotica.jpg",
  historiaKicker: "De dónde venimos",
  historiaTitulo: "Una historia de no rendirse",
  historiaLead: "Empezó como un sueño en Tijuana — y no hemos dejado de construirlo.",
  historiaParrafos:
    "En 2007, CENYCA nació de una convicción simple: que estudiar no debía depender de qué tan lejos quedara la universidad. Empezamos pequeños — un centro de capacitación que ayudaba a jóvenes a dar su siguiente paso, cerca de casa.\n\nNo fue un camino recto. Hubo años difíciles, decisiones arriesgadas y más de una caída. Pero cada vez nos levantamos, porque entendimos algo que nos cambió para siempre: la educación tiene que adaptarse a la vida real, no al revés.\n\nPor eso obtuvimos el aval de la SEP, abrimos las puertas a quienes querían retomar sus estudios y, en 2019, dimos el salto más grande: nos convertimos formalmente en CENYCA Universidad. En 2024 levantamos Campus Casa Blanca, un edificio pensado desde cero para la ingeniería que la frontera necesita.\n\nHoy somos una universidad líder en Baja California, con 4 campus y más de 3,200 alumnos. Pero seguimos siendo lo mismo que en 2007: gente que cree que el talento de la frontera merece un lugar donde crecer.",
  historiaCierre:
    "Esta historia la escribe cada estudiante que cruza nuestras puertas — y apenas comienza.",
  directorImagenUrl: "/nosotros/director-martin-arreola.jpg",
  directorCita:
    "No tienen idea de cuántas veces nos hemos caído y nos hemos levantado, pero lo más importante es que vamos avanzando. Esto no se va a quedar solo en infraestructura — me estoy construyendo mi propia Disneylandia de las ingenierías.",
  directorNombre: "Ing. Jesús Martín Arreola",
  directorCargo: "Director General · CENYCA Universidad",
  cbKicker: "Nuestra casa",
  cbTitulo: "Casa Blanca: el sueño hecho realidad",
  cbDescripcion:
    "No fue fácil. Detrás de cada muro de Campus Casa Blanca hay años de esfuerzo y la convicción de que la frontera merecía una universidad a su altura. Así se construyó — etapa por etapa.",
  cbVideo1Label: "Campus Casa Blanca · Primera etapa",
  cbVideo2Label: "Campus Casa Blanca · Segunda etapa",
  cbGaleria: [
    { imagenUrl: "/nosotros/casa-blanca-arranque-maquinaria.jpg", titulo: "El inicio de la obra" },
    { imagenUrl: "/nosotros/casa-blanca-arranque-comunidad.jpg", titulo: "Nuestra comunidad" },
    { imagenUrl: "/nosotros/casa-blanca-laboratorio-robotica.jpg", titulo: "Laboratorios de ingeniería" },
    { imagenUrl: "/nosotros/casa-blanca-laboratorio-ossur.jpg", titulo: "Laboratorios especializados" },
    { imagenUrl: "/nosotros/casa-blanca-auditorio-smk.jpg", titulo: "Espacios para crecer" },
    { imagenUrl: "/nosotros/graduacion-zonkeys.jpg", titulo: "Nuestros egresados" },
  ] as GaleriaItem[],
  campusKicker: "Dónde estamos",
  campusTitulo: "4 campus en Baja California",
  campusDescripcion:
    "Crecimos para estar cerca de ti. Tres campus en Tijuana y uno en Tecate, cada uno con la calidad CENYCA.",
  campusLista: [
    { nombre: "Campus Casa Blanca", ciudad: "Tijuana", direccion: "Blvd. Casa Blanca 5530, Col. Matamoros, 22206 Tijuana, B.C.", principal: true },
    { nombre: "Campus Otay", ciudad: "Tijuana", direccion: "Calz. del Tecnológico 2016, Local 16, Otay Constituyentes, 22457 Tijuana, B.C.", principal: false },
    { nombre: "Plantel Palmas", ciudad: "Tijuana", direccion: "Blvd. Gustavo Díaz Ordaz 4141, San Carlos, 22106 Tijuana, B.C.", principal: false },
    { nombre: "Plantel Tecate", ciudad: "Tecate", direccion: "C. F 908, Moderna, 21450 Tecate, B.C.", principal: false },
  ] as CampusItem[],
  mision:
    "Formar profesionistas de excelencia con sólidos conocimientos técnicos, valores éticos y visión empresarial, capaces de impulsar el desarrollo socioeconómico de Baja California y de México, a través de una educación pertinente, flexible e innovadora.",
  vision:
    "Ser la universidad privada líder en el noroeste de México, reconocida por la calidad de sus egresados, la pertinencia de sus programas y su estrecha vinculación con el sector productivo e industrial de la región.",
  valoresTitulo: "Nuestros valores",
  valores: [
    { icono: "Star", titulo: "Excelencia", descripcion: "Buscamos los más altos estándares académicos en cada programa que ofrecemos." },
    { icono: "Users", titulo: "Compromiso", descripcion: "Con el desarrollo personal y profesional de cada uno de nuestros estudiantes." },
    { icono: "CheckCircle", titulo: "Integridad", descripcion: "Formamos profesionistas con valores éticos sólidos para la vida y el trabajo." },
    { icono: "BookOpen", titulo: "Innovación", descripcion: "Actualizamos continuamente nuestros planes de estudio junto con la industria local." },
    { icono: "Landmark", titulo: "Pertinencia", descripcion: "Respondemos a las necesidades reales del mercado laboral del noroeste del país." },
    { icono: "MapPin", titulo: "Arraigo regional", descripcion: "Orgullosos de aportar al crecimiento económico de Baja California." },
  ] as ValorItem[],
  ctaTitulo: "Sé parte de esta historia",
  ctaDescripcion:
    "El siguiente capítulo de CENYCA lo escribes tú. Conoce nuestra oferta académica y da el primer paso.",
  ctaBoton1Texto: "Conoce la oferta académica",
  ctaBoton1Url: "/oferta-academica",
  ctaBoton2Texto: "Proceso de admisión",
  ctaBoton2Url: "/admisiones",
};

// Resalta los años (2007, 2019, 2024, 2010s) dentro del relato.
function conAnios(texto: string) {
  return texto.split(/(\b20\d{2}s?\b)/g).map((parte, i) =>
    /^20\d{2}s?$/.test(parte) ? (
      <span key={i} className="text-[#00D4FF] font-semibold">{parte}</span>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function NosotrosPage() {
  const data = await client
    .fetch<NosotrosData | null>(nosotrosPageQuery)
    .catch(() => null);

  const d = {
    heroKicker: data?.heroKicker || DEFAULTS.heroKicker,
    heroTitulo: data?.heroTitulo || DEFAULTS.heroTitulo,
    heroFrase: data?.heroFrase || DEFAULTS.heroFrase,
    heroImagenUrl: data?.heroImagenUrl || DEFAULTS.heroImagenUrl,
    heroImagenAlt: data?.heroImagenAlt || "Campus Casa Blanca de CENYCA Universidad",
    historiaKicker: data?.historiaKicker || DEFAULTS.historiaKicker,
    historiaTitulo: data?.historiaTitulo || DEFAULTS.historiaTitulo,
    historiaLead: data?.historiaLead || DEFAULTS.historiaLead,
    historiaParrafos: data?.historiaParrafos || DEFAULTS.historiaParrafos,
    historiaCierre: data?.historiaCierre || DEFAULTS.historiaCierre,
    directorImagenUrl: data?.directorImagenUrl || DEFAULTS.directorImagenUrl,
    directorImagenAlt: data?.directorImagenAlt || "Ing. Jesús Martín Arreola, Director General de CENYCA Universidad",
    directorCita: data?.directorCita || DEFAULTS.directorCita,
    directorNombre: data?.directorNombre || DEFAULTS.directorNombre,
    directorCargo: data?.directorCargo || DEFAULTS.directorCargo,
    cbKicker: data?.cbKicker || DEFAULTS.cbKicker,
    cbTitulo: data?.cbTitulo || DEFAULTS.cbTitulo,
    cbDescripcion: data?.cbDescripcion || DEFAULTS.cbDescripcion,
    cbVideo1Url: data?.cbVideo1Url || null,
    cbVideo1Label: data?.cbVideo1Label || DEFAULTS.cbVideo1Label,
    cbVideo2Url: data?.cbVideo2Url || null,
    cbVideo2Label: data?.cbVideo2Label || DEFAULTS.cbVideo2Label,
    cbGaleria: data?.cbGaleria && data.cbGaleria.length > 0 ? data.cbGaleria : DEFAULTS.cbGaleria,
    campusKicker: data?.campusKicker || DEFAULTS.campusKicker,
    campusTitulo: data?.campusTitulo || DEFAULTS.campusTitulo,
    campusDescripcion: data?.campusDescripcion || DEFAULTS.campusDescripcion,
    campusLista: data?.campusLista && data.campusLista.length > 0 ? data.campusLista : DEFAULTS.campusLista,
    mision: data?.mision || DEFAULTS.mision,
    vision: data?.vision || DEFAULTS.vision,
    valoresTitulo: data?.valoresTitulo || DEFAULTS.valoresTitulo,
    valores: data?.valores && data.valores.length > 0 ? data.valores : DEFAULTS.valores,
    ctaTitulo: data?.ctaTitulo || DEFAULTS.ctaTitulo,
    ctaDescripcion: data?.ctaDescripcion || DEFAULTS.ctaDescripcion,
    ctaBoton1Texto: data?.ctaBoton1Texto || DEFAULTS.ctaBoton1Texto,
    ctaBoton1Url: data?.ctaBoton1Url || DEFAULTS.ctaBoton1Url,
    ctaBoton2Texto: data?.ctaBoton2Texto || DEFAULTS.ctaBoton2Texto,
    ctaBoton2Url: data?.ctaBoton2Url || DEFAULTS.ctaBoton2Url,
  };

  const parrafos = d.historiaParrafos.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const videos = [
    { url: d.cbVideo1Url, label: d.cbVideo1Label },
    { url: d.cbVideo2Url, label: d.cbVideo2Label },
  ].filter((v): v is { url: string; label: string } => !!v.url);

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[82vh] flex items-center bg-[#121B33] pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Image
          src={d.heroImagenUrl}
          alt={d.heroImagenAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#121B33]/85 via-[#121B33]/80 to-[#121B33]/95"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-3 mb-6">
              <span aria-hidden className="block w-8 h-px bg-[#00D4FF]" />
              <span className="font-montserrat text-[#00D4FF] text-xs font-bold uppercase tracking-[0.3em]">
                {d.heroKicker}
              </span>
              <span aria-hidden className="block w-8 h-px bg-[#00D4FF]" />
            </div>
            <h1
              className="font-bebas text-white tracking-wide leading-[0.95] mb-6 text-balance whitespace-pre-line"
              style={{ fontSize: "clamp(2.75rem, 8vw, 6.5rem)" }}
            >
              {d.heroTitulo}
            </h1>
            <p className="font-montserrat text-white/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-balance">
              {d.heroFrase}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── 2. Nuestra historia + Mensaje del Director ───────────────────────── */}
      <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SectionAccentLine accent="#00D4FF" position="top" />
        <SectionAccentLine accent="#00D4FF" position="bottom" />
        <div
          aria-hidden
          className="absolute -top-24 -left-24 w-[460px] h-[460px] rounded-full bg-[#00D4FF]/10 blur-[150px] pointer-events-none"
        />
        <div className="relative z-10 max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-16 items-start">
          {/* Izquierda — el relato */}
          <div>
            <FadeUp className="mb-10">
              <span className="font-montserrat text-[#00D4FF] text-xs font-bold uppercase tracking-[0.25em] block mb-3">
                {d.historiaKicker}
              </span>
              <h2
                className="font-bebas text-white tracking-wide leading-[1.02]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)" }}
              >
                {d.historiaTitulo}
              </h2>
            </FadeUp>

            <FadeUp>
              <p className="font-montserrat text-white text-xl sm:text-2xl leading-snug font-semibold mb-8 text-balance">
                {d.historiaLead}
              </p>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="font-montserrat text-white/75 text-lg leading-relaxed space-y-5">
                {parrafos.map((p, i) => (
                  <p key={i}>{conAnios(p)}</p>
                ))}
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="font-bebas text-[#00D4FF] tracking-wide leading-tight mt-10 text-balance"
                 style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
                {d.historiaCierre}
              </p>
            </FadeUp>
          </div>

          {/* Derecha — Mensaje del Director */}
          <FadeRight className="lg:sticky lg:top-24">
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#1E2D4A] mb-5">
                <Image
                  src={d.directorImagenUrl}
                  alt={d.directorImagenAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
              <span className="font-montserrat text-[#00D4FF] text-[10px] font-bold uppercase tracking-[0.22em] block mb-3">
                Mensaje del Director
              </span>
              <Quote size={26} className="text-[#00D4FF]/40 mb-2" />
              <blockquote className="font-montserrat text-white/80 text-sm leading-relaxed mb-4">
                {d.directorCita}
              </blockquote>
              <div>
                <p className="font-montserrat font-bold text-white text-sm">
                  {d.directorNombre}
                </p>
                <p className="font-montserrat text-white/55 text-xs">
                  {d.directorCargo}
                </p>
              </div>
            </div>
          </FadeRight>
        </div>
      </section>

      {/* ── 3. Casa Blanca — el sueño hecho realidad ─────────────────────────── */}
      <section className="relative bg-[#F9F9FB] py-24 px-4 sm:px-6 lg:px-8">
        <SectionAccentLine accent="#E9C176" position="top" />
        <SectionAccentLine accent="#E9C176" position="bottom" />
        <div className="max-w-screen-xl mx-auto">
          <FadeUp className="max-w-3xl mb-14">
            <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.25em] block mb-3">
              {d.cbKicker}
            </span>
            <h2
              className="font-bebas text-[#121B33] tracking-wide leading-[1.02] mb-5"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)" }}
            >
              {d.cbTitulo}
            </h2>
            <p className="font-montserrat text-[#45464D] text-lg leading-relaxed text-pretty">
              {d.cbDescripcion}
            </p>
          </FadeUp>

          {/* Videos de construcción del Campus Casa Blanca */}
          {videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-14">
              {videos.map((v) => (
                <FadeUp key={v.label}>
                  <div>
                    <LazySelfHostedVideo videoUrl={v.url} title={v.label} />
                    <p className="font-montserrat text-[#121B33] font-bold text-sm uppercase tracking-[0.15em] mt-3">
                      {v.label}
                    </p>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}

          {/* Galería */}
          <FadeUp>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {d.cbGaleria.map((g, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl bg-[#121B33]"
                >
                  <div className="relative aspect-[4/3]">
                    {g.imagenUrl && (
                      <Image
                        src={g.imagenUrl}
                        alt={g.imagenAlt || g.titulo || "Campus CENYCA"}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                    />
                  </div>
                  {g.titulo && (
                    <p className="absolute bottom-4 left-4 right-4 font-montserrat text-white font-semibold text-sm">
                      {g.titulo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── 4. Nuestros campus ───────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SectionAccentLine accent="#00D4FF" position="top" />
        <SectionAccentLine accent="#00D4FF" position="bottom" />
        <div className="relative z-10 max-w-screen-xl mx-auto">
          <FadeUp className="max-w-2xl mb-12">
            <span className="font-montserrat text-[#00D4FF] text-xs font-bold uppercase tracking-[0.25em] block mb-3">
              {d.campusKicker}
            </span>
            <h2
              className="font-bebas text-white tracking-wide leading-[1.02] mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {d.campusTitulo}
            </h2>
            <p className="font-montserrat text-white/70 text-lg leading-relaxed text-pretty">
              {d.campusDescripcion}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {d.campusLista.map((c, i) => (
              <FadeUp key={i}>
                <div className="h-full flex items-start gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-[#00D4FF]/40 hover:bg-white/[0.07] transition-all">
                  <span className="shrink-0 w-11 h-11 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center">
                    <MapPin size={18} className="text-[#00D4FF]" strokeWidth={2} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-1.5">
                      <h3 className="font-montserrat font-bold text-white text-lg">
                        {c.nombre}
                      </h3>
                      {c.principal && (
                        <span className="font-montserrat text-[#00D4FF] text-[10px] font-bold uppercase tracking-[0.18em] bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-full px-2 py-0.5">
                          Campus principal
                        </span>
                      )}
                    </div>
                    {c.ciudad && (
                      <p className="font-montserrat text-[#00D4FF] text-xs font-bold uppercase tracking-[0.18em] mb-2">
                        {c.ciudad}
                      </p>
                    )}
                    <p className="font-montserrat text-white/60 text-sm leading-relaxed">
                      {c.direccion}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Misión, Visión y Valores ──────────────────────────────────────── */}
      <section className="relative bg-white py-24 px-4 sm:px-6 lg:px-8">
        <SectionAccentLine accent="#E9C176" position="bottom" />
        <div className="max-w-screen-xl mx-auto">
          {/* Misión / Visión */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-20">
            <FadeLeft>
              <div className="bg-[#121B33] rounded-3xl p-9 sm:p-11 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#00D4FF]/15 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap size={28} className="text-[#00D4FF]" strokeWidth={1.5} />
                </div>
                <h2 className="font-bebas text-white text-4xl tracking-wide mb-4">Misión</h2>
                <p className="font-montserrat text-white/70 leading-relaxed flex-1">
                  {d.mision}
                </p>
              </div>
            </FadeLeft>
            <FadeRight>
              <div className="bg-[#F5F7FF] border border-[#121B33]/10 rounded-3xl p-9 sm:p-11 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#121B33]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Award size={28} className="text-[#121B33]" strokeWidth={1.5} />
                </div>
                <h2 className="font-bebas text-[#121B33] text-4xl tracking-wide mb-4">Visión</h2>
                <p className="font-montserrat text-[#444] leading-relaxed flex-1">
                  {d.vision}
                </p>
              </div>
            </FadeRight>
          </div>

          {/* Valores */}
          <FadeUp className="text-center mb-12">
            <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.25em] block mb-3">
              Lo que nos define
            </span>
            <h2
              className="font-bebas text-[#121B33] tracking-wide leading-[1.02]"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
            >
              {d.valoresTitulo}
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {d.valores.map((v, i) => {
              const Icon = ICONOS[v.icono || "Star"] || Star;
              return (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="bg-[#F5F7FF] rounded-2xl p-7 h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-[#121B33] rounded-xl flex items-center justify-center mb-4">
                      <Icon size={22} color="#00D4FF" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-montserrat font-bold text-[#121B33] text-base mb-2">
                      {v.titulo}
                    </h3>
                    <p className="font-montserrat text-[#666] text-sm leading-relaxed text-pretty">
                      {v.descripcion}
                    </p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. CTA final ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SectionAccentLine accent="#00D4FF" position="top" />
        <div
          aria-hidden
          className="absolute -bottom-32 left-1/4 w-[480px] h-[300px] bg-[#00D4FF]/12 blur-[120px] pointer-events-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScaleIn>
            <h2
              className="font-bebas text-white tracking-wide leading-[1.02] mb-5"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {d.ctaTitulo}
            </h2>
            <p className="font-montserrat text-white/70 text-lg mb-10 max-w-xl mx-auto text-balance">
              {d.ctaDescripcion}
            </p>
          </ScaleIn>
          <FadeUp delay={0.15}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={d.ctaBoton1Url}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00D4FF] text-[#121B33] font-montserrat font-bold px-9 py-4 rounded-full hover:bg-white transition-all duration-300 hover:scale-[1.03]"
              >
                {d.ctaBoton1Texto}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={d.ctaBoton2Url}
                className="w-full sm:w-auto border-2 border-white/30 text-white font-montserrat font-bold px-9 py-4 rounded-full hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors duration-300 text-center"
              >
                {d.ctaBoton2Texto}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
