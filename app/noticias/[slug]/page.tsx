import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/live'
import { noticiaBySlugQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: noticia } = await sanityFetch({ query: noticiaBySlugQuery, params: { slug } })

  if (!noticia) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
      <Link
        href="/noticias"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00D4FF] hover:text-white transition-colors mb-10"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        Volver a noticias
      </Link>

      {noticia.categoria && (
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00D4FF] block mb-3">
          {noticia.categoria}
        </span>
      )}

      <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight text-white mb-4">
        {noticia.titulo}
      </h1>

      {noticia.fecha && (
        <p className="text-sm text-white/40 mb-10">
          {new Date(noticia.fecha).toLocaleDateString('es-MX', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      )}

      {noticia.imagen && (
        <div className="relative w-full h-72 sm:h-96 mb-12 rounded-2xl overflow-hidden border border-[rgba(0,212,255,0.15)]">
          <Image
            src={urlFor(noticia.imagen).width(800).height(384).url()}
            alt={noticia.titulo}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {noticia.contenido && (
        <div className="prose prose-invert prose-headings:font-black prose-headings:uppercase prose-a:text-[#00D4FF] prose-strong:text-white max-w-none">
          <PortableText value={noticia.contenido} />
        </div>
      )}
    </div>
  )
}
