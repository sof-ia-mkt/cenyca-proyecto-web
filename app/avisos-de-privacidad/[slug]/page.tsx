import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/live'
import { client } from '@/sanity/lib/client'
import { avisoBySlugQuery, todosAvisosQuery } from '@/sanity/lib/queries'

export const revalidate = 60

type Aviso = {
  _id: string
  titulo: string
  slug: { current: string }
  fecha?: string
  contenido?: Parameters<typeof PortableText>[0]['value']
}

export async function generateStaticParams() {
  const avisos = await client.fetch<Array<{ slug: { current: string } }>>(
    todosAvisosQuery,
  )
  return (avisos ?? []).map((a) => ({ slug: a.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: avisoBySlugQuery,
    params: { slug },
  })
  const aviso = data as Aviso | null
  if (!aviso) return { title: 'Aviso no encontrado — CENYCA' }
  const titulo = `${aviso.titulo} — CENYCA`
  const description = 'Aviso de privacidad de CENYCA Universidad.'
  return {
    title: titulo,
    description,
    openGraph: { title: titulo, description, type: 'article' as const },
    twitter: { card: 'summary' as const, title: titulo, description },
  }
}

const portableComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white mt-12 mb-6 tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold text-white mt-8 mb-3">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-white/75 leading-relaxed mb-5 text-[15px] text-left">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#00D4FF] pl-4 italic text-white/70 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00D4FF] hover:underline"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside space-y-2 text-white/75 mb-5 pl-6">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside space-y-2 text-white/75 mb-5 pl-6">
        {children}
      </ol>
    ),
  },
}

export default async function AvisoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { data } = await sanityFetch({
    query: avisoBySlugQuery,
    params: { slug },
  })
  const aviso = data as Aviso | null

  if (!aviso) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
      <Link
        href="/avisos-de-privacidad"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF] hover:text-white transition-colors mb-10"
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a avisos
      </Link>

      <header className="mb-10 pb-8 border-b border-white/10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-3">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white leading-tight tracking-tight text-balance">
          {aviso.titulo}
        </h1>
        {aviso.fecha && (
          <p className="text-sm text-white/40 mt-4">
            Última actualización:{' '}
            {new Date(aviso.fecha).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </header>

      <article className="prose-invert">
        {aviso.contenido && (
          <PortableText
            value={aviso.contenido}
            components={portableComponents}
          />
        )}
      </article>
    </div>
  )
}
