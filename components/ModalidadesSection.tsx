export default function ModalidadesSection() {
  const modalidades = [
    {
      tag: 'Escolarizada',
      titulo: 'Tiempo completo',
      dia: 'Turno matutino',
      descripcion: 'La experiencia universitaria completa. Vive el campus, convive con tus compañeros y aprovecha al máximo tu formación.',
      color: '#00D4FF',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      tag: 'Entre semana',
      titulo: '1 día a la semana',
      dia: 'Solo 1 día',
      descripcion: 'Asiste un día entre semana y sigue con tu trabajo o actividades el resto de la semana. Flexibilidad real.',
      color: '#4ade80',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      tag: 'Ejecutivo',
      titulo: 'Fin de semana',
      dia: 'Sábado o Domingo',
      descripcion: 'Dedica tu sábado o domingo a formarte. Perfecto para quienes tienen compromisos de lunes a viernes.',
      color: '#ff9500',
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#1B2040] to-[#0a0e2a]">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#D4AF37] to-[#00D4FF]" />

      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(0,212,255,0.04)] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center relative">
        <span className="inline-flex items-center gap-2 border border-[rgba(0,212,255,0.3)] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00D4FF] mb-6">
          Modalidades de estudio
        </span>

        {/* Shimmer title */}
        <h2
          className="text-4xl sm:text-5xl font-black uppercase tracking-widest mb-3"
          style={{
            background: 'linear-gradient(90deg,#fff,#00D4FF,#fff,#00D4FF,#fff)',
            backgroundSize: '300% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'shimmerText 4s ease-in-out infinite',
          }}
        >
          Tu carrera, a tu ritmo
        </h2>
        <p className="text-white/60 text-lg mb-14">Estudia sin pausar tus actividades cotidianas.</p>

        <div className="grid gap-6 sm:grid-cols-3">
          {modalidades.map((m) => (
            <div
              key={m.tag}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center hover:-translate-y-2 hover:border-white/25 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
                {m.icon}
              </div>
              <span
                className="inline-block rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: `${m.color}20`, color: m.color, border: `1px solid ${m.color}40` }}
              >
                {m.tag}
              </span>
              <h3 className="text-lg font-bold text-white mb-1">{m.titulo}</h3>
              <p className="text-2xl font-black mb-4" style={{ color: m.color }}>{m.dia}</p>
              <p className="text-sm text-white/60 leading-relaxed">{m.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href="#contacto"
            className="inline-flex items-center gap-2 bg-[#00D4FF] text-[#1B2040] font-bold uppercase tracking-wide px-10 py-4 rounded-full text-sm hover:bg-white transition-colors"
          >
            Quiero más información
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shimmerText {
          0%   { background-position: 100% 0 }
          50%  { background-position: 0% 0 }
          100% { background-position: 100% 0 }
        }
      `}</style>
    </section>
  )
}
