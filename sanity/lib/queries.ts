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
    duracion,
    descripcionCorta,
    color,
    "imagenUrl": imagen.asset->url,
    "imagenTarjetaUrl": imagenTarjeta.asset->url
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
    "campoLaboral": campoLaboral[]{
      titulo,
      descripcion
    },
    color,
    "imagenUrl": imagen.asset->url,
    "imagenAlt": imagen.alt,
    "imagenLqip": imagen.asset->metadata.lqip,
    "heroVideoUrl": heroVideo.asset->url,
    "galeria": galeria[]{
      "url": asset->url,
      "alt": alt,
      "lqip": asset->metadata.lqip,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    inversion{
      activa,
      inscripcionBase,
      paqueteCuatrimestral,
      paqueteCuatrimestralTecate,
      mostrarToggleCampus,
      plantelesDisponibles,
      mensajeAparta,
      disclaimer,
      cards[]{
        tipo, tag, destacada, etiquetaDestacada,
        diaPrincipal, diaSecundario, horario,
        horarioCasaBlanca, horarioOtros, ocultarDomingoEnOtay, soloCasaBlanca,
        mensualidadBase, mensualidadEspecial, notaEspecial,
        labelToggleEspecial, labelToggleRegular,
        becasOpciones, sinReinscripcion, ctaLabel
      }
    },
    "seo": {
      "titulo": seo.titulo,
      "descripcion": seo.descripcion,
      "imagenUrl": seo.imagen.asset->url
    }
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
    urlMaps,
    "imagenUrl": imagen.asset->url,
    "galeria": galeria[]{
      "url": asset->url,
      alt
    }
  }
`

// ─── Configuración ────────────────────────────────────────────────────────────

export const configuracionQuery = groq`
  *[_type == "configuracion" && _id == "configuracion-general"][0] {
    nombreUniversidad,
    contacto,
    redesSociales,
    sistemas,
    navegacion,
    seo {
      tituloBase,
      descripcion,
      "ogImageUrl": ogImage.asset->url
    },
    "heroSlides": heroSlides[] {
      titulo,
      subtitulo,
      ctaTexto,
      ctaUrl,
      "imagenUrl": imagen.asset->url,
      "imagenLqip": imagen.asset->metadata.lqip
    },
    "imagenesOferta": {
      "ingenierias": imagenesOferta.ingenierias.asset->url,
      "licenciaturas": imagenesOferta.licenciaturas.asset->url
    },
    stats[]{ valor, prefijo, sufijo, label },
    promocionInscripcion{
      activa,
      porcentaje,
      kicker,
      titulo,
      subtitulo,
      mensajeComprobante,
      diasExpiracion,
      whatsappAsesor
    },
    cicloInicio{
      activo,
      fecha,
      kicker,
      slogan,
      mensaje,
      mensajeCicloIniciado
    },
    "videoTestimonial": select(
      defined(videoTestimonial.videoArchivo.asset) || defined(videoTestimonial.youtubeId) => {
        "videoArchivoUrl": videoTestimonial.videoArchivo.asset->url,
        "youtubeId": videoTestimonial.youtubeId,
        "kicker": videoTestimonial.kicker,
        "titulo": videoTestimonial.titulo,
        "subtitulo": videoTestimonial.subtitulo,
        "nombreEgresado": videoTestimonial.nombreEgresado,
        "descripcionEgresado": videoTestimonial.descripcionEgresado,
        "thumbnailUrl": videoTestimonial.thumbnailCustom.asset->url
      },
      null
    )
  }
`

// ─── Noticias ────────────────────────────────────────────────────────────────

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

export const noticiasHomeQuery = groq`
  *[_type == "noticia"] | order(fecha desc) [0...8] {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    imagen
  }
`

// ─── Historia / Nosotros (singleton) ────────────────────────────────────────

export const historiaHomeQuery = groq`
  *[_type == "historia" && _id == "historia-home"][0] {
    kicker,
    headline,
    parrafo,
    ctaTexto,
    ctaUrl,
    "momentos": momentos[] {
      year,
      caption,
      descripcion,
      "imagenUrl": imagen.asset->url,
      "alt": imagen.alt
    }
  }
