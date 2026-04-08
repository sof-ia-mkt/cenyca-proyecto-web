'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const items = [
  'Inscripciones abiertas para el nuevo periodo',
  'Modalidades: Matutino · 1 día a la semana · Sábado o Domingo',
  'Becas disponibles — Consulta requisitos',
  'Más de 15 programas académicos',
  'Solicita información sin compromiso',
]

export default function TickerBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 z-50 flex items-center h-10 border-t border-[#00D4FF] bg-[#1B2040] shadow-[0_-2px_20px_rgba(0,0,0,0.4)] transition-all duration-500"
      style={{ bottom: visible ? 0 : -50 }}
    >
      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden h-full flex items-center relative">
        <div
          className="flex items-center gap-12 whitespace-nowrap"
          style={{ animation: 'tickerScroll 30s linear infinite', paddingLeft: '100%' }}
        >
          {[...items, ...items].map((item, i) => (
            <span key={i} className="text-xs text-white/80 font-medium flex items-center gap-1.5">
              <span className="text-[#00D4FF] font-bold">▸</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/admisiones"
        className="shrink-0 mx-3 px-4 py-1.5 bg-[#00D4FF] text-[#1B2040] text-xs font-bold uppercase tracking-wide rounded-full hover:bg-white transition-colors"
      >
        Inscríbete
      </Link>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  )
}
