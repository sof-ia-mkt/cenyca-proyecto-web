/**
 * Elimina del contenido los datos huérfanos: campos que se quitaron del
 * esquema en la auditoría pero cuyo dato seguía guardado en los documentos.
 * Eso es lo que provoca el aviso "Unknown field found" en el Studio.
 *
 * Campos huérfanos detectados:
 *   - vinculacion-page    → ctaMensajeWhatsapp
 *   - configuracion-general → slogan
 *   - campus (todos)      → slug
 *
 * Ejecutar con:
 *   npx sanity exec scripts/limpiar-campos-huerfanos.ts --with-user-token
 *
 * Seguro: solo hace unset de esos campos. Si un documento no los tiene,
 * la operación no hace nada. Cubre también las versiones draft.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });

async function main() {
  await client
    .patch({ query: '*[_id in ["vinculacion-page", "drafts.vinculacion-page"]]' })
    .unset(["ctaMensajeWhatsapp"])
    .commit();
  console.log("✔ vinculacion-page → ctaMensajeWhatsapp eliminado");

  await client
    .patch({
      query:
        '*[_id in ["configuracion-general", "drafts.configuracion-general"]]',
    })
    .unset(["slogan"])
    .commit();
  console.log("✔ configuracion-general → slogan eliminado");

  await client
    .patch({ query: '*[_type == "campus"]' })
    .unset(["slug"])
    .commit();
  console.log("✔ campus (todos) → slug eliminado");

  console.log("Listo — sin campos huérfanos.");
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
