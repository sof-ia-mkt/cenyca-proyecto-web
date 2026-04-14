export const revalidate = 0; // Siempre datos frescos desde Sanity

import Link from "next/link";
import {
  Settings2, Monitor, Factory, BarChart2, DollarSign,
  Scale, Search, ChefHat, BookOpen, Zap,
  GraduationCap, Calendar, BadgeCheck, Landmark, Users, MapPin,
  School, BriefcaseBusiness, FlaskConical, Layers,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, todosCampusQuery, configuracionQuery } from "@/sanity/lib/queries";
import HeroCarrusel, { type HeroSlide } from "@/app/components/HeroCarrusel";
import { FadeUp, FadeLeft, FadeRight, StaggerContainer, StaggerItem, ScaleIn } from "@/app/components/ScrollReveal";

// ─── Statement Bar — debajo del hero ─────────────────────────────────────────
function StatementBar() {
  return (
    <div className="relative bg-[#1B2040] overflow-hidden">
      {/* Gradiente brillante central */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B2040] via-[#00D4FF]/20 to-[#1B2040]" />
      {/* Línea cyan superior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />
      {/* Línea cyan inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />

      <div className="relative z-10 py-5 px-4 flex items-center justify-center gap-4 sm:gap-8">
        {/* Estrella izquierda */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00D4FF" className="flex-shrink-0 opacity-80">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>

        <p className="font-bebas text-white text-xl sm:text-2xl lg:text-3xl tracking-widest text-center">
          La Universidad{" "}
          <span className="text-[#00D4FF] drop-shadow-[0_0_12px_rgba(0,212,255,0.8)]">
            #1
          </span>{" "}
          en Ingenierías del Noroeste
        </p>

        {/* Estrella derecha */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00D4FF" className="flex-shrink-0 opacity-80">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </div>
    </div>
  );
}

// ─── Elige tu Programa ────────────────────────────────────────────────────────
const programas = [
  {
    id: "bachillerato",
    titulo: "Bachillerato CENYCA",
    tagline: "Preparatoria en 4 meses",
    desc: "El camino más rápido y oficial hacia la universidad. Válido ante la SEP.",
    href: "/bachillerato",
    Icon: School,
    gradient: "from-[#0D1F3C] via-[#1B2040] to-[#0a1628]",
    accent: "#00D4FF",
    grande: true,
  },
  {
    id: "licenciaturas",
    titulo: "Licenciaturas Ejecutivas",
    tagline: "Titúlate en 3 años",
    desc: "10 programas con RVOE, horarios flexibles y modelo cuatrimestral.",
    href: "/licenciaturas",
    Icon: BriefcaseBusiness,
    gradient: "from-[#1B2040] via-[#162038] to-[#0D1F3C]",
    accent: "#00D4FF",
    grande: true,
  },
  {
    id: "posgrados",
    titulo: "Posgrados",
    tagline: "Maestrías y especialidades",
    desc: "Eleva tu perfil profesional con programas de alto nivel académico.",
    href: "/posgrados",
    Icon: FlaskConical,
    gradient: "from-[#1a1040] via-[#1B2040] to-[#0D1428]",
    accent: "#A78BFA",
    grande: false,
  },
  {
    id: "especialidades",
    titulo: "Especialidades",
    tagline: "Educación continua",
    desc: "Cursos y diplomados diseñados para el mercado industrial de BC.",
    href: "/educacion-continua",
    Icon: Layers,
    gradient: "from-[#0D2030] via-[#1B2040] to-[#0a1f2e]",
    accent: "#34D399",
    grande: false,
  },
] as const;

function SeccionProgramas({ imagenes }: { imagenes?: ImagenesPrograma }) {
  const fotosPorId: Record<string, string | undefined> = {
    bachillerato:  imagenes?.bachillerato,
    licenciaturas: imagenes?.licenciaturas,
    posgrados:     imagenes?.posgrados,
    especialidades: imagenes?.especialidades,
  };
  return (
    <section className="bg-[#1B2040] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <FadeUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide">
              Elige tu Programa
            </h2>
            <p className="font-montserrat text-white/50 mt-2 max-w-sm">
              Conoce las opciones que tenemos para cada etapa de tu vida académica.
            </p>
          </div>
          <Link
            href="/licenciaturas"
            className="font-montserrat text-[#00D4FF] text-sm font-semibold flex items-center gap-1.5 hover:gap-3 transition-all duration-300 whitespace-nowrap"
          >
            Ver todos los programas <ArrowRight size={16} />
          </Link>
        </FadeUp>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fila 1 — dos grandes */}
          {programas.filter(p => p.grande).map((p, i) => {
            const foto = fotosPorId[p.id];
            return (
            <FadeUp key={p.id} delay={i * 0.1}>
              <Link
                href={p.href}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.gradient} border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col p-8 min-h-[260px]`}
              >
                {/* Foto de fondo si existe */}
                {foto && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${foto})` }}
                  />
                )}
                {/* Overlay oscuro siempre activo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} ${foto ? "opacity-70" : "opacity-100"}`} />
                {/* Brillo de hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at top left, ${p.accent}, transparent 70%)` }}
                />
                {/* Círculo decorativo */}
                <div
                  className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-[0.07] group-hover:opacity-[0.13] transition-opacity duration-500"
                  style={{ background: p.accent }}
                />

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-auto flex-shrink-0"
                  style={{ backgroundColor: `${p.accent}20` }}
                >
                  <p.Icon size={22} style={{ color: p.accent }} strokeWidth={1.5} />
                </div>

                <div className="mt-10">
                  <span
                    className="font-montserrat text-xs font-semibold uppercase tracking-widest mb-2 block"
                    style={{ color: p.accent }}
                  >
                    {p.tagline}
                  </span>
                  <h3 className="font-bebas text-white text-3xl sm:text-4xl tracking-wide mb-2 leading-tight">
                    {p.titulo}
                  </h3>
                  <p className="font-montserrat text-white/50 text-sm leading-relaxed mb-4">
                    {p.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                    style={{ color: p.accent }}
                  >
                    Conocer más <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </FadeUp>
          );
          })}

          {/* Fila 2 — dos medianas */}
          {programas.filter(p => !p.grande).map((p, i) => {
            const foto = fotosPorId[p.id];
            return (
            <FadeUp key={p.id} delay={0.2 + i * 0.1}>
              <Link
                href={p.href}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.gradient} border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-start sm:items-center gap-5 p-7`}
              >
                {foto && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${foto})` }}
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} ${foto ? "opacity-75" : "opacity-100"}`} />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at top left, ${p.accent}, transparent 70%)` }}
                />

                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${p.accent}20` }}
                >
                  <p.Icon size={24} style={{ color: p.accent }} strokeWidth={1.5} />
                </div>

                <div className="relative z-10">
                  <span
                    className="font-montserrat text-xs font-semibold uppercase tracking-widest mb-1 block"
                    style={{ color: p.accent }}
                  >
                    {p.tagline}
                  </span>
                  <h3 className="font-bebas text-white text-2xl tracking-wide mb-1">{p.titulo}</h3>
                  <p className="font-montserrat text-white/50 text-sm leading-relaxed">{p.desc}</p>
                </div>

                <ArrowRight
                  size={18}
                  className="ml-auto flex-shrink-0 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 hidden sm:block relative z-10"
                  style={{ color: p.accent }}
                />
              </Link>
            </FadeUp>
          );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Divisor diagonal entre secciones ────────────────────────────────────────
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

// ─── Mapeos de iconos y colores (UI concern, no van en Sanity) ────────────────

const SLUG_ICON: Record<string, LucideIcon> = {
  "ingenieria-mecatronica":                Settings2,
  "ingenieria-en-sistemas-computacionales": Monitor,
  "ingenieria-industrial":                 Factory,
  "ingenieria-electromecanica":            Zap,
  "administracion-de-empresas":            BarChart2,
  "contaduria-y-finanzas":                 DollarSign,
  "derecho":                               Scale,
  "criminologia-y-criminalistica":         Search,
  "gastronomia":                           ChefHat,
  "ciencias-de-la-educacion":              BookOpen,
};

const AREA_COLOR: Record<string, string> = {
  "ingenieria":       "#00D4FF",
  "negocios":         "#E67E22",
  "ciencias-sociales":"#D4AF37",
  "gastronomia":      "#F39C12",
  "educacion":        "#1ABC9C",
  "ciencias-salud":   "#E74C3C",
};

const AREA_LABEL: Record<string, string> = {
  "ingenieria":       "Ingeniería",
  "negocios":         "Negocios",
  "ciencias-sociales":"Ciencias Sociales",
  "gastronomia":      "Gastronomía",
  "educacion":        "Educación",
  "ciencias-salud":   "Ciencias de la Salud",
};

const CIUDAD_LABEL: Record<string, string> = {
  "tijuana":  "Tijuana",
  "tecate":   "Tecate",
  "ensenada": "Ensenada",
};

// ─── Beneficios estáticos ─────────────────────────────────────────────────────

const beneficios: { Icon: LucideIcon; titulo: string; desc: string }[] = [
  { Icon: GraduationCap, titulo: "Titúlate en 3 años",     desc: "Modelo cuatrimestral que acelera tu formación sin sacrificar calidad." },
  { Icon: Calendar,      titulo: "Horarios flexibles",      desc: "Modalidad ejecutiva con clases entre semana y fines de semana." },
  { Icon: BadgeCheck,    titulo: "Validez oficial SEP",     desc: "Programas con RVOE, reconocidos a nivel nacional." },
  { Icon: Landmark,      titulo: "Becas disponibles",       desc: "Diferentes esquemas de apoyo económico para que nada te detenga." },
  { Icon: Users,         titulo: "Docentes especializados", desc: "Profesores con experiencia real en la industria de Baja California." },
  { Icon: MapPin,        titulo: "5 Campus en BC",          desc: "Tijuana, Tecate y Ensenada. Cerca de donde tú estás." },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Carrera = {
  _id: string; nombre: string; slug: string;
  area: string; grado: string; modalidades: string[];
  descripcionCorta: string; color: string;
};

type Campus = {
  _id: string; nombre: string; ciudad: string;
  direccion: string; esPrincipal: boolean;
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
};

// ─── Secciones ────────────────────────────────────────────────────────────────


function SeccionCarreras({ carreras }: { carreras: Carrera[] }) {
  return (
    <section className="bg-[#1B2040] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <FadeUp className="text-center mb-14">
          <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3">
            Oferta Académica
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-white/60 max-w-xl mx-auto">
            Programas diseñados para responder a las necesidades del mercado laboral del noroeste del país.
          </p>
        </FadeUp>

        {/* Grid de carreras con stagger */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {carreras.map((c) => {
            const Icon = SLUG_ICON[c.slug] ?? GraduationCap;
            const color = AREA_COLOR[c.area] ?? "#00D4FF";
            const areaLabel = AREA_LABEL[c.area] ?? c.area;
            return (
              <StaggerItem key={c._id}>
                <Link
                  href={`/carreras/${c.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white hover:border-[#00D4FF] hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] transition-all duration-300 hover:-translate-y-2 flex items-start gap-4 block"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: `${color}25` }}
                  >
                    <Icon size={22} style={{ color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs font-montserrat font-semibold uppercase tracking-wider" style={{ color }}>
                      {areaLabel}
                    </span>
                    <h3 className="font-montserrat font-bold text-white group-hover:text-[#1B2040] text-base mt-0.5 transition-colors duration-300">
                      {c.nombre}
                    </h3>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* CTA */}
        <FadeUp delay={0.2} className="text-center mt-12">
          <Link
            href="/licenciaturas"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#1B2040] bg-[#00D4FF] px-8 py-3.5 rounded-full hover:bg-white transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            Ver todas las carreras →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function SeccionBeneficios() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14">
          <h2 className="font-bebas text-[#1B2040] text-5xl sm:text-6xl tracking-wide mb-3">
            ¿Por qué elegir CENYCA?
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-[#666] max-w-xl mx-auto">
            Más de 18 años formando profesionistas comprometidos con el desarrollo de Baja California.
          </p>
        </FadeUp>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {beneficios.map((b) => (
            <StaggerItem key={b.titulo}>
              <div className="bg-[#F5F5F5] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-14 h-14 bg-[#1B2040] rounded-xl flex items-center justify-center mb-5">
                  <b.Icon size={26} color="#00D4FF" strokeWidth={1.5} />
                </div>
                <h3 className="font-montserrat font-bold text-[#1B2040] text-lg mb-2">{b.titulo}</h3>
                <p className="font-montserrat text-[#666] text-sm leading-relaxed">{b.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function SeccionPlanteles({ campus }: { campus: Campus[] }) {
  // Agrupar por ciudad
  const ciudades = [...new Set(campus.map((c) => c.ciudad))];

  return (
    <section className="bg-[#1B2040] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full border border-[#00D4FF]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-[#00D4FF]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeUp className="text-center mb-14">
          <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3">
            Nuestros Planteles
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-white/60 max-w-xl mx-auto">
            {campus.length} campus en Baja California. Cerca de donde tú vives y trabajas.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {campus.map((p) => (
            <StaggerItem key={p._id}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-[#00D4FF]/40 hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="text-4xl mb-4">📍</div>
                <h3 className="font-bebas text-[#00D4FF] text-2xl tracking-wide mb-1">{p.nombre}</h3>
                <p className="font-montserrat text-white/40 text-xs uppercase tracking-wider mb-3">
                  {CIUDAD_LABEL[p.ciudad] ?? p.ciudad}
                  {p.esPrincipal && <span className="ml-2 bg-[#00D4FF]/20 text-[#00D4FF] px-2 py-0.5 rounded-full">Principal</span>}
                </p>
                <p className="font-montserrat text-white/60 text-sm leading-relaxed">{p.direccion}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.2} className="text-center">
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-white border border-white/30 px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Ver directorio completo →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

function SeccionCTA({ config }: { config: Configuracion | null }) {
  const whatsapp = config?.contacto?.whatsapp ?? "526632093980";
  const inscripciones = config?.sistemas?.inscripciones ?? "https://inscripciones.cenyca.edu.mx";

  return (
    <section className="bg-[#00D4FF] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <ScaleIn>
          <h2 className="font-bebas text-[#1B2040] text-5xl sm:text-6xl lg:text-7xl tracking-wide mb-4">
            El momento es ahora
          </h2>
          <p className="font-montserrat text-[#1B2040]/70 text-lg mb-10 max-w-xl mx-auto">
            Inicia tu trámite de inscripción hoy. Cupo limitado para el ciclo Mayo 2026.
          </p>
        </ScaleIn>
        <FadeUp delay={0.2}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={inscripciones}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#1B2040] text-white font-montserrat font-bold text-base px-10 py-4 rounded-full hover:bg-[#252B52] transition-all duration-300 hover:scale-105"
          >
            Iniciar inscripción
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border-2 border-[#1B2040] text-[#1B2040] font-montserrat font-bold text-base px-10 py-4 rounded-full hover:bg-[#1B2040] hover:text-white transition-all duration-300 text-center"
          >
            💬 Escríbenos por WhatsApp
          </a>
        </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default async function HomePage() {
  const [carreras, campus, config] = await Promise.all([
    client.fetch<Carrera[]>(todasCarrerasQuery),
    client.fetch<Campus[]>(todosCampusQuery),
    client.fetch<Configuracion>(configuracionQuery),
  ]);

  return (
    <>
      <HeroCarrusel slides={config?.heroSlides ?? []} />
      <StatementBar />
      <SeccionProgramas imagenes={config?.imagenesPrograma} />
      {/* Programas → Oferta Académica (ambos #1B2040, divisor decorativo) */}
      <DiagonalDivider from="#1B2040" to="#1B2040" />
      <SeccionCarreras carreras={carreras} />
      {/* Oferta Académica (#1B2040) → Beneficios (white) */}
      <DiagonalDivider from="#1B2040" to="#ffffff" flip />
      <SeccionBeneficios />
      {/* Beneficios (white) → Planteles (#1B2040) */}
      <DiagonalDivider from="#ffffff" to="#1B2040" />
      <SeccionPlanteles campus={campus} />
      {/* Planteles (#1B2040) → CTA (#00D4FF) */}
      <DiagonalDivider from="#1B2040" to="#00D4FF" flip />
      <SeccionCTA config={config} />
    </>
  );
}
