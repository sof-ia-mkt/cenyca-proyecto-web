import Link from "next/link";
import type { Metadata } from "next";
import {
  Settings2, Monitor, Factory, BarChart2, DollarSign,
  Scale, Search, ChefHat, BookOpen, Zap, GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { todasCarrerasQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Oferta Académica",
  description: "Conoce todas las licenciaturas e ingenierías que ofrece CENYCA Universidad en Tijuana, Tecate y Ensenada.",
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

const GRADO_LABEL: Record<string, string> = {
  "licenciatura": "Licenciatura",
  "ingenieria":   "Ingeniería",
  "especialidad": "Especialidad",
  "maestria":     "Maestría",
};

type Carrera = {
  _id: string; nombre: string; slug: string;
  area: string; grado: string; modalidades: string[];
  descripcionCorta: string; color: string;
};

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function LicenciaturasPage() {
  const carreras = await client.fetch<Carrera[]>(todasCarrerasQuery);

  // Agrupar por área
  const porArea = carreras.reduce<Record<string, Carrera[]>>((acc, c) => {
    if (!acc[c.area]) acc[c.area] = [];
    acc[c.area].push(c);
    return acc;
  }, {});

  return (
    <>
      {/* Header */}
      <section className="bg-[#1B2040] py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-montserrat font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-3">
            CENYCA Universidad
          </p>
          <h1 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide mb-4">
            Oferta Académica
          </h1>
          <p className="font-montserrat text-white/60 max-w-xl leading-relaxed">
            {carreras.length} programas diseñados para el mercado laboral de Baja California.
            Todos con RVOE y modelo cuatrimestral — titúlate en 3 años.
          </p>
        </div>
      </section>

      {/* Grid por área */}
      <section className="bg-[#F5F5F5] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">
          {Object.entries(porArea).map(([area, items]) => {
            const color = AREA_COLOR[area] ?? "#00D4FF";
            const areaLabel = AREA_LABEL[area] ?? area;
            return (
              <div key={area}>
                {/* Encabezado de área */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 rounded-full" style={{ backgroundColor: color }} />
                  <h2 className="font-bebas text-[#1B2040] text-3xl tracking-wide">
                    {areaLabel}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {items.map((c) => {
                    const Icon = SLUG_ICON[c.slug] ?? GraduationCap;
                    const gradoLabel = GRADO_LABEL[c.grado] ?? c.grado;
                    return (
                      <Link
                        key={c._id}
                        href={`/carreras/${c.slug}`}
                        className="group flex gap-5 p-6 rounded-2xl bg-white border border-transparent hover:border-[#00D4FF]/30 hover:shadow-lg transition-all duration-300"
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon size={22} style={{ color }} strokeWidth={1.75} />
                        </div>
                        <div className="min-w-0">
                          <span className="font-montserrat text-xs font-semibold uppercase tracking-wider" style={{ color }}>
                            {gradoLabel}
                          </span>
                          <h3 className="font-montserrat font-bold text-[#1B2040] text-base mt-0.5 mb-2 group-hover:text-[#00D4FF] transition-colors leading-snug">
                            {c.nombre}
                          </h3>
                          {c.descripcionCorta && (
                            <p className="font-montserrat text-[#888] text-xs leading-relaxed line-clamp-2">
                              {c.descripcionCorta}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto mt-20 text-center">
          <p className="font-montserrat text-[#888] mb-5 text-sm">
            ¿Tienes dudas sobre qué carrera elegir?
          </p>
          <a
            href="https://wa.me/526632093980"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1B2040] text-white font-montserrat font-bold px-10 py-4 rounded-full hover:bg-[#252B52] transition-colors"
          >
            💬 Hablar con un asesor
          </a>
        </div>
      </section>
    </>
  );
}
