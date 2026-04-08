import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/live'
import { ultimasNoticiasQuery } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import ModalidadesSection from '@/components/ModalidadesSection'
import InstalacionesCarousel from '@/components/InstalacionesCarousel'
import CTAContacto from '@/components/CTAContacto'

const licenciaturas = [
  { nombre: 'Derecho', icono: '⚖️' },
  { nombre: 'Administración de Empresas', icono: '📊' },
  { nombre: 'Contaduría Pública y Finanzas', icono: '💰' },
  { nombre: 'Psicología Organizacional', icono: '🧠' },
  { nombre: 'Ciencias de la Educación', icono: '📚' },
  { nombre: 'Criminología y Criminalística', icono: '🔍' },
  { nombre: 'Gastronomía', icono: '🍽️' },
  { nombre: 'Ing. Mecatrónica', icono: '🤖' },
  { nombre: 'Ing. Electromécanica', icono: '⚡' },
  { nombre: 'Ing. en Sistemas Computacionales', icono: '💻' },
  { nombre: 'Ing. Industrial', icono: '🏭' },
]

export default async function Home() {
  const { data: noticias } = await sanityFetch({ query: ultimasNoticiasQuery })

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#00D4FF] opacity-[0.06] blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-6 border border-[rgba(0,212,255,0.3)] rounded-full px-4 py-1.5">
              Universidad CENYCA
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[1.05] tracking-tight text-white mb-6">
              Tu futuro{' '}
              <span className="text-[#00D4FF]">empieza</span>{' '}
              aquí
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-10">
              Formación universitaria de excelencia con un enfoque integral, humanista y comprometido con el desarrollo profesional.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/admisiones"
                className="inline-flex items-center gap-2 bg-[#00D4FF] text-[#1B2040] font-bold uppercase tracking-wide px-8 py-4 rounded-full text-sm hover:bg-white transition-colors"
              >
                Iniciar Admisión
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/licenciaturas"
                className="inline-flex items-center gap-2 border border-[rgba(0,212,255,0.4)] text-white font-bold uppercase tracking-wide px-8 py-4 rounded-full text-sm hover:border-[#00D4FF] hover:text-[#00D4FF] transition-colors"
              >
                Ver Licenciaturas
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 flex flex-wrap gap-8">
            {[
              { valor: '25+', etiqueta: 'Años de experiencia' },
              { valor: '15+', etiqueta: 'Programas académicos' },
              { valor: '5,000+', etiqueta: 'Egresados' },
            ].map(({ valor, etiqueta }) => (
              <div key={etiqueta} className="border-l-2 border-[#00D4FF] pl-4">
                <p className="text-3xl font-black text-white">{valor}</p>
                <p className="text-xs text-white/50 uppercase tracking-wide mt-0.5">{etiqueta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LICENCIATURAS */}
      <section className="py-24 border-t border-[rgba(0,212,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">Oferta Educativa</p>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">Licenciaturas</h2>
            </div>
            <Link
              href="/licenciaturas"
              className="text-sm font-semibold text-[#00D4FF] hover:text-white transition-colors uppercase tracking-wide"
            >
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {licenciaturas.map(({ nombre, icono }) => (
              <Link
                key={nombre}
                href="/licenciaturas"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#252B52] hover:border-[rgba(0,212,255,0.5)] hover:bg-[rgba(0,212,255,0.05)] transition-all duration-300 text-center backdrop-blur-sm"
              >
                <span className="text-3xl">{icono}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-white/80 group-hover:text-[#00D4FF] transition-colors">
                  {nombre}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ÚLTIMAS NOTICIAS */}
      <section className="py-24 border-t border-[rgba(0,212,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">CENYCA Comunica</p>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">Últimas Noticias</h2>
            </div>
            <Link
              href="/noticias"
              className="text-sm font-semibold text-[#00D4FF] hover:text-white transition-colors uppercase tracking-wide"
            >
              Ver todas →
            </Link>
          </div>

          {noticias.length === 0 ? (
            <p className="text-white/40">No hay noticias publicadas aún.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {noticias.map((noticia: any) => (
                <Link
                  key={noticia._id}
                  href={`/noticias/${noticia.slug.current}`}
                  className="group flex flex-col rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#252B52] overflow-hidden hover:border-[rgba(0,212,255,0.4)] transition-all duration-300"
                >
                  <div className="relative h-48 bg-[#1B2040] overflow-hidden">
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
                    <h3 className="font-bold text-white group-hover:text-[#00D4FF] transition-colors line-clamp-2 leading-snug">
                      {noticia.titulo}
                    </h3>
                    {noticia.fecha && (
                      <p className="text-xs text-white/40 mt-auto pt-3">
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
        </div>
      </section>

      <ModalidadesSection />

      <InstalacionesCarousel />

      <CTAContacto />
    </>
  )
}
