"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Star } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

export type FaqItem = {
  _id: string;
  pregunta: string;
  respuesta: PortableTextBlock[];
  destacada?: boolean;
  categoriaId: string;
  categoriaSlug?: string;
};

export type FaqCategoria = {
  _id: string;
  nombre: string;
  slug: string;
  icono?: string;
  descripcion?: string;
};

const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-white/75 leading-relaxed text-pretty mb-3 last:mb-0">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1 text-white/75">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1 text-white/75">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00D4FF] underline underline-offset-2 hover:text-white transition-colors"
      >
        {children}
      </a>
    ),
  },
};

function plainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((b) =>
      (b as { children?: { text?: string }[] }).children
        ?.map((c) => c.text ?? "")
        .join(" ") ?? "",
    )
    .join(" ");
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

type Props = {
  categorias: FaqCategoria[];
  faqs: FaqItem[];
};

export default function FaqAccordion({ categorias, faqs }: Props) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return faqs;
    const nq = normalize(q);
    return faqs.filter((f) => {
      const haystack = normalize(`${f.pregunta} ${plainText(f.respuesta)}`);
      return haystack.includes(nq);
    });
  }, [query, faqs]);

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const f of filtered) {
      const arr = map.get(f.categoriaId) ?? [];
      arr.push(f);
      map.set(f.categoriaId, arr);
    }
    return categorias
      .map((c) => ({ categoria: c, items: map.get(c._id) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [filtered, categorias]);

  return (
    <>
      {/* Buscador */}
      <div className="relative mb-10">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca una pregunta… (becas, horarios, RVOE)"
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/40 text-base outline-none focus:border-[#00D4FF]/40 focus:bg-white/[0.07] transition-colors"
        />
      </div>

      {/* Navegación rápida por categorías */}
      {!query && categorias.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categorias.map((c) => (
            <a
              key={c._id}
              href={`#${c.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors"
            >
              {c.nombre}
            </a>
          ))}
        </div>
      )}

      {/* Empty state */}
      {grouped.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-white/60 text-lg">
            No encontramos resultados para “{query}”.
          </p>
          <p className="text-white/40 text-sm mt-3">
            Prueba con otra palabra o contacta a un asesor.
          </p>
        </div>
      )}

      {/* Grupos por categoría */}
      <div className="space-y-14">
        {grouped.map(({ categoria, items }) => (
          <section key={categoria._id} id={categoria.slug} className="scroll-mt-24">
            <div className="mb-6 pb-4 border-b border-white/10">
              <h2 className="font-bebas text-white text-3xl sm:text-4xl tracking-wide leading-[1.05]">
                {categoria.nombre}
              </h2>
              {categoria.descripcion && (
                <p className="text-white/55 text-sm mt-2 max-w-2xl">
                  {categoria.descripcion}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {items.map((f) => {
                const isOpen = openId === f._id;
                return (
                  <article
                    key={f._id}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? "bg-white/[0.07] border-white/20"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : f._id)}
                      aria-expanded={isOpen}
                      className="w-full text-left flex items-start gap-4 px-5 sm:px-6 py-5 cursor-pointer"
                    >
                      <span className="flex-1 font-montserrat text-white font-semibold text-base sm:text-lg leading-snug text-pretty">
                        {f.pregunta}
                      </span>
                      {f.destacada && (
                        <Star
                          size={14}
                          className="text-[#00D4FF] flex-shrink-0 mt-1"
                          fill="currentColor"
                        />
                      )}
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 mt-0.5 text-white/50 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#00D4FF]" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 pt-1 font-montserrat text-[15px]">
                          <PortableText
                            value={f.respuesta}
                            components={ptComponents}
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
