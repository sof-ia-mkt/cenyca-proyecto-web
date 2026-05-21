import Link from "next/link";
import { HelpCircle, Shield, ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { configuracionQuery } from "@/sanity/lib/queries";
import FooterSocialBar from "@/app/components/FooterSocialBar";

type RedesSociales = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
};

type Configuracion = { redesSociales?: RedesSociales };

// Iconos de marca (SVG inline — lucide-react ya no exporta los de marca en versiones recientes)
type IconProps = { size?: number };

function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 4.99 3.66 9.13 8.44 9.93v-7.02H7.9v-2.91h2.54V9.84c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.8 8.43-4.94 8.43-9.93Z" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.71a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.14Z" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.13C19.5 3.86 12 3.86 12 3.86s-7.5 0-9.4.51A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.13C4.5 20.14 12 20.14 12 20.14s7.5 0 9.4-.51a3 3 0 0 0 2.1-2.13C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.27 3.6L9.6 15.6Z" />
    </svg>
  );
}

export default async function Footer() {
  const config = await client.fetch<Configuracion>(configuracionQuery).catch(() => null);
  const r = config?.redesSociales ?? {};

  const socials = [
    { key: "instagram", url: r.instagram, label: "Instagram", Icon: InstagramIcon },
    { key: "facebook", url: r.facebook, label: "Facebook", Icon: FacebookIcon },
    { key: "tiktok", url: r.tiktok, label: "TikTok", Icon: TikTokIcon },
    { key: "youtube", url: r.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s) => !!s.url);

  return (
    <footer className="bg-[#121B33] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Información útil — Preguntas frecuentes + Aviso de privacidad */}
        <div className="py-10 sm:py-12 border-b border-white/[0.06]">
          <p className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase mb-5 text-center sm:text-left">
            Información útil
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              href="/preguntas-frecuentes"
              className="group relative flex items-center gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.08] hover:border-[#00D4FF]/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center group-hover:bg-[#00D4FF]/20 transition-colors">
                <HelpCircle size={24} className="text-[#00D4FF]" strokeWidth={1.75} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-white font-semibold text-base sm:text-lg leading-snug">
                  Preguntas frecuentes
                </span>
                <span className="block text-white/55 text-xs sm:text-sm mt-1 leading-snug">
                  RVOE, becas, horarios, inscripción, titulación y más.
                </span>
              </span>
              <ArrowRight
                size={18}
                className="flex-shrink-0 text-white/40 group-hover:text-[#00D4FF] group-hover:translate-x-0.5 transition-all"
              />
            </Link>

            <Link
              href="/avisos-de-privacidad"
              className="group relative flex items-center gap-4 bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.08] hover:border-[#00D4FF]/40 hover:-translate-y-0.5 transition-all"
            >
              <span className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center group-hover:bg-[#00D4FF]/20 transition-colors">
                <Shield size={24} className="text-[#00D4FF]" strokeWidth={1.75} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-white font-semibold text-base sm:text-lg leading-snug">
                  Aviso de privacidad
                </span>
                <span className="block text-white/55 text-xs sm:text-sm mt-1 leading-snug">
                  Cómo protegemos y usamos tus datos personales.
                </span>
              </span>
              <ArrowRight
                size={18}
                className="flex-shrink-0 text-white/40 group-hover:text-[#00D4FF] group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </div>
        </div>

        {/* Redes sociales — se ocultan en /carreras/[slug] para no duplicar la sección dedicada */}
        {socials.length > 0 && (
          <FooterSocialBar>
            <div className="flex items-center justify-center gap-3 py-6 border-b border-white/[0.06]">
              {socials.map(({ key, url, label, Icon }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#00D4FF] hover:text-[#121B33] hover:border-[#00D4FF] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </FooterSocialBar>
        )}

        {/* Copyright + RVOE */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-montserrat">
            © {new Date().getFullYear()} CENYCA Universidad. Todos los derechos reservados.
          </p>
          <span className="text-white/30 text-xs font-montserrat">
            RVOE · SEP · Baja California
          </span>
        </div>
      </div>
    </footer>
  );
}
