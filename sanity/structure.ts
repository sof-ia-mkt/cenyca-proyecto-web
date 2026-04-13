import type { StructureResolver } from 'sanity/structure'

// Configuracion es un singleton — solo puede existir un documento con ID fijo
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: siempre abre el mismo documento ID "configuracion"
      S.listItem()
        .title('Configuración General')
        .child(
          S.document()
            .schemaType('configuracion')
            .documentId('configuracion-general')
        ),
      S.divider(),
      // Resto de tipos (sin configuracion para evitar duplicados en el menú)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'configuracion'
      ),
    ])
