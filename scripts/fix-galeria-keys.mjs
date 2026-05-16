/**
 * Regenera los _key de los items de galería en todas las carreras para que sean
 * únicos. Necesario porque la primera versión de upload-carrera-images.mjs usaba
 * `g-${asset._id.slice(-8)}`, que colisiona cuando dos carreras comparten la
 * misma imagen base (ej. `instalaciones-7.webp`).
 *
 * Uso: SANITY_TOKEN=<token> node scripts/fix-galeria-keys.mjs
 */
import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

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

const carreras = await client.fetch(`*[_type == "carrera" && defined(galeria)]{ _id, "slug": slug.current, galeria }`);

const tx = client.transaction();
let aplicados = 0;

for (const c of carreras) {
  if (!c.galeria || c.galeria.length === 0) continue;

  // Genera _key únicos. Asegura ningún duplicado dentro del array.
  const keys = new Set();
  const fixed = c.galeria.map((item, i) => {
    let key = item._key;
    if (!key || keys.has(key)) {
      key = `g-${randomBytes(6).toString("hex")}-${i}`;
    }
    keys.add(key);
    return { ...item, _key: key };
  });

  tx.patch(c._id, (p) => p.set({ galeria: fixed }));
  console.log(`  ✔ ${c.slug} — ${c.galeria.length} items con keys regenerados`);
  aplicados++;
}

if (aplicados === 0) {
  console.log("Nada que arreglar.");
  process.exit(0);
}

await tx.commit();
console.log(`\n✓ ${aplicados} carreras actualizadas.`);
