"use client";

/**
 * ShareButtons — botones de compartir social para artículos / noticias.
 *
 * Opciones disponibles (todas con identidad de marca y tooltip):
 *   - Copiar link (con feedback "¡Copiado!" durante 2s)
 *   - WhatsApp (verde)
 *   - Facebook (azul Meta)
 *   - X / Twitter (negro)
 *   - LinkedIn (azul corporativo)
 *
 * Instagram NO tiene un share-URL público (Meta nunca lo lanzó), así que
 * mostramos un botón "Compartir en Stories" SOLO en mobile que:
 *   1) Copia el link al portapapeles
 *   2) Abre la app de IG vía deep link
 *   3) El usuario pega y postea manualmente
 * En desktop el botón no aparece (no tiene sentido).
 */

import { useEffect, useState } from "react";
import { MessageCircle, Link2, Check } from "lucide-react";

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

type Props = {
  url: string;
  title: string;
};

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detección simple de mobile para mostrar el botón de IG Stories.
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const links = {
    whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso si el browser bloquea clipboard
    }
  };

  const shareToInstagramStories = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
    // Deep link a la cámara de IG Stories. Si no está instalada cae al web.
    window.location.href = "instagram://story-camera";
    // Fallback: abrir IG web después de un momento
    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank");
    }, 600);
  };

  const baseBtn =
    "group relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-white/70 transition-all duration-200 hover:scale-110";

  const Tooltip = ({ label }: { label: string }) => (
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#121B33] border border-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  );

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mr-1">
        Compartir
      </span>

      {/* Copiar link */}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copiar enlace"
        className={`${baseBtn} hover:border-[#00D4FF] hover:text-[#00D4FF] hover:bg-[#00D4FF]/10`}
      >
        {copied ? <Check size={16} /> : <Link2 size={15} />}
        <Tooltip label={copied ? "¡Copiado!" : "Copiar link"} />
      </button>

      {/* WhatsApp */}
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir por WhatsApp"
        className={`${baseBtn} hover:border-[#25D366] hover:text-white hover:bg-[#25D366]`}
      >
        <MessageCircle size={16} />
        <Tooltip label="WhatsApp" />
      </a>

      {/* Facebook */}
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en Facebook"
        className={`${baseBtn} hover:border-[#1877F2] hover:text-white hover:bg-[#1877F2]`}
      >
        <FacebookIcon />
        <Tooltip label="Facebook" />
      </a>

      {/* X / Twitter */}
      <a
        href={links.x}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en X"
        className={`${baseBtn} hover:border-white hover:text-white hover:bg-black`}
      >
        <XIcon />
        <Tooltip label="X (Twitter)" />
      </a>

      {/* LinkedIn */}
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Compartir en LinkedIn"
        className={`${baseBtn} hover:border-[#0A66C2] hover:text-white hover:bg-[#0A66C2]`}
      >
        <LinkedInIcon />
        <Tooltip label="LinkedIn" />
      </a>

      {/* Instagram Stories — solo mobile */}
      {isMobile && (
        <button
          type="button"
          onClick={shareToInstagramStories}
          aria-label="Compartir en Instagram Stories"
          className={`${baseBtn} hover:border-transparent hover:text-white hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF]`}
        >
          <InstagramIcon />
          <Tooltip label="Instagram Stories" />
        </button>
      )}
    </div>
  );
}
