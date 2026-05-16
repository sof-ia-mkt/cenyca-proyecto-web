import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp } from "./ScrollReveal";
import HistoriaTimeline from "./HistoriaTimeline";
import SectionAccentLine from "./SectionAccentLine";

export type HistoriaMomento = {
  year: string;
  caption: string;
  descripcion?: string;
  imagenUrl?: string;
  alt?: string;
};

export type HistoriaData = {
  kicker?: string;
  headline?: string;
  parrafo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  momentos?: HistoriaMomento[];
};

export default function SeccionHistoria({ data }: { data: HistoriaData }) {
  if (!data || !data.momentos || data.momentos.length === 0) return null;
  const momentos = data.momentos.slice(0, 5);

  return (
    <section className="relative bg-[#121B33] pt-36 md:pt-44 pb-24 md:pb-32 px-6 md:px-12 overflow-hidden">
      <SectionAccentLine accent="#00D4FF" position="top" />
      <SectionAccentLine accent="#00D4FF" position="bottom" />
      {/* Glow ambient sutil arriba */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#00D4FF]/8 blur-[120px] pointer-events-none"
      />

      <div className="relative max-w-screen-2xl mx-auto">
        {/* Header */}
        <FadeUp className="mb-12 md:mb-16 max-w-3xl">
          {data.kicker && (
            <p className="text-[#00D4FF] font-bold text-[11px] tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span aria-hidden className="block w-6 h-px bg-[#00D4FF]" />
              {data.kicker}
            </p>
          )}
          {data.headline && (
            <h2
              className="text-white font-black mb-5"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              {data.headline}
            </h2>
          )}
          {data.parrafo && (
            <p className="text-white/80 text-lg md:text-xl leading-relaxed text-justify">
              {data.parrafo}
            </p>
          )}
        </FadeUp>

        {/* Timeline horizontal con foto cinematográfica */}
        <FadeUp delay={0.1} className="mb-12">
          <HistoriaTimeline momentos={momentos} />
        </FadeUp>

        {/* CTA */}
        {data.ctaTexto && data.ctaUrl && (
          <FadeUp delay={0.2}>
            <div className="flex justify-center md:justify-start">
              <Link
                href={data.ctaUrl}
                className="group inline-flex items-center gap-3 bg-[#00D4FF] text-[#121B33] px-8 py-4 rounded-full font-extrabold text-sm md:text-base uppercase tracking-wider hover:bg-[#33DDFF] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,212,255,0.5)] shadow-[0_8px_28px_rgba(0,212,255,0.3)] transition-all"
              >
                {data.ctaTexto}
                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

