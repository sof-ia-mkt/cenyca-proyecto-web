import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Cache 5 min. Cuando subes contenido nuevo en Sanity aparece en el
// buscador automáticamente al expirar el cache (sin redeploy).
export const revalidate = 300;

export type SearchItem = {
  id: string;
  title: string;
  description?: string;
  body?: string;
  category: "Carreras" | "Noticias" | "Avisos" | "Páginas";
  href: string;
};

const PAGINAS_ESTATICAS: SearchItem[] = [
  {
    id: "page-home",
    title: "Inicio",
    description: "CENYCA Universidad — Ingenierías y Licenciaturas con RVOE SEP en Baja California.",
    category: "Páginas",
    href: "/",
  },
  {
    id: "page-oferta",
    title: "Oferta Académica",
    description: "Todos los programas de licenciatura e ingeniería con validez SEP.",
    body: "carreras programas licenciaturas ingenierias planes estudio",
    category: "Páginas",
    href: "/oferta-academica",
  },
  {
    id: "page-licenciaturas",
    title: "Licenciaturas",
    description: "Licenciaturas con RVOE en Tijuana y Tecate.",
    category: "Páginas",
    href: "/licenciaturas",
  },
  {
    id: "page-ingenierias",
    title: "Ingenierías",
    description: "Ingenierías con RVOE en Tijuana y Tecate.",
    category: "Páginas",
    href: "/ingenierias",
  },
  {
    id: "page-nosotros",
    title: "Nosotros",
    description: "Historia, misión y valores de CENYCA Universidad.",
    body: "historia mision vision valores quienes somos acerca about",
    category: "Páginas",
    href: "/nosotros",
  },
  {
    id: "page-vinculacion",
    title: "Vinculación",
    description: "Convenios, alianzas y programas de vinculación con la industria.",
    body: "convenios alianzas empresas industria deportes vinculacion",
    category: "Páginas",
    href: "/vinculacion",
  },
  {
    id: "page-noticias",
    title: "Noticias",
    description: "Últimas noticias y eventos de CENYCA Universidad.",
    category: "Páginas",
    href: "/noticias",
  },
  {
    id: "page-documentos",
    title: "Documentos",
    description: "Documentos institucionales y trámites.",
    category: "Páginas",
    href: "/documentos",
  },
  {
    id: "page-avisos",
    title: "Avisos de Privacidad",
    description: "Avisos de privacidad de CENYCA Universidad.",
    category: "Páginas",
    href: "/avisos-de-privacidad",
  },
  {
    id: "page-faq",
    title: "Preguntas frecuentes",
    description: "RVOE, becas, horarios, inscripción, titulación y más.",
    body: "faq preguntas frecuentes dudas rvoe becas horarios inscripcion titulacion modalidad cuatrimestre revalidacion convenios",
    category: "Páginas",
    href: "/preguntas-frecuentes",
  },
  {
    id: "page-contacto",
    title: "Contacto",
    description: "Inscríbete o solicita información.",
    body: "inscripcion inscripciones admisiones contacto telefono whatsapp",
    category: "Páginas",
    href: "/#contacto",
  },
  {
    id: "page-planteles",
    title: "Planteles y Campus",
    description: "Conoce nuestros campus en Tijuana y Tecate.",
    body: "campus plantel casa blanca palmas otay tecate ubicaciones direccion",
    category: "Páginas",
    href: "/#planteles",
  },
];

const AREA_LABEL: Record<string, string> = {
  ingenieria: "Ingeniería",
  negocios: "Negocios",
  "ciencias-sociales": "Ciencias Sociales",
  gastronomia: "Gastronomía",
  educacion: "Educación",
  "ciencias-salud": "Ciencias de la Salud",
};

const carrerasQuery = groq`*[_type == "carrera" && activa == true]{
  _id,
  nombre,
  "slug": slug.current,
  area,
  grado,
  descripcionCorta,
  perfilEgresado,
  "campoLaboral": campoLaboral[]{
    titulo,
    descripcion
  }
}`;

const noticiasQuery = groq`*[_type == "noticia"] | order(fecha desc){
  _id,
  titulo,
  "slug": slug.current,
  resumen,
  "contenidoText": pt::text(contenido)
}`;

const avisosQuery = groq`*[_type == "avisoPrivacidad"]{
  _id,
  titulo,
  "slug": slug.current
}`;

export async function GET() {
  const [carreras, noticias, avisos] = await Promise.all([
    client
      .fetch<
        Array<{
          _id: string;
          nombre: string;
          slug: string;
          area?: string;
          grado?: string;
          descripcionCorta?: string;
          perfilEgresado?: string[];
          campoLaboral?: Array<{ titulo?: string; descripcion?: string }>;
        }>
      >(carrerasQuery)
      .catch(() => []),
    client
      .fetch<
        Array<{
          _id: string;
          titulo: string;
          slug: string;
          resumen?: string;
          contenidoText?: string;
        }>
      >(noticiasQuery)
      .catch(() => []),
    client
      .fetch<Array<{ _id: string; titulo: string; slug: string }>>(avisosQuery)
      .catch(() => []),
  ]);

  const carreraItems: SearchItem[] = carreras
    .filter((c) => c.slug && c.nombre)
    .map((c) => ({
      id: c._id,
      title: c.nombre,
      description: c.descripcionCorta,
      body: [
        c.area ? AREA_LABEL[c.area] ?? c.area : "",
        c.grado ?? "",
        ...(c.perfilEgresado ?? []),
        ...(c.campoLaboral ?? []).flatMap((cl) => [cl.titulo ?? "", cl.descripcion ?? ""]),
      ]
        .filter(Boolean)
        .join(" "),
      category: "Carreras",
      href: `/carreras/${c.slug}`,
    }));

  const noticiaItems: SearchItem[] = noticias
    .filter((n) => n.slug && n.titulo)
    .map((n) => ({
      id: n._id,
      title: n.titulo,
      description: n.resumen,
      body: n.contenidoText?.slice(0, 1500),
      category: "Noticias",
      href: `/noticias/${n.slug}`,
    }));

  const avisoItems: SearchItem[] = avisos
    .filter((a) => a.slug && a.titulo)
    .map((a) => ({
      id: a._id,
      title: a.titulo,
      category: "Avisos",
      href: `/avisos-de-privacidad/${a.slug}`,
    }));

  const items: SearchItem[] = [
    ...PAGINAS_ESTATICAS,
    ...carreraItems,
    ...noticiaItems,
    ...avisoItems,
  ];

  return NextResponse.json(
    { items, generatedAt: new Date().toISOString(), count: items.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
