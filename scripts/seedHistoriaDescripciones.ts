import { getCliClient } from "sanity/cli";

/**
 * Llena el campo `descripcion` (texto largo) de cada momento del documento
 * Historia / Nosotros (singleton id "historia-home"). Estas descripciones
 * aparecen al abrir la foto en el lightbox del home.
 *
 * Uso: npx sanity exec scripts/seedHistoriaDescripciones.ts --with-user-token
 */

const DESCRIPCIONES = [
  // Momento 0 — 2024 Casa Blanca
  "En 2024 abrimos las puertas de Campus Casa Blanca, nuestra apuesta más ambiciosa: un edificio diseñado desde cero para alojar laboratorios especializados en ingeniería, manufactura avanzada y robótica aplicada. Es la sede insignia de la transición CENYCA: de centro de enseñanza a universidad líder de Baja California.",
  // Momento 1 — 2007 Fundación
  "Todo empezó en 2007 con un sueño concreto: hacer accesible la preparación universitaria en Tijuana. Nacimos como centro de capacitación enfocado en preparatoria y cursos preuniversitarios, atendiendo a quienes querían dar el siguiente paso académico cerca de casa.",
  // Momento 2 — 2010s Aval SEP
  "En los 2010s consolidamos nuestro modelo: obtuvimos aval SEP, certificamos bachillerato en un solo examen y abrimos las puertas a adultos mayores de 18 años que querían retomar sus estudios. Aquí descubrimos que la flexibilidad académica era la clave.",
  // Momento 3 — 2019 Universidad
  "En 2019 dimos el salto que cambió todo: nos constituimos formalmente como CENYCA Universidad. Empezamos a ofrecer licenciaturas y posgrados, abriendo el camino para que quienes empezaron con nosotros en bachillerato pudieran completar toda su formación profesional bajo el mismo techo.",
  // Momento 4 — Hoy
  "Hoy somos 4 campus en Baja California: Tijuana (Casa Blanca, Otay y Palmas) y Tecate. Más de 3,200 alumnos activos construyen su carrera con nosotros, en programas que van desde ingenierías de frontera hasta humanidades aplicadas.",
];

async function patchDoc(client: ReturnType<typeof getCliClient>, docId: string) {
  const doc = await client.getDocument(docId);
  if (!doc) return false;

  let patch = client.patch(docId);
  DESCRIPCIONES.forEach((descripcion, idx) => {
    patch = patch.set({ [`momentos[${idx}].descripcion`]: descripcion });
  });
  const result = await patch.commit();
  console.log(`✓ Actualizado ${docId} · _rev=${result._rev}`);
  return true;
}

async function main() {
  const client = getCliClient({ apiVersion: "2026-04-07" });
  const draftPatched = await patchDoc(client, "drafts.historia-home");
  const publishedPatched = await patchDoc(client, "historia-home");

  if (!draftPatched && !publishedPatched) {
    console.error("⚠ No existe el documento historia-home.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
