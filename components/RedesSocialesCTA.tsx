import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";

export type RedesSociales = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
};

type Props = {
  redes?: RedesSociales;
  whatsapp?: string;
  carreraNombre?: string;
  gradoLabel?: string;
  accent?: string;
};

// Definición de cada red: id, label, URL field key, color oficial, gradiente
// opcional (para Instagram) y path del logo (SVG inline para no depender de
// librerías externas y respetar las guidelines de marca).
type RedConfig = {
  key: keyof RedesSociales;
  label: string;
  brand: string;
  gradient?: string;
  // Path SVG del logo en viewBox 0 0 24 24.
  path: React.ReactNode;
};

const REDES: RedConfig[] = [
  {
    key: "facebook",
    label: "Facebook",
    brand: "#1877F2",
    path: (
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.99 22 12z" />
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    brand: "#E4405F",
    gradient: "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 100%)",
    path: (
      <>
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.254-.66.598-1.215 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    brand: "#000000",
    path: (
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.83 4.83 0 0 1-1.84-.07z" />
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    brand: "#FF0000",
    path: (
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    brand: "#0A66C2",
    path: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    ),
  },
  {
    key: "twitter",
    label: "X",
    brand: "#000000",
    path: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    ),
  },
];

export default function RedesSocialesCTA({
  redes,
  whatsapp,
  carreraNombre,
  gradoLabel,
  accent = "#00D4FF",
}: Props) {
  const activas = REDES.filter((r) => Boolean(redes?.[r.key]?.trim()));
  if (activas.length === 0 && !whatsapp) return null;

  const accentStyle = { "--accent": accent } as CSSProperties;
  const waText = encodeURIComponent(
    `Hola, me interesa la ${gradoLabel ?? "carrera"} en ${carreraNombre ?? "CENYCA"}`,
  );
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waText}` : null;

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#121B33]"
      style={accentStyle}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full opacity-15 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <span
          className="inline-flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] font-semibold mb-4"
          style={{ color: accent }}
        >
          <span className="h-px w-8" style={{ backgroundColor: accent, opacity: 0.4 }} />
          Mantente conectado
          <span className="h-px w-8" style={{ backgroundColor: accent, opacity: 0.4 }} />
        </span>

        <h2 className="font-bebas text-white text-5xl sm:text-6xl tracking-wide leading-[1.05] mb-4 text-balance">
          Síguenos en redes sociales
        </h2>

        <p className="font-montserrat text-white/65 text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto text-balance">
          Conoce el día a día de CENYCA, eventos, becas, testimonios y novedades del programa.
        </p>

        {/* Logos */}
        {activas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 mb-12">
            {activas.map((r) => (
              <a
                key={r.key}
                href={redes![r.key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Síguenos en ${r.label}`}
                className="group relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-2xl"
                style={r.gradient ? { backgroundImage: r.gradient } : { backgroundColor: r.brand }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 sm:h-8 sm:w-8"
                  aria-hidden
                >
                  {r.path}
                </svg>
                <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 font-montserrat text-[10px] uppercase tracking-wider text-white/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {r.label}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Mini CTA WhatsApp */}
        {waLink && (
          <div className="flex flex-col items-center gap-3">
            <span className="font-montserrat text-sm text-white/45">¿Prefieres hablar con un asesor?</span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-montserrat font-semibold text-sm text-white/85 hover:text-white border-b border-white/20 hover:border-white pb-0.5 transition-colors"
            >
              <MessageCircle size={16} style={{ color: accent }} />
              Pregúntanos por WhatsApp
            </a>
          </div>
        )}

        {/* Link sutil a todas las carreras */}
        <Link
          href="/oferta-academica"
          className="mt-12 inline-flex items-center gap-2 font-montserrat text-xs text-white/35 hover:text-white/70 transition-colors"
        >
          Ver todas las carreras
          <ChevronRight size={12} />
        </Link>
      </div>
    </section>
  );
}
