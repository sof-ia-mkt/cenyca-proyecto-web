import { getCliClient } from "sanity/cli";

/**
 * Llena los campos `year` y `caption` de cada momento del documento
 * Historia / Nosotros (singleton id "historia-home").
 *
 * Uso: npx sanity exec scripts/seedHistoria.ts --with-user-token
 */

type Momento = { idx: number; year: string; caption: string };

const MOMENTOS: Momento[] = [
  { idx: 0, year: "2024", caption: "Casa Blanca, apostando por ingenierías" },
  { idx: 1, year: "2007", caption: "Nace CENYCA en Tijuana" },
  { idx: 2, year: "2010s", caption: "Aval SEP y formación a adultos" },
  { idx: 3, year: "2019", caption: "CENYCA Universidad" },
  { idx: 4, year: "Hoy", caption: "4 campus en BC · +3,200 alumnos" },
];

async function patchDoc(client: ReturnType<typeof getCliClient>, docId: string) {
  const doc = await client.getDocument(docId);
  if (!doc) return false;

  let patch = client.patch(docId);
  for (const m of MOMENTOS) {
    patch = patch.set({
      [`momentos[${m.idx}].year`]: m.year,
      [`momentos[${m.idx}].caption`]: m.caption,
    });
  }
  const result = await patch.commit();
  console.log(`✓ Actualizado ${docId} · _rev=${result._rev}`);
  return true;
}

async function main() {
  const client = getCliClient({ apiVersion: "2026-04-07" });

  // Sanity guarda los drafts como "drafts.<id>" y la versión publicada como "<id>".
  // Parchamos ambos por si existen.
  const draftPatched = await patchDoc(client, "drafts.historia-home");
  const publishedPatched = await patchDoc(client, "historia-home");

  if (!draftPatched && !publishedPatched) {
    console.error(
      "⚠ No existe el documento. Abre el Studio, arrastra una foto a un momento y guárdalo (aunque sea como borrador) para que se cree."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
