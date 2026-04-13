import { defineField, defineType } from "sanity";

export const campus = defineType({
  name: "campus",
  title: "Campus / Planteles",
  type: "document",
  icon: () => "🏫",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre del plantel",
      type: "string",
      description: "Ejemplo: Campus Tijuana Este",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "nombre", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ciudad",
      title: "Ciudad",
      type: "string",
      options: {
        list: [
          { title: "Tijuana", value: "tijuana" },
          { title: "Tecate", value: "tecate" },
          { title: "Ensenada", value: "ensenada" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "direccion",
      title: "Dirección completa",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "telefono",
      title: "Teléfono",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      description: "Número con código de país. Ejemplo: 526641234567",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Correo electrónico",
      type: "string",
    }),
    defineField({
      name: "horario",
      title: "Horario de atención",
      type: "string",
      description: "Ejemplo: Lunes a Viernes 8:00 - 20:00 | Sábado 9:00 - 14:00",
    }),
    defineField({
      name: "urlMaps",
      title: "URL de Google Maps",
      type: "url",
      description: "Link de Google Maps para este plantel",
    }),
    defineField({
      name: "embedMaps",
      title: "Embed de Google Maps",
      type: "text",
      rows: 3,
      description: "Código src del iframe de Google Maps (solo el src, sin el tag iframe)",
    }),
    defineField({
      name: "imagen",
      title: "Foto del campus",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "esPrincipal",
      title: "¿Es el campus principal?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "activo",
      title: "¿Campus activo?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "orden",
      title: "Orden de aparición",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "nombre",
      subtitle: "ciudad",
      media: "imagen",
    },
    prepare({ title, subtitle, media }) {
      const ciudades: Record<string, string> = {
        tijuana: "Tijuana",
        tecate: "Tecate",
        ensenada: "Ensenada",
      };
      return {
        title,
        subtitle: ciudades[subtitle] ?? subtitle,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Orden de aparición",
      name: "ordenAsc",
      by: [{ field: "orden", direction: "asc" }],
    },
  ],
});
