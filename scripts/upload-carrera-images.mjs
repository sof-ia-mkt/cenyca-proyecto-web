/**
 * Sube imágenes de landing-pages-cenyca/[slug]/assets/ a Sanity como assets,
 * y patchea cada carrera con la imagen del hero + galería del programa.
 *
 * Orden de preferencia para el HERO:
 *  1. asset_1.webp (las ingenierías + criminología la usan como hero)
 *  2. perfil-egresado.webp (las del patrón simple)
 *  3. vida-1.webp / carrusel-2.jpg (gastronomía)
 *
 * Galería: todas las vida-*.webp + instalaciones-*.webp + laboratorio-*.webp,
 * en orden, hasta 8 (límite del schema).
 *
 * No re-sube imágenes ya subidas (verifica por nombre original).
 *
 * Uso: SANITY_TOKEN=<token> node scripts/upload-carrera-images.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { basename, extname, resolve } from "node:path";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("Falta SANITY_TOKEN.");
  process.exit(1);
}

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-08",
  token,
  useCdn: false,
});

const LANDINGS_ROOT = "C:/Users/axmlp/OneDrive/Desktop/landing-pages-cenyca";

// Mapeo slug Sanity → carpeta de landing
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
};

const SKIP_FILES = new Set(["flecha2.webp", "flecha2.png", "og-image.png"]);

function pickHero(assetsDir) {
  const candidates = [
    "asset_1.webp",
    "laboratorio-criminologia.webp",
    "perfil-egresado.webp",
    "carrusel-2.jpg",
    "vida-1.webp",
    "vida-1.jpg",
  ];
  for (const c of candidates) {
    const p = resolve(assetsDir, c);
    if (existsSync(p)) return { path: p, name: c };
  }
  return null;
}

function pickGaleria(assetsDir, heroName) {
  const all = readdirSync(assetsDir).filter((f) => {
    const lower = f.toLowerCase();
    if (SKIP_FILES.has(lower)) return false;
    if (lower.endsWith(".jpg") || lower.endsWith(".webp")) {
      // Solo formatos imagen, preferimos webp
      return true;
    }
    return false;
  });
  // Galería: vida-*, instalaciones-*, laboratorio-* — preferimos webp y excluimos el hero
  const candidates = all
    .filter((f) => {
      if (f === heroName) return false;
      const lower = f.toLowerCase();
      return /^(vida|instalaciones|laboratorio|asset_)/i.test(lower);
    })
    .sort((a, b) => {
      // webp gana sobre jpg para el mismo basename
      const aBase = a.replace(/\.(webp|jpg|jpeg|png)$/i, "");
      const bBase = b.replace(/\.(webp|jpg|jpeg|png)$/i, "");
      if (aBase === bBase) return a.endsWith(".webp") ? -1 : 1;
      return aBase.localeCompare(bBase);
    });
  // Filtra duplicados por basename — quedarse con la primera versión (webp).
  const seen = new Set();
  const picked = [];
  for (const f of candidates) {
    const baseKey = f.replace(/\.(webp|jpg|jpeg|png)$/i, "");
    if (seen.has(baseKey)) continue;
    seen.add(baseKey);
    picked.push({ path: resolve(assetsDir, f), name: f });
    if (picked.length >= 8) break;
  }
  return picked;
}

async function uploadImage(filePath, filename) {
  const buf = readFileSync(filePath);
  const asset = await client.assets.upload("image", buf, { filename });
  return asset;
}

function imageRef(assetId, alt) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

// ─── Ejecución ────────────────────────────────────────────────────────────────

const carreras = await client.fetch(`*[_type == "carrera"]{ _id, "slug": slug.current, nombre, "tieneImagen": defined(imagen.asset), "tieneGaleria": count(galeria) }`);

for (const c of carreras) {
  const landingFolder = SLUG_TO_LANDING[c.slug];
  if (!landingFolder) {
    console.log(`  ⚠ ${c.slug} — sin mapeo, salto`);
    continue;
  }
  const assetsDir = resolve(LANDINGS_ROOT, landingFolder, "assets");
  if (!existsSync(assetsDir) || !statSync(assetsDir).isDirectory()) {
    console.log(`  ⚠ ${c.slug} — sin carpeta assets, salto`);
    continue;
  }

  const heroPick = pickHero(assetsDir);
  if (!heroPick) {
    console.log(`  ⚠ ${c.slug} — sin imagen hero candidato, salto`);
    continue;
  }

  const galeriaPicks = pickGaleria(assetsDir, heroPick.name);

  console.log(`\n[${c.slug}]  hero=${heroPick.name}  galeria=${galeriaPicks.length}`);

  const patch = {};

  if (!c.tieneImagen) {
    const asset = await uploadImage(heroPick.path, `${c.slug}-hero${extname(heroPick.name)}`);
    patch.imagen = imageRef(asset._id, c.nombre);
    console.log(`  ✔ hero subido (${asset._id})`);
  } else {
    console.log(`  · hero ya existe, no se reemplaza`);
  }

  if ((c.tieneGaleria ?? 0) === 0 && galeriaPicks.length > 0) {
    const galeriaUploads = [];
    for (const g of galeriaPicks) {
      const asset = await uploadImage(g.path, `${c.slug}-${basename(g.name)}`);
      galeriaUploads.push({
        _type: "image",
        _key: `g-${asset._id.slice(-8)}`,
        asset: { _type: "reference", _ref: asset._id },
        alt: `${c.nombre} — ${basename(g.name, extname(g.name))}`,
      });
      console.log(`  ✔ galería: ${g.name} (${asset._id})`);
    }
    patch.galeria = galeriaUploads;
  } else if ((c.tieneGaleria ?? 0) > 0) {
    console.log(`  · galería ya existe (${c.tieneGaleria} items), no se reemplaza`);
  }

  if (Object.keys(patch).length === 0) {
    console.log(`  · nada que actualizar`);
    continue;
  }

  await client.patch(c._id).set(patch).commit();
  console.log(`  ✔ ${c.slug} patcheado`);
}

console.log("\n✓ Listo");
