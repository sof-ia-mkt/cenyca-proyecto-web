'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

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
          <Link
            href="/"
            className="text-xl font-black uppercase tracking-widest text-white hover:text-[#00D4FF] transition-colors"
          >
            CENYCA
            <span className="text-[#00D4FF]">.</span>
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
          <div className="xl:hidden border-t border-[rgba(0,212,255,0.15)] py-4 space-y-1">
            {navItems.map((item) =>
              item.submenu ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] transition-colors"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 space-y-1 mt-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => { setOpenDropdown(null); setMobileOpen(false) }}
                          className="block px-3 py-2 text-sm font-medium text-[#00D4FF] hover:text-white transition-colors"
                        >
                          — {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-[#00D4FF] transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
