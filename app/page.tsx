export const revalidate = 0;

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
import HeroAnimado, { type HeroSlide } from "@/app/components/HeroAnimado";
import BlueprintReveal from "@/app/components/BlueprintReveal";
import LoadingIntro from "@/app/components/LoadingIntro";
import { sanityImg } from "@/sanity/lib/image-url";
import {
  FadeUp, FadeLeft, FadeRight,
  StaggerContainer, StaggerItem, ScaleIn,
} from "@/app/components/ScrollReveal";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Carrera = {
  _id: string; nombre: string; slug: string;
  area: string; grado: string; modalidades: string[];
  descripcionCorta: string; color: string;
  imagenUrl?: string;
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

// ─── Mapeos UI ────────────────────────────────────────────────────────────────

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
  "ingenieria":        "#00D4FF",
  "negocios":          "#E67E22",
  "ciencias-sociales": "#D4AF37",
  "gastronomia":       "#F39C12",
  "educacion":         "#1ABC9C",
  "ciencias-salud":    "#E74C3C",
};

const AREA_LABEL: Record<string, string> = {
  "ingenieria":        "Ingeniería",
  "negocios":          "Negocios",
  "ciencias-sociales": "Ciencias Sociales",
  "gastronomia":       "Gastronomía",
  "educacion":         "Educación",
  "ciencias-salud":    "Ciencias de la Salud",
};

