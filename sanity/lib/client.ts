import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN de Sanity: lecturas rápidas; ISR/revalidate maneja frescura
})
