"use client";

import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

export default function NewsletterSuscripcion() {
  const [email, setEmail] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!acepta) return;
    setEnviando(true);
    // TODO: conectar backend (Resend Audiences / Mailchimp / Sanity)
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
    }, 600);
  }

  return (
    <section className="relative my-16 md:my-20">
      <div className="relative rounded-3xl overflow-hidden bg-[#121B33] p-8 md:p-12 shadow-[0_30px_80px_rgba(18,27,51,0.25)]">
        {/* Acento superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#E9C176] to-[#00D4FF]" />

        {/* Halos decorativos */}
        <div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-[#00D4FF]/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[24rem] h-[24rem] bg-[#E9C176]/8 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/25 mb-5">
              <Mail size={13} className="text-[#00D4FF]" strokeWidth={2.5} />
              <span className="text-[#00D4FF] text-[10px] font-bold tracking-[0.25em] uppercase">
                Newsletter
              </span>
            </div>
            <h2
              className="text-white font-extrabold mb-4"
              style={{
                fontSize: "clamp(1.7rem, 3.2vw, 2.6rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
              }}
            >
              Suscríbete al newsletter de{" "}
              <span className="text-[#00D4FF]">CENYCA</span>.
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-md">
              Recibe noticias, eventos y oportunidades académicas directamente
              en tu correo. Sin spam, solo lo importante.
            </p>
          </div>

          {/* Form */}
          <div>
            {enviado ? (
              <div className="flex items-center gap-4 rounded-2xl bg-white/[0.04] border border-[#00D4FF]/25 px-5 py-5">
                <span className="w-11 h-11 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center shrink-0">
                  <Check size={20} className="text-[#00D4FF]" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="text-white font-bold text-sm mb-0.5">
                    ¡Suscripción confirmada!
                  </p>
                  <p className="text-white/55 text-xs">
                    Te enviaremos noticias importantes de CENYCA Universidad.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none bg-white/[0.06] border border-white/15 focus:border-[#00D4FF] focus:bg-white/[0.09] transition-all"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      required
                      checked={acepta}
                      onChange={(e) => setAcepta(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="w-5 h-5 rounded-md border border-white/25 bg-white/[0.06] peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] flex items-center justify-center transition-all">
                      {acepta && (
                        <Check
                          size={14}
                          className="text-[#121B33]"
                          strokeWidth={3}
                        />
                      )}
                    </span>
                  </span>
                  <span className="text-xs text-white/55 leading-relaxed">
                    Acepto recibir comunicaciones de CENYCA y he leído el{" "}
                    <a
                      href="/avisos-de-privacidad"
                      className="text-[#00D4FF] underline-offset-2 hover:underline"
                    >
                      aviso de privacidad
                    </a>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!acepta || enviando}
                  className="group/btn w-full py-3.5 rounded-xl bg-[#00D4FF] text-[#121B33] font-bold text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#33DDFF] hover:shadow-[0_10px_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all"
                >
                  {enviando ? "Enviando…" : "Suscribirme"}
                  {!enviando && (
                    <ArrowRight
                      size={16}
                      strokeWidth={2.5}
                      className="group-hover/btn:translate-x-1 transition-transform"
                    />
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
