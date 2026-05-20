"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export type NoticiaItem = {
  _id: string;
  titulo: string;
  slug: { current: string };
  fecha?: string;
  categoria?: string;
  imagen?: { asset?: { _ref?: string } } | null;
};

const CATEGORIAS: { value: string; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "general", label: "General" },
  { value: "academico", label: "Académico" },
  { value: "cultural", label: "Cultural" },
  { value: "deportivo", label: "Deportivo" },
];

function fmtFecha(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NoticiasGrid({
  noticias,
}: {
  noticias: NoticiaItem[];
}) {
  const [filtro, setFiltro] = useState<string>("todas");

  // Categorías que realmente tienen contenido
  const disponibles = useMemo(() => {
    const set = new Set<string>();
    noticias.forEach((n) => n.categoria && set.add(n.categoria));
    return CATEGORIAS.filter(
      (c) => c.value === "todas" || set.has(c.value)
    );
  }, [noticias]);

  const filtradas = useMemo(() => {
    if (filtro === "todas") return noticias;
    return noticias.filter((n) => n.categoria === filtro);
  }, [noticias, filtro]);

  if (noticias.length === 0) return null;

  return (
    <>
      {/* Filtros de categoría */}
      {disponibles.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {disponibles.map((c) => {
            const activo = filtro === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setFiltro(c.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-[0.18em] uppercase transition-all ${
                  activo
                    ? "bg-[#121B33] text-white shadow-[0_6px_18px_rgba(18,27,51,0.2)]"
                    : "bg-white text-[#121B33] border border-[#121B33]/15 hover:border-[#121B33]/40 hover:bg-[#F2F3F7]"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      {filtradas.length === 0 ? (
        <p className="text-[#76777E] text-center py-12">
          No hay noticias en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtradas.map((n) => (
            <Link
              key={n._id}
              href={`/noticias/${n.slug.current}`}
              className="group flex flex-col rounded-2xl bg-white border border-[#121B33]/10 overflow-hidden hover:border-[#121B33]/25 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(18,27,51,0.12)] transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-[#121B33] overflow-hidden">
                {n.imagen ? (
                  <Image
                    src={urlFor(n.imagen).width(600).height(450).url()}
                    alt={n.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/15 text-5xl font-extrabold">
                    CENYCA
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 p-6">
                {n.categoria && (
                  <span className="text-[#00D4FF] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
                    {n.categoria}
                  </span>
                )}
                <h3
                  className="text-[#121B33] font-extrabold mb-4 line-clamp-3 group-hover:text-[#1E2D4A] transition-colors text-pretty"
                  style={{
                    fontSize: "1.15rem",
                    letterSpacing: "-0.015em",
                    lineHeight: 1.25,
                  }}
                >
                  {n.titulo}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#121B33]/8">
                  <span className="text-[#76777E] text-xs">
                    {fmtFecha(n.fecha)}
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="text-[#121B33]/40 group-hover:text-[#00D4FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
