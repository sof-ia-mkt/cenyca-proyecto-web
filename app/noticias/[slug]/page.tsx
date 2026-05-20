import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import ShareButtons from '@/app/components/ShareButtons'
import { sanityFetch } from '@/sanity/lib/live'
import { noticiaBySlugQuery, noticiasRelacionadasQuery, configuracionQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import NewsletterSuscripcion from '@/app/components/NewsletterSuscripcion'
import { SITE_URL } from '@/lib/siteUrl'
import { breadcrumbJsonLd } from '@/lib/jsonLd'

type ImageBlock = {
  _key: string
  _type: 'image'
  url?: string
  lqip?: string
  dimensions?: { width: number; height: number }
  alt?: string
}

const portableComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageBlock }) => {
      if (!value?.url) return null
      const w = value.dimensions?.width ?? 1200
      const h = value.dimensions?.height ?? 800
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-2xl border border-[rgba(0,212,255,0.15)]">
            <Image
              src={value.url}
              alt={value.alt || ''}
              width={w}
              height={h}
              sizes="(min-width: 768px) 720px, 100vw"
              placeholder={value.lqip ? 'blur' : 'empty'}
              blurDataURL={value.lqip}
              className="h-auto w-full object-cover"
            />
          </div>
          {value.alt && (
            <figcaption className="mt-2 text-center text-xs text-white/40">
              {value.alt}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-white/85 leading-relaxed text-left">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-2xl sm:text-3xl font-black uppercase text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-3 text-xl sm:text-2xl font-bold uppercase text-white">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[#00D4FF] pl-5 py-1 italic text-white/70">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc pl-6 space-y-2 text-white/85">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal pl-6 space-y-2 text-white/85">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#00D4FF] underline underline-offset-2 hover:text-white"
      >
        {children}
      </a>
    ),
  },
}

type Noticia = {
  _id: string
  titulo: string
  slug: { current: string }
  fecha?: string
  categoria?: string
  imagen?: { _type: 'image'; asset: { _ref: string } }
  resumen?: string
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data } = await sanityFetch({ query: noticiaBySlugQuery, params: { slug } })
  const noticia = data as (Noticia & { resumen?: string; extracto?: string }) | null
  if (!noticia) return { title: 'Noticia no encontrada' }
  const titulo = noticia.titulo
  const descripcion = noticia.extracto ?? noticia.resumen ?? `Lee "${titulo}" en CENYCA Comunica.`
  // Forzamos formato JPG y compresión para garantizar <300KB y máxima
  // compatibilidad con WhatsApp/FB (que rechazan imágenes muy pesadas).
  const ogImage = noticia.imagen
    ? urlFor(noticia.imagen)
        .width(1200)
        .height(630)
        .fit('crop')
        .format('jpg')
        .quality(80)
        .url()
    : undefined
  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      type: 'article',
      url: `${SITE_URL}/noticias/${slug}`,
      images: ogImage
        ? [
            {
              url: ogImage,
              secureUrl: ogImage,
              width: 1200,
              height: 630,
              type: 'image/jpeg',
              alt: titulo,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: titulo,
      description: descripcion,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [{ data: noticiaRaw }, { data: configRaw }] = await Promise.all([
    sanityFetch({ query: noticiaBySlugQuery, params: { slug } }),
    sanityFetch({ query: configuracionQuery }),
  ])
  const noticia = noticiaRaw as (Noticia & {
    contenido?: unknown
    imagenUrl?: string
    autor?: { nombre?: string; rol?: string; avatarUrl?: string }
  }) | null
  const config = configRaw as {
    contacto?: { whatsapp?: string }
    sistemas?: { inscripciones?: string }
  } | null

  if (!noticia) notFound()

  const { data: relacionadasRaw } = await sanityFetch({
    query: noticiasRelacionadasQuery,
    params: { slug, categoria: noticia.categoria ?? '' },
  })
  const relacionadas = (relacionadasRaw ?? []) as Noticia[]

  const whatsapp: string = config?.contacto?.whatsapp ?? '526641300236'
  const inscripciones: string =
    config?.sistemas?.inscripciones ?? 'https://inscripciones.cenyca.edu.mx'

  const shareUrl = `${SITE_URL}/noticias/${slug}`

  // JSON-LD NewsArticle para que Google entienda las noticias y las muestre
  // en Google News / Discover / rich results.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description:
      (noticia as { extracto?: string }).extracto ??
      `Lee "${noticia.titulo}" en CENYCA Comunica.`,
    image: noticia.imagen
      ? [urlFor(noticia.imagen).width(1200).height(630).fit("crop").url()]
      : undefined,
    datePublished: noticia.fecha,
    dateModified: noticia.fecha,
    author: { "@type": "Organization", name: "CENYCA Universidad" },
    publisher: {
      "@type": "Organization",
      name: "CENYCA Universidad",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
    articleSection: noticia.categoria,
  }

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Inicio', url: '/' },
    { name: 'Noticias', url: '/noticias' },
    { name: noticia.titulo, url: `/noticias/${slug}` },
  ])

  return (
    <article className="bg-[#121B33] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-16">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00D4FF] hover:text-white transition-colors mb-10"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Volver a noticias
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-16 items-start">
          {/* ── Columna principal ──────────────────────────────────────────── */}
          <main className="min-w-0">
            {noticia.categoria && (
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00D4FF] block mb-3">
                {noticia.categoria}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-black uppercase leading-tight text-white mb-4 text-balance">
              {noticia.titulo}
            </h1>

            {noticia.fecha && (
              <p className="text-sm text-white/40 mb-6">
                {new Date(noticia.fecha).toLocaleDateString('es-MX', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            )}

            {/* Compartir */}
            <div className="mb-10">
              <ShareButtons url={shareUrl} title={noticia.titulo} />
            </div>

            {noticia.imagen ? (
              <div className="relative w-full h-72 sm:h-96 mb-12 rounded-2xl overflow-hidden border border-[rgba(0,212,255,0.15)]">
                <Image
                  src={urlFor(noticia.imagen).width(1200).height(630).url()}
                  alt={noticia.titulo}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}

            {noticia.contenido ? (
              <div className="text-base">
                <PortableText value={noticia.contenido as Parameters<typeof PortableText>[0]['value']} components={portableComponents} />
              </div>
            ) : null}

            {/* Newsletter inline al terminar de leer */}
            <div className="mt-14">
              <NewsletterSuscripcion />
            </div>
          </main>

          {/* ── Sidebar sticky (solo desktop) ───────────────────────────────── */}
          <aside className="hidden lg:block sticky top-24 self-start space-y-6">
            <div className="rounded-2xl border border-[rgba(0,212,255,0.2)] bg-[#1E2D4A] p-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-2">
                CENYCA Universidad
              </span>
              <h3 className="text-xl font-black uppercase text-white leading-tight mb-3 text-balance">
                ¿Te interesa estudiar aquí?
              </h3>
              <p className="text-sm text-white/60 mb-5 leading-relaxed text-pretty">
                Licenciaturas e ingenierías con RVOE oficial. Titúlate en 3 años.
              </p>
              <a
                href={inscripciones}
                target="_blank" rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-[#00D4FF] to-[#00B8DB] text-[#121B33] font-black uppercase tracking-wider text-sm px-5 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,212,255,0.55)] hover:-translate-y-0.5 mb-3"
              >
                Inscríbete
              </a>
              <a
                href={`https://wa.me/${whatsapp}?text=Hola%2C%20me%20gustar%C3%ADa%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20oferta%20acad%C3%A9mica`}
                target="_blank" rel="noopener noreferrer"
                className="block text-center bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-black uppercase tracking-wider text-sm px-5 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(37,211,102,0.55)] hover:-translate-y-0.5"
              >
                WhatsApp
              </a>
            </div>

            <Link
              href="/licenciaturas"
              className="block rounded-2xl border border-white/10 bg-[#1E2D4A]/60 p-6 hover:border-[#00D4FF]/40 transition"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
                Explora
              </span>
              <p className="text-white font-bold mb-1">Oferta académica completa</p>
              <p className="text-xs text-white/50">Licenciaturas, ingenierías y posgrados →</p>
            </Link>
          </aside>
        </div>

        {/* ── Noticias relacionadas ──────────────────────────────────────────── */}
        {relacionadas.length > 0 && (
          <section className="mt-20 pt-12 border-t border-white/10">
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mb-2">
              Sigue leyendo
            </h2>
            <p className="text-sm text-white/40 mb-8">Más noticias de CENYCA Comunica</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((n) => (
                <Link
                  key={n._id}
                  href={`/noticias/${n.slug.current}`}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-[#1E2D4A] overflow-hidden hover:border-[#00D4FF]/40 transition"
                >
                  <div className="relative h-44 bg-[#121B33]">
                    {n.imagen && (
                      <Image
                        src={urlFor(n.imagen).width(600).height(352).url()}
                        alt={n.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    {n.categoria && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-2">
                        {n.categoria}
                      </span>
                    )}
                    <h3 className="text-white font-bold leading-tight line-clamp-2 mb-2 group-hover:text-[#00D4FF] transition-colors text-pretty">
                      {n.titulo}
                    </h3>
                    {n.fecha && (
                      <p className="text-xs text-white/40">
                        {new Date(n.fecha).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
