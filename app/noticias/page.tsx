import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/live'
import { todasNoticiasQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const metadata = { title: 'Noticias — CENYCA' }

export default async function NoticiasPage() {
  const { data: noticias } = await sanityFetch({ query: todasNoticiasQuery })

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10">Noticias</h1>

      {noticias.length === 0 ? (
        <p className="text-zinc-400">No hay noticias publicadas aún.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia: any) => (
            <Link
              key={noticia._id}
              href={`/noticias/${noticia.slug.current}`}
              className="group block border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-400 transition-colors"
            >
              {noticia.imagen ? (
                <div className="relative h-44 bg-zinc-100">
                  <Image
                    src={urlFor(noticia.imagen).width(400).height(176).url()}
                    alt={noticia.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-44 bg-zinc-100" />
              )}
              <div className="p-4">
                {noticia.categoria && (
                  <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                    {noticia.categoria}
                  </span>
                )}
                <h2 className="font-semibold mt-1 group-hover:underline line-clamp-2">
                  {noticia.titulo}
                </h2>
                {noticia.fecha && (
                  <p className="text-xs text-zinc-400 mt-2">
                    {new Date(noticia.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
