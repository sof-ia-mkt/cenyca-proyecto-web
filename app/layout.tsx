import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppChat from "./components/WhatsAppChat";
import PromoPopup from "./components/PromoPopup";
import { client } from "@/sanity/lib/client";
import { configuracionQuery } from "@/sanity/lib/queries";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    siteName: "CENYCA Universidad",
    locale: "es_MX",
    type: "website",
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
  const inscripciones = config?.sistemas?.inscripciones;
  // Prioridad: imagen específica del popup → imagen/galeria del campus principal
  const popupBg = popupConfig?.imagenUrl || campusFoto?.imagenUrl;

  return (
    <html
      lang="es"
      className={`${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-inter antialiased">
        <Navbar />
        <main className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer />
        <WhatsAppChat phone={whatsapp} />
        <PromoPopup inscripcionesUrl={inscripciones} backgroundUrl={popupBg} />
      </body>
    </html>
  );
}
