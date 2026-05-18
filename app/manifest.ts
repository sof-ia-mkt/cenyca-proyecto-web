import type { MetadataRoute } from "next";

/**
 * Web App Manifest — habilita "Agregar a pantalla de inicio" en móviles,
 * tema de barra de navegación coherente con la marca, y mejora SEO/PWA
 * score en Lighthouse.
 *
 * Next 16 sirve este archivo en /manifest.webmanifest automáticamente.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CENYCA Universidad",
    short_name: "CENYCA",
    description:
      "Universidad en Tijuana y Tecate. Licenciaturas, ingenierías y maestrías con RVOE SEP. Titúlate en 3 años.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#121B33",
    theme_color: "#121B33",
    lang: "es-MX",
    categories: ["education"],
    icons: [
      // Iconos generados dinámicamente vía app/icon.tsx y app/apple-icon.tsx
      // (monograma "C" sobre fondo de marca). Reemplazo temporal hasta tener
      // un isotipo cuadrado oficial — el logo.png es horizontal y se
      // distorsiona como icono de PWA.
      { src: "/icon", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
  };
}
