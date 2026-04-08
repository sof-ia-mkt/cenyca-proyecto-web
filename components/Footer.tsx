import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(0,212,255,0.15)] bg-[#252B52] mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Image src="/logo.avif" alt="CENYCA Universidad" width={130} height={48} className="h-12 w-auto object-contain mb-3" />
            <Image src="/slogan.avif" alt="Donde tu potencial se vuelve éxito" width={150} height={30} className="h-7 w-auto object-contain opacity-70 mb-4" />
            <p className="text-sm text-white/60 leading-relaxed">
              Formación universitaria con excelencia académica y compromiso con el desarrollo integral.
            </p>
          </div>

          {/* Oferta educativa */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-4">
              Oferta Educativa
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/licenciaturas" className="hover:text-[#00D4FF] transition-colors">Licenciaturas</Link></li>
              <li><Link href="/posgrados" className="hover:text-[#00D4FF] transition-colors">Posgrados</Link></li>
              <li><Link href="/educacion-continua" className="hover:text-[#00D4FF] transition-colors">Educación Continua</Link></li>
              <li><Link href="/intercambios" className="hover:text-[#00D4FF] transition-colors">Intercambios</Link></li>
            </ul>
          </div>

          {/* Institución */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-4">
              Institución
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/nosotros" className="hover:text-[#00D4FF] transition-colors">Nosotros</Link></li>
              <li><Link href="/admisiones" className="hover:text-[#00D4FF] transition-colors">Admisiones</Link></li>
              <li><Link href="/becas" className="hover:text-[#00D4FF] transition-colors">Becas</Link></li>
              <li><Link href="/noticias" className="hover:text-[#00D4FF] transition-colors">CENYCA Comunica</Link></li>
              <li><Link href="/documentos" className="hover:text-[#00D4FF] transition-colors">Documentos</Link></li>
              <li><Link href="/avisos-de-privacidad" className="hover:text-[#00D4FF] transition-colors">Avisos de Privacidad</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] mb-4">
              Contacto
            </h3>
            <address className="not-italic text-sm text-white/70 space-y-2 leading-relaxed">
              <p>Calle Universidad 123<br />Col. Centro, Ciudad de México<br />C.P. 06000</p>
              <p>
                <a href="tel:+525500000000" className="hover:text-[#00D4FF] transition-colors">
                  (55) 0000-0000
                </a>
              </p>
              <p>
                <a href="mailto:informacion@cenyca.edu.mx" className="hover:text-[#00D4FF] transition-colors">
                  informacion@cenyca.edu.mx
                </a>
              </p>
            </address>

            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { label: 'Facebook', href: '#', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Instagram', href: '#', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11A4.5 4.5 0 0117.5 22h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z' },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-white/60 hover:text-[#00D4FF] hover:border-[#00D4FF] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(0,212,255,0.1)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} CENYCA Universidad. Todos los derechos reservados.</p>
          <Link href="/avisos-de-privacidad" className="hover:text-[#00D4FF] transition-colors">
            Aviso de Privacidad
          </Link>
        </div>
      </div>
    </footer>
  )
}
