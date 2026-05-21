import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({
      name: "pregunta",
      title: "Pregunta",
      description: "Redactada exactamente como un prospecto la haría. Termina con signo de interrogación.",
      type: "string",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "respuesta",
      title: "Respuesta",
      description:
        "Texto enriquecido. Puedes usar negritas, listas, enlaces y separar en párrafos. Sé claro y directo (2-6 oraciones idealmente).",
      type: "array",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [
            { title: "Lista con viñetas", value: "bullet" },
            { title: "Lista numerada", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Negrita", value: "strong" },
              { title: "Cursiva", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Enlace",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (r) =>
                      r.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
                  }),
                ],
              },
            ],
          },
        },
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoría",
      type: "reference",
      to: [{ type: "categoriaFaq" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "orden",
      title: "Orden dentro de la categoría",
      description: "Menor = aparece primero.",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "activa",
      title: "¿Activa?",
      description: "Si está apagada, no se muestra en el sitio.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "destacada",
      title: "¿Destacada?",
      description: "Las destacadas aparecen marcadas y pueden mostrarse en bloques resumidos (homepage, footer).",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "pregunta", subtitle: "categoria.nombre", activa: "activa" },
    prepare: ({ title, subtitle, activa }) => ({
      title: activa ? title : `🚫 ${title}`,
      subtitle: subtitle ?? "Sin categoría",
    }),
  },
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
    { title: "Pregunta (A→Z)", name: "preguntaAsc", by: [{ field: "pregunta", direction: "asc" }] },
  ],
});
