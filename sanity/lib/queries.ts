import { groq } from 'next-sanity'

// ─── Carreras ─────────────────────────────────────────────────────────────────

export const todasCarrerasQuery = groq`
  *[_type == "carrera" && activa == true] | order(orden asc) {
    _id,
    nombre,
    "slug": slug.current,
    area,
    grado,
    modalidades,
    descripcionCorta,
    color
  }
`

export const carreraBySlugQuery = groq`
  *[_type == "carrera" && slug.current == $slug && activa == true][0] {
    _id,
    nombre,
    "slug": slug.current,
    area,
    grado,
    modalidades,
    duracion,
    descripcionCorta,
    descripcionLarga,
    beneficios,
    perfilEgresado,
    campoLaboral,
    color,
    "imagenUrl": imagen.asset->url
  }
`

// ─── Campus ───────────────────────────────────────────────────────────────────

export const todosCampusQuery = groq`
  *[_type == "campus" && activo == true] | order(orden asc) {
    _id,
    nombre,
    ciudad,
    direccion,
    telefono,
    whatsapp,
    horario,
    esPrincipal,
    urlMaps
  }
`

// ─── Configuración ────────────────────────────────────────────────────────────

export const configuracionQuery = groq`
  *[_type == "configuracion" && _id == "configuracion-general"][0] {
    nombreUniversidad,
    contacto,
    redesSociales,
    sistemas,
    "heroSlides": heroSlides[] {
      titulo,
      subtitulo,
      ctaTexto,
      ctaUrl,
      "imagenUrl": imagen.asset->url,
      "imagenLqip": imagen.asset->metadata.lqip
    },
    "imagenesPrograma": {
      "bachillerato": imagenesPrograma.bachillerato.asset->url,
      "licenciaturas": imagenesPrograma.licenciaturas.asset->url,
      "posgrados": imagenesPrograma.posgrados.asset->url,
      "especialidades": imagenesPrograma.especialidades.asset->url
    }
  }
`

// ─── Noticias ────────────────────────────────────────────────────────────────

export const ultimasNoticiasQuery = groq`
  *[_type == "noticia"] | order(fecha desc) [0...3] {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    imagen
  }
`

export const todasNoticiasQuery = groq`
  *[_type == "noticia"] | order(fecha desc) {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    imagen
  }
`

export const noticiaBySlugQuery = groq`
  *[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    imagen,
    contenido
  }
`

export const todosDocumentosQuery = groq`
  *[_type == "documento"] | order(_createdAt desc) {
    _id,
    titulo,
    slug,
    descripcion,
    categoria,
    "archivoUrl": archivo.asset->url
  }
`

export const todosAvisosQuery = groq`
  *[_type == "avisoPrivacidad"] | order(fecha desc) {
    _id,
    titulo,
    slug,
    fecha
  }
`
