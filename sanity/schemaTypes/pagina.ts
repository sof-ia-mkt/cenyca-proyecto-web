import { defineField, defineType } from 'sanity'

export const pagina = defineType({
  name: 'pagina',
  title: 'Páginas',
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
      name: 'contenido',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: { title: 'titulo' },
  },
})
