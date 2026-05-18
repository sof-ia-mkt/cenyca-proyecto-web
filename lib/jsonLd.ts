/**
 * Helpers para generar JSON-LD (schema.org) consistente en todo el sitio.
 *
 * Google usa estos snippets para entender la estructura del contenido y
 * habilitar rich results: breadcrumbs en SERP, mapas con LocalBusiness,
 * Google News para artículos, etc.
 */

import { SITE_URL } from "./siteUrl";

export type Crumb = { name: string; url: string };

/**
 * BreadcrumbList — se renderiza como migas de pan en el resultado de búsqueda.
 * Cada crumb es absoluto (incluye SITE_URL).
 *
 * Uso:
 *   breadcrumbJsonLd([
 *     { name: "Inicio", url: "/" },
 *     { name: "Carreras", url: "/licenciaturas" },
 *     { name: "Gastronomía", url: "/carreras/gastronomia" },
 *   ])
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url.startsWith("http") ? c.url : `${SITE_URL}${c.url}`,
    })),
  };
}

export type CampusForJsonLd = {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono?: string;
  horario?: string;
  urlMaps?: string;
  imagenUrl?: string;
};

const CIUDAD_DATA: Record<
  string,
  { localidad: string; cp?: string }
> = {
  tijuana: { localidad: "Tijuana" },
  tecate: { localidad: "Tecate" },
};

/**
 * CollegeOrUniversity (subtipo de EducationalOrganization + LocalBusiness)
 * por cada campus. Esto le dice a Google que CENYCA tiene varias ubicaciones
 * físicas y habilita aparición en Google Maps cuando alguien busca
 * "universidad cerca de mí" en Tijuana o Tecate.
 *
 * Importante: omitimos campos undefined del objeto resultante. JSON-LD con
 * `image: null` o `telephone: undefined` lo marca el Rich Results test como
 * inválido y Google ignora el bloque completo.
 */
export function campusJsonLd(c: CampusForJsonLd) {
  const ciudad = CIUDAD_DATA[c.ciudad]?.localidad ?? c.ciudad;
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: c.nombre,
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "CENYCA Universidad",
      url: SITE_URL,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: c.direccion,
      addressLocality: ciudad,
      addressRegion: "BC",
      addressCountry: "MX",
    },
    url: `${SITE_URL}/#planteles`,
  };
  if (c.telefono) base.telephone = c.telefono;
  if (c.urlMaps) base.hasMap = c.urlMaps;
  if (c.imagenUrl) base.image = c.imagenUrl;
  return base;
}
