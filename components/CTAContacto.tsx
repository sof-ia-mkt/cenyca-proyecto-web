'use client'

import { useState, useEffect } from 'react'

function useCountdown(targetDate: Date) {
  const [time, setTime] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
  useEffect(() => {
    function update() {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        dias: Math.floor(diff / 86400000),
        horas: Math.floor((diff % 86400000) / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return time
}

export default function CTAContacto() {
  const [deadline] = useState(() => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000))
  const { dias, horas, minutos, segundos } = useCountdown(deadline)
  const [form, setForm] = useState({ nombre: '', telefono: '', carrera: '', modalidad: '' })
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviado(true)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section id="contacto" className="py-24 relative overflow-hidden bg-gradient-to-br from-[#1B2040] to-[#0d1025]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#D4AF37] to-[#00D4FF]" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-[rgba(212,175,55,0.04)] blur-[120px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — urgencia */}
          <div>
            <span className="inline-flex items-center gap-2 border border-[rgba(0,212,255,0.3)] rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#00D4FF] mb-6">
              ¡Inscripciones abiertas!
            </span>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-tight text-white mb-4">
              Comienza tu<br /><span className="text-[#00D4FF]">futuro hoy</span>
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Plazas limitadas por periodo. Asegura tu lugar antes de que cierren las inscripciones.
            </p>

            {/* Countdown */}
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Cierre de inscripciones en</p>
            <div className="flex gap-3 mb-8">
              {[
                { val: pad(dias), label: 'Días' },
                { val: pad(horas), label: 'Horas' },
                { val: pad(minutos), label: 'Min' },
                { val: pad(segundos), label: 'Seg' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-[#00D4FF] text-[#1B2040] rounded-xl px-4 py-3 min-w-[64px] text-center">
                  <span className="block text-2xl font-black leading-none">{val}</span>
                  <span className="block text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{label}</span>
                </div>
              ))}
            </div>

            {/* Barra de lugares */}
            <div className="bg-white/5 border border-[rgba(0,212,255,0.2)] rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🎓</span>
                <p className="text-sm text-white/90">
                  Solo quedan <strong className="text-[#00D4FF] text-base">8 lugares</strong> disponibles este periodo
                </p>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: '73%',
                    background: 'linear-gradient(90deg,#00D4FF,#D4AF37,#ff9500)',
                    backgroundSize: '200% 100%',
                    animation: 'barraPulse 2s ease infinite',
                  }}
                />
              </div>
              <p className="text-xs text-white/50 text-center">73% de lugares tomados — ¡no esperes más!</p>
            </div>

            {/* Info items */}
            <div className="space-y-3">
              {[
                { icon: '📍', texto: 'Calle Universidad 123, Col. Centro, CDMX' },
                { icon: '📞', texto: '(55) 0000-0000' },
                { icon: '✉️', texto: 'informacion@cenyca.edu.mx' },
              ].map(({ icon, texto }) => (
                <div key={texto} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-9 h-9 rounded-xl bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-base shrink-0">
                    {icon}
                  </span>
                  {texto}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="rounded-2xl border border-[rgba(0,212,255,0.15)] overflow-hidden"
            style={{ background: 'linear-gradient(160deg,#1e2348,#161a35)' }}>
            <div className="p-8">
              {enviado ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-xl font-black uppercase text-white mb-2">¡Solicitud recibida!</h3>
                  <p className="text-white/60 text-sm">Un asesor se pondrá en contacto contigo muy pronto.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-black uppercase text-white text-center mb-1">Solicita información</h3>
                  <p className="text-xs text-white/50 text-center mb-6 uppercase tracking-wide">Sin compromiso · Respuesta en minutos</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { name: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Tu nombre', icon: '👤' },
                      { name: 'telefono', label: 'WhatsApp / Teléfono', type: 'tel', placeholder: '55 0000 0000', icon: '📱' },
                    ].map(({ name, label, type, placeholder, icon }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-white/70 mb-1.5">{label}</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-70">{icon}</span>
                          <input
                            type={type}
                            placeholder={placeholder}
                            required
                            value={(form as any)[name]}
                            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#00D4FF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.15)' }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5">Carrera de interés</label>
                      <select
                        required
                        value={form.carrera}
                        onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none appearance-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: form.carrera ? 'white' : 'rgba(255,255,255,0.35)' }}
                      >
                        <option value="" disabled>Selecciona una carrera</option>
                        {['Derecho','Psicología','Administración','Contaduría','Pedagogía','Comunicación','Ingeniería en Sistemas','Ingeniería Industrial','Criminología'].map(c => (
                          <option key={c} value={c} style={{ background: '#1B2040' }}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1.5">Modalidad preferida</label>
                      <select
                        value={form.modalidad}
                        onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none appearance-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <option value="" style={{ background: '#1B2040' }}>Cualquier modalidad</option>
                        <option value="matutino" style={{ background: '#1B2040' }}>Matutino</option>
                        <option value="1-dia" style={{ background: '#1B2040' }}>1 día a la semana</option>
                        <option value="sabado" style={{ background: '#1B2040' }}>Sábado / Domingo</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="relative w-full py-4 rounded-xl font-bold uppercase tracking-wide text-[#1B2040] text-sm overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_25px_rgba(0,212,255,0.4)]"
                      style={{ background: '#00D4FF' }}
                    >
                      <span className="relative z-10">Quiero más información →</span>
                    </button>
                  </form>

                  <p className="flex items-center justify-center gap-1.5 mt-4 text-xs text-white/40">
                    <svg className="w-3.5 h-3.5 text-[#00D4FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Tus datos están seguros. No spam.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes barraPulse {
          0%,100% { background-position: 0% 50% }
          50%      { background-position: 100% 50% }
        }
      `}</style>
    </section>
  )
}
