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