const CIUDAD_LABEL: Record<string, string> = {
  "tijuana":  "Tijuana",
  "tecate":   "Tecate",
  "ensenada": "Ensenada",
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
  const imgBySlug = new Map(carreras.map((c) => [c.slug, sanityImg(c.imagenUrl, 1600)]));
  return (
    <section className="py-32 px-6 md:px-12 bg-[#F9F9FB]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <FadeLeft className="max-w-2xl">
            <p className="text-[#E9C176] font-bold tracking-[0.2em] uppercase mb-4 text-sm">
              Formación de Élite
            </p>
            <h2
              className="font-extrabold text-[#121B33]"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              Excelencia Académica
            </h2>
          </FadeLeft>
          <FadeRight>
            <p className="text-[#45464D] text-lg max-w-md leading-relaxed">
              Desarrollamos líderes capaces de orquestar la tecnología para resolver
              los desafíos más complejos de la humanidad.
            </p>
          </FadeRight>
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

// ─── Innovation Stats ─────────────────────────────────────────────────────────

const stats = [
  { num: "95%", label: "Empleabilidad", desc: "Nuestros egresados lideran en las empresas más importantes del noroeste desde el primer año." },
  { num: "18+", label: "Años de Trayectoria", desc: "Casi dos décadas formando a los ingenieros y profesionistas de Baja California." },
  { num: "5",   label: "Campus en BC",      desc: "Presencia consolidada en Tijuana, Tecate y Ensenada, cerca de donde vives." },
  { num: "#1",  label: "Ingenierías del NO", desc: "Liderazgo indiscutible en calidad educativa e investigación aplicada en el noroeste." },
];

function SeccionStats() {
  return (
    <section className="py-32 bg-[#F3F3F5]">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div className="bg-white p-12 rounded-xl h-full">
                <div
                  className="font-black text-[#121B33] mb-4"
                  style={{ fontSize: "clamp(3.5rem, 6vw, 4.5rem)", letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {s.num}
                </div>
                <div className="text-xs font-bold tracking-[0.2em] uppercase text-[#45464D]">
                  {s.label}
                </div>
                <p className="mt-4 text-sm text-[#76777E] leading-relaxed">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Oferta Académica completa (Sanity) ───────────────────────────────────────

function SeccionCarreras({ carreras }: { carreras: Carrera[] }) {
  return (
    <section className="bg-[#121B33] py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        <FadeUp className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-3">
            Catálogo Completo
          </p>
          <h2
            className="font-black text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Oferta Académica
          </h2>
          <p className="text-white/50 mt-3 max-w-lg text-sm leading-relaxed">
            Programas con RVOE SEP diseñados para responder a las necesidades del mercado laboral del noroeste.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {carreras.map((c) => {
            const Icon = SLUG_ICON[c.slug] ?? GraduationCap;
            const color = AREA_COLOR[c.area] ?? "#00D4FF";
            const areaLabel = AREA_LABEL[c.area] ?? c.area;
            return (
              <StaggerItem key={c._id}>
                <Link
                  href={`/carreras/${c.slug}`}
                  className="group bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white hover:border-transparent hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 flex items-start gap-4 block"
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon size={20} style={{ color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block mb-0.5" style={{ color }}>
                      {areaLabel}
                    </span>
                    <h3 className="font-semibold text-white group-hover:text-[#121B33] text-sm leading-snug transition-colors duration-300">
                      {c.nombre}
                    </h3>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeUp delay={0.2}>
          <Link
            href="/licenciaturas"
            className="inline-flex items-center gap-2 text-[#121B33] bg-[#00D4FF] px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors duration-300"
          >
            Ver todos los programas <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── Elige tu Programa (Sanity) ───────────────────────────────────────────────

const programas = [
  {
    id: "bachillerato",
    titulo: "Bachillerato CENYCA",
    tagline: "Preparatoria en 4 meses",
    desc: "El camino más rápido y oficial hacia la universidad. Válido ante la SEP.",
    href: "/bachillerato",
    Icon: School,
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
    accent: "#A78BFA",
    grande: false,
  },
  {
    id: "especialidades",
    titulo: "Educación Continua",
    tagline: "Cursos y diplomados",
    desc: "Formación continua para profesionistas del mercado industrial de BC.",
    href: "/educacion-continua",
    Icon: Layers,
    accent: "#34D399",
    grande: false,
  },
] as const;

function SeccionProgramas({ imagenes }: { imagenes?: ImagenesPrograma }) {
  const fotosPorId: Record<string, string | undefined> = {
    bachillerato:   sanityImg(imagenes?.bachillerato, 1200),
    licenciaturas:  sanityImg(imagenes?.licenciaturas, 1200),
    posgrados:      sanityImg(imagenes?.posgrados, 1200),
    especialidades: sanityImg(imagenes?.especialidades, 1200),
  };

  return (
    <section className="bg-[#F9F9FB] py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        <FadeUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-2">
              Niveles Educativos
            </p>
            <h2
              className="font-black text-[#121B33]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
            >
              Elige tu Programa
            </h2>
          </div>
          <Link
            href="/licenciaturas"
            className="text-[#00D4FF] text-sm font-bold flex items-center gap-1.5 hover:gap-3 transition-all duration-300 uppercase tracking-wider whitespace-nowrap"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {programas.filter(p => p.grande).map((p, i) => {
            const foto = fotosPorId[p.id];
            return (
              <FadeUp key={p.id} delay={i * 0.1}>
                <Link
                  href={p.href}
                  className="group relative overflow-hidden rounded-xl bg-[#121B33] border border-white/5 hover:border-[#00D4FF]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col p-9 min-h-[260px] block"
                >
                  {foto && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:opacity-35 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${foto})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#121B33] via-[#121B33]/80 to-[#0D1428]" />
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-auto flex-shrink-0 relative z-10"
                    style={{ backgroundColor: `${p.accent}20` }}
                  >
                    <p.Icon size={22} style={{ color: p.accent }} strokeWidth={1.5} />
                  </div>
                  <div className="relative z-10 mt-10">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: p.accent }}>
                      {p.tagline}
                    </span>
                    <h3 className="font-bold text-white text-2xl mb-2" style={{ letterSpacing: "-0.01em" }}>
                      {p.titulo}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{p.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-3 transition-all duration-300" style={{ color: p.accent }}>
                      Conocer más <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            );
          })}

          {programas.filter(p => !p.grande).map((p, i) => {
            const foto = fotosPorId[p.id];
            return (
              <FadeUp key={p.id} delay={0.2 + i * 0.1}>
                <Link
                  href={p.href}
                  className="group relative overflow-hidden rounded-xl bg-[#121B33] border border-white/5 hover:border-[#00D4FF]/30 transition-all duration-500 hover:-translate-y-1 flex sm:flex-row items-center gap-5 p-7 block"
                >
                  {foto && (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${foto})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#121B33]/95 to-[#0D1428]/95" />
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
                    style={{ backgroundColor: `${p.accent}20` }}
                  >
                    <p.Icon size={24} style={{ color: p.accent }} strokeWidth={1.5} />
                  </div>
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest mb-1 block" style={{ color: p.accent }}>
                      {p.tagline}
                    </span>
                    <h3 className="font-bold text-white text-xl mb-1" style={{ letterSpacing: "-0.01em" }}>{p.titulo}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
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

// ─── Beneficios ───────────────────────────────────────────────────────────────

const beneficios: { Icon: LucideIcon; titulo: string; desc: string }[] = [
  { Icon: GraduationCap, titulo: "Titúlate en 3 años",     desc: "Modelo cuatrimestral que acelera tu formación sin sacrificar calidad." },
  { Icon: Calendar,      titulo: "Horarios Flexibles",      desc: "Modalidad ejecutiva con clases entre semana y fines de semana." },
  { Icon: BadgeCheck,    titulo: "Validez Oficial SEP",     desc: "Todos nuestros programas cuentan con RVOE reconocido a nivel nacional." },
  { Icon: Landmark,      titulo: "Becas Disponibles",       desc: "Diferentes esquemas de apoyo económico para que nada te detenga." },
  { Icon: Users,         titulo: "Docentes Especializados", desc: "Profesores con experiencia real en la industria de Baja California." },
  { Icon: MapPin,        titulo: "5 Campus en BC",          desc: "Tijuana, Tecate y Ensenada. Cerca de donde tú estás." },
];

function SeccionBeneficios() {
  return (
    <section className="bg-white py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-screen-xl mx-auto">
        <FadeUp className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-3">
            Por qué CENYCA
          </p>
          <h2
            className="font-black text-[#121B33]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Más de 18 años formando<br />
            profesionistas de excelencia.
          </h2>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {beneficios.map((b) => (
            <StaggerItem key={b.titulo}>
              <div className="bg-[#F3F3F5] rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-12 h-12 bg-[#121B33] rounded-lg flex items-center justify-center mb-5">
                  <b.Icon size={22} color="#00D4FF" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-[#121B33] text-base mb-2" style={{ letterSpacing: "-0.01em" }}>
                  {b.titulo}
                </h3>
                <p className="text-[#45464D] text-sm leading-relaxed">{b.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

// ─── Planteles ────────────────────────────────────────────────────────────────

function SeccionPlanteles({ campus }: { campus: Campus[] }) {
  return (
    <section className="bg-[#121B33] py-24 px-6 sm:px-10 lg:px-16 relative overflow-hidden">
      <div className="relative z-10 max-w-screen-xl mx-auto">
        <FadeUp className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D4FF] mb-3">
            Presencia Regional
          </p>
          <h2
            className="font-black text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em" }}
          >
            Nuestros Planteles
          </h2>
          <p className="text-white/50 mt-3 text-sm">
            {campus.length} campus en Baja California, cerca de donde vives y trabajas.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {campus.map((p) => (
            <StaggerItem key={p._id}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-7 hover:bg-white/10 hover:border-[#00D4FF]/30 hover:-translate-y-1 transition-all duration-300 h-full">
                <MapPin size={24} className="text-[#00D4FF] mb-4" strokeWidth={1.5} />
                <h3 className="font-bold text-white text-base mb-1" style={{ letterSpacing: "-0.01em" }}>{p.nombre}</h3>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                  {CIUDAD_LABEL[p.ciudad] ?? p.ciudad}
                  {p.esPrincipal && (
                    <span className="bg-[#00D4FF]/15 text-[#00D4FF] px-2 py-0.5 rounded-full text-[10px]">
                      Principal
                    </span>
                  )}
                </p>
                <p className="text-white/55 text-sm leading-relaxed">{p.direccion}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.2}>
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 text-white border border-white/20 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors duration-300"
          >
            Ver directorio completo <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

// ─── CTA Final (light bg, gradient blobs) ─────────────────────────────────────

function SeccionCTA({ config }: { config: Configuracion | null }) {
  const whatsapp = config?.contacto?.whatsapp ?? "526632093980";
  const inscripciones = config?.sistemas?.inscripciones ?? "https://inscripciones.cenyca.edu.mx";

  return (
    <section className="py-40 bg-[#F9F9FB] relative overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 text-center relative z-10">
        <ScaleIn>
          <h2
            className="font-black text-[#121B33] mb-8"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            El futuro no se espera.<br />Se construye.
          </h2>
          <p className="text-xl text-[#45464D] max-w-2xl mx-auto mb-12 leading-relaxed">
            Comienza tu proceso de admisión hoy y asegura tu lugar en la élite de
            la ingeniería del noroeste.
          </p>
        </ScaleIn>
        <FadeUp delay={0.2}>
          <div className="inline-flex flex-col sm:flex-row gap-6">
            <a
              href={inscripciones}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121B33] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#3D4660] transition-all"
            >
              Iniciar Aplicación
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#121B33] px-10 py-5 rounded-full font-bold text-lg border border-[#76777E] hover:bg-[#E8E8EA] transition-all"
            >
              Hablar con un Mentor
            </a>
          </div>
        </FadeUp>
      </div>

      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E9C176]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#00D4FF]/20 blur-[120px] rounded-full pointer-events-none" />
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
      <LoadingIntro />
      <HeroAnimado slides={config?.heroSlides ?? []} />
      <BlueprintReveal />
      <SeccionExcelencia carreras={carreras} />
      <SeccionStats />
      <SeccionPlanteles campus={campus} />
      <SeccionCTA config={config} />
    </>
  );
}
