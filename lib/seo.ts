import type { Metadata } from "next";
import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { configuracionQuery } from "@/sanity/lib/queries";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * SEO compartido.
 *
 * El problema que resuelve: Next fusiona la metadata de forma superficial.
 * Si una página define `openGraph`, REEMPLAZA por completo el del layout, no
 * lo complementa. Diez páginas definían solo título y descripción y con eso
 * perdían la imagen, el nombre del sitio y el idioma: al compartirlas por
 * WhatsApp o Facebook salían sin foto.
 *
 * Aquí se arma el bloque completo una sola vez y cada página aporta lo suyo.
 */

export const MARCA = "CENYCA Universidad";

/**
 * Recorta una imagen del CDN de Sanity a 1200x630, que es lo que declaramos
 * y lo que esperan las redes. Sin esto se servía el original (el global es un
 * PNG de 3750px) y las plataformas lo recortan a su criterio o lo rechazan
 * por peso. Se fuerza JPG y calidad 80 para quedar holgadamente por debajo
 * del límite que aplican WhatsApp y Facebook.
 */
export function ogImagen(url?: string | null): string | undefined {
  if (!url) return undefined;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}w=1200&h=630&fit=crop&auto=format&fm=jpg&q=80`;
}

/**
 * Imagen de respaldo definida por marketing en Sanity. `cache` la memoiza por
 * render, así que las páginas que la piden no multiplican la consulta.
 */
const ogGlobal = cache(async (): Promise<string | undefined> => {
  const config = await client
    .fetch<{ seo?: { ogImageUrl?: string } }>(configuracionQuery)
    .catch((err) => {
      console.warn("[lib/seo] no se pudo leer la imagen OG global", err);
      return null;
    });
  return ogImagen(config?.seo?.ogImageUrl);
});

type EntradaSeo = {
  /** Título de la pestaña. La plantilla del layout le añade la marca. */
  title: string;
  description: string;
  /** Ruta absoluta del sitio, p. ej. "/nosotros". */
  path: string;
  /** Título para redes, si debe diferir del de la pestaña. */
  ogTitle?: string;
  ogDescription?: string;
  /** Imagen propia ya recortada; si se omite se usa la global de Sanity. */
  imagen?: string;
  type?: "website" | "article";
  /** Para páginas que no deben indexarse. */
  noIndex?: boolean;
};

export async function metadataDePagina(e: EntradaSeo): Promise<Metadata> {
  const imagen = e.imagen ?? (await ogGlobal());
  const ogTitle = e.ogTitle ?? e.title;
  const ogDescription = e.ogDescription ?? e.description;

  return {
    title: e.title,
    description: e.description,
    alternates: { canonical: e.path },
    ...(e.noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      siteName: MARCA,
      locale: "es_MX",
      type: e.type ?? "website",
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}${e.path}`,
      ...(imagen
        ? { images: [{ url: imagen, width: 1200, height: 630, alt: ogTitle }] }
        : {}),
    },
    twitter: {
      card: imagen ? "summary_large_image" : "summary",
      title: ogTitle,
      description: ogDescription,
      ...(imagen ? { images: [imagen] } : {}),
    },
  };
}
