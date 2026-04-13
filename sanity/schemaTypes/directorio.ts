import { defineField, defineType } from "sanity";

export const directorio = defineType({
  name: "directorio",
  title: "Directorio",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre completo",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cargo",
      title: "Cargo / Puesto",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "area",
      title: "Área / Departamento",
      type: "string",
      options: {
        list: [
          { title: "Rectoría", value: "rectoria" },
          { title: "Dirección Académica", value: "direccion-academica" },
          { title: "Administración", value: "administracion" },
          { title: "Servicios Escolares", value: "servicios-escolares" },
          { title: "Vinculación", value: "vinculacion" },
          { title: "Tecnologías de la Información", value: "ti" },
          { title: "Recursos Humanos", value: "rh" },
          { title: "Otra", value: "otra" },
        ],
      },
    }),
    defineField({
      name: "campus",
      title: "Campus",
      type: "reference",
      to: [{ type: "campus" }],
      description: "Campus al que pertenece (opcional si es corporativo)",
    }),
    defineField({
      name: "foto",
      title: "Foto",
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
      name: "email",
      title: "Correo electrónico",
      type: "string",
    }),
    defineField({
      name: "telefono",
      title: "Teléfono directo",
      type: "string",
    }),
    defineField({
      name: "extension",
      title: "Extensión",
      type: "string",
    }),
    defineField({
      name: "orden",
      title: "Orden de aparición",
      type: "number",
    }),
    defineField({
      name: "visible",
      title: "¿Visible en el directorio público?",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "nombre",
      subtitle: "cargo",
      media: "foto",
    },
  },
  orderings: [
    {
      title: "Orden de aparición",
      name: "ordenAsc",
      by: [{ field: "orden", direction: "asc" }],
    },
    {
      title: "Nombre A-Z",
      name: "nombreAsc",
      by: [{ field: "nombre", direction: "asc" }],
    },
  ],
});
