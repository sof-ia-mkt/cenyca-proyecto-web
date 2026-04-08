import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/live'
import { ultimasNoticiasQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default async function Home() {
  const { data: noticias } = await sanityFetch({ query: ultimasNoticiasQuery })

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">CENYCA</h1>
      <p className="text-zinc-500 mb-12">Centro de Estudios</p>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Últimas noticias</h2>
          <Link href="/noticias" className="text-sm text-blue-600 hover:underline">
            Ver todas →
          </Link>
        </div>

        {noticias.length === 0 ? (
          <p className="text-zinc-400">No hay noticias publicadas aún.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {noticias.map((noticia: any) => (
              <Link
                key={noticia._id}
                href={`/noticias/${noticia.slug.current}`}
                className="group block border border-zinc-200 rounded-lg overflow-hidden hover:border-zinc-400 transition-colors"
              >
                {noticia.imagen && (
                  <div className="relative h-44 bg-zinc-100">
                    <Image
                      src={urlFor(noticia.imagen).width(400).height(176).url()}
                      alt={noticia.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  {noticia.categoria && (
                    <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                      {noticia.categoria}
                    </span>
                  )}
                  <h3 className="font-semibold mt-1 group-hover:underline line-clamp-2">
                    {noticia.titulo}
                  </h3>
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
      </section>
    </main>
  )
}
