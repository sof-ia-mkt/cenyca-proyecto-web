import Link from 'next/link'

export const metadata = { title: 'Licenciaturas — CENYCA Universidad' }

const licenciaturas = [
  {
    nombre: 'Derecho',
    icono: '⚖️',
    descripcion: 'Formación jurídica sólida para defender la justicia y el orden legal.',
  },
  {
    nombre: 'Administración de Empresas',
    icono: '📊',
    descripcion: 'Desarrolla habilidades de liderazgo, gestión y estrategia organizacional.',
  },
  {
    nombre: 'Contaduría Pública y Finanzas',
    icono: '💰',
    descripcion: 'Domina la contabilidad, auditoría y planeación financiera empresarial.',
  },
  {
    nombre: 'Psicología Organizacional',
    icono: '🧠',
    descripcion: 'Comprende el comportamiento humano en entornos laborales y sociales.',
  },
  {
    nombre: 'Ciencias de la Educación',
    icono: '📚',
    descripcion: 'Forma educadores comprometidos con el aprendizaje y el desarrollo humano.',
  },
  {
    nombre: 'Criminología y Criminalística',
    icono: '🔍',
    descripcion: 'Analiza el fenómeno delictivo y colabora con la seguridad y justicia.',
  },
  {
    nombre: 'Gastronomía',
    icono: '🍽️',
    descripcion: 'Arte culinario, gestión de restaurantes y cultura gastronómica integral.',
  },
  {
    nombre: 'Ingeniería Mecatrónica',
    icono: '🤖',
    descripcion: 'Fusiona mecánica, electrónica y sistemas de control para la industria.',
  },
  {
    nombre: 'Ingeniería Electromecánica',
    icono: '⚡',
    descripcion: 'Diseña y mantiene sistemas eléctricos y mecánicos industriales.',
  },
  {
    nombre: 'Ingeniería en Sistemas Computacionales',
    icono: '💻',
    descripcion: 'Desarrollo de software, redes e infraestructura tecnológica empresarial.',
  },
  {
    nombre: 'Ingeniería Industrial',
    icono: '🏭',
    descripcion: 'Optimiza procesos productivos y de calidad en la industria moderna.',
  },
]

export default function LicenciaturasPage() {
  return (
    <>
      {/* Header */}
      <section className="py-20 border-b border-[rgba(0,212,255,0.1)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00D4FF] mb-3">Oferta Educativa</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase text-white leading-tight">
            Licenciaturas
          </h1>
          <p className="mt-4 text-white/60 max-w-xl">
            Elige la carrera que transformará tu futuro. Todas nuestras licenciaturas cuentan con RVOE y están diseñadas para el mercado laboral actual.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {licenciaturas.map(({ nombre, icono, descripcion }) => (
              <Link
                key={nombre}
                href="/admisiones"
                className="group flex gap-5 p-6 rounded-2xl border border-[rgba(0,212,255,0.15)] bg-[#252B52] hover:border-[rgba(0,212,255,0.5)] hover:bg-[rgba(0,212,255,0.05)] transition-all duration-300"
              >
                <span className="text-4xl shrink-0 mt-0.5">{icono}</span>
                <div>
                  <h2 className="font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug mb-1">
                    {nombre}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed">{descripcion}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-white/50 mb-4 text-sm">¿No encuentras lo que buscas? Contáctanos.</p>
            <Link
              href="/admisiones"
              className="inline-flex items-center gap-2 bg-[#00D4FF] text-[#1B2040] font-bold uppercase tracking-wide px-10 py-4 rounded-full text-sm hover:bg-white transition-colors"
            >
              Solicitar información
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
