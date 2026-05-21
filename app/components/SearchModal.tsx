"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2 } from "lucide-react";
import MiniSearch from "minisearch";
import type { SearchItem } from "@/app/api/search-index/route";

type Props = { open: boolean; onClose: () => void };

const CATEGORY_ORDER: SearchItem["category"][] = [
  "Carreras",
  "Páginas",
  "Noticias",
  "Avisos",
];

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);
  if (terms.length === 0) return text;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(re);
  // Reaplicamos los caracteres originales por índice para conservar acentos
  let idx = 0;
  return parts.map((p, i) => {
    const slice = text.slice(idx, idx + p.length);
    idx += p.length;
    const isMatch = terms.includes(p.toLowerCase());
    return isMatch ? (
      <mark key={i} className="bg-[#00D4FF]/30 text-white rounded-sm px-0.5">
        {slice}
      </mark>
    ) : (
      <span key={i}>{slice}</span>
    );
  });
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Carga el índice una sola vez (la primera vez que se abre el modal).
  useEffect(() => {
    if (!open || items.length > 0) return;
    setLoading(true);
    fetch("/api/search-index")
      .then((r) => r.json())
      .then((data: { items: SearchItem[] }) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, items.length]);

  // Construye MiniSearch sobre los items cargados.
  const mini = useMemo(() => {
    if (items.length === 0) return null;
    const ms = new MiniSearch<SearchItem>({
      fields: ["title", "description", "body"],
      storeFields: ["title", "description", "category", "href"],
      idField: "id",
      searchOptions: {
        boost: { title: 3, description: 1.5 },
        fuzzy: 0.2,
        prefix: true,
        combineWith: "AND",
      },
      processTerm: (term) =>
        term
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
    });
    ms.addAll(items);
    return ms;
  }, [items]);

  type Result = {
    id: string;
    title: string;
    description?: string;
    category: SearchItem["category"];
    href: string;
  };

  const results: Result[] = useMemo(() => {
    if (!mini) return [];
    const q = query.trim();
    if (!q) {
      // Empty state — carreras destacadas curadas (orden importa).
      const destacadas = [
        "ingenieria-industrial",
        "ingenieria-mecatronica",
        "ingenieria-electromecanica",
        "gastronomia",
        "criminologia-y-criminalistica",
      ];
      return destacadas
        .map((slug) => items.find((i) => i.href === `/carreras/${slug}`))
        .filter((i): i is SearchItem => Boolean(i))
        .map((i) => ({
          id: i.id,
          title: i.title,
          description: i.description,
          category: i.category,
          href: i.href,
        }));
    }
    const hits = mini.search(q) as unknown as Array<{
      id: string;
      title: string;
      description?: string;
      category: SearchItem["category"];
      href: string;
    }>;
    return hits.slice(0, 12);
  }, [mini, query, items]);

  // Agrupado por categoría respetando orden + ranking dentro de cada grupo.
  const grouped = useMemo(() => {
    const map = new Map<SearchItem["category"], Result[]>();
    for (const r of results) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    const out: Array<{ category: SearchItem["category"]; items: Result[] }> = [];
    for (const cat of CATEGORY_ORDER) {
      const items = map.get(cat);
      if (items && items.length > 0) out.push({ category: cat, items });
    }
    return out;
  }, [results]);

  // Lista plana para keyboard nav (mismo orden que en UI).
  const flatList = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  // Reset hover cuando cambian resultados.
  useEffect(() => {
    setHoverIdx(0);
  }, [query, items.length]);

  // Focus al abrir + ESC + bloqueo de scroll body.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    return () => {
      clearTimeout(t);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Keyboard: ESC cierra, ↑/↓ navega, Enter abre.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHoverIdx((i) => Math.min(i + 1, Math.max(flatList.length - 1, 0)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHoverIdx((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        const target = flatList[hoverIdx];
        if (target) {
          e.preventDefault();
          onClose();
          router.push(target.href);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flatList, hoverIdx, onClose, router]);

  if (!open) return null;

  let flatIdx = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador del sitio"
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh]"
      onClick={onClose}
    >
      <div aria-hidden className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#0F1729] border border-white/10 rounded-2xl shadow-[0_50px_140px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          {loading ? (
            <Loader2 size={20} className="text-[#00D4FF] animate-spin shrink-0" />
          ) : (
            <Search size={20} className="text-[#00D4FF] shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar carreras, noticias, páginas…"
            className="flex-1 bg-transparent text-white placeholder-white/40 text-base md:text-lg outline-none"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono">
            ESC
          </kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="sm:hidden p-1 rounded-md text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {grouped.length === 0 && !loading && (
            <div className="px-5 py-12 text-center text-white/50 text-sm">
              {query.trim()
                ? `Sin resultados para "${query}"`
                : "Empieza a escribir para buscar"}
            </div>
          )}

          {grouped.map(({ category, items: list }) => (
            <div key={category} className="py-2">
              <p className="px-5 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                {category}
              </p>
              <ul>
                {list.map((r) => {
                  flatIdx++;
                  const isActive = flatIdx === hoverIdx;
                  return (
                    <li key={r.id}>
                      <Link
                        href={r.href}
                        onClick={onClose}
                        onMouseEnter={(() => {
                          const captured = flatIdx;
                          return () => setHoverIdx(captured);
                        })()}
                        className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                          isActive ? "bg-[#00D4FF]/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {highlight(r.title, query)}
                          </p>
                          {r.description && (
                            <p className="text-white/55 text-xs leading-relaxed mt-0.5 line-clamp-1">
                              {highlight(r.description, query)}
                            </p>
                          )}
                        </div>
                        <ArrowRight
                          size={14}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-[#00D4FF]" : "text-white/30"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 border-t border-white/10 text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↓</kbd>
            navegar
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
            abrir
          </span>
          <span className="ml-auto">{flatList.length} resultado{flatList.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
