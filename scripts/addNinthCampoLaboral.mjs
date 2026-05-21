// Agrega una 9ª card a campoLaboral en cada carrera (idempotente).
// Si el título ya existe, no duplica.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-07",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const NINTH = {
  "carrera-administracion": {
    titulo: "Innovación y Transformación Digital",
    descripcion:
      "Lideras la modernización de empresas tradicionales: digitalización de procesos, adopción de IA, comercio electrónico y nuevos modelos de negocio. Un perfil cada vez más solicitado en pymes y maquilas que necesitan reinventarse para seguir siendo competitivas.",
  },
  "carrera-educacion": {
    titulo: "Educación Inclusiva",
    descripcion:
      "Diseñas y aplicas estrategias para atender alumnos con necesidades educativas especiales, discapacidad o aptitudes sobresalientes. Trabajas en escuelas regulares, centros especializados (USAER, CAM) o como consultor para instituciones que buscan ser verdaderamente inclusivas.",
  },
  "carrera-contaduria": {
    titulo: "Compliance y Prevención de Lavado",
    descripcion:
      "Diseñas y operas los controles que protegen a la empresa de fraudes, lavado de dinero y sanciones regulatorias (PLD, FATCA, OFAC). Es una de las áreas con mayor crecimiento, especialmente en banca, fintech y empresas con operación binacional.",
  },
  "carrera-criminologia": {
    titulo: "Inteligencia Criminal",
    descripcion:
      "Analizas grandes volúmenes de información (telefónica, financiera, redes sociales) para detectar patrones, redes delictivas y rutas operativas. Trabajas con áreas de inteligencia de fiscalías, policías estatales o corporaciones privadas de seguridad.",
  },
  "carrera-derecho": {
    titulo: "Mediación y MASC",
    descripcion:
      "Resuelves conflictos sin llegar a juicio mediante mediación, conciliación o arbitraje (Mecanismos Alternativos de Solución de Controversias). Una especialidad en auge tras la reforma judicial, con demanda en centros de mediación públicos y privados.",
  },
  "carrera-gastronomia": {
    titulo: "Crítica y Contenido Gastronómico",
    descripcion:
      "Te conviertes en voz autorizada del sector: crítica gastronómica, periodismo, creación de contenido digital, libros de cocina o asesoría a medios. Tijuana es escenario natural para quien quiera narrar la escena culinaria más activa del país.",
  },
  "carrera-electromecanica": {
    titulo: "Energías Renovables",
    descripcion:
      "Diseñas, instalas y mantienes sistemas solares fotovoltaicos, eólicos y de almacenamiento para industria, comercio y vivienda. Un sector con crecimiento acelerado en Baja California por su radiación solar y tarifas industriales altas.",
  },
  "carrera-industrial": {
    titulo: "Sostenibilidad y ESG",
    descripcion:
      "Implementas estrategias ambientales, sociales y de gobernanza (ESG) en plantas industriales: huella de carbono, economía circular, reportes de sustentabilidad. Cada vez más exigido por clientes globales y fondos de inversión.",
  },
  "carrera-mecatronica": {
    titulo: "Vehículos Eléctricos y Movilidad",
    descripcion:
      "Te incorporas a la nueva industria de electromovilidad: baterías, trenes motrices eléctricos, electrónica de potencia y sistemas de carga. Baja California está atrayendo inversión fuerte de fabricantes y proveedores del sector EV.",
  },
  "carrera-sistemas": {
    titulo: "Inteligencia Artificial y Machine Learning",
    descripcion:
      "Construyes modelos de IA aplicada: visión por computadora, NLP, sistemas de recomendación, IA generativa. El perfil con mayor demanda y mejores salarios de la industria tecnológica actual, tanto en empresas locales como en remoto para EE.UU.",
  },
};

const docs = await client.fetch(
  '*[_type=="carrera" && defined(campoLaboral)]{_id,campoLaboral}',
);

let added = 0;
let skipped = 0;
for (const d of docs) {
  const nuevo = NINTH[d._id];
  if (!nuevo) {
    console.log("skip (sin 9ª definida):", d._id);
    continue;
  }
  const yaExiste = (d.campoLaboral || []).some(
    (it) => it?.titulo?.trim().toLowerCase() === nuevo.titulo.toLowerCase(),
  );
  if (yaExiste) {
    console.log(`= ${d._id} ya tiene "${nuevo.titulo}"`);
    skipped++;
    continue;
  }
  const next = [
    ...(d.campoLaboral || []),
    { _key: randomUUID().replace(/-/g, "").slice(0, 12), ...nuevo },
  ];
  await client.patch(d._id).set({ campoLaboral: next }).commit();
  console.log(`+ ${d._id} → ${next.length} cards (agregada "${nuevo.titulo}")`);
  added++;
}
console.log(`\nAgregadas: ${added} · Ya existían: ${skipped}`);
