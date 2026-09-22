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
import { SanityLive } from "@/sanity/lib/live";
import { configuracionQuery } from "@/sanity/lib/queries";
import { sanityImg } from "@/sanity/lib/image-url";
import { SITE_URL } from "@/lib/siteUrl";
import type { CicloInicio } from "@/lib/ciclo";
import Analitica, { META_PIXEL_ID, GTM_ID } from "./components/Analitica";

// Sin `weight`: next/font sirve la versión VARIABLE de Inter — un solo woff2
// cubre todos los pesos (antes: 7 archivos estáticos en el critical path).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    .catch((err) => {
      console.warn("[layout] configuracionQuery (metadata) falló; usando defaults", err);
      return null;
    });

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
    // El canonical se define por página (app/page.tsx para el home). Ponerlo
    // aquí lo heredaría todo el sitio y marcaría cada página como duplicado de "/".
    openGraph: {
      siteName: "CENYCA Universidad",
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
  // Obtiene config desde Sanity (whatsapp, navegación, redes, ciclo, imagen del popup) + fallback foto campus.
  const [config, popupConfig, campusFoto] = await Promise.all([
    client
      .fetch<{
        contacto?: { whatsapp?: string };
        navegacion?: { mostrarVidaEstudiantil?: boolean };
        redesSociales?: Partial<Record<"facebook" | "instagram" | "tiktok" | "youtube" | "linkedin" | "twitter", string>>;
        cicloInicio?: CicloInicio;
      }>(configuracionQuery)
      .catch((err) => {
        console.warn("[layout] configuracionQuery falló; usando defaults", err);
        return null;
      }),
    client
      .fetch<{ imagenUrl?: string } | null>(
        `*[_type == "configuracion" && _id == "configuracion-general"][0]{
          "imagenUrl": popupPromo.imagen.asset->url
        }`
      )
      .catch((err) => {
        console.warn("[layout] query de imagen del popup falló", err);
        return null;
      }),
    client
      .fetch<{ imagenUrl?: string } | null>(
        `*[_type == "campus" && esPrincipal == true][0]{
          "imagenUrl": coalesce(imagen.asset->url, galeria[0].asset->url)
        }`
      )
      .catch((err) => {
        console.warn("[layout] query de foto de campus falló", err);
        return null;
      }),
  ]);
  const whatsapp = config?.contacto?.whatsapp || "526647719475";
  // Perfiles sociales para JSON-LD `sameAs`: los edita marketing en Sanity
  // (configuracion.redesSociales), nada quemado en código.
  const redes = config?.redesSociales ?? {};
  const sameAs = [redes.facebook, redes.instagram, redes.tiktok, redes.youtube, redes.linkedin, redes.twitter].filter(
    (u): u is string => typeof u === "string" && u.trim().length > 0
  );
  const mostrarVidaEstudiantil = config?.navegacion?.mostrarVidaEstudiantil ?? false;
  // Prioridad: imagen específica del popup → imagen/galeria del campus principal.
  // sanityImg: sin él se descarga el ORIGINAL de Sanity (una foto de campus
  // puede pesar varios MB); con w=1120 el popup baja ~100-200KB.
  const popupBg = sanityImg(popupConfig?.imagenUrl || campusFoto?.imagenUrl, 1120);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "CENYCA Universidad",
    alternateName: "Centro de Estudios y Carreras",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-square.png`,
      width: 3750,
      height: 3750,
    },
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
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  // WebSite — ayuda a Google a entender la marca y formatear el resultado
  // principal con el nombre correcto. No incluimos SearchAction porque no
  // existe una página de resultados de búsqueda con URL pública (el
  // SearchModal del Navbar es solo cliente); incluirlo sin endpoint real
  // hace que Google lo ignore o lo marque como inválido.
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CENYCA Universidad",
    alternateName: "CENYCA",
    url: SITE_URL,
    inLanguage: "es-MX",
    publisher: { "@type": "EducationalOrganization", name: "CENYCA Universidad" },
  };

  // SiteNavigationElement — señal explícita a Google sobre las páginas
  // principales del sitio. Ayuda a que los sitelinks que Google muestre
  // bajo el resultado de marca sean los que nosotros consideramos
  // importantes, no rutas aleatorias indexadas.
  const siteNavJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Navegación principal",
    itemListElement: [
      { "@type": "SiteNavigationElement", position: 1, name: "Inicio", url: SITE_URL },
      { "@type": "SiteNavigationElement", position: 2, name: "Nosotros", url: `${SITE_URL}/nosotros` },
      { "@type": "SiteNavigationElement", position: 3, name: "Oferta Académica", url: `${SITE_URL}/oferta-academica` },
      { "@type": "SiteNavigationElement", position: 4, name: "Licenciaturas", url: `${SITE_URL}/licenciaturas` },
      { "@type": "SiteNavigationElement", position: 5, name: "Ingenierías", url: `${SITE_URL}/ingenierias` },
      { "@type": "SiteNavigationElement", position: 6, name: "Vinculación", url: `${SITE_URL}/vinculacion` },
      { "@type": "SiteNavigationElement", position: 7, name: "Noticias", url: `${SITE_URL}/noticias` },
    ],
  };

  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-inter antialiased">
        {/* Google Tag Manager (noscript) — debe ir al inicio del body */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavJsonLd) }}
        />
        <Navbar mostrarVidaEstudiantil={mostrarVidaEstudiantil} />
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer />
        <WhatsAppChat phone={whatsapp} />
        <PromoPopup backgroundUrl={popupBg} ciclo={config?.cicloInicio} />
        <Analitica />
        <Analytics />
        <SpeedInsights />
        <SanityLive />
      </body>
    </html>
  );
}
