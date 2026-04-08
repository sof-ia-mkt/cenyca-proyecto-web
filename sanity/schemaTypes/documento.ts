import { defineField, defineType } from 'sanity'

export const documento = defineType({
  name: 'documento',
  title: 'Documentos',
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
      name: 'archivo',
      title: 'Archivo PDF',
      type: 'file',
      options: { accept: '.pdf' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Convocatorias', value: 'convocatorias' },
          { title: 'Formatos', value: 'formatos' },
          { title: 'Reglamentos', value: 'reglamentos' },
          { title: 'Otros', value: 'otros' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'categoria' },
  },
})
