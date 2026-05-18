import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "CENYCA Universidad",
    template: "%s | CENYCA Universidad",
  },
  description:
    "Universidad en Tijuana, Tecate y Ensenada. Licenciaturas, especialidades y maestrías con validez oficial. Titúlate en 3 años con modelo cuatrimestral.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "universidad Tijuana",
    "universidad Tecate",
    "universidad Ensenada",
    "universidad Baja California",
    "licenciaturas RVOE",
    "ingenierías RVOE",
    "CENYCA Universidad",
    "modelo cuatrimestral",
    "titularse en 3 años",
    "becas universidad Tijuana",
  ],
  authors: [{ name: "CENYCA Universidad" }],
  creator: "CENYCA Universidad",
  publisher: "CENYCA Universidad",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "CENYCA Universidad",
    locale: "es_MX",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CENYCA Universidad",
    description:
      "Universidad en Tijuana, Tecate y Ensenada. RVOE oficial, titúlate en 3 años.",
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
  verification: {
    // google: "AGREGAR_CUANDO_TENGAS_SEARCH_CONSOLE",
  },
};

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
      "Universidad en Tijuana, Tecate y Ensenada con licenciaturas e ingenierías con RVOE SEP. Modelo cuatrimestral, titúlate en 3 años.",
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
        <Navbar />
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
