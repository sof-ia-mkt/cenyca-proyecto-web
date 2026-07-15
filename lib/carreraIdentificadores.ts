// Mapeo de slug de Sanity → identificadores que espera el endpoint Emma (Novai).
// Los valores `carrera` y `source` deben coincidir con los que ya usas en tus
// landings dedicadas (landing-pages-cenyca/[slug]/index.html) para que los leads
// caigan en el mismo flujo del CRM.

export type CarreraIdentificadores = {
  carrera: string;
  source: string;
};

const MAPA: Record<string, CarreraIdentificadores> = {
  "ingenieria-mecatronica":                  { carrera: "Ingenieria Mecatronica",                 source: "web-mecatronica" },
  "ingenieria-electromecanica":              { carrera: "Ingenieria Electromecanica",             source: "web-electromecanica" },
  "ingenieria-en-sistemas-computacionales":  { carrera: "Ingenieria en Sistemas Computacionales", source: "web-sistemas" },
  "ingenieria-industrial":                   { carrera: "Ingenieria Industrial",                  source: "web-industrial" },
  "derecho":                                 { carrera: "Derecho",                                source: "web-derecho" },
  "administracion-de-empresas":              { carrera: "Administracion de Empresas",             source: "web-administracion" },
  "contaduria-publica-y-finanzas":           { carrera: "Contaduria Publica y Finanzas",          source: "web-contaduria" },
  "contaduria-y-finanzas":                   { carrera: "Contaduria Publica y Finanzas",          source: "web-contaduria" },
  "ciencias-de-la-educacion":                { carrera: "Ciencias de la Educacion",               source: "web-educacion" },
  "criminologia-y-criminalistica":           { carrera: "Criminologia y Criminalistica",          source: "web-criminologia" },
  "criminologia":                            { carrera: "Criminologia y Criminalistica",          source: "web-criminologia" },
  "gastronomia":                             { carrera: "Gastronomia",                            source: "web-gastronomia" },
  "psicologia-organizacional":               { carrera: "Psicologia Organizacional",              source: "web-psicologia" },
};

export function getCarreraIdentificadores(slug: string, nombre?: string): CarreraIdentificadores {
  const direct = MAPA[slug];
  if (direct) return direct;
  // Fallback: usa el nombre tal cual y deriva el source del slug.
  return {
    carrera: nombre ?? slug,
    source: `web-${slug}`,
  };
}
