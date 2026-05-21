import { defineField, defineType } from "sanity";

export const categoriaFaq = defineType({
  name: "categoriaFaq",
  title: "Categoría de FAQ",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      description: "Ej: Inversión y becas, Inscripción, Titulación",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (ancla URL)",
      description: "Identificador en minúsculas con guiones. Se usa como ancla (#inscripcion).",
      type: "slug",
      options: { source: "nombre", maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "icono",
      title: "Icono (nombre de Lucide)",
      description:
        "Nombre exacto de un icono de Lucide. Ej: GraduationCap, DollarSign, ClipboardList, Briefcase, Award, BookOpen, MapPin, HelpCircle.",
      type: "string",
      initialValue: "HelpCircle",
    }),
    defineField({
      name: "descripcion",
      title: "Descripción corta",
      description: "Texto breve que aparece bajo el título de la categoría.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "orden",
      title: "Orden",
      description: "Menor = primero. Controla el orden de las categorías en la página.",
      type: "number",
      initialValue: 10,
    }),
  ],
  preview: {
    select: { title: "nombre", subtitle: "descripcion", media: "icono" },
  },
  orderings: [
    { title: "Orden manual", name: "ordenAsc", by: [{ field: "orden", direction: "asc" }] },
  ],
});