`

// ─── Vinculación (singleton) ─────────────────────────────────────────────────

export const vinculacionPageQuery = groq`
  *[_type == "vinculacion" && _id == "vinculacion-page"][0] {
    heroKicker,
    heroTitulo,
    heroDescripcion,
    "heroVideoUrl": heroVideo.asset->url,
    "heroPosterUrl": heroPoster.asset->url,
    "heroPosterAlt": heroPoster.alt,
    "heroPosterLqip": heroPoster.asset->metadata.lqip,
    heroStats[]{ valor, sufijo, label, color },
    scrollHint,
    aliadosKicker,
    aliadosTexto,
    rector{
      nombre,
      cargo,
      cita,
      "imagenUrl": imagen.asset->url,
      "imagenAlt": imagen.alt,
      "imagenLqip": imagen.asset->metadata.lqip
    },
    pilaresKicker,
    pilaresTitulo,
    "pilares": pilares[]{
      icono,
      titulo,
      descripcion,
      aliados,
      "imagenUrl": imagen.asset->url,
      "imagenAlt": imagen.alt,
      "imagenLqip": imagen.asset->metadata.lqip
    },
    galeriaTitulo,
    galeriaDescripcion,
    "galeria": galeria[]{
      titulo,
      empresa,
      "imagenUrl": imagen.asset->url,
      "imagenAlt": imagen.alt,
      "imagenLqip": imagen.asset->metadata.lqip
    },
    ctaKicker,
    ctaTitulo,
    ctaDescripcion,
    ctaEmailAsunto,
    ctaEmailCuerpo,
    contacto{ nombre, cargo, email }
  }
`

export const noticiaBySlugQuery = groq`
  *[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    extracto,
    imagen,
    "contenido": contenido[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions,
        "alt": coalesce(alt, "")
      }
    }
  }
`

export const noticiasRelacionadasQuery = groq`
  *[_type == "noticia" && slug.current != $slug] | order(
    select(categoria == $categoria => 0, 1), fecha desc
  )[0...3] {
    _id,
    titulo,
    slug,
    fecha,
    categoria,
    imagen
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

export const avisoBySlugQuery = groq`
  *[_type == "avisoPrivacidad" && slug.current == $slug][0] {
    _id,
    titulo,
    slug,
    fecha,
    contenido
  }
`

// ─── Nosotros (singleton) ────────────────────────────────────────────────────

export const nosotrosPageQuery = groq`
  *[_type == "nosotros" && _id == "nosotros-page"][0] {
    heroKicker,
    heroTitulo,
    heroFrase,
    "heroImagenUrl": heroImagen.asset->url,
    "heroImagenAlt": heroImagen.alt,
    historiaKicker,
    historiaTitulo,
    historiaLead,
    historiaParrafos,
    historiaCierre,
    "directorImagenUrl": directorImagen.asset->url,
    "directorImagenAlt": directorImagen.alt,
    directorCita,
    directorNombre,
    directorCargo,
    cbKicker,
    cbTitulo,
    cbDescripcion,
    "cbVideo1Url": cbVideo1.asset->url,
    cbVideo1Label,
    "cbVideo2Url": cbVideo2.asset->url,
    cbVideo2Label,
    "cbGaleria": cbGaleria[]{
      "imagenUrl": imagen.asset->url,
      "imagenAlt": imagen.alt,
      titulo
    },
    campusKicker,
    campusTitulo,
    campusDescripcion,
    "campusLista": campusLista[]{ nombre, ciudad, direccion, principal },
    mision,
    vision,
    valoresTitulo,
    "valores": valores[]{ icono, titulo, descripcion },
    ctaTitulo,
    ctaDescripcion,
    ctaBoton1Texto,
    ctaBoton1Url,
    ctaBoton2Texto,
    ctaBoton2Url
  }
`

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const faqsQuery = groq`
  {
    "categorias": *[_type == "categoriaFaq"] | order(orden asc){
      _id,
      nombre,
      "slug": slug.current,
      icono,
      descripcion,
      orden
    },
    "faqs": *[_type == "faq" && activa == true] | order(orden asc){
      _id,
      pregunta,
      respuesta,
      destacada,
      orden,
      "categoriaId": categoria._ref,
      "categoriaSlug": categoria->slug.current
    }
  }
`
