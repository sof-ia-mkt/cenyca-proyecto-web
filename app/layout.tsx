import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppChat from "./components/WhatsAppChat";
import PromoPopup from "./components/PromoPopup";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { client } from "@/sanity/lib/client";
import { configuracionQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Defaults SEO (fallback si Sanity no responde o no tiene SEO llenado).
const DEFAULT_TITLE = "CENYCA Universidad";
const DEFAULT_DESCRIPTION =
  "Universidad en Tijuana y Tecate. Licenciaturas, ingenierías y maestrías con RVOE SEP. Titúlate en 3 años con modelo cuatrimestral.";
const DEFAULT_TWITTER_DESC =
  "Universidad en Tijuana y Tecate. RVOE oficial, titúlate en 3 años.";
// Brand corto para el template de title — evita que páginas internas queden
// con títulos de 100+ chars cuando se concatena con el tituloBase largo.
const BRAND_SHORT = "CENYCA Universidad";

/**
 * Viewport + theme color. En Next 15+ deben ir en su propio export
 * `viewport` (separado de `metadata`). El themeColor pinta la barra
 * superior del browser en móviles y coincide con el manifest.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#121B33" },
    { media: "(prefers-color-scheme: dark)", color: "#121B33" },
  ],
  colorScheme: "light",
};

/**
 * Metadata dinámica para que la OG image global (configuracion.seo.ogImage)
 * subida en Sanity Studio aplique a TODAS las páginas que no definen su
 * propia imagen (Next.js merge: las páginas con OG propia la sobrescriben).
 */
export async function generateMetadata(): Promise<Metadata> {
  const config = await client
    .fetch<{
      seo?: {
        tituloBase?: string;
        descripcion?: string;
        ogImageUrl?: string;
      };
    }>(configuracionQuery)
    .catch(() => null);

  const title = config?.seo?.tituloBase || DEFAULT_TITLE;
  const description = config?.seo?.descripcion || DEFAULT_DESCRIPTION;
  const ogImage = config?.seo?.ogImageUrl;

  return {
    title: { default: title, template: `%s | ${BRAND_SHORT}` },
    description,
    metadataBase: new URL(SITE_URL),
    keywords: [
      "universidad Tijuana",
      "universidad Tecate",
      "universidad Baja California",
      "licenciaturas RVOE",
      "ingenierías RVOE",
      "CENYCA Universidad",
      "modelo cuatrimestral",
      "titularse en 3 años",
      "becas universidad Tijuana",
    ],
    authors: [{ name: title }],
    creator: title,
    publisher: title,
    alternates: { canonical: "/" },
    openGraph: {
      siteName: title,
      title,
      description,
      locale: "es_MX",
      type: "website",
      url: SITE_URL,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DEFAULT_TWITTER_DESC,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtiene config desde Sanity (whatsapp + inscripciones + imagen del popup) + fallback foto campus.
  const [config, popupConfig, campusFoto] = await Promise.all([
    client
      .fetch<{
        contacto?: { whatsapp?: string };
        sistemas?: { inscripciones?: string };
        navegacion?: { mostrarVidaEstudiantil?: boolean };
      }>(configuracionQuery)
      .catch(() => null),
    client
      .fetch<{ imagenUrl?: string } | null>(
        `*[_type == "configuracion" && _id == "configuracion-general"][0]{
          "imagenUrl": popupPromo.imagen.asset->url
        }`
      )
      .catch(() => null),
    client
      .fetch<{ imagenUrl?: string } | null>(
        `*[_type == "campus" && esPrincipal == true][0]{
          "imagenUrl": coalesce(imagen.asset->url, galeria[0].asset->url)
        }`
      )
      .catch(() => null),
  ]);
  const whatsapp = config?.contacto?.whatsapp || "526641300236";
  const mostrarVidaEstudiantil = config?.navegacion?.mostrarVidaEstudiantil ?? false;
  // Prioridad: imagen específica del popup → imagen/galeria del campus principal
  const popupBg = popupConfig?.imagenUrl || campusFoto?.imagenUrl;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "CENYCA Universidad",
    alternateName: "Centro de Estudios y Carreras",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Universidad en Tijuana y Tecate con licenciaturas e ingenierías con RVOE SEP. Modelo cuatrimestral, titúlate en 3 años.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tijuana",
      addressRegion: "BC",
      addressCountry: "MX",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${whatsapp}`,
      contactType: "admissions",
      areaServed: "MX",
      availableLanguage: ["Spanish"],
    },
    sameAs: [
      "https://www.facebook.com/cenycauniversidad",
      "https://www.instagram.com/cenycauniversidad",
    ],
  };

  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-inter antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Navbar mostrarVidaEstudiantil={mostrarVidaEstudiantil} />
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer />
        <WhatsAppChat phone={whatsapp} />
        <PromoPopup backgroundUrl={popupBg} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
