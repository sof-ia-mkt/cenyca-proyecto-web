import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/live'
import { todosAvisosQuery } from '@/sanity/lib/queries'

export const metadata = {
  title: 'Avisos de Privacidad — CENYCA',
  description:
    'Avisos de privacidad de CENYCA Universidad conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.',
  openGraph: {
    title: 'Avisos de Privacidad | CENYCA Universidad',
    description: 'Avisos de privacidad de CENYCA Universidad.',
    type: 'website' as const,
  },
  twitter: { card: 'summary' as const, title: 'Avisos de Privacidad | CENYCA Universidad' },
}

type AvisoListItem = {
  _id: string;
  titulo: string;
  slug: { current: string };
  fecha?: string;
};

export default async function AvisosPage() {
  const { data } = await sanityFetch({ query: todosAvisosQuery })
  const avisos = (data ?? []) as AvisoListItem[]

  return (
    <div className="bg-[#121B33] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-16">
      <div className="mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-white text-balance">Avisos de Privacidad</h1>
      </div>

      {avisos.length === 0 ? (
        <p className="text-white/40">No hay avisos de privacidad publicados aún.</p>
      ) : (
        <div className="space-y-3">
          {avisos.map((aviso) => (
            <div
              key={aviso._id}
              className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#1E2D4A] hover:border-[rgba(0,212,255,0.35)] transition-colors"
            >
              <div>
                <h2 className="font-bold text-white">{aviso.titulo}</h2>
                {aviso.fecha && (
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(aviso.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                )}
              </div>
              <Link
                href={`/avisos-de-privacidad/${aviso.slug.current}`}
                className="shrink-0 text-xs font-bold uppercase tracking-wide text-[#00D4FF] hover:text-white transition-colors"
              >
                Ver aviso →
              </Link>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
