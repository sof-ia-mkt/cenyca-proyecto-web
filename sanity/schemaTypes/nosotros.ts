import { defineField, defineType } from "sanity";

/**
 * Singleton — solo un documento con ID fijo "nosotros-page".
 * Controla todo el contenido de la página /nosotros.
 */
const imagenConAlt = (extra?: Record<string, unknown>) => ({
  type: "image" as const,
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
  ],
  ...extra,
});

export const nosotros = defineType({
  name: "nosotros",
  title: "Nosotros (Página)",
  type: "document",
  icon: () => "🏛️",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "historia", title: "Historia" },
    { name: "director", title: "Mensaje del Director" },
    { name: "casablanca", title: "Casa Blanca" },
    { name: "campus", title: "Campus" },
    { name: "mvv", title: "Misión, Visión y Valores" },
    { name: "cta", title: "CTA final" },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: "heroKicker",
      title: "Kicker (texto pequeño arriba)",
      type: "string",
      group: "hero",
      initialValue: "Nuestra historia",
    }),
    defineField({
      name: "heroTitulo",
      title: "Título principal",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Lo que un día fue un sueño, hoy es CENYCA.",
    }),
    defineField({
      name: "heroFrase",
      title: "Frase de apoyo",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroImagen",
      title: "Imagen de fondo del hero",
      description: "Foto a pantalla completa detrás del título. Ideal: una toma potente del campus.",
      group: "hero",
      ...imagenConAlt(),
    }),

    // ── Historia ─────────────────────────────────────────────────────────────
    defineField({
      name: "historiaKicker",
      title: "Kicker",
      type: "string",
      group: "historia",
      initialValue: "De dónde venimos",
    }),
    defineField({
      name: "historiaTitulo",
      title: "Título",
      type: "string",
      group: "historia",
      initialValue: "Una historia de no rendirse",
    }),
    defineField({
      name: "historiaLead",
      title: "Frase destacada (lead)",
      description: "La frase grande en negrita al inicio del relato.",
      type: "text",
      rows: 2,
      group: "historia",
    }),
    defineField({
      name: "historiaParrafos",
      title: "Relato",
      description:
        "El cuerpo de la historia. Separa cada párrafo con una línea en blanco. Los años (2007, 2019, 2024…) se resaltan en color automáticamente.",
      type: "text",
      rows: 14,
      group: "historia",
    }),
    defineField({
      name: "historiaCierre",
      title: "Frase de cierre",
      description: "La frase motivacional final, resaltada en color.",
      type: "text",
      rows: 2,
      group: "historia",
    }),

    // ── Mensaje del Director ─────────────────────────────────────────────────
    defineField({
      name: "directorImagen",
      title: "Foto del Director",
      group: "director",
      ...imagenConAlt(),
    }),
    defineField({
      name: "directorCita",
      title: "Cita / mensaje",
      type: "text",
      rows: 6,
      group: "director",
    }),
    defineField({
      name: "directorNombre",
      title: "Nombre",
      type: "string",
      group: "director",
      initialValue: "Ing. Jesús Martín Arreola",
    }),
    defineField({
      name: "directorCargo",
      title: "Cargo",
      type: "string",
      group: "director",
      initialValue: "Director General · CENYCA Universidad",
    }),

    // ── Casa Blanca ──────────────────────────────────────────────────────────
    defineField({
      name: "cbKicker",
      title: "Kicker",
      type: "string",
      group: "casablanca",
      initialValue: "Nuestra casa",
    }),
    defineField({
      name: "cbTitulo",
      title: "Título",
      type: "string",
      group: "casablanca",
      initialValue: "Casa Blanca: el sueño hecho realidad",
    }),
    defineField({
      name: "cbDescripcion",
      title: "Descripción",
      type: "text",
      rows: 3,
      group: "casablanca",
    }),
    defineField({
      name: "cbVideo1",
      title: "Video — Primera etapa",
      description: "Archivo MP4. Recomendado: 720p, comprimido (<20 MB).",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      group: "casablanca",
    }),
    defineField({
      name: "cbVideo1Label",
      title: "Etiqueta del video 1",
      type: "string",
      group: "casablanca",
      initialValue: "Campus Casa Blanca · Primera etapa",
    }),
    defineField({
      name: "cbVideo2",
      title: "Video — Segunda etapa",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      group: "casablanca",
    }),
    defineField({
      name: "cbVideo2Label",
      title: "Etiqueta del video 2",
      type: "string",
      group: "casablanca",
      initialValue: "Campus Casa Blanca · Segunda etapa",
    }),
    defineField({
      name: "cbGaleria",
      title: "Galería",
      description: "Fotos del campus. Recomendado: 6 imágenes.",
      type: "array",
      group: "casablanca",
      of: [
        {
          type: "object",
          name: "fotoGaleria",
          fields: [
            defineField({ ...imagenConAlt(), name: "imagen", title: "Imagen" }),
            defineField({ name: "titulo", title: "Título corto", type: "string" }),
          ],
          preview: { select: { title: "titulo", media: "imagen" } },
        },
      ],
    }),

    // ── Campus ───────────────────────────────────────────────────────────────
    defineField({
      name: "campusKicker",
      title: "Kicker",
      type: "string",
      group: "campus",
      initialValue: "Dónde estamos",
    }),
    defineField({
      name: "campusTitulo",
      title: "Título",
      type: "string",
      group: "campus",
      initialValue: "4 campus en Baja California",
    }),
    defineField({
      name: "campusDescripcion",
      title: "Descripción",
      type: "text",
      rows: 2,
      group: "campus",
    }),
    defineField({
      name: "campusLista",
      title: "Lista de campus",
      type: "array",
      group: "campus",
      of: [
        {
          type: "object",
          name: "campusItem",
          fields: [
            defineField({ name: "nombre", title: "Nombre", type: "string" }),
            defineField({ name: "ciudad", title: "Ciudad", type: "string" }),
            defineField({ name: "direccion", title: "Dirección", type: "text", rows: 2 }),
            defineField({ name: "principal", title: "¿Campus principal?", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "nombre", subtitle: "ciudad" } },
        },
      ],
    }),

    // ── Misión, Visión y Valores ─────────────────────────────────────────────
    defineField({
      name: "mision",
      title: "Misión",
      type: "text",
      rows: 4,
      group: "mvv",
    }),
    defineField({
      name: "vision",
      title: "Visión",
      type: "text",
      rows: 4,
      group: "mvv",
    }),
    defineField({
      name: "valoresTitulo",
      title: "Título de la sección de valores",
      type: "string",
      group: "mvv",
      initialValue: "Nuestros valores",
    }),
    defineField({
      name: "valores",
      title: "Valores",
      type: "array",
      group: "mvv",
      of: [
        {
          type: "object",
          name: "valor",
          fields: [
            defineField({
              name: "icono",
              title: "Ícono",
              type: "string",
              options: {
                list: [
                  { title: "Estrella (Excelencia)", value: "Star" },
                  { title: "Personas (Compromiso)", value: "Users" },
                  { title: "Check (Integridad)", value: "CheckCircle" },
                  { title: "Libro (Innovación)", value: "BookOpen" },
                  { title: "Institución (Pertinencia)", value: "Landmark" },
                  { title: "Ubicación (Arraigo)", value: "MapPin" },
                ],
              },
            }),
            defineField({ name: "titulo", title: "Título", type: "string" }),
            defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "titulo", subtitle: "icono" } },
        },
      ],
    }),

    // ── CTA final ────────────────────────────────────────────────────────────
    defineField({
      name: "ctaTitulo",
      title: "Título",
      type: "string",
      group: "cta",
      initialValue: "Sé parte de esta historia",
    }),
    defineField({
      name: "ctaDescripcion",
      title: "Descripción",
      type: "text",
      rows: 2,
      group: "cta",
    }),
    defineField({
      name: "ctaBoton1Texto",
      title: "Botón 1 — texto",
      type: "string",
      group: "cta",
      initialValue: "Conoce la oferta académica",
    }),
    defineField({
      name: "ctaBoton1Url",
      title: "Botón 1 — enlace",
      type: "string",
      group: "cta",
      initialValue: "/oferta-academica",
    }),
    defineField({
      name: "ctaBoton2Texto",
      title: "Botón 2 — texto",
      type: "string",
      group: "cta",
      initialValue: "Proceso de admisión",
    }),
    defineField({
      name: "ctaBoton2Url",
      title: "Botón 2 — enlace",
      type: "string",
      group: "cta",
      initialValue: "/admisiones",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Nosotros (Página)" }),
  },
});
