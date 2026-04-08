import { type SchemaTypeDefinition } from 'sanity'
import { noticia } from './noticia'
import { documento } from './documento'
import { avisoPrivacidad } from './avisoPrivacidad'
import { pagina } from './pagina'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [noticia, documento, avisoPrivacidad, pagina],
}
