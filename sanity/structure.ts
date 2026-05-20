import type { StructureResolver } from 'sanity/structure'

// Configuración e Historia son singletons — solo un documento con ID fijo
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: Configuración General
      S.listItem()
        .title('Configuración General')
        .child(
          S.document()
            .schemaType('configuracion')
            .documentId('configuracion-general')
        ),
      // Singleton: Historia / Nosotros (Home)
      S.listItem()
        .title('Historia / Nosotros (Home)')
        .child(
          S.document()
            .schemaType('historia')
            .documentId('historia-home')
        ),
      // Singleton: Vinculación
      S.listItem()
        .title('Vinculación (Página)')
        .child(
          S.document()
            .schemaType('vinculacion')
            .documentId('vinculacion-page')
        ),
      // Singleton: Nosotros
      S.listItem()
        .title('Nosotros (Página)')
        .child(
          S.document()
            .schemaType('nosotros')
            .documentId('nosotros-page')
        ),
      S.divider(),
      // Resto de tipos (sin singletons para evitar duplicados en el menú)
      ...S.documentTypeListItems().filter(
        (item) => !['configuracion', 'historia', 'vinculacion', 'nosotros'].includes(item.getId() ?? '')
      ),
    ])
