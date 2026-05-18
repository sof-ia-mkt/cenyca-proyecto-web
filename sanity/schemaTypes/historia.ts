import { defineField, defineType } from "sanity";

/**
 * Singleton — solo puede existir UN documento con ID fijo "historia".
 * Se edita siempre desde el mismo lugar en el studio.
 */
export const historia = defineType({
  name: "historia",
  title: "Historia / Nosotros (Home)",
  type: "document",
  icon: () => "📜",
  fields: [
    defineField({
      name: "kicker",
      title: "Kicker (texto pequeño arriba del título)",
      type: "string",
      initialValue: "Nuestra historia",
    }),
    defineField({
      name: "headline",
      title: "Título principal (h2)",
      type: "string",
      initialValue:
        "De centro de enseñanza a universidad líder en Baja California.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parrafo",
      title: "Párrafo introductorio",
      type: "text",
      rows: 3,
      initialValue:
        "Desde 2007 formando talento en Tijuana. Hoy, 4 campus en Baja California y más de 3,200 alumnos construyendo su futuro con nosotros.",
    }),
    defineField({
      name: "ctaTexto",
      title: "Texto del botón CTA",
      type: "string",
      initialValue: "Conoce nuestra historia completa",
    }),
    defineField({
      name: "ctaUrl",
      title: "URL del CTA",
      description: 'Ej: "/nosotros" o un link completo',
      type: "string",
      initialValue: "/nosotros",
    }),
    defineField({
      name: "momentos",
      title: "Momentos (5 fotos en orden)",
      description:
        "Posición 1 = Foto GRANDE (protagonista). Posiciones 2, 3, 4 = fotos pequeñas. Posición 5 = foto ancha (parte inferior).",
      type: "array",
      of: [
        {
          type: "object",
          name: "momento",
          title: "Momento",
          fields: [
            defineField({
              name: "year",
              title: "Año / Etiqueta corta",
              description: 'Ej: "2007", "2010s", "Hoy"',
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption (descripción corta)",
              description: "1 línea, lo que aparece sobre la foto",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "descripcion",
              title: "Descripción larga (aparece al abrir la foto)",
              description: "2-4 oraciones que se muestran cuando el usuario hace clic en la imagen.",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "imagen",
              title: "Imagen",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Texto alternativo (accesibilidad)",
                  type: "string",
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "year", subtitle: "caption", media: "imagen" },
          },
        },
      ],
      validation: (Rule) => Rule.length(5).error("Necesitas exactamente 5 momentos."),
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return { title: "Historia (Home)", subtitle: title };
    },
  },
});
