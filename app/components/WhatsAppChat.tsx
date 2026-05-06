"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const QUICK_REPLIES = [
  {
    id: "carreras",
    label: "Quiero información de carreras",
    message:
      "Hola, me interesa conocer más sobre las carreras que ofrece CENYCA Universidad.",
  },
  {
    id: "costos",
    label: "Costos y becas",
    message: "Hola, me gustaría información sobre costos y becas.",
  },
  {
    id: "visita",
    label: "Agendar visita al campus",
    message:
      "Hola, me gustaría agendar una visita al campus para conocerlo en persona.",
  },
  {
    id: "otra",
    label: "Tengo otra pregunta",
    message: "Hola, tengo una pregunta sobre CENYCA Universidad.",
  },
] as const;

const DEFAULT_MSG = "Hola, me gustaría más información sobre CENYCA Universidad.";

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  );
}

export default function WhatsAppChat({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // Burbuja preview: lo que ocurra primero — pasar el primer viewport o 4s.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = sessionStorage.getItem("waChatBubbleDismissed");
    if (dismissed) return;

    let fired = false;
    const trigger = () => {
      if (fired) return;
      fired = true;
      setShowBubble(true);
    };

    // Fallback por tiempo (lectores que no scrollean)
    const timer = setTimeout(trigger, 4000);

    // Trigger por scroll — apenas pasen ~80% del primer viewport
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function dismissBubble() {
    setShowBubble(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("waChatBubbleDismissed", "1");
    }
  }

  function openWhatsapp(message: string = DEFAULT_MSG) {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function toggle() {
    setOpen((o) => !o);
    dismissBubble();
  }

  return (
    <>
      {/* Panel del chat */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat de WhatsApp"
          className="fixed bottom-24 right-4 md:right-6 z-[60] w-[min(360px,calc(100vw-2rem))] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden border border-black/10"
          style={{ animation: "waChatIn 0.3s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1B2040] to-[#121B33] text-white p-5 flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-[#00D4FF] text-[#121B33] font-black flex items-center justify-center text-base">
                C
              </div>
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-[#121B33]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">Atención CENYCA</p>
              <p className="text-white/60 text-[11px] flex items-center gap-1.5">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                En línea · Te responde un asesor
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="shrink-0 text-white/60 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-[#ECE5DD] px-4 pt-4 pb-3 max-h-[420px] overflow-y-auto">
            {/* Mensaje de bienvenida */}
            <div className="flex mb-4">
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] shadow-sm">
                <p className="text-[#1B2040] text-sm leading-relaxed">
                  ¡Hola! 👋 Soy asesor de CENYCA Universidad. ¿En qué te puedo ayudar hoy?
                </p>
                <p className="text-[#76777E] text-[10px] mt-1.5 text-right">
                  En línea
                </p>
              </div>
            </div>

            {/* Quick replies */}
            <p className="text-[#3D4660] text-[10px] uppercase tracking-[0.2em] font-bold mb-2 px-1">
              Selecciona una opción
            </p>
            <div className="space-y-2">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.id}
                  type="button"
                  onClick={() => openWhatsapp(qr.message)}
                  className="w-full text-left bg-white border border-black/5 rounded-xl px-4 py-3 text-sm text-[#1B2040] font-medium hover:bg-[#00D4FF]/8 hover:border-[#00D4FF]/40 hover:translate-x-0.5 transition-all shadow-sm"
                >
                  {qr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer / CTA principal */}
          <div className="bg-white p-3 border-t border-black/5">
            <button
              type="button"
              onClick={() => openWhatsapp()}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FBB5A] text-white font-bold text-sm py-3 rounded-xl transition-colors"
            >
              <WhatsAppIcon size={18} />
              Iniciar conversación
            </button>
            <p className="text-center text-[#76777E] text-[10px] mt-2">
              Tu mensaje se abrirá en WhatsApp
            </p>
          </div>
        </div>
      )}

      {/* Burbujita preview */}
      {!open && showBubble && (
        <div
          className="fixed bottom-24 right-4 md:right-6 z-[60] max-w-[260px]"
          style={{ animation: "waChatBubbleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <button
            type="button"
            onClick={dismissBubble}
            aria-label="Ocultar mensaje"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1B2040] text-white text-xs font-bold flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
          >
            ×
          </button>
          <button
            type="button"
            onClick={() => { setOpen(true); dismissBubble(); }}
            className="block bg-white text-[#1B2040] rounded-2xl rounded-br-sm shadow-[0_8px_28px_rgba(0,0,0,0.18)] px-4 py-3 text-left hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)] transition-shadow"
          >
            <p className="text-sm leading-snug">
              👋 ¡Hola! ¿Tienes dudas sobre carreras o admisiones?
            </p>
            <p className="text-[#00D4FF] text-xs font-bold mt-1.5">
              Pregúntanos por WhatsApp →
            </p>
          </button>
        </div>
      )}

      {/* Botón flotante (FAB) */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
        aria-expanded={open}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_28px_rgba(37,211,102,0.5)] flex items-center justify-center hover:scale-105 hover:shadow-[0_12px_36px_rgba(37,211,102,0.7)] transition-all"
      >
        {open ? <X size={24} strokeWidth={2.5} /> : <WhatsAppIcon size={26} />}
        {/* Pulso suave cuando está cerrado */}
        {!open && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping"
            style={{ animationDuration: "2.5s" }}
          />
        )}
      </button>

      <style>{`
        @keyframes waChatIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes waChatBubbleIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
