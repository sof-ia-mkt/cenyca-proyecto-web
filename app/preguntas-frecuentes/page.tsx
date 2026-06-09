// Revalida cada 60s — cambios en Sanity se reflejan en menos de 1 min.
export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";
import { faqsQuery, configuracionQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/jsonLd";
import FaqAccordion, {
  type FaqCategoria,
  type FaqItem,
} from "@/app/components/FaqAccordion";

type FaqQueryResult = {
  categorias: FaqCategoria[];
  faqs: FaqItem[];
};

export const metadata: Metadata = {
  title: "Preguntas frecuentes — CENYCA Universidad",
  description:
    "Respuestas claras a las dudas más comunes sobre CENYCA Universidad: RVOE, becas, horarios, inscripción, modalidades, titulación y más.",
  alternates: { canonical: "/preguntas-frecuentes" },
  openGraph: {
    title: "Preguntas frecuentes — CENYCA Universidad",
    description:
      "Becas, horarios, RVOE, inscripción, titulación: todo lo que un prospecto pregunta antes de inscribirse en CENYCA.",
    url: `${SITE_URL}/preguntas-frecuentes`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Preguntas frecuentes — CENYCA Universidad",
  },
};

function blocksToPlainText(blocks: PortableTextBlock[]): string {
  if (!blocks) return "";
  return blocks
    .map((b) => {
      const children = (b as { children?: { text?: string }[] }).children;
      return children ? children.map((c) => c.text ?? "").join("") : "";
    })
    .join(" ")
    .trim();
}

export default async function PreguntasFrecuentesPage() {
  const data = (await client.fetch(faqsQuery)) as FaqQueryResult;
  const config = await client.fetch(configuracionQuery);

  const categorias = data?.categorias ?? [];
  const faqs = data?.faqs ?? [];

  // Solo las FAQs que tienen categoría existente (defensivo)
  const validCategoriaIds = new Set(categorias.map((c) => c._id));
  const faqsValidas = faqs.filter((f) => validCategoriaIds.has(f.categoriaId));

  const whatsapp = config?.contacto?.whatsapp ?? "526642344919";
  const waText = encodeURIComponent(
    "Hola, vengo de la sección de preguntas frecuentes y me gustaría más información.",
  );

  // JSON-LD
  const faqJsonLd = faqPageJsonLd(
    faqsValidas.map((f) => ({
      question: f.pregunta,
      answer: blocksToPlainText(f.respuesta),
    })),
  );

  const breadcrumb = breadcrumbJsonLd([
    { name: "Inicio", url: "/" },
    { name: "Preguntas frecuentes", url: "/preguntas-frecuentes" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* Hero oscuro */}
      <section className="relative bg-[#121B33] pt-28 md:pt-32 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-20 h-[320px] w-[320px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00D4FF 0%, transparent 70%)" }}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <HelpCircle size={14} className="text-[#00D4FF]" />
            <span className="font-montserrat text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">
              Resolvemos tus dudas
            </span>
          </div>

          <h1
            className="font-extrabold text-white text-balance mb-5"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.6rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.04,
            }}
          >
            Preguntas frecuentes.
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl text-pretty">
            Todo lo que un futuro alumno necesita saber antes de inscribirse:
            validez oficial, horarios, becas, modalidades, titulación y más. Si
            tu duda no aparece aquí, escríbenos por WhatsApp.
          </p>
        </div>
      </section>

      {/* Contenido — buscador + acordeón */}
      <section className="bg-[#0E1628] py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {faqsValidas.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/60 text-lg">
                Aún no hay preguntas publicadas. Vuelve pronto.
              </p>
            </div>
          ) : (
            <FaqAccordion categorias={categorias} faqs={faqsValidas} />
          )}
        </div>
      </section>

      {/* Bloque de cierre — contacto */}
      <section className="bg-[#121B33] py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-bebas text-white text-3xl sm:text-4xl tracking-wide leading-[1.05] mb-4"
          >
            ¿No encontraste tu respuesta?
          </h2>
          <p className="text-white/65 text-base sm:text-lg mb-8 max-w-2xl mx-auto text-pretty">
            Nuestros asesores resuelven dudas específicas sobre carreras,
            inversión, becas, inscripción y trayectoria académica.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${whatsapp}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00D4FF] text-[#0F1729] font-semibold text-sm hover:bg-white transition-colors"
            >
              <MessageCircle size={18} />
              Hablar con un asesor
            </a>
            <Link
              href="/oferta-academica"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/30 transition-colors"
            >
              Ver oferta académica
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
