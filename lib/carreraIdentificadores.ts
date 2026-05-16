// Mapeo de slug de Sanity → identificadores que espera el endpoint Emma (Novai).
// Los valores `carrera` y `source` deben coincidir con los que ya usas en tus
// landings dedicadas (landing-pages-cenyca/[slug]/index.html) para que los leads
// caigan en el mismo flujo del CRM.

export type CarreraIdentificadores = {
  carrera: string;
  source: string;
};

const MAPA: Record<string, CarreraIdentificadores> = {
  "ingenieria-mecatronica":                  { carrera: "Ingenieria Mecatronica",                 source: "landing-mecatronica" },
  "ingenieria-electromecanica":              { carrera: "Ingenieria Electromecanica",             source: "landing-electromecanica" },
  "ingenieria-en-sistemas-computacionales":  { carrera: "Ingenieria en Sistemas Computacionales", source: "landing-sistemas" },
  "ingenieria-industrial":                   { carrera: "Ingenieria Industrial",                  source: "landing-industrial" },
  "derecho":                                 { carrera: "Derecho",                                source: "landing-derecho" },
  "administracion-de-empresas":              { carrera: "Administracion de Empresas",             source: "landing-administracion" },
  "contaduria-publica-y-finanzas":           { carrera: "Contaduria Publica y Finanzas",          source: "landing-contaduria" },
  "contaduria-y-finanzas":                   { carrera: "Contaduria Publica y Finanzas",          source: "landing-contaduria" },
  "ciencias-de-la-educacion":                { carrera: "Ciencias de la Educacion",               source: "landing-educacion" },
  "criminologia-y-criminalistica":           { carrera: "Criminologia y Criminalistica",          source: "landing-criminologia" },
  "criminologia":                            { carrera: "Criminologia y Criminalistica",          source: "landing-criminologia" },
  "gastronomia":                             { carrera: "Gastronomia",                            source: "landing-gastronomia" },
  "psicologia-organizacional":               { carrera: "Psicologia Organizacional",              source: "landing-psicologia" },
};

export function getCarreraIdentificadores(slug: string, nombre?: string): CarreraIdentificadores {
  const direct = MAPA[slug];
  if (direct) return direct;
  // Fallback: usa el nombre tal cual y deriva el source del slug.
  return {
    carrera: nombre ?? slug,
    source: `landing-${slug}`,
  };
}
