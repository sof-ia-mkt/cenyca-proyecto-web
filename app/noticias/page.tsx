import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/live'
import { todasNoticiasQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const metadata = { title: 'CENYCA Comunica — Noticias' }

export default async function NoticiasPage() {
  const { data: noticias } = await sanityFetch({ query: todasNoticiasQuery })

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">CENYCA Comunica</p>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-white">Noticias</h1>
      </div>

      {noticias.length === 0 ? (
        <p className="text-white/40">No hay noticias publicadas aún.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia: any) => (
            <Link
              key={noticia._id}
              href={`/noticias/${noticia.slug.current}`}
              className="group flex flex-col rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#1E2D4A] overflow-hidden hover:border-[rgba(0,212,255,0.4)] transition-all duration-300"
            >
              <div className="relative h-48 bg-[#121B33] overflow-hidden">
                {noticia.imagen ? (
                  <Image
                    src={urlFor(noticia.imagen).width(600).height(192).url()}
                    alt={noticia.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl opacity-20">📰</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {noticia.categoria && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00D4FF] mb-2">
                    {noticia.categoria}
                  </span>
                )}
                <h2 className="font-bold text-white group-hover:text-[#00D4FF] transition-colors line-clamp-2 leading-snug">
                  {noticia.titulo}
                </h2>
                {noticia.fecha && (
                  <p className="text-xs text-white/40 mt-auto pt-3">
                    {new Date(noticia.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
