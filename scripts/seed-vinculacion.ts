/**
 * Puebla el documento singleton `vinculacion-page` con el contenido que hoy
 * vive como respaldo (DEFAULTS) en app/vinculacion/page.tsx, subiendo las
 * imágenes de /public/vinculacion a Sanity.
 *
 * Objetivo: que la página de Vinculación sea 100% editable desde el Studio.
 *
 * Ejecutar con:
 *   npx sanity exec scripts/seed-vinculacion.ts --with-user-token
 *
 * Es seguro: usa patch (no borra heroTitulo, heroVideo, rector.nombre, etc.).
 * setIfMissing solo rellena campos de texto vacíos; set escribe las imágenes
 * y arreglos que están vacíos.
 */
import { getCliClient } from "sanity/cli";
import { createReadStream } from "fs";
import { join } from "path";

const client = getCliClient({ apiVersion: "2024-01-01" });
const PUB = join(process.cwd(), "public", "vinculacion");

const FILES = [
  "rector.jpg",
  "innovate-baja-connect.jpg",
  "convenio-zonkeys.jpg",
  "gastronomia-icf.jpg",
  "consejo-tecnico.jpg",
  "visita-manufactura.jpg",
] as const;

async function main() {
  console.log("Subiendo imágenes a Sanity…");
  const assetIds: Record<string, string> = {};
  for (const file of FILES) {
    const asset = await client.assets.upload(
      "image",
      createReadStream(join(PUB, file)),
      { filename: file }
    );
    assetIds[file] = asset._id;
    console.log(`  ✔ ${file} → ${asset._id}`);
  }

  const img = (file: string, alt: string) => ({
    _type: "image",
    asset: { _type: "reference", _ref: assetIds[file] },
    alt,
  });

  const pilares = [
    {
      _key: "pilar-industria",
      _type: "pilar",
      icono: "Factory",
      titulo: "Industria y manufactura",
      descripcion:
        "Trabajamos junto a las empresas más importantes del sector industrial de Baja California para ofrecer a nuestros estudiantes prácticas reales, proyectos colaborativos y acceso directo al mercado laboral.",
      aliados: ["ENGEL", "HASCO", "Sybridge Technologies"],
      imagen: img(
        "innovate-baja-connect.jpg",
        "Innovate Baja Connect — ENGEL · HASCO · Sybridge"
      ),
    },
    {
      _key: "pilar-deporte",
      _type: "pilar",
      icono: "Trophy",
      titulo: "Deporte y cultura",
      descripcion:
        "Impulsamos el talento más allá del aula. Nuestros convenios con organizaciones deportivas abren oportunidades únicas de desarrollo profesional y personal para toda la comunidad CENYCA.",
      aliados: ["Club Deportivo Zonkeys", "CIBACOPA"],
      imagen: img(
        "convenio-zonkeys.jpg",
        "Firma de convenio — Club Deportivo Zonkeys"
      ),
    },
    {
      _key: "pilar-social",
      _type: "pilar",
      icono: "Heart",
      titulo: "Responsabilidad social",
      descripcion:
        "Formamos ciudadanos comprometidos. A través de proyectos de vinculación social, nuestros estudiantes aplican su conocimiento para transformar comunidades y generar impacto real en la región.",
      aliados: [
        "ICF International Community Foundation",
        "Consejo Técnico Escolar",
      ],
      imagen: img("gastronomia-icf.jpg", "Estudiantes de Gastronomía con ICF"),
    },
  ];

  const galeria = [
    {
      _key: "gal-innovate",
      _type: "fotoGaleria",
      titulo: "Innovate Baja Connect en el auditorio de CENYCA",
      empresa: "ENGEL · HASCO · Sybridge",
      imagen: img("innovate-baja-connect.jpg", "Innovate Baja Connect"),
    },
    {
      _key: "gal-zonkeys",
      _type: "fotoGaleria",
      titulo: "Firma de convenio con Zonkeys",
      empresa: "Club Deportivo Zonkeys",
      imagen: img("convenio-zonkeys.jpg", "Firma de convenio con Zonkeys"),
    },
    {
      _key: "gal-icf",
      _type: "fotoGaleria",
      titulo: "Estudiantes de Gastronomía con ICF",
      empresa: "International Community Foundation",
      imagen: img("gastronomia-icf.jpg", "Estudiantes de Gastronomía con ICF"),
    },
    {
      _key: "gal-consejo",
      _type: "fotoGaleria",
      titulo: "Consejo Técnico Escolar de Zona",
      empresa: "Sector Educativo",
      imagen: img("consejo-tecnico.jpg", "Consejo Técnico Escolar"),
    },
    {
      _key: "gal-manufactura",
      _type: "fotoGaleria",
      titulo: "Visita a laboratorio de manufactura",
      empresa: "Industria regional",
      imagen: img("visita-manufactura.jpg", "Visita a laboratorio"),
    },
  ];

  console.log("Aplicando patch a vinculacion-page…");
  await client
    .patch("vinculacion-page")
    // Rellena textos solo si están vacíos (no pisa lo que ya editaste)
    .setIfMissing({
      heroKicker: "Alianzas estratégicas",
      heroDescripcion:
        "Construimos puentes sólidos entre la academia y el mundo real, porque creemos que la mejor forma de aprender es junto a quienes ya están transformando la región.",
      scrollHint: "Conoce más",
      aliadosKicker: "Confían en nosotros",
      aliadosTexto:
        "{n}+ convenios activos con instituciones, industria y sector social",
      pilaresKicker: "Nuestras áreas de colaboración",
      pilaresTitulo: "Tres pilares de vinculación",
      galeriaTitulo: "Momentos de alianza",
      galeriaDescripcion:
        "Cada firma, cada evento y cada proyecto representa un paso más en nuestra apuesta por una educación conectada al mundo real.",
      ctaKicker: "¿Quieres ser parte?",
      ctaTitulo: "Vincula tu empresa con CENYCA",
      ctaDescripcion:
        "Accede a talento formado para la industria, desarrolla proyectos colaborativos y forma parte de una red de aliados que está transformando Baja California.",
      "rector.cargo": "Rector · CENYCA Universidad",
      "rector.cita":
        '"La vinculación no es un complemento de nuestra misión — es parte esencial de ella. Cuando una empresa abre sus puertas a nuestros estudiantes, cuando un organismo confía en nuestro talento, cuando la industria y la academia se sientan en la misma mesa, ocurre algo extraordinario: el aprendizaje se vuelve real. En CENYCA trabajamos cada día para fortalecer estos puentes, porque sabemos que el profesionista que se forma junto al sector productivo es quien verdaderamente transforma su comunidad."',
    })
    // Escribe imágenes y arreglos (confirmados vacíos en el dataset)
    .set({
      heroPoster: img(
        "innovate-baja-connect.jpg",
        "Eventos de vinculación CENYCA"
      ),
      "rector.imagen": img(
        "rector.jpg",
        "Ing. José Alfredo Sánchez Herrera — Rector de CENYCA"
      ),
      pilares,
      galeria,
    })
    .commit();

  console.log("✔ Documento vinculacion-page poblado correctamente.");
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
