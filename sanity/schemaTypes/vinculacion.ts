import { defineField, defineType } from "sanity";

/**
 * Singleton — solo puede existir UN documento con ID fijo "vinculacion-page".
 */
export const vinculacion = defineType({
  name: "vinculacion",
  title: "Vinculación (Página)",
  type: "document",
  icon: () => "🤝",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "rector", title: "Mensaje del Rector" },
    { name: "pilares", title: "Pilares" },
    { name: "galeria", title: "Galería" },
    { name: "cta", title: "CTA empresas" },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroKicker",
      title: "Kicker",
      type: "string",
      group: "hero",
      initialValue: "Alianzas estratégicas",
    }),
    defineField({
      name: "heroTitulo",
      title: "Título principal",
      type: "string",
      group: "hero",
      initialValue: "Vinculación",
    }),
    defineField({
      name: "heroDescripcion",
      title: "Descripción",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue:
        "Construimos puentes sólidos entre la academia y el mundo real, porque creemos que la mejor forma de aprender es junto a quienes ya están transformando la región.",
    }),

    // ── Rector ───────────────────────────────────────────────────────────────
    defineField({
      name: "rector",
      title: "Mensaje del Rector",
      type: "object",
      group: "rector",
      fields: [
        defineField({
          name: "nombre",
          title: "Nombre",
          type: "string",
          initialValue: "Ing. José Alfredo Sánchez Herrera",
        }),
        defineField({
          name: "cargo",
          title: "Cargo",
          type: "string",
          initialValue: "Rector · CENYCA Universidad",
        }),
        defineField({
          name: "cita",
          title: "Cita / Mensaje",
          type: "text",
          rows: 8,
        }),
        defineField({
          name: "imagen",
          title: "Foto del Rector",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
          ],
        }),
      ],
    }),

    // ── Pilares ──────────────────────────────────────────────────────────────
    defineField({
      name: "pilaresTitulo",
      title: "Título sección pilares",
      type: "string",
      group: "pilares",
      initialValue: "Tres pilares de vinculación",
    }),
    defineField({
      name: "pilaresKicker",
      title: "Kicker sección pilares",
      type: "string",
      group: "pilares",
      initialValue: "Nuestras áreas de colaboración",
    }),
    defineField({
      name: "pilares",
      title: "Pilares",
      type: "array",
      group: "pilares",
      of: [
        {
          type: "object",
          name: "pilar",
          fields: [
            defineField({
              name: "icono",
              title: "Ícono",
              type: "string",
              options: {
                list: [
                  { title: "Industria (Factory)", value: "Factory" },
                  { title: "Deporte (Trophy)", value: "Trophy" },
                  { title: "Responsabilidad social (Heart)", value: "Heart" },
                  { title: "Educación (GraduationCap)", value: "GraduationCap" },
                  { title: "Comunidad (Users)", value: "Users" },
                  { title: "Innovación (Lightbulb)", value: "Lightbulb" },
                  { title: "Global (Globe)", value: "Globe" },
                ],
                layout: "dropdown",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "titulo",
              title: "Título",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "descripcion",
              title: "Descripción",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "aliados",
              title: "Aliados",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
            defineField({
              name: "imagen",
              title: "Imagen",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
              ],
            }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "icono", media: "imagen" },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // ── Galería ──────────────────────────────────────────────────────────────
    defineField({
      name: "galeriaTitulo",
      title: "Título sección galería",
      type: "string",
      group: "galeria",
      initialValue: "Momentos de alianza",
    }),
    defineField({
      name: "galeriaDescripcion",
      title: "Descripción galería",
      type: "text",
      rows: 2,
      group: "galeria",
      initialValue:
        "Cada firma, cada evento y cada proyecto representa un paso más en nuestra apuesta por una educación conectada al mundo real.",
    }),
    defineField({
      name: "galeria",
      title: "Galería (la 1ª foto sale en grande)",
      type: "array",
      group: "galeria",
      of: [
        {
          type: "object",
          name: "fotoGaleria",
          fields: [
            defineField({
              name: "imagen",
              title: "Imagen",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "titulo",
              title: "Título / descripción corta",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "empresa",
              title: "Empresa / aliado",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "empresa", media: "imagen" },
          },
        },
      ],
    }),

    // ── CTA ──────────────────────────────────────────────────────────────────
    defineField({
      name: "ctaKicker",
      title: "Kicker CTA",
      type: "string",
      group: "cta",
      initialValue: "¿Quieres ser parte?",
    }),
    defineField({
      name: "ctaTitulo",
      title: "Título CTA",
      type: "string",
      group: "cta",
      initialValue: "Vincula tu empresa con CENYCA",
    }),
    defineField({
      name: "ctaDescripcion",
      title: "Descripción CTA",
      type: "text",
      rows: 3,
      group: "cta",
      initialValue:
        "Accede a talento formado para la industria, desarrolla proyectos colaborativos y forma parte de una red de aliados que está transformando Baja California.",
    }),
    defineField({
      name: "ctaMensajeWhatsapp",
      title: "Mensaje WhatsApp (pre-rellenado)",
      type: "text",
      rows: 2,
      group: "cta",
      initialValue:
        "Hola, mi empresa está interesada en establecer un convenio de vinculación con CENYCA Universidad.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Vinculación (Página)" }),
  },
});
