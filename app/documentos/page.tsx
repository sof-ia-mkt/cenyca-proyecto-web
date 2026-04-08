import { sanityFetch } from '@/sanity/lib/live'
import { todosDocumentosQuery } from '@/sanity/lib/queries'

export const metadata = { title: 'Documentos — CENYCA' }

export default async function DocumentosPage() {
  const { data: documentos } = await sanityFetch({ query: todosDocumentosQuery })

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">Institución</p>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-white">Documentos</h1>
      </div>

      {documentos.length === 0 ? (
        <p className="text-white/40">No hay documentos publicados aún.</p>
      ) : (
        <div className="space-y-3">
          {documentos.map((doc: any) => (
            <div
              key={doc._id}
              className="flex items-center gap-5 p-5 rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#252B52] hover:border-[rgba(0,212,255,0.35)] transition-colors group"
            >
              {/* PDF icon */}
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                {doc.categoria && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF] block mb-0.5">
                    {doc.categoria}
                  </span>
                )}
                <h2 className="font-bold text-white truncate">{doc.titulo}</h2>
                {doc.descripcion && (
                  <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{doc.descripcion}</p>
                )}
              </div>

              {doc.archivoUrl && (
                <a
                  href={doc.archivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 bg-[#00D4FF] text-[#1B2040] font-bold uppercase tracking-wide px-5 py-2.5 rounded-full text-xs hover:bg-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Descargar
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
