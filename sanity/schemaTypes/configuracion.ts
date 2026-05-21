import { defineField, defineType } from "sanity";

export const configuracion = defineType({
  name: "configuracion",
  title: "Configuración General",
  type: "document",
  icon: () => "⚙️",
  // Solo debe existir un documento de configuración (singleton)
  groups: [
    { name: "identidad", title: "Identidad y contacto", default: true },
    { name: "navegacion", title: "Navegación" },
    { name: "seo", title: "SEO" },
    { name: "home", title: "Home" },
    { name: "carrera", title: "Páginas de carrera" },
    { name: "imagenes", title: "Imágenes de secciones" },
  ],
  fields: [
    // --- IDENTIDAD ---
    defineField({
      name: "nombreUniversidad",
      title: "Nombre de la universidad",
      type: "string",
      group: "identidad",
      initialValue: "CENYCA Universidad",
      validation: (Rule) => Rule.required(),
    }),

    // --- NAVEGACIÓN ---
    defineField({
      name: "navegacion",
      title: "Visibilidad del menú",
      description:
        "Controla qué secciones aparecen en el menú principal. Apaga las que aún no están listas; vuelve a prenderlas cuando publiques el contenido.",
      type: "object",
      group: "navegacion",
      fields: [
        defineField({
          name: "mostrarVidaEstudiantil",
          title: "Mostrar 'Vida Estudiantil' en el menú",
          type: "boolean",
          initialValue: false,
          description: "Apaga si la página aún no está lista para publicarse.",
        }),
      ],
    }),

    // --- CONTACTO GENERAL ---
    defineField({
      name: "contacto",
      title: "Contacto general",
      type: "object",
      group: "identidad",
      fields: [
        defineField({ name: "telefono", title: "Teléfono principal", type: "string" }),
        defineField({ name: "whatsapp", title: "WhatsApp (con código de país)", type: "string", description: "Ejemplo: 526641234567" }),
        defineField({ name: "email", title: "Email de contacto", type: "string" }),
        defineField({ name: "emailAdmisiones", title: "Email de admisiones", type: "string" }),
      ],
    }),

    // --- REDES SOCIALES ---
    defineField({
      name: "redesSociales",
      title: "Redes sociales",
      type: "object",
      group: "identidad",
      fields: [
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "twitter", title: "X / Twitter URL", type: "url" }),
      ],
    }),

    // --- LINKS DEL SISTEMA ---
    defineField({
      name: "sistemas",
      title: "Links a sistemas internos",
      type: "object",
      group: "identidad",
      fields: [
        defineField({ name: "plataformaAlumnos", title: "Plataforma Alumnos URL", type: "url", initialValue: "https://alumnos.cenyca.edu.mx" }),
        defineField({ name: "inscripciones", title: "Portal de Inscripciones URL", type: "url", initialValue: "https://inscripciones.cenyca.edu.mx" }),
        defineField({ name: "sige", title: "SIGE URL", type: "url", initialValue: "https://sige.cenyca.edu.mx" }),
      ],
    }),

    // --- POPUP DE PROMOCIÓN ---
    defineField({
      name: "popupPromo",
      title: "Popup de promoción",
      description:
        "Imagen de fondo que aparece en el popup de promoción del home (al scrollear).",
      type: "object",
      group: "home",
      fields: [
        defineField({
          name: "imagen",
          title: "Imagen de fondo del popup",
          description: "Recomendado: 1080x1080 o más, vertical/cuadrada se ve mejor.",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
          ],
        }),
      ],
    }),

    // --- SEO GLOBAL ---
    defineField({
      name: "seo",
      title: "SEO Global",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "tituloBase", title: "Título base del sitio", type: "string", initialValue: "CENYCA Universidad" }),
        defineField({ name: "descripcion", title: "Meta descripción global", type: "text", rows: 2, validation: (Rule) => Rule.max(160) }),
        defineField({ name: "ogImage", title: "OG Image por defecto", type: "image" }),
      ],
    }),

    // --- HERO / CARRUSEL ---
    defineField({
      name: "heroSlides",
      title: "Hero / Carrusel",
      description: "Imágenes y texto que aparecen en el carrusel principal de la página de inicio.",
      type: "array",
      group: "home",
      of: [
        {
          type: "object",
          name: "slide",
          title: "Slide",
          fields: [
            defineField({
              name: "imagen",
              title: "Imagen de fondo",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "titulo",
              title: "Título principal",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "subtitulo",
              title: "Subtítulo",
              type: "string",
            }),
            defineField({
              name: "ctaTexto",
              title: "Texto del botón",
              type: "string",
              description: 'Ejemplo: "Inscríbete ahora"',
            }),
            defineField({
              name: "ctaUrl",
              title: "Link del botón",
              type: "string",
              description: 'Ejemplo: /admisiones o https://inscripciones.cenyca.edu.mx',
            }),
          ],
          preview: {
            select: { title: "titulo", media: "imagen" },
          },
        },
      ],
    }),

    // --- IMÁGENES OFERTA ACADÉMICA ---
    defineField({
      name: "imagenesOferta",
      title: "Imágenes — Oferta Académica",
      description: "Fotos de fondo para los bloques grandes de la página /oferta-academica.",
      type: "object",
      group: "imagenes",
      fields: [
        defineField({
          name: "ingenierias",
          title: "Ingenierías",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 1600 × 1200 px. Sugerencia: brazo robótico, CNC, circuitos, laboratorio técnico.",
        }),
        defineField({
          name: "licenciaturas",
          title: "Licenciaturas",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 1600 × 1200 px. Sugerencia: escena ejecutiva, laptops, reunión moderna.",
        }),
      ],
    }),

    // --- STATS / CIFRAS INSTITUCIONALES ---
    defineField({
      name: "stats",
      title: "Cifras institucionales",
      description: "Aparecen como contadores animados en las páginas de carrera. Recomendado: 3 o 4 cifras.",
      type: "array",
      group: "carrera",
      of: [
        {
          type: "object",
          name: "stat",
          title: "Cifra",
          fields: [
            defineField({
              name: "valor",
              title: "Valor numérico",
              type: "number",
              description: "Solo el número. Ejemplo: 25, 98, 50.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "prefijo",
              title: "Prefijo",
              type: "string",
              description: 'Opcional. Ejemplo: "+", "$".',
            }),
            defineField({
              name: "sufijo",
              title: "Sufijo",
              type: "string",
              description: 'Opcional. Ejemplo: "%", "k", "+".',
            }),
            defineField({
              name: "label",
              title: "Etiqueta",
              type: "string",
              description: 'Ejemplo: "Años formando profesionistas".',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { valor: "valor", sufijo: "sufijo", label: "label" },
            prepare({ valor, sufijo, label }) {
              return { title: `${valor ?? ""}${sufijo ?? ""}`, subtitle: label };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // --- VIDEO TESTIMONIAL ---
    defineField({
      name: "videoTestimonial",
      title: "Video testimonial",
      description:
        "Se muestra en cada página de carrera. Deja vacío para ocultar la sección. Si subes archivo MP4 Y pones YouTube ID, gana el MP4.",
      type: "object",
      group: "carrera",
      fields: [
        defineField({
          name: "videoArchivo",
          title: "Archivo de video (MP4)",
          description:
            "Súbelo aquí para servirlo desde el CDN de Sanity (sin marca de agua de YouTube). Recomendado: 720p, h.264, máximo 30 MB.",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
        }),
        defineField({
          name: "youtubeId",
          title: "YouTube ID (alternativa)",
          type: "string",
          description:
            'Si no subiste archivo, puedes usar YouTube. Solo el ID, no la URL completa. Ejemplo: "dQw4w9WgXcQ".',
        }),
        defineField({
          name: "kicker",
          title: "Kicker",
          type: "string",
          description: 'Texto pequeño arriba del título. Ejemplo: "Historias CENYCA".',
          initialValue: "Historias CENYCA",
        }),
        defineField({
          name: "titulo",
          title: "Título de la sección",
          type: "string",
          initialValue: "Conoce a quienes ya viven CENYCA",
        }),
        defineField({
          name: "subtitulo",
          title: "Subtítulo",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "nombreEgresado",
          title: "Nombre del egresado",
          type: "string",
        }),
        defineField({
          name: "descripcionEgresado",
          title: "Descripción del egresado",
          type: "string",
          description: 'Ejemplo: "Ing. Mecatrónico, Generación 2023".',
        }),
        defineField({
          name: "thumbnailCustom",
          title: "Thumbnail custom (opcional)",
          description: "Si no la subes, se usa la portada que YouTube genera automáticamente.",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    // --- PROMOCIÓN / FORMULARIO DE INSCRIPCIÓN ---
    defineField({
      name: "promocionInscripcion",
      title: "Promoción de inscripción (formulario en páginas de carrera)",
      description:
        "Configura el formulario de captura de leads que aparece en cada página de carrera, con la promoción y el mensaje del comprobante para WhatsApp.",
      type: "object",
      group: "carrera",
      fields: [
        defineField({
          name: "activa",
          title: "¿Promoción activa?",
          description: "Apaga para ocultar el formulario de todas las páginas de carrera.",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "porcentaje",
          title: "Porcentaje de descuento",
          description: 'Solo el número. Ejemplo: 20 para "20% de descuento".',
          type: "number",
          initialValue: 20,
          validation: (Rule) => Rule.min(1).max(100),
        }),
        defineField({
          name: "kicker",
          title: "Kicker (texto pequeño arriba del título)",
          type: "string",
          initialValue: "Descuento de inscripción",
        }),
        defineField({
          name: "titulo",
          title: "Título de la sección",
          description: 'Ejemplo: "Reclama tu descuento del 20%". Puedes usar {porcentaje} y se reemplaza automáticamente.',
          type: "string",
          initialValue: "Reclama tu descuento del {porcentaje}% en tu inscripción",
        }),
        defineField({
          name: "subtitulo",
          title: "Subtítulo",
          type: "text",
          rows: 2,
          initialValue: "Solo por tiempo limitado para nuevos alumnos. Deja tus datos y un asesor te contactará por WhatsApp.",
        }),
        defineField({
          name: "mensajeComprobante",
          title: "Mensaje del comprobante",
          description: "Texto grande que aparece en la pantalla de confirmación, indicando qué hacer con el comprobante.",
          type: "string",
          initialValue: "Envía este comprobante a tu asesor o preséntalo al inscribirte",
        }),
        defineField({
          name: "diasExpiracion",
          title: "Días de validez del descuento",
          description: "Número de días que la promoción es válida desde el registro. Aparece en el comprobante como fecha de expiración.",
          type: "number",
          initialValue: 30,
          validation: (Rule) => Rule.min(1).max(365),
        }),
        defineField({
          name: "whatsappAsesor",
          title: "WhatsApp del asesor (opcional)",
          description:
            "Número al que se enviará el comprobante por WhatsApp. Si lo dejas vacío se usa el WhatsApp del contacto general. Formato con código de país, ejemplo: 526631300236.",
          type: "string",
        }),
      ],
    }),

    // --- CTA CONTADOR DE INICIO DE CICLO ---
    defineField({
      name: "cicloInicio",
      title: "CTA de inicio de ciclo (banner del home)",
      description:
        "Banner con countdown al próximo inicio de clases y formulario de captura, debajo de Modalidades en el home. Configurable porque los ciclos cambian (enero / mayo / septiembre).",
      type: "object",
      group: "home",
      fields: [
        defineField({
          name: "activo",
          title: "¿Mostrar sección?",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "fecha",
          title: "Fecha y hora del inicio de clases",
          description: "Define a qué fecha cuenta hacia atrás el contador.",
          type: "datetime",
        }),
        defineField({
          name: "kicker",
          title: "Kicker (texto pequeño arriba)",
          type: "string",
          description: 'Ejemplo: "Iniciamos clases en septiembre".',
          initialValue: "Iniciamos clases en septiembre",
        }),
        defineField({
          name: "slogan",
          title: "Slogan grande (Bebas)",
          type: "string",
          initialValue: "Donde tu potencial se vuelve éxito",
        }),
        defineField({
          name: "mensaje",
          title: "Mensaje del formulario",
          description: "Texto debajo del contador antes del formulario.",
          type: "string",
          initialValue: "Deja tus datos y obtén un {porcentaje}% de descuento en tu inscripción",
        }),
        defineField({
          name: "mensajeCicloIniciado",
          title: "Mensaje cuando el ciclo ya inició",
          description:
            'Reemplaza al contador cuando la fecha ya pasó. Ejemplo: "Próximo ciclo: pregunta por WhatsApp".',
          type: "string",
          initialValue: "El ciclo actual ya inició. Pregunta por el próximo por WhatsApp.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "nombreUniversidad",
    },
  },
});
