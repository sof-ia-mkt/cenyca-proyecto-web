import Link from 'next/link'

interface PlaceholderPageProps {
  titulo: string
  descripcion: string
  seccion: string
}

export default function PlaceholderPage({ titulo, descripcion, seccion }: PlaceholderPageProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] border border-[rgba(0,212,255,0.3)] rounded-full px-4 py-1.5 mb-6">
          {seccion}
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase text-white mb-4">{titulo}</h1>
        <p className="text-white/50 leading-relaxed mb-10">{descripcion}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[rgba(0,212,255,0.4)] text-[#00D4FF] font-bold uppercase tracking-wide px-8 py-3 rounded-full text-sm hover:bg-[rgba(0,212,255,0.08)] transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
