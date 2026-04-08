import { sanityFetch } from '@/sanity/lib/live'
import { todosDocumentosQuery } from '@/sanity/lib/queries'

export const metadata = { title: 'Documentos — CENYCA' }

export default async function DocumentosPage() {
  const { data: documentos } = await sanityFetch({ query: todosDocumentosQuery })

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Documentos</h1>

      {documentos.length === 0 ? (
        <p className="text-zinc-400">No hay documentos publicados aún.</p>
      ) : (
        <div className="divide-y divide-zinc-200">
          {documentos.map((doc: any) => (
            <div key={doc._id} className="py-5 flex items-start justify-between gap-4">
              <div>
                {doc.categoria && (
                  <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                    {doc.categoria}
                  </span>
                )}
                <h2 className="font-semibold mt-0.5">{doc.titulo}</h2>
                {doc.descripcion && (
                  <p className="text-sm text-zinc-500 mt-1">{doc.descripcion}</p>
                )}
              </div>
              {doc.archivoUrl && (
                <a
                  href={doc.archivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  Descargar PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
