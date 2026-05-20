import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  Factory,
  Trophy,
  Heart,
  GraduationCap,
  Users,
  Lightbulb,
  Globe,
  Briefcase,
  HeartHandshake,
  MapPin,
  Calendar,
  Sprout,
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
import SectionAccentLine from "@/app/components/SectionAccentLine";
import AnimatedCounter from "@/app/components/AnimatedCounter";
import AliadosMarquee from "@/app/components/AliadosMarquee";
import HeroVideo from "@/app/components/HeroVideo";
import aliadosData from "@/public/vinculacion/aliados.json";
import { client } from "@/sanity/lib/client";
import { vinculacionPageQuery } from "@/sanity/lib/queries";

type ImagenSanity = {
  imagenUrl?: string;
  imagenAlt?: string;
  imagenLqip?: string;
};

type HeroStat = {
  valor?: number;
  sufijo?: string;
  label?: string;
  color?: "gold" | "white" | "cyan";
};

type VinculacionData = {
  heroKicker?: string;
  heroTitulo?: string;
  heroDescripcion?: string;
  heroVideoUrl?: string;
  heroPosterUrl?: string;
  heroPosterAlt?: string;
  heroPosterLqip?: string;
  heroStats?: HeroStat[];
  scrollHint?: string;
  aliadosKicker?: string;
  aliadosTexto?: string;
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
  ctaEmailAsunto?: string;
  ctaEmailCuerpo?: string;
  contacto?: {
    nombre?: string;
    cargo?: string;
    email?: string;
  };
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

// Tipos de colaboración por sector (lo que un estudiante/aliado obtiene
// concretamente en ese pilar). Se muestran como 2x2 de íconos + label.
const TIPOS_POR_SECTOR: Record<
  string,
  { icon: LucideIcon; label: string }[]
> = {
  industria: [
    { icon: Briefcase, label: "Prácticas profesionales" },
    { icon: Lightbulb, label: "Proyectos integradores" },
    { icon: MapPin, label: "Visitas industriales" },
    { icon: GraduationCap, label: "Bolsa de trabajo" },
  ],
  deporte: [
    { icon: Trophy, label: "Becas deportivas" },
    { icon: Calendar, label: "Eventos y ligas" },
    { icon: Users, label: "Promoción institucional" },
    { icon: GraduationCap, label: "Talento dual" },
  ],
  social: [
    { icon: HeartHandshake, label: "Servicio social" },
    { icon: Sprout, label: "Proyectos comunitarios" },
    { icon: Users, label: "Voluntariado" },
    { icon: Calendar, label: "Jornadas y eventos" },
  ],
  educacion: [
    { icon: GraduationCap, label: "Continuidad académica" },
    { icon: Users, label: "Intercambios" },
    { icon: Lightbulb, label: "Proyectos conjuntos" },
    { icon: Calendar, label: "Eventos académicos" },
  ],
  servicios: [
    { icon: Briefcase, label: "Prácticas profesionales" },
    { icon: GraduationCap, label: "Bolsa de trabajo" },
    { icon: Users, label: "Convenios institucionales" },
    { icon: Calendar, label: "Eventos sectoriales" },
  ],
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
  | "ctaEmailAsunto"
  | "ctaEmailCuerpo"
>> & {
  contacto: Required<NonNullable<VinculacionData["contacto"]>>;
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
  ctaEmailAsunto: "Interés en convenio de vinculación con CENYCA",
  ctaEmailCuerpo:
    "Buen día, Mtra. Alejandra:\n\nMi empresa está interesada en establecer un convenio de vinculación con CENYCA Universidad. Quedo atento/a a sus comentarios.\n\nSaludos cordiales,",
  contacto: {
    nombre: "Mtra. Alejandra Chan Gálvez",
    cargo: "Dirección de Vinculación",
    email: "direccion.vinculacion@cenyca.edu.mx",
  },
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

export default async function VinculacionPage() {
  const data = await client
    .fetch<VinculacionData | null>(vinculacionPageQuery)
    .catch(() => null);

  const heroKicker = data?.heroKicker || DEFAULTS.heroKicker;
  const heroTitulo = data?.heroTitulo || DEFAULTS.heroTitulo;
  const heroDescripcion = data?.heroDescripcion || DEFAULTS.heroDescripcion;
  const heroVideoUrl = data?.heroVideoUrl || null;
  const heroPosterUrl =
    data?.heroPosterUrl || "/vinculacion/innovate-baja-connect.jpg";
  const heroPosterAlt = data?.heroPosterAlt || "Eventos de vinculación CENYCA";
  const scrollHint = data?.scrollHint || "Conoce más";
  const aliadosKicker = data?.aliadosKicker || "Confían en nosotros";
  const aliadosTextoTpl =
    data?.aliadosTexto ||
    "{n}+ convenios activos con instituciones, industria y sector social";
  const aliadosTexto = aliadosTextoTpl.replace(
    /\{n\}/g,
    String(aliadosData.stats.activos)
  );

  // Stats: Sanity override > auto del sheet
  const heroStats: Required<HeroStat>[] =
    data?.heroStats && data.heroStats.length > 0
      ? data.heroStats.map((s) => ({
          valor: s.valor ?? 0,
          sufijo: s.sufijo ?? "",
          label: s.label ?? "",
          color: s.color ?? "white",
        }))
      : [
          {
            valor: aliadosData.stats.totalHistorico,
            sufijo: "+",
            label: "Convenios firmados",
            color: "gold",
          },
          {
            valor: aliadosData.stats.activos,
            sufijo: "",
            label: "Aliados activos",
            color: "white",
          },
          { valor: 3, sufijo: "", label: "Sectores de impacto", color: "cyan" },
        ];

  const statColor = (c: HeroStat["color"]) =>
    c === "gold" ? "text-[#E9C176]" : c === "cyan" ? "text-[#00D4FF]" : "text-white";

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

  const contacto = {
    nombre: data?.contacto?.nombre || DEFAULTS.contacto.nombre,
    cargo: data?.contacto?.cargo || DEFAULTS.contacto.cargo,
    email: data?.contacto?.email || DEFAULTS.contacto.email,
  };
  const mailAsunto = encodeURIComponent(
    data?.ctaEmailAsunto || DEFAULTS.ctaEmailAsunto
  );
  const mailCuerpo = encodeURIComponent(
    data?.ctaEmailCuerpo || DEFAULTS.ctaEmailCuerpo
  );
  const mailtoHref = `mailto:${contacto.email}?subject=${mailAsunto}&body=${mailCuerpo}`;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[680px] lg:min-h-[780px] flex items-center bg-[#121B33] pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background: si hay video en Sanity lo usa, si no muestra el póster */}
        {heroVideoUrl ? (
          <HeroVideo
            src={heroVideoUrl}
            poster={heroPosterUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        ) : (
          <Image
            src={heroPosterUrl}
            alt={heroPosterAlt}
            fill
            priority
            sizes="100vw"
            placeholder={data?.heroPosterLqip ? "blur" : "empty"}
            blurDataURL={data?.heroPosterLqip}
            className="object-cover opacity-40"
          />
        )}

        {/* Overlay gradiente para legibilidad */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#121B33]/80 via-[#121B33]/70 to-[#121B33]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#121B33_85%)]"
        />

        {/* Halos dorados sutiles */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E9C176]/20 to-transparent blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#00D4FF]/15 to-transparent blur-3xl pointer-events-none"
        />

        <SectionAccentLine accent="#E9C176" position="top" opacity={0.6} />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <FadeUp className="text-center">
            <div className="inline-flex items-center gap-3 mb-6">
              <span aria-hidden className="block w-8 h-px bg-[#E9C176]" />
              <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.3em]">
                {heroKicker}
              </span>
              <span aria-hidden className="block w-8 h-px bg-[#E9C176]" />
            </div>
            <h1
              className="font-bebas text-white tracking-wide mb-6 leading-none text-balance"
              style={{ fontSize: "clamp(2.75rem, 11vw, 8rem)" }}
            >
              {heroTitulo}
            </h1>
            <p className="font-montserrat text-white/75 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-14 text-pretty">
              {heroDescripcion}
            </p>
          </FadeUp>

          {/* Stats: Sanity override → fallback automático del sheet */}
          <FadeUp delay={0.25}>
            <div className="grid grid-cols-3 gap-4 sm:gap-10 max-w-3xl mx-auto pt-10 border-t border-white/10">
              {heroStats.map((s, i) => (
                <div
                  key={`${s.label}-${i}`}
                  className={`text-center ${i === 1 ? "border-x border-white/10" : ""}`}
                >
                  <div
                    className={`font-bebas ${statColor(s.color)} text-4xl sm:text-6xl lg:text-7xl tracking-wide leading-none`}
                  >
                    <AnimatedCounter value={s.valor} suffix={s.sufijo} />
                  </div>
                  <p className="font-montserrat text-white/60 text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] mt-2 sm:mt-3">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Scroll hint */}
        <div
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="font-montserrat text-[10px] uppercase tracking-[0.3em]">{scrollHint}</span>
          <span className="block w-px h-10 bg-gradient-to-b from-[#E9C176]/60 to-transparent" />
        </div>
      </section>

      <div id="aliados" className="scroll-mt-24">
        <AliadosMarquee
          aliados={aliadosData.aliados}
          kicker={aliadosKicker}
          texto={aliadosTexto}
        />
      </div>

      {/* ── Mensaje del Rector ────────────────────────────────────────────── */}
      <section className="relative bg-white py-24 px-4 sm:px-6 lg:px-8">
        <SectionAccentLine accent="#E9C176" position="top" />
        <SectionAccentLine accent="#E9C176" position="bottom" />
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
              <div className="relative bg-[#F9F9FB] border border-[#121B33]/10 rounded-3xl p-8 sm:p-10 overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-[#E9C176] via-[#E9C176] to-transparent"
                />
                <blockquote className="font-montserrat text-[#333] text-lg sm:text-xl leading-relaxed italic whitespace-pre-line text-left">
                  {rector.cita}
                </blockquote>
                <div className="flex items-center gap-4 mt-8">
                  <div className="w-12 h-1 bg-[#E9C176] rounded" />
                  <p className="font-montserrat font-bold text-[#121B33] text-sm">
                    {rector.nombre}
                  </p>
                </div>
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      {/* ── Pilares ───────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8">
        <SectionAccentLine accent="#00D4FF" position="top" />
        <SectionAccentLine accent="#00D4FF" position="bottom" />
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-16">
            <span className="font-montserrat text-[#00D4FF] text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              {pilaresKicker}
            </span>
            <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3 text-balance">
              {pilaresTitulo}
            </h2>
            <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto" />
          </FadeUp>

          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pilares.map((pilar, idx) => {
              const Icon = ICONS[pilar.icono || ""] || Factory;
              const isAccent = idx === 1;
              // Mapeo icono → sector del aliados.json
              const iconSectorMap: Record<string, string> = {
                Factory: "industria",
                Lightbulb: "industria",
                Trophy: "deporte",
                Heart: "social",
                Users: "social",
                GraduationCap: "educacion",
                Globe: "servicios",
              };
              const pilarSector = iconSectorMap[pilar.icono || ""] || "";
              const tiposColab = TIPOS_POR_SECTOR[pilarSector] ?? [];
              const accentColor = isAccent ? "#E9C176" : "#00D4FF";
              const accentBg = isAccent ? "bg-[#E9C176]/15" : "bg-[#00D4FF]/15";
              const accentText = isAccent ? "text-[#E9C176]" : "text-[#00D4FF]";
              const accentHoverBorder = isAccent
                ? "hover:border-[#E9C176]/30"
                : "hover:border-[#00D4FF]/30";
              return (
                <StaggerItem key={pilar.titulo}>
                  <div
                    className={`bg-white/5 border border-white/10 rounded-3xl overflow-hidden ${accentHoverBorder} transition-all duration-300 h-full flex flex-col`}
                  >
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
                      <div className={`w-12 h-12 ${accentBg} rounded-xl flex items-center justify-center mb-5`}>
                        <Icon size={24} className={accentText} strokeWidth={1.5} style={{ color: accentColor }} />
                      </div>
                      <h3 className="font-montserrat font-bold text-white text-xl mb-3 text-balance">
                        {pilar.titulo}
                      </h3>
                      <p className="font-montserrat text-white/60 text-sm leading-relaxed mb-6 flex-1 text-left">
                        {pilar.descripcion}
                      </p>
                      {tiposColab.length > 0 && (
                        <div className="border-t border-white/10 pt-5">
                          <p
                            className={`font-montserrat ${accentText} text-xs uppercase tracking-wider mb-4`}
                          >
                            Formas de colaboración
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            {tiposColab.map(({ icon: TipoIcon, label }) => (
                              <div
                                key={label}
                                className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5"
                              >
                                <TipoIcon
                                  size={16}
                                  strokeWidth={1.75}
                                  style={{ color: accentColor }}
                                  className="shrink-0"
                                />
                                <span className="font-montserrat text-white/85 text-[11px] leading-tight">
                                  {label}
                                </span>
                              </div>
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

      {/* ── Galería ───────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F9F9FB] py-24 px-4 sm:px-6 lg:px-8">
        <SectionAccentLine accent="#E9C176" position="top" />
        <SectionAccentLine accent="#E9C176" position="bottom" />
        <div className="max-w-7xl mx-auto">
          <FadeUp className="text-center mb-14">
            <div className="inline-flex items-center gap-3 mb-4">
              <span aria-hidden className="block w-[2px] h-5 bg-[#E9C176]" />
              <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.2em]">
                Galería
              </span>
              <span aria-hidden className="block w-[2px] h-5 bg-[#E9C176]" />
            </div>
            <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-3 text-balance">
              {galeriaTitulo}
            </h2>
            <div className="w-16 h-1 bg-[#E9C176] rounded mx-auto mb-4" />
            <p className="font-montserrat text-[#666] max-w-xl mx-auto text-sm text-pretty">
              {galeriaDescripcion}
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:auto-rows-fr">
            {galeria.map((item, i) => (
              <FadeUp
                key={`${item.titulo}-${i}`}
                delay={i * 0.08}
                className={i === 0 ? "lg:row-span-2 lg:h-full" : ""}
              >
                <div
                  className={`group relative rounded-2xl overflow-hidden cursor-default ${
                    i === 0 ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-video lg:h-full"
                  }`}
                >
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
                        <p className="font-montserrat text-[#E9C176] text-xs mt-1">
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

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <SectionAccentLine accent="#E9C176" position="top" opacity={0.7} />
        <SectionAccentLine accent="#E9C176" position="bottom" opacity={0.7} />

        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#E9C176]/25 to-transparent blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#8B6A2E]/20 to-transparent blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <ScaleIn>
            <div className="inline-flex items-center gap-3 mb-5">
              <span aria-hidden className="block w-[2px] h-5 bg-[#E9C176]" />
              <span className="font-montserrat text-[#E9C176] text-xs font-bold uppercase tracking-[0.2em]">
                ¿Quieres ser parte?
              </span>
              <span aria-hidden className="block w-[2px] h-5 bg-[#E9C176]" />
            </div>
            <h2 className="font-bebas text-white text-4xl sm:text-6xl tracking-wide mb-5 text-balance">
              {ctaTitulo}
            </h2>
            <div className="w-20 h-[3px] bg-gradient-to-r from-[#E9C176] to-[#8B6A2E] rounded mx-auto mb-6" />
            <p className="font-montserrat text-white/70 text-lg mb-10 max-w-xl mx-auto text-pretty">
              {ctaDescripcion}
            </p>
          </ScaleIn>
          <FadeUp delay={0.2}>
            <div className="flex justify-center">
              <a
                href={mailtoHref}
                className="btn-shine group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E9C176] to-[#c19a4a] text-[#121B33] font-montserrat font-bold px-10 py-4 rounded-full hover:from-[#f0cd87] hover:to-[#d4ab5a] transition-all duration-300 hover:scale-105 shadow-xl shadow-[#E9C176]/40"
              >
                <Mail size={18} /> Escribir a Vinculación
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>
          </FadeUp>

          {/* Tarjeta de contacto: persona responsable de vinculación */}
          <FadeUp delay={0.35}>
            <div className="mt-10 max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl px-6 py-6 backdrop-blur-sm">
              <p className="font-montserrat text-[#E9C176] text-[10px] font-bold uppercase tracking-[0.25em] text-center mb-4">
                Atiende personalmente
              </p>
              <div className="flex flex-col items-center text-center">
                <div
                  aria-hidden
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#E9C176] to-[#8B6A2E] flex items-center justify-center font-bebas text-[#121B33] text-xl mb-3"
                >
                  {contacto.nombre
                    .replace(/^(Mtra?\.|Ing\.|Lic\.|Dr\.|Mtr\.)\s*/i, "")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <p className="font-montserrat font-bold text-white text-sm leading-tight">
                  {contacto.nombre}
                </p>
                <p className="font-montserrat text-white/60 text-xs mt-0.5">
                  {contacto.cargo}
                </p>
                <a
                  href={`mailto:${contacto.email}`}
                  className="font-montserrat text-[#E9C176] text-xs mt-3 inline-flex items-center gap-1.5 hover:underline break-all"
                >
                  <Mail size={12} className="shrink-0" />
                  {contacto.email}
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
