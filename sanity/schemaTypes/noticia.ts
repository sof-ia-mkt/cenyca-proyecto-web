import { defineField, defineType } from 'sanity'

export const noticia = defineType({
  name: 'noticia',
  title: 'Noticias',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'extracto',
      title: 'Extracto (resumen corto)',
      type: 'text',
      rows: 3,
      description: 'Resumen breve (máx. 160 caracteres). Se usa para SEO meta description y para las tarjetas de listado.',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Académico', value: 'academico' },
          { title: 'Cultural', value: 'cultural' },
          { title: 'Deportivo', value: 'deportivo' },
        ],
      },
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria', media: 'imagen' },
  },
})
