"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";

export type CarreraCard = {
  _id: string;
  nombre: string;
  slug: string;
  area: string;
  grado: string;
  modalidades?: string[];
  duracion?: string;
  descripcionCorta?: string;
  imagenUrl?: string;
  imagenTarjetaUrl?: string;
};

const MODALIDAD_LABEL: Record<string, string> = {
  escolarizado: "Escolarizado",
  ejecutivo: "Ejecutivo",
  "en-linea": "En línea",
};

const GRADO_LABEL: Record<string, string> = {
  licenciatura: "Licenciatura",
  ingenieria: "Ingeniería",
  especialidad: "Especialidad",
  maestria: "Maestría",
};

export default function AreaCarreraGrid({
  carreras,
}: {
  carreras: CarreraCard[];
}) {
  const [filtro, setFiltro] = useState<string>("todas");

  // Modalidades únicas disponibles
  const modalidades = useMemo(() => {
    const set = new Set<string>();
    carreras.forEach((c) => c.modalidades?.forEach((m) => set.add(m)));
    return Array.from(set);
  }, [carreras]);

  const filtradas = useMemo(() => {
    if (filtro === "todas") return carreras;
    return carreras.filter((c) => c.modalidades?.includes(filtro));
  }, [carreras, filtro]);

  return (
    <div>
      {/* Filtros */}
      {modalidades.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-10 md:mb-12">
          <span className="text-[#76777E] text-[10px] font-bold tracking-[0.25em] uppercase mr-2">
            Modalidad
          </span>
          <FilterChip
            label="Todas"
            active={filtro === "todas"}
            onClick={() => setFiltro("todas")}
          />
          {modalidades.map((m) => (
            <FilterChip
              key={m}
              label={MODALIDAD_LABEL[m] ?? m}
              active={filtro === m}
              onClick={() => setFiltro(m)}
            />
          ))}
        </div>
      )}

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
        {filtradas.map((c) => (
          <CarreraCardItem key={c._id} carrera={c} />
        ))}
      </div>

      {filtradas.length === 0 && (
        <p className="text-center text-[#76777E] py-16">
          No hay programas con esa modalidad.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-all ${
        active
          ? "bg-[#121B33] text-white shadow-[0_6px_18px_rgba(18,27,51,0.25)]"
          : "bg-white text-[#45464D] border border-[#121B33]/10 hover:border-[#121B33]/30 hover:text-[#121B33]"
      }`}
    >
      {label}
    </button>
  );
}

function CarreraCardItem({ carrera: c }: { carrera: CarreraCard }) {
  const grado = GRADO_LABEL[c.grado] ?? c.grado;
  const fotoCard = c.imagenTarjetaUrl ?? c.imagenUrl;

  return (
    <Link
      href={`/carreras/${c.slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#121B33]/8 hover:border-[#00D4FF]/40 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(18,27,51,0.12)] transition-all duration-300"
    >
      {/* Foto */}
      <div className="relative aspect-[16/10] bg-[#121B33] overflow-hidden">
        {fotoCard ? (
          <Image
            src={fotoCard}
            alt={c.nombre}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E2D4A] to-[#121B33] flex items-center justify-center">
            <GraduationCap className="w-14 h-14 text-white/20" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Pill grado */}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-[#121B33] px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase">
          {grado}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6 md:p-7">
        <h3
          className="text-[#121B33] font-extrabold mb-3 group-hover:text-[#0099CC] transition-colors leading-snug"
          style={{
            fontSize: "1.3rem",
            letterSpacing: "-0.02em",
          }}
        >
          {c.nombre}
        </h3>
        {c.descripcionCorta && (
          <p className="text-[#45464D] text-sm leading-relaxed line-clamp-3 mb-5">
            {c.descripcionCorta}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#121B33]/8">
          <div className="flex items-center gap-1.5 text-[#76777E] text-xs">
            <Clock size={13} strokeWidth={2.2} />
            <span>{c.duracion || "3 años"}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[#0099CC] font-bold text-xs uppercase tracking-[0.15em] group-hover:gap-2.5 transition-all">
            Conocer
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
