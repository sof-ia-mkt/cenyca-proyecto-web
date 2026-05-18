"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export default function PromoPopup({
  backgroundUrl,
}: {
  backgroundUrl?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Una vez mostrado, no se vuelve a abrir hasta que el usuario refresque la página
  // (refresh o entrar de nuevo desde fuera). Navegación interna no lo re-dispara
  // porque el componente vive en el layout y no se desmonta.
  const shownRef = useRef(false);

  useEffect(() => {
    // Solo en home; en otras rutas no se dispara.
    if (pathname !== "/") return;
    const timer = setTimeout(() => {
      if (!shownRef.current) {
        shownRef.current = true;
        setOpen(true);
      }
    }, 25000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // ESC cierra
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Bloquea scroll del body
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [open]);

  function dismiss() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Promoción de inscripción"
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-6"
      style={{ animation: "promoPopupBackdropIn 0.3s ease-out" }}
      onClick={dismiss}
    >
      {/* Backdrop blur */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Card cinematográfica con foto */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[560px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_50px_140px_rgba(0,0,0,0.7)]"
        style={{ animation: "promoPopupIn 0.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {/* Foto de fondo */}
        {backgroundUrl ? (
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              animation: "promoPopupKenBurns 18s ease-in-out infinite alternate",
            }}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-[#1B2A55] via-[#121B33] to-[#0B1226]"
          />
        )}

        {/* Overlay cinematográfico — la foto se ve, el texto queda legible al fondo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/45 to-black/95"
        />
        {/* Vignette lateral muy sutil */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15"
        />

        {/* Glow cyan ambient */}
        <span
          aria-hidden
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#00D4FF]/30 blur-[110px] pointer-events-none"
        />

        {/* Botón cerrar */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all"
        >
          <X size={16} />
        </button>

        {/* Contenido */}
        <div className="relative z-10 p-7 md:p-10 pt-12 md:pt-14 min-h-[480px] md:min-h-[540px] flex flex-col justify-end">
          {/* Headline */}
          <h2
            className="text-white font-black mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 2.8rem)",
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
            }}
          >
            Iniciamos en{" "}
            <span
              className="bg-clip-text text-transparent inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #00D4FF 0%, #00D4FF 35%, #B3F0FF 48%, #FFFFFF 50%, #B3F0FF 52%, #00D4FF 65%, #00D4FF 100%)",
                backgroundSize: "250% 100%",
                animation: "textShimmer 5s ease-in-out infinite",
                filter:
                  "drop-shadow(0 0 18px rgba(0,212,255,0.55)) drop-shadow(0 0 6px rgba(0,212,255,0.45))",
              }}
            >
              septiembre.
            </span>
          </h2>

          {/* Body */}
          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] max-w-md">
            Sé de los <span className="text-white font-bold">primeros 50 en inscribirte</span> y
            recibe un <span className="text-[#E9C176] font-bold">descuento exclusivo</span> en tu
            inscripción.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/#contacto"
              onClick={(e) => {
                dismiss();
                // Solo hacemos scroll suave si ya estamos en home; en otras rutas el
                // navegador navega a /#contacto automáticamente.
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  // Pequeño delay para dar tiempo a que el popup haga unmount antes del scroll.
                  setTimeout(() => {
                    document
                      .getElementById("contacto")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 80);
                }
              }}
              className="group inline-flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-[#33DDFF] text-[#121B33] font-extrabold text-sm md:text-base uppercase tracking-[0.18em] px-7 py-4 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(0,212,255,0.65)] shadow-[0_10px_32px_rgba(0,212,255,0.4)]"
            >
              Quiero la promoción
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <button
              type="button"
              onClick={dismiss}
              className="text-white/55 hover:text-white/85 text-xs uppercase tracking-[0.22em] font-bold py-2 transition-colors"
            >
              Tal vez después
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes promoPopupBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes promoPopupIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes promoPopupKenBurns {
          from { transform: scale(1.05); }
          to   { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
