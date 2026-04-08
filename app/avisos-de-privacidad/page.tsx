import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { todosAvisosQuery } from '@/sanity/lib/queries'

export const metadata = { title: 'Avisos de Privacidad — CENYCA' }

export default async function AvisosPage() {
  const { data: avisos } = await sanityFetch({ query: todosAvisosQuery })

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Avisos de Privacidad</h1>

      {avisos.length === 0 ? (
        <p className="text-zinc-400">No hay avisos de privacidad publicados aún.</p>
      ) : (
        <div className="divide-y divide-zinc-200">
          {avisos.map((aviso: any) => (
            <div key={aviso._id} className="py-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold">{aviso.titulo}</h2>
                {aviso.fecha && (
                  <p className="text-sm text-zinc-400 mt-0.5">
                    {new Date(aviso.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <Link
                href={`/avisos-de-privacidad/${aviso.slug.current}`}
                className="shrink-0 text-sm font-medium text-blue-600 hover:underline"
              >
                Ver aviso →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
