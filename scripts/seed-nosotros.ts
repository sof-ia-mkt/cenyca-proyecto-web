/**
 * Crea y puebla el documento singleton `nosotros-page` con el contenido de la
 * página /nosotros, subiendo imágenes y videos de /public/nosotros a Sanity.
 *
 * Ejecutar con:
 *   npx sanity exec scripts/seed-nosotros.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { createReadStream } from "fs";
import { join } from "path";

const client = getCliClient({ apiVersion: "2024-01-01" });
const PUB = join(process.cwd(), "public", "nosotros");

const IMAGENES = [
  "casa-blanca-laboratorio-robotica.jpg",
  "director-martin-arreola.jpg",
  "casa-blanca-arranque-maquinaria.jpg",
  "casa-blanca-arranque-comunidad.jpg",
  "casa-blanca-laboratorio-ossur.jpg",
  "casa-blanca-auditorio-smk.jpg",
  "graduacion-zonkeys.jpg",
] as const;

const VIDEOS = [
  "campus-casa-blanca-etapa-1.mp4",
  "campus-casa-blanca-etapa-2.mp4",
] as const;

async function main() {
  console.log("Subiendo imágenes…");
  const img: Record<string, string> = {};
  for (const file of IMAGENES) {
    const asset = await client.assets.upload("image", createReadStream(join(PUB, file)), { filename: file });
    img[file] = asset._id;
    console.log(`  ✔ ${file}`);
  }

  console.log("Subiendo videos…");
  const vid: Record<string, string> = {};
  for (const file of VIDEOS) {
    const asset = await client.assets.upload("file", createReadStream(join(PUB, file)), { filename: file });
    vid[file] = asset._id;
    console.log(`  ✔ ${file}`);
  }

  const imagen = (file: string, alt: string) => ({
    _type: "image",
    asset: { _type: "reference", _ref: img[file] },
    alt,
  });
  const archivo = (file: string) => ({
    _type: "file",
    asset: { _type: "reference", _ref: vid[file] },
  });

  console.log("Creando documento nosotros-page…");
  await client.createOrReplace({
    _id: "nosotros-page",
    _type: "nosotros",

    heroKicker: "Nuestra historia",
    heroTitulo: "Lo que un día fue un sueño, hoy es CENYCA.",
    heroFrase:
      "Desde 2007 transformando la educación en la frontera — de un centro de capacitación en Tijuana a una universidad líder en Baja California.",
    heroImagen: imagen("casa-blanca-laboratorio-robotica.jpg", "Campus Casa Blanca de CENYCA Universidad"),

    historiaKicker: "De dónde venimos",
    historiaTitulo: "Una historia de no rendirse",
    historiaLead: "Empezó como un sueño en Tijuana — y no hemos dejado de construirlo.",
    historiaParrafos:
      "En 2007, CENYCA nació de una convicción simple: que estudiar no debía depender de qué tan lejos quedara la universidad. Empezamos pequeños — un centro de capacitación que ayudaba a jóvenes a dar su siguiente paso, cerca de casa.\n\n" +
      "No fue un camino recto. Hubo años difíciles, decisiones arriesgadas y más de una caída. Pero cada vez nos levantamos, porque entendimos algo que nos cambió para siempre: la educación tiene que adaptarse a la vida real, no al revés.\n\n" +
      "Por eso obtuvimos el aval de la SEP, abrimos las puertas a quienes querían retomar sus estudios y, en 2019, dimos el salto más grande: nos convertimos formalmente en CENYCA Universidad. En 2024 levantamos Campus Casa Blanca, un edificio pensado desde cero para la ingeniería que la frontera necesita.\n\n" +
      "Hoy somos una universidad líder en Baja California, con 4 campus y más de 3,200 alumnos. Pero seguimos siendo lo mismo que en 2007: gente que cree que el talento de la frontera merece un lugar donde crecer.",
    historiaCierre:
      "Esta historia la escribe cada estudiante que cruza nuestras puertas — y apenas comienza.",

    directorImagen: imagen("director-martin-arreola.jpg", "Ing. Jesús Martín Arreola, Director General de CENYCA Universidad"),
    directorCita:
      "No tienen idea de cuántas veces nos hemos caído y nos hemos levantado, pero lo más importante es que vamos avanzando. Esto no se va a quedar solo en infraestructura — me estoy construyendo mi propia Disneylandia de las ingenierías.",
    directorNombre: "Ing. Jesús Martín Arreola",
    directorCargo: "Director General · CENYCA Universidad",

    cbKicker: "Nuestra casa",
    cbTitulo: "Casa Blanca: el sueño hecho realidad",
    cbDescripcion:
      "No fue fácil. Detrás de cada muro de Campus Casa Blanca hay años de esfuerzo y la convicción de que la frontera merecía una universidad a su altura. Así se construyó — etapa por etapa.",
    cbVideo1: archivo("campus-casa-blanca-etapa-1.mp4"),
    cbVideo1Label: "Campus Casa Blanca · Primera etapa",
    cbVideo2: archivo("campus-casa-blanca-etapa-2.mp4"),
    cbVideo2Label: "Campus Casa Blanca · Segunda etapa",
    cbGaleria: [
      { _type: "fotoGaleria", _key: "g1", imagen: imagen("casa-blanca-arranque-maquinaria.jpg", "El inicio de la obra"), titulo: "El inicio de la obra" },
      { _type: "fotoGaleria", _key: "g2", imagen: imagen("casa-blanca-arranque-comunidad.jpg", "Nuestra comunidad"), titulo: "Nuestra comunidad" },
      { _type: "fotoGaleria", _key: "g3", imagen: imagen("casa-blanca-laboratorio-robotica.jpg", "Laboratorios de ingeniería"), titulo: "Laboratorios de ingeniería" },
      { _type: "fotoGaleria", _key: "g4", imagen: imagen("casa-blanca-laboratorio-ossur.jpg", "Laboratorios especializados"), titulo: "Laboratorios especializados" },
      { _type: "fotoGaleria", _key: "g5", imagen: imagen("casa-blanca-auditorio-smk.jpg", "Espacios para crecer"), titulo: "Espacios para crecer" },
      { _type: "fotoGaleria", _key: "g6", imagen: imagen("graduacion-zonkeys.jpg", "Nuestros egresados"), titulo: "Nuestros egresados" },
    ],

    campusKicker: "Dónde estamos",
    campusTitulo: "4 campus en Baja California",
    campusDescripcion:
      "Crecimos para estar cerca de ti. Tres campus en Tijuana y uno en Tecate, cada uno con la calidad CENYCA.",
    campusLista: [
      { _type: "campusItem", _key: "c1", nombre: "Campus Casa Blanca", ciudad: "Tijuana", direccion: "Blvd. Casa Blanca 5530, Col. Matamoros, 22206 Tijuana, B.C.", principal: true },
      { _type: "campusItem", _key: "c2", nombre: "Campus Otay", ciudad: "Tijuana", direccion: "Calz. del Tecnológico 2016, Local 16, Otay Constituyentes, 22457 Tijuana, B.C.", principal: false },
      { _type: "campusItem", _key: "c3", nombre: "Plantel Palmas", ciudad: "Tijuana", direccion: "Blvd. Gustavo Díaz Ordaz 4141, San Carlos, 22106 Tijuana, B.C.", principal: false },
      { _type: "campusItem", _key: "c4", nombre: "Plantel Tecate", ciudad: "Tecate", direccion: "C. F 908, Moderna, 21450 Tecate, B.C.", principal: false },
    ],

    mision:
      "Formar profesionistas de excelencia con sólidos conocimientos técnicos, valores éticos y visión empresarial, capaces de impulsar el desarrollo socioeconómico de Baja California y de México, a través de una educación pertinente, flexible e innovadora.",
    vision:
      "Ser la universidad privada líder en el noroeste de México, reconocida por la calidad de sus egresados, la pertinencia de sus programas y su estrecha vinculación con el sector productivo e industrial de la región.",
    valoresTitulo: "Nuestros valores",
    valores: [
      { _type: "valor", _key: "v1", icono: "Star", titulo: "Excelencia", descripcion: "Buscamos los más altos estándares académicos en cada programa que ofrecemos." },
      { _type: "valor", _key: "v2", icono: "Users", titulo: "Compromiso", descripcion: "Con el desarrollo personal y profesional de cada uno de nuestros estudiantes." },
      { _type: "valor", _key: "v3", icono: "CheckCircle", titulo: "Integridad", descripcion: "Formamos profesionistas con valores éticos sólidos para la vida y el trabajo." },
      { _type: "valor", _key: "v4", icono: "BookOpen", titulo: "Innovación", descripcion: "Actualizamos continuamente nuestros planes de estudio junto con la industria local." },
      { _type: "valor", _key: "v5", icono: "Landmark", titulo: "Pertinencia", descripcion: "Respondemos a las necesidades reales del mercado laboral del noroeste del país." },
      { _type: "valor", _key: "v6", icono: "MapPin", titulo: "Arraigo regional", descripcion: "Orgullosos de aportar al crecimiento económico de Baja California." },
    ],

    ctaTitulo: "Sé parte de esta historia",
    ctaDescripcion:
      "El siguiente capítulo de CENYCA lo escribes tú. Conoce nuestra oferta académica y da el primer paso.",
    ctaBoton1Texto: "Conoce la oferta académica",
    ctaBoton1Url: "/oferta-academica",
    ctaBoton2Texto: "Proceso de admisión",
    ctaBoton2Url: "/admisiones",
  });

  console.log("✔ Documento nosotros-page creado y poblado.");
}

main().catch((err) => {
  console.error("Error:", err.message || err);
  process.exit(1);
});
