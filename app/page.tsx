export const revalidate = 0; // Siempre datos frescos desde Sanity

import Link from "next/link";
import {
  Settings2, Monitor, Factory, BarChart2, DollarSign,
  Scale, Search, ChefHat, BookOpen, Zap,
  GraduationCap, Calendar, BadgeCheck, Landmark, Users, MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery, todosCampusQuery, configuracionQuery } from "@/sanity/lib/queries";
import HeroCarrusel, { type HeroSlide } from "@/app/components/HeroCarrusel";
import { FadeUp, FadeLeft, FadeRight, StaggerContainer, StaggerItem, ScaleIn } from "@/app/components/ScrollReveal";

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

type Configuracion = {
  contacto?: { whatsapp?: string };
  sistemas?: { inscripciones?: string };
  heroSlides?: HeroSlide[];
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
      <SeccionCarreras carreras={carreras} />
      <SeccionBeneficios />
      <SeccionPlanteles campus={campus} />
      <SeccionCTA config={config} />
    </>
  );
}
