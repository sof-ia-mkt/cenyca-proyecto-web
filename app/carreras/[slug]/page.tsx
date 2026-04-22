import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Clock, BookOpen, Briefcase, GraduationCap, ArrowLeft, MessageCircle } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { carreraBySlugQuery, configuracionQuery, todasCarrerasQuery } from "@/sanity/lib/queries";

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
  beneficios?: Beneficio[];
  perfilEgresado?: string[];
  campoLaboral?: string[];
  imagenUrl?: string;
  seo?: { titulo?: string; descripcion?: string };
};

type Configuracion = {
  contacto?: { whatsapp?: string };
  sistemas?: { inscripciones?: string };
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
  return {
    title: carrera.seo?.titulo ?? carrera.nombre,
    description: carrera.seo?.descripcion ?? carrera.descripcionCorta,
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

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#121B33] pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <Link
            href="/licenciaturas"
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#00D4FF] font-montserrat text-sm mb-10 transition-colors"
          >
            <ArrowLeft size={14} /> Todas las carreras
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-[#00D4FF]/15 text-[#00D4FF] font-montserrat text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {areaLabel}
            </span>
            <span className="bg-white/10 text-white/70 font-montserrat text-xs px-3 py-1 rounded-full">
              {gradoLabel}
            </span>
            {carrera.modalidades?.map((m) => (
              <span key={m} className="bg-white/10 text-white/70 font-montserrat text-xs px-3 py-1 rounded-full">
                {MODALIDAD_LABEL[m] ?? m}
              </span>
            ))}
          </div>

          {/* Nombre */}
          <h1 className="font-bebas text-white text-5xl sm:text-6xl lg:text-7xl tracking-wide leading-none mb-6">
            {carrera.nombre}
          </h1>

          {/* Descripción corta */}
          <p className="font-montserrat text-white/70 text-lg max-w-2xl leading-relaxed mb-10">
            {carrera.descripcionCorta}
          </p>

          {/* Duración */}
          {carrera.duracion && (
            <div className="inline-flex items-center gap-2 text-white/50 font-montserrat text-sm mb-10">
              <Clock size={16} />
              <span>{carrera.duracion}</span>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={inscripciones}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#00D4FF] text-[#121B33] font-montserrat font-bold px-8 py-4 rounded-full hover:bg-white transition-colors duration-300"
            >
              <GraduationCap size={18} />
              Inscribirme ahora
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=Hola, me interesa la ${gradoLabel} en ${carrera.nombre}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-montserrat font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors duration-300"
            >
              <MessageCircle size={18} />
              Solicitar información
            </a>
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ────────────────────────────────────────────────────── */}
      {carrera.beneficios && carrera.beneficios.length > 0 && (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl tracking-wide mb-3 text-center">
              ¿Por qué estudiar {carrera.nombre}?
            </h2>
            <div className="w-14 h-1 bg-[#00D4FF] rounded mx-auto mb-12" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {carrera.beneficios.map((b) => (
                <div
                  key={b._key}
                  className="flex gap-5 p-6 bg-[#F5F5F5] rounded-2xl hover:shadow-md transition-shadow"
                >
                  {b.icono && (
                    <span className="text-3xl flex-shrink-0">{b.icono}</span>
                  )}
                  <div>
                    <h3 className="font-montserrat font-bold text-[#121B33] text-base mb-1">
                      {b.titulo}
                    </h3>
                    {b.descripcion && (
                      <p className="font-montserrat text-[#666] text-sm leading-relaxed">
                        {b.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PERFIL DE EGRESADO ────────────────────────────────────────────── */}
      {carrera.perfilEgresado && carrera.perfilEgresado.length > 0 && (
        <section className="bg-[#F5F5F5] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
              <div>
                <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl tracking-wide mb-3">
                  Perfil de Egresado
                </h2>
                <div className="w-14 h-1 bg-[#00D4FF] rounded mb-8" />
                <p className="font-montserrat text-[#666] leading-relaxed">
                  Al concluir tu {gradoLabel} en {carrera.nombre}, serás capaz de:
                </p>
              </div>
              <ul className="space-y-4">
                {carrera.perfilEgresado.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <CheckCircle2 size={20} className="text-[#00D4FF] mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span className="font-montserrat text-[#444] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── CAMPO LABORAL ─────────────────────────────────────────────────── */}
      {carrera.campoLaboral && carrera.campoLaboral.length > 0 && (
        <section className="bg-[#121B33] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bebas text-white text-4xl sm:text-5xl tracking-wide mb-3">
                Campo Laboral
              </h2>
              <div className="w-14 h-1 bg-[#00D4FF] rounded mx-auto mb-4" />
              <p className="font-montserrat text-white/60 max-w-lg mx-auto">
                Como egresado de {carrera.nombre} podrás desempeñarte en:
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {carrera.campoLaboral.map((campo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 hover:border-[#00D4FF]/40 hover:bg-white/10 transition-colors"
                >
                  <Briefcase size={14} className="text-[#00D4FF]" />
                  <span className="font-montserrat text-white/80 text-sm">{campo}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="bg-[#00D4FF] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen size={40} className="text-[#121B33]/40 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide mb-4">
            Comienza tu historia en CENYCA
          </h2>
          <p className="font-montserrat text-[#121B33]/70 mb-8 max-w-md mx-auto">
            Cupo limitado para el ciclo Mayo 2026. No dejes pasar tu lugar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={inscripciones}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121B33] text-white font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#1E2D4A] transition-colors"
            >
              Inscribirme ahora
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#121B33] text-[#121B33] font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#121B33] hover:text-white transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
