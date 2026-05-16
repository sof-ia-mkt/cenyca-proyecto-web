/**
 * Llena el campo `inversion` de cada carrera con los datos exactos de las
 * landings dedicadas (landing-pages-cenyca/[slug]/index.html).
 *
 * Hay 3 patrones:
 *  - COMPLETO: 2 cards (martes estelar + fin de semana) + toggle de campus
 *    (mecatrónica, electromecánica, criminología, administración, sistemas, industrial)
 *  - SIMPLE: 1 card (fin de semana) sin toggle de campus, con mensaje "Aparta tu lugar"
 *    (derecho, contaduría, educación, psicología)
 *  - PREMIUM: 1 card (fin de semana) con mensualidad alta $5,500
 *    (gastronomía)
 *
 * Uso: SANITY_TOKEN=<token> node scripts/fill-inversion.mjs
 */
import { createClient } from "@sanity/client";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Falta SANITY_TOKEN en el ambiente.");
  process.exit(1);
}

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-08",
  token,
  useCdn: false,
});

const DISCLAIMER = "Los costos pueden variar. Becas sujetas a disponibilidad. Contacta a un asesor para más información.";
const MENSAJE_APARTA = "Aparta tu lugar pagando inscripción y paquete cuatrimestral. No te preocupes por los espacios.";

// ─── Helpers de cards ─────────────────────────────────────────────────────────

const cardMartesEstelar = () => ({
  _key: "card-martes",
  tipo: "entre-semana",
  tag: "ENTRE SEMANA",
  destacada: true,
  etiquetaDestacada: "HORARIO ESTELAR",
  diaPrincipal: "Martes",
  horario: "6:00 pm – 9:49 pm",
  mensualidadBase: 4000,
  mensualidadEspecial: 2200,
  notaEspecial: "Sujeto a venta de 20 boletos",
  labelToggleEspecial: "Con 20 boletos",
  labelToggleRegular: "Precio regular",
  ctaLabel: "Quiero este horario",
});

const cardFinDeSemanaConCampus = () => ({
  _key: "card-fds",
  tipo: "fin-de-semana",
  tag: "FIN DE SEMANA",
  destacada: false,
  etiquetaDestacada: "MÁS SOLICITADO",
  diaPrincipal: "Sábado",
  diaSecundario: "o Domingo",
  horarioCasaBlanca: "Sáb: 1 pm – 5 pm  ·  Dom: 8 am – 12 pm",
  horarioOtros: "8:00 am – 12:00 pm",
  ocultarDomingoEnOtay: true,
  mensualidadBase: 4000,
  becasOpciones: [0, 10, 20],
  sinReinscripcion: true,
  ctaLabel: "Quiero este horario",
});

const cardFinDeSemanaSimple = ({ mensualidad = 4000, cta = "Quiero este horario" } = {}) => ({
  _key: "card-fds",
  tipo: "fin-de-semana",
  tag: "FIN DE SEMANA",
  destacada: true,
  etiquetaDestacada: "MÁS SOLICITADO",
  diaPrincipal: "Sábado",
  diaSecundario: "o Domingo",
  horario: "Sáb: 1 pm – 5 pm  ·  Dom: 8 am – 12 pm",
  mensualidadBase: mensualidad,
  becasOpciones: [0, 10, 20],
  sinReinscripcion: true,
  ctaLabel: cta,
});

// ─── Configuraciones por patrón ───────────────────────────────────────────────

const inversionCompleto = () => ({
  activa: true,
  inscripcionBase: 2000,
  paqueteCuatrimestral: 950,
  paqueteCuatrimestralTecate: 800,
  mostrarToggleCampus: true,
  disclaimer: DISCLAIMER,
  cards: [cardMartesEstelar(), cardFinDeSemanaConCampus()],
});

const inversionSimple = () => ({
  activa: true,
  inscripcionBase: 2000,
  paqueteCuatrimestral: 950,
  paqueteCuatrimestralTecate: 800,
  mostrarToggleCampus: false,
  mensajeAparta: MENSAJE_APARTA,
  disclaimer: DISCLAIMER,
  cards: [cardFinDeSemanaSimple()],
});

const inversionGastronomia = () => ({
  activa: true,
  inscripcionBase: 2000,
  paqueteCuatrimestral: 950,
  paqueteCuatrimestralTecate: 950,
  mostrarToggleCampus: false,
  disclaimer: DISCLAIMER,
  cards: [cardFinDeSemanaSimple({ mensualidad: 5500, cta: "Quiero inscribirme" })],
});

// ─── Mapeo slug → patrón ──────────────────────────────────────────────────────

const PATRONES = {
  // COMPLETO (6 carreras): 2 cards con toggle de campus
  "ingenieria-mecatronica": inversionCompleto,
  "ingenieria-electromecanica": inversionCompleto,
  "ingenieria-en-sistemas-computacionales": inversionCompleto,
  "ingenieria-industrial": inversionCompleto,
  "criminologia-y-criminalistica": inversionCompleto,
  "criminologia": inversionCompleto,
  "administracion-de-empresas": inversionCompleto,

  // SIMPLE (4 carreras): 1 card fin de semana, sin toggle de campus
  "derecho": inversionSimple,
  "contaduria-publica-y-finanzas": inversionSimple,
  "contaduria-y-finanzas": inversionSimple,
  "ciencias-de-la-educacion": inversionSimple,
  "psicologia-organizacional": inversionSimple,

  // PREMIUM (1 carrera): mensualidad alta
  "gastronomia": inversionGastronomia,
};

// ─── Ejecución ────────────────────────────────────────────────────────────────

const carreras = await client.fetch(`*[_type == "carrera"]{ _id, "slug": slug.current, nombre }`);
console.log(`Encontradas ${carreras.length} carreras en Sanity.\n`);

const tx = client.transaction();
let aplicados = 0;
let saltados = 0;

for (const c of carreras) {
  const builder = PATRONES[c.slug];
  if (!builder) {
    console.log(`  ⚠ ${c.slug} — sin patrón definido, se salta`);
    saltados++;
    continue;
  }
  const data = builder();
  tx.patch(c._id, (p) => p.set({ inversion: data }));
  console.log(`  ✔ ${c.slug} — patrón aplicado (${data.cards.length} card${data.cards.length > 1 ? "s" : ""})`);
  aplicados++;
}

if (aplicados === 0) {
  console.log("Nada que aplicar.");
  process.exit(0);
}

await tx.commit();
console.log(`\n✓ Listo. ${aplicados} carreras actualizadas, ${saltados} saltadas.`);

// Limpia el campo viejo `modalidadesHorarios` del documento de configuración general.
try {
  const cfg = await client.getDocument("configuracion-general");
  if (cfg && cfg.modalidadesHorarios) {
    await client
      .patch("configuracion-general")
      .unset(["modalidadesHorarios"])
      .commit();
    console.log("✓ Campo viejo `modalidadesHorarios` eliminado del documento de configuración.");
  }
} catch (err) {
  console.log("Nota: no se pudo limpiar `modalidadesHorarios` (puede que no exista):", err.message);
}
