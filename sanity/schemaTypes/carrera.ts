import { defineField, defineType } from "sanity";

export const carrera = defineType({
  name: "carrera",
  title: "Carreras",
  type: "document",
  icon: () => "🎓",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre de la carrera",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description: "Se genera automáticamente del nombre. Ejemplo: ingenieria-mecatronica",
      options: { source: "nombre", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "area",
      title: "Área académica",
      type: "string",
      options: {
        list: [
          { title: "Ingeniería", value: "ingenieria" },
          { title: "Negocios", value: "negocios" },
          { title: "Ciencias Sociales", value: "ciencias-sociales" },
          { title: "Ciencias de la Salud", value: "ciencias-salud" },
          { title: "Gastronomía", value: "gastronomia" },
          { title: "Educación", value: "educacion" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "grado",
      title: "Grado académico",
      type: "string",
      options: {
        list: [
          { title: "Licenciatura", value: "licenciatura" },
          { title: "Ingeniería", value: "ingenieria" },
          { title: "Especialidad", value: "especialidad" },
          { title: "Maestría", value: "maestria" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "modalidades",
      title: "Modalidades disponibles",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Escolarizado", value: "escolarizado" },
          { title: "Ejecutivo", value: "ejecutivo" },
          { title: "En línea", value: "en-linea" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "duracion",
      title: "Duración",
      type: "string",
      description: "Ejemplo: 3 años (12 cuatrimestres)",
      initialValue: "3 años (12 cuatrimestres)",
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta",
      description: "Aparece en tarjetas y listados. Máximo 160 caracteres.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción completa",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagen",
      title: "Imagen principal (hero)",
      description:
        "Foto épica de la carrera. Se usa como hero de la página individual /carreras/[slug] y, si no defines la imagen de tarjeta abajo, también en los listados.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "imagenTarjeta",
      title: "Imagen para tarjetas/listados (opcional)",
      description:
        "Imagen alternativa para cards en /ingenierias, /licenciaturas, /oferta-academica y home. Útil si la imagen principal es muy abierta/cinematográfica y no queda bien en cards chicas. Si se deja vacía, los listados usan la imagen principal.",
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
      name: "color",
      title: "Color acento (para la tarjeta)",
      description: "Hex del color de esta carrera. Ejemplo: #00D4FF",
      type: "string",
      initialValue: "#00D4FF",
    }),
    defineField({
      name: "beneficios",
      title: "Beneficios del programa",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "icono", title: "Ícono (emoji)", type: "string" }),
            defineField({ name: "titulo", title: "Título", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 2 }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "descripcion" },
          },
        },
      ],
    }),
    defineField({
      name: "perfilEgresado",
      title: "Perfil de egresado",
      description: "Lista de competencias y habilidades del egresado",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "campoLaboral",
      title: "Campo laboral",
      description: "Áreas o empresas donde puede trabajar el egresado",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "galeria",
      title: "Galería del programa",
      description:
        "Fotos de laboratorios, talleres, equipos y alumnos en práctica. Recomendado: 6 imágenes (se muestran en grid 3×2). Sube entre 3 y 8.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "landingUrl",
      title: "URL de la landing page actual",
      description: "Si tienes una landing dedicada, ponla aquí.",
      type: "url",
    }),
    defineField({
      name: "orden",
      title: "Orden de aparición",
      type: "number",
      description: "Número para ordenar las carreras en el listado. Menor número = aparece primero.",
    }),
    defineField({
      name: "activa",
      title: "¿Carrera activa?",
      type: "boolean",
      description: "Desactiva para ocultar temporalmente sin eliminar.",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "titulo", title: "Título SEO", type: "string", validation: (Rule) => Rule.max(60) }),
        defineField({ name: "descripcion", title: "Meta descripción", type: "text", rows: 2, validation: (Rule) => Rule.max(160) }),
        defineField({ name: "imagen", title: "OG Image", type: "image" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "nombre",
      subtitle: "grado",
      media: "imagen",
    },
    prepare({ title, subtitle, media }) {
      const grados: Record<string, string> = {
        licenciatura: "Licenciatura",
        ingenieria: "Ingeniería",
        especialidad: "Especialidad",
        maestria: "Maestría",
      };
      return {
        title,
        subtitle: grados[subtitle] ?? subtitle,
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
    {
      title: "Nombre A-Z",
      name: "nombreAsc",
      by: [{ field: "nombre", direction: "asc" }],
    },
  ],
});
