'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navItems = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Admisiones', href: '/admisiones' },
  { label: 'Becas', href: '/becas' },
  { label: 'Licenciaturas', href: '/licenciaturas' },
  { label: 'Posgrados', href: '/posgrados' },
  { label: 'Educación Continua', href: '/educacion-continua' },
  { label: 'Intercambios', href: '/intercambios' },
  { label: 'CENYCA Comunica', href: '/noticias' },
  {
    label: 'Más Información',
    href: '#',
    submenu: [
      { label: 'Licenciaturas', href: '/licenciaturas' },
      { label: 'Test Vocacional', href: '/test-vocacional' },
    ],
  },
]

const mobileGroups = [
  {
    label: 'Institución',
    items: [
      { label: 'Nosotros', href: '/nosotros' },
      { label: 'CENYCA Comunica', href: '/noticias' },
    ],
  },
  {
    label: 'Oferta educativa',
    items: [
      { label: 'Licenciaturas', href: '/licenciaturas' },
      { label: 'Posgrados', href: '/posgrados' },
      { label: 'Educación Continua', href: '/educacion-continua' },
      { label: 'Intercambios', href: '/intercambios' },
    ],
  },
  {
    label: 'Ingreso',
    items: [
      { label: 'Admisiones', href: '/admisiones' },
      { label: 'Becas', href: '/becas' },
    ],
  },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(0,212,255,0.15)] bg-[#1B2040]/95 backdrop-blur-md">
      <nav ref={navRef} className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src="/logo.avif" alt="CENYCA Universidad" width={120} height={44} className="h-11 w-auto object-contain" priority />
            <span className="hidden sm:block w-px h-8 bg-white/30" />
            <Image src="/slogan.avif" alt="Donde tu potencial se vuelve éxito" width={140} height={36} className="hidden sm:block h-9 w-auto object-contain opacity-90" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navItems.map((item) =>
              item.submenu ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] transition-colors rounded"
                  >
                    {item.label}
                    <svg
                      className={`w-3 h-3 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[rgba(0,212,255,0.2)] bg-[#252B52] shadow-xl shadow-black/40 backdrop-blur-md overflow-hidden">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] hover:bg-[rgba(0,212,255,0.08)] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] transition-colors rounded"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Hamburger */}
          <button
            className="xl:hidden flex flex-col gap-1.5 p-2 rounded"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-[rgba(0,212,255,0.15)] py-4 space-y-5">
            {mobileGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#00D4FF]/70">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] hover:bg-[rgba(0,212,255,0.06)] rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="px-3 pt-2 border-t border-[rgba(0,212,255,0.1)]">
              <Link
                href="/admisiones"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 bg-[#00D4FF] text-[#1B2040] font-bold uppercase tracking-wide text-sm rounded-xl hover:bg-white transition-colors"
              >
                Inscríbete ahora
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
