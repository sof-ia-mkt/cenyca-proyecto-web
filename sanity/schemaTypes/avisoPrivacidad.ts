import { defineField, defineType } from 'sanity'
import { slugOptions, slugValidation } from '../lib/slugValidation'

export const avisoPrivacidad = defineType({
  name: 'avisoPrivacidad',
  title: 'Avisos de Privacidad',
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
      options: slugOptions('titulo'),
      validation: slugValidation,
    }),
    defineField({
      name: 'fecha',
      title: 'Fecha',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contenido',
      title: 'Contenido',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'fecha' },
  },
})
