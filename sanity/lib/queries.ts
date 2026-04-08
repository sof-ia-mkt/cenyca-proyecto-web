import { groq } from 'next-sanity'

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
