'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

const fotos = [
  { src: '/instalaciones/instalaciones-1.avif', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-2.avif', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-3.webp', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-4.avif', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-5.avif', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-6.avif', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-7.webp', alt: 'Instalaciones CENYCA' },
  { src: '/instalaciones/instalaciones-8.jpg', alt: 'Instalaciones CENYCA' },
]

export default function InstalacionesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function scrollTo(index: number) {
    if (!trackRef.current) return
    const item = trackRef.current.children[index] as HTMLElement
    trackRef.current.scrollTo({ left: item.offsetLeft, behavior: 'smooth' })
    setActive(index)
  }

  function prev() { scrollTo(Math.max(0, active - 1)) }
  function next() { scrollTo(Math.min(fotos.length - 1, active + 1)) }

  return (
    <section className="py-24 border-t border-[rgba(0,212,255,0.1)]" style={{
      backgroundImage: 'url(/flecha2.webp)',
      backgroundSize: '600px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right -80px center',
    }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-2">Campus</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white">Nuestras Instalaciones</h2>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
            onScroll={(e) => {
              const el = e.currentTarget
              const idx = Math.round(el.scrollLeft / (el.scrollWidth / fotos.length))
              setActive(idx)
            }}
          >
            {fotos.map((foto, i) => (
              <div
                key={i}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden"
                style={{ width: 'calc(33.333% - 8px)', scrollSnapAlign: 'start', minWidth: 280, aspectRatio: '4/3' }}
              >
                <Image src={foto.src} alt={foto.alt} fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Nav buttons */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[rgba(27,32,64,0.8)] border border-[rgba(0,212,255,0.3)] text-[#00D4FF] flex items-center justify-center hover:bg-[rgba(27,32,64,0.95)] transition-colors backdrop-blur-sm z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[rgba(27,32,64,0.8)] border border-[rgba(0,212,255,0.3)] text-[#00D4FF] flex items-center justify-center hover:bg-[rgba(27,32,64,0.95)] transition-colors backdrop-blur-sm z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {fotos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === active ? 'bg-[#00D4FF] scale-125' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
