import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { todasNoticiasQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import NewsletterSuscripcion from "@/app/components/NewsletterSuscripcion";
import NoticiasGrid, { type NoticiaItem } from "@/app/components/NoticiasGrid";
import { FadeUp, FadeLeft, FadeRight } from "@/app/components/ScrollReveal";

export const metadata = {
  title: "CENYCA Comunica — Noticias",
  description:
    "Noticias, comunicados y novedades académicas de CENYCA Universidad. Mantente al día con la vida universitaria en Baja California.",
  openGraph: {
    title: "CENYCA Comunica — Noticias",
    description: "Noticias y novedades académicas de CENYCA Universidad.",
    type: "website",
  },
  twitter: { card: "summary_large_image" as const, title: "CENYCA Comunica — Noticias" },
};

function fmtFecha(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NoticiasPage() {
  const { data: noticiasData } = await sanityFetch({ query: todasNoticiasQuery });
  const noticias = (noticiasData ?? []) as NoticiaItem[];

  const featured = noticias[0];
  const resto = noticias.slice(1);

  return (
    <>
      {/* Header editorial */}
      <section className="relative bg-[#F9F9FB] pt-32 md:pt-40 pb-12 md:pb-16 px-6 md:px-12">
        <div className="relative max-w-screen-2xl mx-auto">
          <FadeUp>
            <p className="text-[#76777E] font-semibold text-[11px] tracking-[0.3em] uppercase mb-8">
              CENYCA Comunica · 2026
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <FadeLeft className="lg:col-span-7">
              <h1
                className="font-extrabold text-[#121B33]"
                style={{
                  fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1.02,
                }}
              >
                Noticias.
              </h1>
            </FadeLeft>
            <FadeRight className="lg:col-span-5 lg:pb-4">
              <p className="text-[#45464D] text-base md:text-lg leading-relaxed max-w-md text-pretty">
                Lo que está pasando en CENYCA Universidad — eventos, logros,
                convocatorias y la vida académica del campus.
              </p>
            </FadeRight>
          </div>
          <FadeUp delay={0.15}>
            <div className="mt-14 md:mt-16 h-px bg-[#121B33]/10" />
          </FadeUp>
        </div>
      </section>

      {/* Featured story */}
      {featured && (
        <section className="bg-[#F9F9FB] pb-16 md:pb-20 px-6 md:px-12">
          <div className="max-w-screen-2xl mx-auto">
            <FadeUp>
              <Link
                href={`/noticias/${featured.slug.current}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              >
                <div className="relative lg:col-span-7 aspect-[16/10] rounded-3xl overflow-hidden bg-[#121B33]">
                  {featured.imagen ? (
                    <Image
                      src={urlFor(featured.imagen).width(1400).height(875).url()}
                      alt={featured.titulo}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-[1100ms] ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/15 text-7xl font-extrabold">
                      CENYCA
                    </div>
                  )}
                  <span className="absolute top-5 left-5 inline-flex items-center gap-2 bg-white text-[#121B33] px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase">
                    Destacado
                  </span>
                </div>

                <div className="lg:col-span-5">
                  {featured.categoria && (
                    <p className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase mb-5">
                      {featured.categoria}
                    </p>
                  )}
                  <h2
                    className="text-[#121B33] font-extrabold mb-6 group-hover:text-[#1E2D4A] transition-colors text-balance"
                    style={{
                      fontSize: "clamp(1.8rem, 3.4vw, 2.8rem)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.1,
                    }}
                  >
                    {featured.titulo}
                  </h2>
                  <p className="text-[#76777E] text-sm mb-8">
                    {fmtFecha(featured.fecha)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#121B33] font-bold text-sm uppercase tracking-[0.18em] group-hover:gap-4 transition-all duration-300">
                    Leer noticia
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </FadeUp>
          </div>
        </section>
      )}

      {/* Grid + filtros */}
      <section className="bg-[#F9F9FB] pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-screen-2xl mx-auto">
          {resto.length > 0 && (
            <FadeUp>
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase">
                  Archivo
                </span>
                <span className="h-px flex-1 bg-[#121B33]/10 max-w-[200px]" />
              </div>
            </FadeUp>
          )}

          {noticias.length === 0 ? (
            <FadeUp>
              <div className="rounded-3xl border border-dashed border-[#121B33]/15 bg-white py-20 text-center">
                <p className="text-[#76777E] text-sm">
                  Aún no hay noticias publicadas. Vuelve pronto.
                </p>
              </div>
            </FadeUp>
          ) : (
            <FadeUp delay={0.1}>
              <NoticiasGrid noticias={resto} />
            </FadeUp>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#F9F9FB] px-6 md:px-12 pb-28 md:pb-32">
        <div className="max-w-screen-2xl mx-auto">
          <NewsletterSuscripcion />
        </div>
      </section>
    </>
  );
}
