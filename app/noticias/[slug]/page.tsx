import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/live'
import { noticiaBySlugQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: noticia } = await sanityFetch({
    query: noticiaBySlugQuery,
    params: { slug },
  })

  if (!noticia) notFound()

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <Link href="/noticias" className="text-sm text-blue-600 hover:underline mb-8 inline-block">
        ← Volver a noticias
      </Link>

      {noticia.categoria && (
        <span className="block text-xs text-blue-600 font-medium uppercase tracking-wide mb-2">
          {noticia.categoria}
        </span>
      )}

      <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>

      {noticia.fecha && (
        <p className="text-sm text-zinc-400 mb-8">
          {new Date(noticia.fecha).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      {noticia.imagen && (
        <div className="relative w-full h-72 mb-10 rounded-lg overflow-hidden bg-zinc-100">
          <Image
            src={urlFor(noticia.imagen).width(800).height(288).url()}
            alt={noticia.titulo}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {noticia.contenido && (
        <div className="prose prose-zinc max-w-none">
          <PortableText value={noticia.contenido} />
        </div>
      )}
    </main>
  )
}
