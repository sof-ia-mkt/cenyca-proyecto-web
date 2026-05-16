"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Oferta Académica", href: "/oferta-academica" },
  { label: "Vida Estudiantil", href: "/vida-estudiantil" },
  { label: "Vinculación", href: "/vinculacion" },
  { label: "Directorio", href: "/directorio" },
];

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  // `scrolled = true` cuando el usuario baja > 40px. Controla la compresión y el fondo.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cuando el menú móvil está abierto, dejamos el navbar opaco aunque estés en el top.
  const opaque = scrolled || menuAbierto;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        opaque
          ? "bg-[#121B33]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          : "bg-[#121B33]/30 backdrop-blur-md"
      }`}
    >
      {/* Línea sutil cian al borde inferior cuando ya scrolleaste — coherente con SectionAccentLine */}
      <div
        aria-hidden
        className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${opaque ? "opacity-100" : "opacity-0"}`}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.45) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? "h-[64px]" : "h-[96px]"
          }`}
        >
          {/* Logo + Slogan */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 flex-shrink-0 group">
            <Image
              src="/logo.avif"
              alt="CENYCA Universidad"
              width={180}
              height={58}
              priority
              className={`object-contain transition-[height,width] duration-300 ${
                scrolled ? "h-9 w-auto" : "h-12 w-auto"
              }`}
            />
            {/* Slogan al lado — se oculta en mobile para ahorrar espacio */}
            <span
              aria-hidden
              className={`hidden md:block h-8 w-px bg-white/15 transition-opacity duration-300 ${
                scrolled ? "opacity-60" : "opacity-100"
              }`}
            />
            {/* Slogan como texto — más legible que la imagen, escala mejor */}
            <span
              className={`hidden md:flex flex-col leading-tight transition-opacity duration-300 ${
                scrolled ? "opacity-80" : "opacity-95"
              }`}
            >
              <span
                className={`font-montserrat text-white/95 font-semibold tracking-wide transition-[font-size] duration-300 ${
                  scrolled ? "text-[11px]" : "text-[13px]"
                }`}
                style={{ letterSpacing: "0.04em" }}
              >
                Donde tu potencial
              </span>
              <span
                className={`font-montserrat text-[#00D4FF] font-bold tracking-wide transition-[font-size] duration-300 ${
                  scrolled ? "text-[11px]" : "text-[13px]"
                }`}
                style={{ letterSpacing: "0.04em" }}
              >
                se vuelve éxito
              </span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative whitespace-nowrap text-white text-[13px] xl:text-sm font-semibold px-2.5 xl:px-3.5 py-2 rounded-md hover:text-[#00D4FF] transition-colors duration-200 group"
              >
                {link.label}
                {/* Underline animado en hover */}
                <span
                  aria-hidden
                  className="absolute left-2.5 right-2.5 xl:left-3.5 xl:right-3.5 bottom-1 h-px bg-[#00D4FF] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </Link>
            ))}
          </nav>

          {/* CTA + Plataforma Alumnos — desktop */}
          <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
            <a
              href="https://alumnos.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-[13px] font-semibold px-5 py-2.5 rounded-full border border-white/25 hover:bg-white/10 hover:border-white/60 transition-colors duration-200 whitespace-nowrap inline-flex items-center"
            >
              Plataforma Alumnos
            </a>
            <a
              href="https://inscripciones.cenyca.edu.mx"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00D4FF] text-[#121B33] text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-white transition-all duration-300 hover:scale-[1.03] shadow-[0_0_20px_rgba(0,212,255,0.45)] whitespace-nowrap inline-flex items-center"
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
        <div className="bg-[#1E2D4A] px-4 py-4 flex flex-col gap-1 border-t border-white/10">
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
              className="bg-[#00D4FF] text-[#121B33] text-sm font-bold px-5 py-3 rounded-full text-center hover:bg-[#00B8DB] transition-colors"
            >
              Inscríbete
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
