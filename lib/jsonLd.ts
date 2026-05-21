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

/**
 * Convierte el horario textual de Sanity en `OpeningHoursSpecification`
 * estructurado para schema.org. Acepta el formato libre que usamos:
 *
 *   "Lunes a Viernes: 7:00 AM - 9:00 PM | Sábado: 8:00 AM - 6:00 PM | Domingo: 7:00 AM - 1:00 PM"
 *
 * Devuelve [] si no logra parsear — el JSON-LD se queda sin openingHours
 * en vez de inyectar datos inválidos que Google rechace.
 */
const DIA_MAP: Record<string, string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  miércoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  sábado: "Saturday",
  domingo: "Sunday",
};
const DIA_ORDEN = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function normalizaDia(s: string): string | null {
  return DIA_MAP[s.trim().toLowerCase()] ?? null;
}

function parseHora12h(s: string): string | null {
  // Acepta "7:00 AM", "9:00 PM", "07:00", "21:00"
  const m = s.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ?? "00";
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  if (h < 0 || h > 23) return null;
  return `${String(h).padStart(2, "0")}:${min}`;
}

export function parseHorarioToSpecs(horario: string): Array<{
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}> {
  const bloques = horario.split("|").map((b) => b.trim()).filter(Boolean);
  const specs: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }> = [];

  for (const bloque of bloques) {
    const [diasRaw, horasRaw] = bloque.split(":").length > 2
      ? [bloque.slice(0, bloque.indexOf(":")), bloque.slice(bloque.indexOf(":") + 1)]
      : bloque.split(/:(.+)/);
    if (!diasRaw || !horasRaw) continue;

    // Días: "Lunes a Viernes" o "Sábado" o "Lunes, Miércoles"
    let dayOfWeek: string[] = [];
    const aMatch = diasRaw.match(/^(.+?)\s+a\s+(.+)$/i);
    if (aMatch) {
      const d1 = normalizaDia(aMatch[1]);
      const d2 = normalizaDia(aMatch[2]);
      if (!d1 || !d2) continue;
      const i1 = DIA_ORDEN.indexOf(d1);
      const i2 = DIA_ORDEN.indexOf(d2);
      if (i1 < 0 || i2 < 0 || i2 < i1) continue;
      dayOfWeek = DIA_ORDEN.slice(i1, i2 + 1);
    } else {
      const dias = diasRaw.split(/[,/]/).map(normalizaDia).filter((d): d is string => Boolean(d));
      if (dias.length === 0) continue;
      dayOfWeek = dias;
    }

    // Horas: "7:00 AM - 9:00 PM"
    const horaMatch = horasRaw.match(/^\s*(.+?)\s*-\s*(.+?)\s*$/);
    if (!horaMatch) continue;
    const opens = parseHora12h(horaMatch[1]);
    const closes = parseHora12h(horaMatch[2]);
    if (!opens || !closes) continue;

    specs.push({ "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes });
  }

  return specs;
}

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
  if (c.telefono) base.telephone = c.telefono.replace(/\s+/g, "");
  if (c.urlMaps) base.hasMap = c.urlMaps;
  if (c.imagenUrl) base.image = c.imagenUrl;
  if (c.horario) {
    const specs = parseHorarioToSpecs(c.horario);
    if (specs.length > 0) base.openingHoursSpecification = specs;
  }
  return base;
}

/**
 * FAQPage — habilita rich results de preguntas/respuestas en Google.
 * Cada FAQ se incluye con su pregunta y respuesta en texto plano.
 *
 * Uso:
 *   faqPageJsonLd([
 *     { question: "¿Tienen RVOE?", answer: "Sí, todas..." },
 *     ...
 *   ])
 */
export function faqPageJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}
