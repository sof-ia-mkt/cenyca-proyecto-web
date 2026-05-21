"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export type KnownRoute = { label: string; href: string };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function bigramsOf(s: string): Set<string> {
  const clean = normalize(s).replace(/\s+/g, "");
  const grams = new Set<string>();
  for (let i = 0; i < clean.length - 1; i++) grams.add(clean.slice(i, i + 2));
  return grams;
}

// Dice coefficient: 2|A∩B| / (|A|+|B|). Range 0..1. Robusto contra typos
// y orden de palabras — funciona bien para "oferta" vs "oferta-academica".
function dice(a: string, b: string): number {
  if (!a || !b) return 0;
  if (normalize(a) === normalize(b)) return 1;
  // Bonus si una contiene a la otra (e.g. "oferta" ⊂ "oferta-academica")
  const na = normalize(a).replace(/\s+/g, "");
  const nb = normalize(b).replace(/\s+/g, "");
  if (nb.includes(na) || na.includes(nb)) {
    const ratio = Math.min(na.length, nb.length) / Math.max(na.length, nb.length);
    return Math.max(0.7, ratio);
  }
  const A = bigramsOf(a);
  const B = bigramsOf(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const g of A) if (B.has(g)) inter++;
  return (2 * inter) / (A.size + B.size);
}

export default function SmartNotFoundSuggestions({ routes }: { routes: KnownRoute[] }) {
  const [suggestions, setSuggestions] = useState<KnownRoute[]>([]);
  const [pathname, setPathname] = useState<string>("");

  useEffect(() => {
    const path = window.location.pathname;
    setPathname(path);
    const query = path.replace(/^\/+|\/+$/g, "").replace(/\//g, " ");
    if (!query) return;
    const scored = routes
      .map((r) => {
        const target = r.href.replace(/^\/+/, "").replace(/\//g, " ");
        return { route: r, score: dice(query, target) };
      })
      .filter((s) => s.score >= 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((s) => s.route);
    setSuggestions(scored);
  }, [routes]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-12 max-w-md mx-auto">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/45 mb-4">
        ¿Buscabas {pathname && <span className="text-[#00D4FF]">{pathname}</span>}?
      </p>
      <ul className="space-y-2">
        {suggestions.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="group flex items-center justify-between gap-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#00D4FF]/40 rounded-xl px-5 py-3.5 transition-all text-left"
            >
              <span className="text-white font-bold text-sm">{s.label}</span>
              <ArrowRight
                size={14}
                className="shrink-0 text-white/40 group-hover:text-[#00D4FF] group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
