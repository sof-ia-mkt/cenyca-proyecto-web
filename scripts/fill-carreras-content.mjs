/**
 * Lee cada landing en landing-pages-cenyca/[slug]/index.html, extrae beneficios,
 * perfil de egreso y campo laboral, y los patchea en Sanity por carrera.
 *
 * No toca: imagen, color, descripcionCorta, modalidades, inversion (ya estaban
 * llenos). No genera descripcionLarga (queda para después).
 *
 * Uso: SANITY_TOKEN=<token> node scripts/fill-carreras-content.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "node-html-parser";

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

// Mapeo slug Sanity → carpeta de landing. Algunas carreras tienen slugs con
// nombres distintos entre Sanity y la carpeta de landing.
const SLUG_TO_LANDING = {
  "ingenieria-mecatronica": "ingenieria-mecatronica",
  "ingenieria-electromecanica": "ingenieria-electromecanica",
  "ingenieria-en-sistemas-computacionales": "ingenieria-en-sistemas-computacionales",
  "ingenieria-industrial": "ingenieria-industrial",
  "criminologia-y-criminalistica": "criminologia-y-criminalistica",
  "criminologia": "criminologia-y-criminalistica",
  "administracion-de-empresas": "administracion-de-empresas",
  "derecho": "derecho",
  "contaduria-y-finanzas": "contaduria-publica-y-finanzas",
  "contaduria-publica-y-finanzas": "contaduria-publica-y-finanzas",
  "ciencias-de-la-educacion": "ciencias-de-la-educacion",
  "gastronomia": "gastronomia",
  "psicologia-organizacional": "psicologia-organizacional",
};

const LANDINGS_ROOT = "C:/Users/axmlp/OneDrive/Desktop/landing-pages-cenyca";

// Mapeo de palabras clave del título del beneficio → emoji (que después el
// componente BeneficioIcon convierte a Lucide). Aquí solo guardamos el título
// y descripción; el componente ya mapea por keyword.
function extractBeneficios(root) {
  const cards = root.querySelectorAll(".beneficio-card");
  return cards.map((c, i) => {
    const titulo = c.querySelector("h3")?.text?.trim();
    const descripcion = c.querySelector("p")?.text?.trim();
    if (!titulo) return null;
    return {
      _key: `beneficio-${i}`,
      titulo,
      descripcion: descripcion || undefined,
    };
  }).filter(Boolean);
}

function extractPerfilEgresado(root) {
  // Buscamos cualquier <ul class="perfil-lista"> y extraemos sus <li>,
  // ignorando el último que normalmente es italic decorativo.
  const ul = root.querySelector("ul.perfil-lista");
  if (!ul) return [];
  const items = ul.querySelectorAll("li");
  return items
    .map((li) => {
      const spans = li.querySelectorAll("span");
      // Tomamos el último span (el primero es el ícono check). Si solo hay 1, ese.
      const text = (spans[spans.length - 1]?.text || li.text || "").trim();
      // Filtramos el ítem decorativo final (no tiene check, suele ser italic).
      const isItalic = li.getAttribute("style")?.includes("border-bottom:none") || false;
      if (isItalic) return null;
      return text || null;
    })
    .filter(Boolean);
}

function extractCampoLaboral(root) {
  // Recortamos a 6 items para conservar la geometría del grid 3×2.
  const items = root.querySelectorAll(".campo-item h3");
  return items.map((h) => h.text.trim()).filter(Boolean).slice(0, 6);
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

const carreras = await client.fetch(`*[_type == "carrera"]{ _id, "slug": slug.current, nombre }`);
console.log(`Encontradas ${carreras.length} carreras en Sanity.\n`);

const tx = client.transaction();
let aplicados = 0;
let saltados = 0;

for (const c of carreras) {
  const landingFolder = SLUG_TO_LANDING[c.slug];
  if (!landingFolder) {
    console.log(`  ⚠ ${c.slug} — sin mapeo de landing, salto`);
    saltados++;
    continue;
  }

  const filePath = resolve(LANDINGS_ROOT, landingFolder, "index.html");
  let html;
  try {
    html = readFileSync(filePath, "utf8");
  } catch {
    console.log(`  ⚠ ${c.slug} — no se pudo leer ${filePath}, salto`);
    saltados++;
    continue;
  }

  const root = parse(html);
  const beneficios = extractBeneficios(root);
  const perfilEgresado = extractPerfilEgresado(root);
  const campoLaboral = extractCampoLaboral(root);

  const patch = {};
  if (beneficios.length > 0) patch.beneficios = beneficios;
  if (perfilEgresado.length > 0) patch.perfilEgresado = perfilEgresado;
  if (campoLaboral.length > 0) patch.campoLaboral = campoLaboral;

  if (Object.keys(patch).length === 0) {
    console.log(`  · ${c.slug} — sin contenido extraíble`);
    saltados++;
    continue;
  }

  tx.patch(c._id, (p) => p.set(patch));
  console.log(
    `  ✔ ${c.slug} — beneficios: ${beneficios.length}, perfil: ${perfilEgresado.length}, campo: ${campoLaboral.length}`,
  );
  aplicados++;
}

if (aplicados === 0) {
  console.log("Nada que aplicar.");
  process.exit(0);
}

await tx.commit();
console.log(`\n✓ Listo. ${aplicados} carreras actualizadas, ${saltados} saltadas.`);
