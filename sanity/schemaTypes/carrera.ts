import { defineField, defineType } from "sanity";
import { slugOptions, slugValidation } from "../lib/slugValidation";

export const carrera = defineType({
  name: "carrera",
  title: "Carreras",
  type: "document",
  icon: () => "🎓",
  groups: [
    { name: "info", title: "Información", default: true },
    { name: "contenido", title: "Contenido" },
    { name: "imagenes", title: "Imágenes" },
    { name: "inversion", title: "Inversión / Costos" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre de la carrera",
      type: "string",
      group: "info",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "info",
      description: "Se genera automáticamente del nombre. Ejemplo: ingenieria-mecatronica",
      options: slugOptions("nombre"),
      validation: slugValidation,
    }),
    defineField({
      name: "area",
      title: "Área académica",
      type: "string",
      group: "info",
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
      group: "info",
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
      group: "info",
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
      group: "info",
      description: "Ejemplo: 3 años (9 cuatrimestres)",
      initialValue: "3 años (9 cuatrimestres)",
    }),
    defineField({
      name: "descripcionCorta",
      title: "Descripción corta",
      description: "Aparece en tarjetas y listados. Máximo 160 caracteres.",
      type: "text",
      group: "contenido",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción completa",
      type: "array",
      group: "contenido",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagen",
      title: "Imagen principal (hero)",
      description:
        "Foto épica de la carrera. Se usa como hero de la página individual /carreras/[slug] y, si no defines la imagen de tarjeta abajo, también en los listados.",
      type: "image",
      group: "imagenes",
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
      name: "heroVideo",
      title: "Video de hero (fondo del hero)",
      description:
        "Video que aparece como fondo del hero en /carreras/[slug]. Si no subes video, el hero usa la imagen principal como fondo.\n\n" +
        "Recomendaciones:\n" +
        "• Formato: MP4 (H.264) o WebM\n" +
        "• Resolución: 1920×1080 (Full HD) o 1280×720\n" +
        "• Peso ideal: menos de 5 MB (máximo 8 MB). Comprime con Handbrake o ffmpeg antes de subir.\n" +
        "• Duración: 6 a 15 segundos pensados para loop\n" +
        "• Sin audio (se reproduce muted)\n" +
        "• Sin texto quemado dentro del video — el título y los CTAs van encima en el sitio\n" +
        "• Encuadre horizontal con la acción al centro (los lados pueden recortarse en distintos tamaños de pantalla)",
      type: "file",
      group: "imagenes",
      options: {
        accept: "video/mp4,video/webm",
      },
    }),
    defineField({
      name: "imagenTarjeta",
      title: "Imagen para tarjetas/listados (opcional)",
      description:
        "Imagen alternativa para cards en /ingenierias, /licenciaturas, /oferta-academica y home. Útil si la imagen principal es muy abierta/cinematográfica y no queda bien en cards chicas. Si se deja vacía, los listados usan la imagen principal.",
      type: "image",
      group: "imagenes",
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
      group: "info",
      initialValue: "#00D4FF",
    }),
    defineField({
      name: "beneficios",
      title: "Beneficios del programa",
      type: "array",
      group: "contenido",
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
      group: "contenido",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "campoLaboral",
      title: "Campo laboral",
      description: "Áreas o empresas donde puede trabajar el egresado",
      type: "array",
      group: "contenido",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "inversion",
      title: "Inversión / Costos",
      description:
        "Tarjetas con los horarios y costos del programa. Se muestran como sección dedicada en la página de la carrera. Soporta 1 o 2 cards (entre semana, fin de semana) y diferentes precios por campus.",
      type: "object",
      group: "inversion",
      fields: [
        defineField({
          name: "activa",
          title: "¿Mostrar sección?",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "inscripcionBase",
          title: "Costo base de inscripción",
          description: 'Antes del descuento. Ejemplo: 2000 para "Inscripción $2,000".',
          type: "number",
          initialValue: 2000,
        }),
        defineField({
          name: "paqueteCuatrimestral",
          title: "Paquete cuatrimestral (default)",
          description: "Costo del paquete cuatrimestral en planteles regulares (CB, Palmas, Otay).",
          type: "number",
          initialValue: 950,
        }),
        defineField({
          name: "paqueteCuatrimestralTecate",
          title: "Paquete cuatrimestral en Tecate",
          description: "Costo distinto en Tecate. Si no aplica, deja igual al regular.",
          type: "number",
          initialValue: 800,
        }),
        defineField({
          name: "mostrarToggleCampus",
          title: "¿Mostrar selector de plantel?",
          description:
            "Activa si esta carrera se ofrece en varios planteles con horarios o paquetes distintos. Si solo está en un plantel, desactiva.",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "mensajeAparta",
          title: 'Mensaje "Aparta tu lugar" (opcional)',
          type: "text",
          rows: 2,
          description: "Texto destacado debajo del primer pago. Ejemplo del schema de Derecho.",
        }),
        defineField({
          name: "disclaimer",
          title: "Disclaimer",
          type: "string",
          initialValue: "Los costos pueden variar. Becas sujetas a disponibilidad. Contacta a un asesor para más información.",
        }),
        defineField({
          name: "cards",
          title: "Tarjetas",
          description: "1 o 2 cards (entre semana / fin de semana). Cada una con su lógica.",
          type: "array",
          of: [
            {
              type: "object",
              name: "cardInversion",
              fields: [
                defineField({
                  name: "tipo",
                  title: "Tipo de card",
                  type: "string",
                  options: {
                    list: [
                      { title: "Entre semana (martes)", value: "entre-semana" },
                      { title: "Fin de semana", value: "fin-de-semana" },
                    ],
                  },
                  validation: (Rule) => Rule.required(),
                }),
                defineField({ name: "tag", title: "Tag arriba (ej. 'ENTRE SEMANA')", type: "string" }),
                defineField({
                  name: "destacada",
                  title: "Destacada (con etiqueta especial)",
                  type: "boolean",
                  initialValue: false,
                }),
                defineField({
                  name: "etiquetaDestacada",
                  title: 'Etiqueta destacada',
                  type: "string",
                  description: 'Ejemplo: "HORARIO ESTELAR", "MÁS SOLICITADO".',
                }),
                defineField({ name: "diaPrincipal", title: "Día principal (h3)", type: "string", description: 'Ej. "Martes", "Sábado".' }),
                defineField({ name: "diaSecundario", title: "Día secundario (opcional, gris)", type: "string", description: 'Ej. "o Domingo".' }),
                defineField({ name: "horario", title: "Horario default", type: "string", description: 'Ej. "6:00 pm – 9:49 pm" o "Sáb: 1pm-5pm · Dom: 8am-12pm".' }),
                defineField({
                  name: "horarioCasaBlanca",
                  title: "Horario en Casa Blanca (opcional)",
                  type: "string",
                  description: "Si el horario varía por plantel. Solo aplica si Tipo = Fin de semana.",
                }),
                defineField({
                  name: "horarioOtros",
                  title: "Horario en otros planteles (Palmas/Otay/Tecate)",
                  type: "string",
                  description: 'Ej. "8:00 am – 12:00 pm".',
                }),
                defineField({
                  name: "ocultarDomingoEnOtay",
                  title: "¿Ocultar 'o Domingo' en plantel Otay?",
                  type: "boolean",
                  initialValue: false,
                }),
                defineField({
                  name: "mensualidadBase",
                  title: "Mensualidad (base)",
                  type: "number",
                  description: "Mensualidad por defecto (sin descuentos).",
                }),
                defineField({
                  name: "mensualidadEspecial",
                  title: "Mensualidad con descuento especial (opcional)",
                  type: "number",
                  description: 'Solo para "entre semana": precio con boletos. Ej. 2200.',
                }),
                defineField({
                  name: "notaEspecial",
                  title: "Nota debajo del precio (opcional)",
                  type: "string",
                  description: 'Ej. "Sujeto a venta de 20 boletos".',
                }),
                defineField({
                  name: "labelToggleEspecial",
                  title: "Label del toggle especial",
                  type: "string",
                  initialValue: "Con 20 boletos",
                }),
                defineField({
                  name: "labelToggleRegular",
                  title: "Label del toggle regular",
                  type: "string",
                  initialValue: "Precio regular",
                }),
                defineField({
                  name: "becasOpciones",
                  title: "Opciones de beca (%)",
                  description: "Solo aplica a fin de semana. Lista de porcentajes de beca disponibles. Ej. [0, 10, 20].",
                  type: "array",
                  of: [{ type: "number" }],
                }),
                defineField({
                  name: "sinReinscripcion",
                  title: '¿Mostrar "Sin reinscripción $0"?',
                  type: "boolean",
                  initialValue: false,
                }),
                defineField({
                  name: "ctaLabel",
                  title: "Texto del botón",
                  type: "string",
                  initialValue: "Quiero este horario",
                }),
              ],
              preview: {
                select: { title: "diaPrincipal", subtitle: "tag", media: "destacada" },
              },
            },
          ],
          validation: (Rule) => Rule.max(2),
        }),
      ],
    }),
    defineField({
      name: "galeria",
      title: "Galería del programa",
      description:
        "Fotos de laboratorios, talleres, equipos y alumnos en práctica. Recomendado: 6 imágenes (se muestran en grid 3×2). Sube entre 3 y 8.",
      type: "array",
      group: "imagenes",
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
      name: "orden",
      title: "Orden de aparición",
      type: "number",
      group: "info",
      description: "Número para ordenar las carreras en el listado. Menor número = aparece primero.",
    }),
    defineField({
      name: "activa",
      title: "¿Carrera activa?",
      type: "boolean",
      group: "info",
      description: "Desactiva para ocultar temporalmente sin eliminar.",
      initialValue: true,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
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
