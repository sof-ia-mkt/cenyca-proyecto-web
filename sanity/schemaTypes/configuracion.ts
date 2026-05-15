import { defineField, defineType } from "sanity";

export const configuracion = defineType({
  name: "configuracion",
  title: "Configuración General",
  type: "document",
  icon: () => "⚙️",
  // Solo debe existir un documento de configuración (singleton)
  fields: [
    // --- IDENTIDAD ---
    defineField({
      name: "nombreUniversidad",
      title: "Nombre de la universidad",
      type: "string",
      initialValue: "CENYCA Universidad",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slogan",
      title: "Slogan",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo principal",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
    defineField({
      name: "logoBlanco",
      title: "Logo blanco (para fondos oscuros)",
      type: "image",
      options: { hotspot: false },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),

    // --- CONTACTO GENERAL ---
    defineField({
      name: "contacto",
      title: "Contacto general",
      type: "object",
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

    // --- IMÁGENES SECCIÓN "ELIGE TU PROGRAMA" ---
    defineField({
      name: "imagenesPrograma",
      title: "Imágenes — Elige tu Programa",
      description: "Fotos de fondo para cada tarjeta de programa en la página de inicio.",
      type: "object",
      fields: [
        defineField({
          name: "bachillerato",
          title: "Bachillerato CENYCA",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 800 × 520 px",
        }),
        defineField({
          name: "licenciaturas",
          title: "Licenciaturas Ejecutivas",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 800 × 520 px",
        }),
        defineField({
          name: "posgrados",
          title: "Posgrados",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 800 × 360 px",
        }),
        defineField({
          name: "especialidades",
          title: "Especialidades / Educación Continua",
          type: "image",
          options: { hotspot: true },
          description: "Tamaño recomendado: 800 × 360 px",
        }),
      ],
    }),

    // --- IMÁGENES OFERTA ACADÉMICA ---
    defineField({
      name: "imagenesOferta",
      title: "Imágenes — Oferta Académica",
      description: "Fotos de fondo para los bloques grandes de la página /oferta-academica.",
      type: "object",
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
      description: "Se muestra en cada página de carrera. Deja vacío para ocultar la sección.",
      type: "object",
      fields: [
        defineField({
          name: "youtubeId",
          title: "YouTube ID",
          type: "string",
          description: 'Solo el ID, no la URL completa. Ejemplo: "dQw4w9WgXcQ".',
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

    // --- AVISO DE PRIVACIDAD ---
    defineField({
      name: "avisoPrivacidad",
      title: "URL Aviso de Privacidad",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "nombreUniversidad",
      media: "logo",
    },
  },
});
