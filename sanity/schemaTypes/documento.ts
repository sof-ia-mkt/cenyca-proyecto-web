import { defineField, defineType } from 'sanity'
import { slugOptions, slugValidation } from '../lib/slugValidation'

export const documento = defineType({
  name: 'documento',
  title: 'Documentos',
  type: 'document',
  icon: () => '📄',
  description:
    'Documentos oficiales descargables (PDF) que se publican en la página /documentos del sitio: reglamentos, convocatorias, formatos, RVOE, planes de estudio, calendario escolar, etc. Cada documento que crees aquí aparece como una tarjeta con botón de descarga.',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título del documento',
      type: 'string',
      description:
        'Nombre tal como lo verá quien entra a descargarlo. Ejemplos: «Reglamento General de Alumnos», «Convocatoria de Becas — Septiembre 2026», «RVOE Ingeniería Industrial», «Solicitud de Inscripción».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Se genera solo a partir del título. No necesitas editarlo.',
      options: slugOptions('titulo'),
      validation: slugValidation,
    }),
    defineField({
      name: 'archivo',
      title: 'Archivo PDF',
      type: 'file',
      description:
        'El archivo PDF que se descargará al hacer clic en «Descargar». Solo se aceptan archivos .pdf.',
      options: { accept: '.pdf' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción corta (opcional)',
      type: 'text',
      rows: 3,
      description:
        'Una línea breve que aparece debajo del título para dar contexto. Ejemplo: «Normas de conducta, asistencia y evaluación vigentes para el ciclo 2026.»',
    }),
    defineField({
      name: 'categoria',
      title: 'Categoría',
      type: 'string',
      description:
        'Agrupa el documento por tipo. Convocatorias = admisiones y becas · Formatos = solicitudes y trámites (inscripción, baja, beca) · Reglamentos = normativa institucional · Otros = RVOE, planes de estudio, calendario escolar.',
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
