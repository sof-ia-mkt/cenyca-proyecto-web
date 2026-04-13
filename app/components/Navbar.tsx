"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Oferta Académica", href: "/oferta" },
  { label: "Vida Estudiantil", href: "/vida-estudiantil" },
  { label: "Vinculación", href: "/vinculacion" },
  { label: "Directorio", href: "/directorio" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="bg-[#1B2040] shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.avif"
              alt="CENYCA Universidad"
              width={140}
              height={45}
              className="object-contain"
              priority
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white text-sm font-medium px-3 py-2 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Plataforma Alumnos — desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://alumnos.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium px-3 py-2 rounded-md border border-white/20 hover:bg-white/10 transition-colors duration-200"
            >
              Plataforma Alumnos
            </a>
            <a
              href="https://inscripciones.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00D4FF] text-[#1B2040] text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#00B8DB] transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
            >
              Inscríbete
            </a>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuAbierto ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-[#252B52] px-4 py-4 flex flex-col gap-1 border-t border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuAbierto(false)}
              className="text-white text-sm font-medium px-3 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
            <a
              href="https://alumnos.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-sm font-medium px-3 py-3 rounded-md border border-white/20 text-center hover:bg-white/10 transition-colors"
            >
              Plataforma Alumnos
            </a>
            <a
              href="https://inscripciones.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00D4FF] text-[#1B2040] text-sm font-bold px-5 py-3 rounded-full text-center hover:bg-[#00B8DB] transition-colors"
            >
              Inscríbete
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
