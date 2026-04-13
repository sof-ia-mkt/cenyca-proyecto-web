import Link from "next/link";
import {
  Settings2, Monitor, Factory, BarChart2, DollarSign,
  Scale, Brain, Search, ChefHat, BookOpen, Zap,
  GraduationCap, Calendar, BadgeCheck, Landmark, Users, MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const carreras: {
  nombre: string; area: string; color: string;
  Icon: LucideIcon; slug: string;
}[] = [
  { nombre: "Ingeniería Mecatrónica",        area: "Ingeniería",        color: "#00D4FF", Icon: Settings2,   slug: "ingenieria-mecatronica" },
  { nombre: "Ingeniería en Sistemas",        area: "Ingeniería",        color: "#8E44AD", Icon: Monitor,     slug: "ingenieria-en-sistemas-computacionales" },
  { nombre: "Ingeniería Industrial",         area: "Ingeniería",        color: "#00B8DB", Icon: Factory,     slug: "ingenieria-industrial" },
  { nombre: "Administración de Empresas",    area: "Negocios",          color: "#E67E22", Icon: BarChart2,   slug: "administracion-de-empresas" },
  { nombre: "Contaduría Pública y Finanzas", area: "Negocios",          color: "#27AE60", Icon: DollarSign,  slug: "contaduria-publica-y-finanzas" },
  { nombre: "Derecho",                       area: "Ciencias Sociales", color: "#D4AF37", Icon: Scale,       slug: "derecho" },
  { nombre: "Psicología Organizacional",     area: "Ciencias Sociales", color: "#E74C3C", Icon: Brain,       slug: "psicologia-organizacional" },
  { nombre: "Criminología y Criminalística", area: "Ciencias Sociales", color: "#2C3E50", Icon: Search,      slug: "criminologia-y-criminalistica" },
  { nombre: "Gastronomía",                   area: "Gastronomía",       color: "#F39C12", Icon: ChefHat,     slug: "gastronomia" },
  { nombre: "Ciencias de la Educación",      area: "Educación",         color: "#1ABC9C", Icon: BookOpen,    slug: "ciencias-de-la-educacion" },
  { nombre: "Ing. Electromecánica",          area: "Ingeniería",        color: "#3498DB", Icon: Zap,         slug: "ingenieria-electromecanica" },
];

const beneficios: { Icon: LucideIcon; titulo: string; desc: string }[] = [
  { Icon: GraduationCap, titulo: "Titúlate en 3 años",      desc: "Modelo cuatrimestral que acelera tu formación sin sacrificar calidad." },
  { Icon: Calendar,      titulo: "Horarios flexibles",       desc: "Modalidad ejecutiva con clases entre semana y fines de semana." },
  { Icon: BadgeCheck,    titulo: "Validez oficial SEP",      desc: "Programas con RVOE, reconocidos a nivel nacional." },
  { Icon: Landmark,      titulo: "Becas disponibles",        desc: "Diferentes esquemas de apoyo económico para que nada te detenga." },
  { Icon: Users,         titulo: "Docentes especializados",  desc: "Profesores con experiencia real en la industria de Baja California." },
  { Icon: MapPin,        titulo: "5 Campus en BC",           desc: "Tijuana, Tecate y Ensenada. Cerca de donde tú estás." },
];

const planteles = [
  { ciudad: "Tijuana", descripcion: "Campus principal con múltiples sedes en la ciudad." },
  { ciudad: "Tecate",  descripcion: "Atendiendo a la comunidad del valle de Tecate." },
  { ciudad: "Ensenada",descripcion: "Presencia en el puerto de Ensenada, BC." },
];

// ─── Componentes de sección ───────────────────────────────────────────────────

function SeccionHero() {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden bg-[#1B2040]">

      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.webm" type="video/webm" />
        <source src="/videos/hero-bg.mp4"  type="video/mp4" />
      </video>

      {/* Overlay oscuro sobre el video */}
      <div className="absolute inset-0 bg-[#1B2040]/60" />

      {/* Título centrado */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-bebas text-white leading-none tracking-wide">
          <span className="block text-5xl sm:text-6xl lg:text-7xl">
            Tu futuro empieza
          </span>
          <span className="block text-5xl sm:text-6xl lg:text-7xl text-[#00D4FF]">
            en CENYCA Universidad
          </span>
        </h1>
      </div>

    </section>
  );
}

function SeccionCarreras() {
  return (
    <section className="bg-[#F5F5F5] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="font-bebas text-[#1B2040] text-5xl sm:text-6xl tracking-wide mb-3">
            Oferta Académica
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-[#666] max-w-xl mx-auto">
            Programas diseñados para responder a las necesidades del mercado laboral del noroeste del país.
          </p>
        </div>

        {/* Grid de carreras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {carreras.map((c) => (
            <Link
              key={c.slug}
              href={`/oferta/${c.slug}`}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-start gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${c.color}18` }}
              >
                <c.Icon size={22} style={{ color: c.color }} strokeWidth={1.75} />
              </div>
              <div>
                <span
                  className="text-xs font-montserrat font-semibold uppercase tracking-wider"
                  style={{ color: c.color }}
                >
                  {c.area}
                </span>
                <h3 className="font-montserrat font-700 text-[#1B2040] text-base mt-0.5 group-hover:text-[#00D4FF] transition-colors">
                  {c.nombre}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/oferta"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-[#1B2040] border-2 border-[#1B2040] px-8 py-3.5 rounded-full hover:bg-[#1B2040] hover:text-white transition-all duration-300"
          >
            Ver todas las carreras
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function SeccionBeneficios() {
  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-bebas text-[#1B2040] text-5xl sm:text-6xl tracking-wide mb-3">
            ¿Por qué elegir CENYCA?
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-[#666] max-w-xl mx-auto">
            Más de 18 años formando profesionistas comprometidos con el desarrollo de Baja California.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {beneficios.map((b) => (
            <div key={b.titulo} className="bg-[#F5F5F5] rounded-2xl p-7 hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#1B2040] rounded-xl flex items-center justify-center mb-5">
                <b.Icon size={26} color="#00D4FF" strokeWidth={1.5} />
              </div>
              <h3 className="font-montserrat font-bold text-[#1B2040] text-lg mb-2">{b.titulo}</h3>
              <p className="font-montserrat text-[#666] text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SeccionPlanteles() {
  return (
    <section className="bg-[#1B2040] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decoración */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full border border-[#00D4FF]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full border border-[#00D4FF]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-3">
            Nuestros Planteles
          </h2>
          <div className="w-16 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
          <p className="font-montserrat text-white/60 max-w-xl mx-auto">
            5 campus en Baja California. Cerca de donde tú vives y trabajas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {planteles.map((p) => (
            <div key={p.ciudad} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors duration-300">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="font-bebas text-[#00D4FF] text-3xl tracking-wide mb-2">{p.ciudad}</h3>
              <p className="font-montserrat text-white/60 text-sm">{p.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/directorio"
            className="inline-flex items-center gap-2 font-montserrat font-semibold text-white border border-white/30 px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            Ver directorio completo →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SeccionCTA() {
  return (
    <section className="bg-[#00D4FF] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-bebas text-[#1B2040] text-5xl sm:text-6xl lg:text-7xl tracking-wide mb-4">
          El momento es ahora
        </h2>
        <p className="font-montserrat text-[#1B2040]/70 text-lg mb-10 max-w-xl mx-auto">
          Inicia tu trámite de inscripción hoy. Cupo limitado para el ciclo Mayo 2026.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://inscripciones.cenyca.edu.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#1B2040] text-white font-montserrat font-bold text-base px-10 py-4 rounded-full hover:bg-[#252B52] transition-all duration-300 hover:scale-105"
          >
            Iniciar inscripción
          </a>
          <a
            href="https://wa.me/526640000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border-2 border-[#1B2040] text-[#1B2040] font-montserrat font-bold text-base px-10 py-4 rounded-full hover:bg-[#1B2040] hover:text-white transition-all duration-300 text-center"
          >
            💬 Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <SeccionHero />
      <SeccionCarreras />
      <SeccionBeneficios />
      <SeccionPlanteles />
      <SeccionCTA />
    </>
  );
}
