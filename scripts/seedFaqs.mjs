// Crea categorías y preguntas frecuentes en Sanity.
// Idempotente: si vuelve a correrse, reemplaza por _id (no duplica).

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "1zsi1hi5",
  dataset: "production",
  apiVersion: "2026-04-07",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Helpers para PortableText
let blockKey = 0;
const k = () => `k${Date.now()}${++blockKey}`;

function block(children, listItem = undefined) {
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs: [],
    children,
    ...(listItem ? { listItem, level: 1 } : {}),
  };
}
function span(text, marks = []) {
  return { _type: "span", _key: k(), text, marks };
}
function p(text) {
  return block([span(text)]);
}
function pBold(parts) {
  // parts: [{ text, bold? }]
  return block(
    parts.map((part) =>
      span(part.text, part.bold ? ["strong"] : []),
    ),
  );
}
function bullet(text) {
  return block([span(text)], "bullet");
}

// ── Categorías ────────────────────────────────────────────────────────────────
const CATEGORIAS = [
  {
    _id: "cat-faq-universidad",
    nombre: "Sobre CENYCA Universidad",
    slug: "universidad",
    icono: "BookOpen",
    descripcion:
      "Qué somos, dónde estamos y noticias recientes de la institución.",
    orden: 10,
  },
  {
    _id: "cat-faq-validez",
    nombre: "Validez oficial y RVOE",
    slug: "validez",
    icono: "ShieldCheck",
    descripcion:
      "Reconocimiento de Validez Oficial de Estudios y validez del título.",
    orden: 20,
  },
  {
    _id: "cat-faq-modalidad",
    nombre: "Modalidad y horarios",
    slug: "modalidad",
    icono: "Clock",
    descripcion:
      "Modalidad cuatrimestral, horarios disponibles y formato de las clases.",
    orden: 30,
  },
  {
    _id: "cat-faq-inscripcion",
    nombre: "Inscripción y admisión",
    slug: "inscripcion",
    icono: "ClipboardList",
    descripcion: "Requisitos, ciclos de admisión y proceso de inscripción.",
    orden: 40,
  },
  {
    _id: "cat-faq-inversion",
    nombre: "Inversión y becas",
    slug: "inversion",
    icono: "DollarSign",
    descripcion: "Becas, formas de pago y esquemas de apoyo económico.",
    orden: 50,
  },
  {
    _id: "cat-faq-vinculacion",
    nombre: "Vinculación y bolsa de trabajo",
    slug: "vinculacion",
    icono: "Briefcase",
    descripcion: "Convenios, prácticas y colocación en el mercado laboral.",
    orden: 60,
  },
  {
    _id: "cat-faq-trayectoria",
    nombre: "Trayectoria académica",
    slug: "trayectoria",
    icono: "GitBranch",
    descripcion:
      "Cambios de carrera, revalidación de materias y movilidad dentro de CENYCA.",
    orden: 70,
  },
  {
    _id: "cat-faq-titulacion",
    nombre: "Titulación",
    slug: "titulacion",
    icono: "Award",
    descripcion: "Modalidades y requisitos para obtener tu título profesional.",
    orden: 80,
  },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
const FAQS = [
  // Universidad
  {
    _id: "faq-que-es-cenyca",
    cat: "cat-faq-universidad",
    pregunta: "¿Qué es CENYCA Universidad?",
    destacada: true,
    respuesta: [
      p(
        "CENYCA Universidad es una institución de educación superior privada que ofrece licenciaturas, ingenierías, especialidades y maestrías con validez oficial, enfocadas en responder a las necesidades del mercado laboral del noroeste del país.",
      ),
      p(
        "Nació en Tijuana en 2007 como centro de capacitación y hoy cuenta con varios campus en Baja California.",
      ),
    ],
  },
  {
    _id: "faq-campus-cenyca",
    cat: "cat-faq-universidad",
    pregunta: "¿En qué ciudades tiene campus CENYCA Universidad?",
    respuesta: [
      p(
        "CENYCA tiene presencia en Baja California con campus en Tijuana y Tecate, además de sedes que se han ido ampliando en la región. Actualmente la institución se encuentra en expansión, con un nuevo plantel de gran capacidad en construcción en Tijuana.",
      ),
    ],
  },
  {
    _id: "faq-noticias-recientes",
    cat: "cat-faq-universidad",
    pregunta: "¿Qué noticias recientes hay sobre CENYCA Universidad?",
    respuesta: [
      p(
        "En 2024 se colocó la primera piedra de un nuevo plantel de CENYCA en Tijuana, con más de 20 mil m² y una fuerte inversión en laboratorios para áreas de ingeniería e industria.",
      ),
      p(
        "En 2026, alrededor de 300 nuevos profesionistas egresaron de CENYCA en una ceremonia celebrada en la Arena de Tijuana.",
      ),
    ],
  },

  // Validez oficial / RVOE
  {
    _id: "faq-rvoe",
    cat: "cat-faq-validez",
    pregunta: "¿CENYCA Universidad cuenta con RVOE?",
    destacada: true,
    respuesta: [
      p(
        "Sí. Todas nuestras carreras cuentan con su respectivo RVOE (Reconocimiento de Validez Oficial de Estudios).",
      ),
    ],
  },
  {
    _id: "faq-rvoe-estatal-federal",
    cat: "cat-faq-validez",
    pregunta: "¿El RVOE de CENYCA es federal o estatal?",
    destacada: true,
    respuesta: [
      pBold([
        { text: "Nuestro RVOE es " },
        { text: "estatal", bold: true },
        {
          text:
            ", otorgado por la Secretaría de Educación del Gobierno de Baja California.",
        },
      ]),
      p(
        "Conforme a la Ley General de Educación, los estudios con RVOE válidamente otorgado —federal o estatal— tienen reconocimiento oficial en todo el territorio nacional, por lo que tu título tiene validez fuera de Baja California para continuar estudios o ejercer profesionalmente.",
      ),
    ],
  },

  // Modalidad y horarios
  {
    _id: "faq-modalidad-cuatrimestral",
    cat: "cat-faq-modalidad",
    pregunta: "¿Cómo es la modalidad universitaria en CENYCA?",
    destacada: true,
    respuesta: [
      pBold([
        { text: "Modalidad ", bold: false },
        { text: "cuatrimestral", bold: true },
        { text: ". " },
        {
          text:
            "Todas nuestras carreras concluyen en 3 años con 9 cuatrimestres, lo que te permite titularte antes que en el modelo semestral tradicional.",
        },
      ]),
    ],
  },
  {
    _id: "faq-modalidad-presencial-linea",
    cat: "cat-faq-modalidad",
    pregunta: "¿CENYCA ofrece carreras en línea o presenciales?",
    respuesta: [
      p("Actualmente todas nuestras carreras son 100% presenciales."),
    ],
  },
  {
    _id: "faq-horarios",
    cat: "cat-faq-modalidad",
    pregunta: "¿Cuáles son los horarios disponibles?",
    destacada: true,
    respuesta: [
      p(
        "Tenemos varias opciones para que elijas la que mejor se adapte a tu vida:",
      ),
      bullet("Escolarizada: lunes a jueves, horario matutino."),
      bullet("Martes: horario vespertino."),
      bullet("Sábados: horario matutino o vespertino."),
      bullet("Domingos: horario matutino."),
    ],
  },

  // Inscripción
  {
    _id: "faq-requisitos-inscripcion",
    cat: "cat-faq-inscripcion",
    pregunta: "¿Cuáles son los requisitos de inscripción?",
    destacada: true,
    respuesta: [
      p("Los documentos básicos para inscribirte son:"),
      bullet("Certificado de preparatoria"),
      bullet("CURP"),
      bullet("INE o identificación oficial"),
      bullet("Comprobante de domicilio"),
      bullet("Acta de nacimiento"),
      p(
        "Para casos especiales (alumnos foráneos, revalidaciones o equivalencias) consulta con un asesor para los requisitos adicionales.",
      ),
    ],
  },
  {
    _id: "faq-inicio-ciclos",
    cat: "cat-faq-inscripcion",
    pregunta: "¿Cuándo inician los ciclos en CENYCA?",
    destacada: true,
    respuesta: [
      pBold([
        { text: "Manejamos " },
        { text: "tres ciclos al año", bold: true },
        { text: ": " },
        { text: "enero, mayo y septiembre", bold: true },
        {
          text:
            ". Esto te permite incorporarte sin esperar un año académico completo.",
        },
      ]),
    ],
  },
  {
    _id: "faq-examen-admision",
    cat: "cat-faq-inscripcion",
    pregunta: "¿Hay examen de admisión?",
    respuesta: [
      p(
        "No. El proceso de admisión en CENYCA no incluye examen de admisión eliminatorio.",
      ),
    ],
  },

  // Inversión y becas
  {
    _id: "faq-becas",
    cat: "cat-faq-inversion",
    pregunta: "¿Qué tipos de becas o apoyos económicos ofrece CENYCA?",
    destacada: true,
    respuesta: [
      p(
        "Manejamos tres niveles de beca, vinculados a un esquema de venta de boletos:",
      ),
      block(
        [
          span("Beca del 10%", ["strong"]),
          span(" — sujeta a venta de "),
          span("10 boletos", ["strong"]),
          span(" (público general)."),
        ],
        "bullet",
      ),
      block(
        [
          span("Beca del 20%", ["strong"]),
          span(" — sujeta a venta de "),
          span("20 boletos", ["strong"]),
          span(" (público general)."),
        ],
        "bullet",
      ),
      block(
        [
          span("Beca del 30%", ["strong"]),
          span(" — sujeta a venta de "),
          span("20 boletos", ["strong"]),
          span(
            " (exclusivo para colaboradores de empresas con convenio previamente autorizado y confirmado).",
          ),
        ],
        "bullet",
      ),
      p(
        "Aplican restricciones. Comunícate con un asesor o con el área académica para más detalles.",
      ),
    ],
  },
  {
    _id: "faq-formas-pago",
    cat: "cat-faq-inversion",
    pregunta: "¿Qué formas de pago aceptan?",
    respuesta: [
      p(
        "Aceptamos pago en efectivo y con tarjeta de débito o crédito. Para más detalles sobre opciones de pago, contacta a un asesor.",
      ),
    ],
  },

  // Vinculación
  {
    _id: "faq-bolsa-trabajo",
    cat: "cat-faq-vinculacion",
    pregunta: "¿CENYCA tiene bolsa de trabajo o convenios con empresas?",
    destacada: true,
    respuesta: [
      pBold([
        { text: "Sí. Contamos con más de " },
        { text: "250 convenios firmados", bold: true },
        { text: " con empresas de la región." },
      ]),
      p(
        "Nuestro enfoque es conectar a los alumnos con el mercado laboral a través de prácticas, vinculación y oportunidades de empleo desde antes de egresar.",
      ),
    ],
  },

  // Trayectoria
  {
    _id: "faq-cambio-carrera",
    cat: "cat-faq-trayectoria",
    pregunta: "¿Puedo cambiar de carrera dentro de CENYCA?",
    respuesta: [
      p(
        "Sí. Antes de hacer el cambio se realiza un análisis de viabilidad con el departamento de Control Escolar para evaluar materias acreditadas, equivalencias y compatibilidad con el nuevo plan de estudios.",
      ),
      p(
        "Aplican restricciones. Comunícate con un asesor para más detalles.",
      ),
    ],
  },
  {
    _id: "faq-revalidacion",
    cat: "cat-faq-trayectoria",
    pregunta: "¿Puedo revalidar materias de otra universidad en CENYCA?",
    respuesta: [
      p(
        "Sí, es posible. Se realiza un análisis previo de tus materias y necesitas presentar la documentación oficial (certificado parcial, kárdex, plan de estudios) ante Control Escolar.",
      ),
      p(
        "Aplican restricciones. Comunícate con un asesor o con el área académica para más detalles.",
      ),
    ],
  },

  // Titulación
  {
    _id: "faq-titulacion",
    cat: "cat-faq-titulacion",
    pregunta: "¿Cuáles son las modalidades de titulación en CENYCA?",
    destacada: true,
    respuesta: [
      p("Ofrecemos dos modalidades de titulación:"),
      block(
        [
          span("Por promedio", ["strong"]),
          span(" — para alumnos con promedio general de "),
          span("9.0 o superior", ["strong"]),
          span(" a lo largo de la carrera."),
        ],
        "bullet",
      ),
      block(
        [
          span("Por tesina", ["strong"]),
          span(
            " — elaboración de un trabajo escrito sobre un tema de tu especialidad.",
          ),
        ],
        "bullet",
      ),
      p(
        "Aplican restricciones. Para conocer requisitos completos, fechas y costos, comunícate con un asesor o con el área académica.",
      ),
    ],
  },
];

// ── Ejecución ─────────────────────────────────────────────────────────────────
console.log("→ Categorías:", CATEGORIAS.length);
console.log("→ FAQs:", FAQS.length);

const tx = client.transaction();

// Categorías
for (const c of CATEGORIAS) {
  tx.createOrReplace({
    _id: c._id,
    _type: "categoriaFaq",
    nombre: c.nombre,
    slug: { _type: "slug", current: c.slug },
    icono: c.icono,
    descripcion: c.descripcion,
    orden: c.orden,
  });
}

// FAQs
let orden = 10;
let lastCat = null;
for (const f of FAQS) {
  if (f.cat !== lastCat) {
    orden = 10;
    lastCat = f.cat;
  }
  tx.createOrReplace({
    _id: f._id,
    _type: "faq",
    pregunta: f.pregunta,
    respuesta: f.respuesta,
    categoria: { _type: "reference", _ref: f.cat },
    orden,
    activa: true,
    destacada: f.destacada ?? false,
  });
  orden += 10;
}

const result = await tx.commit();
console.log(`✓ Commit: ${result.results.length} documentos creados/reemplazados.`);
