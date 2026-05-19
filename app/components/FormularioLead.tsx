"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Clock, HeartHandshake } from "lucide-react";
import { FadeLeft, FadeRight, FadeUp } from "@/app/components/ScrollReveal";

type FormState = {
  nombre: string;
  telefono: string;
  email: string;
  carrera: string;
  acepta: boolean;
};

const INITIAL: FormState = {
  nombre: "",
  telefono: "",
  email: "",
  carrera: "",
  acepta: false,
};

export default function FormularioLead({
  carreras = [],
}: {
  carreras?: string[];
}) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acepta) return;
    setEnviando(true);
    // TODO: conectar backend (Resend / Sanity / CRM)
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
    }, 600);
  }

  return (
    <section className="relative bg-[#F9F9FB] py-28 md:py-32 px-6 md:px-12 overflow-hidden">
      {/* Halos decorativos sutiles */}
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-[#E9C176]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-[#00D4FF]/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Columna izquierda — copy editorial */}
          <FadeLeft className="lg:col-span-6">
            <p className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase mb-6">
              ¿Aún no decides?
            </p>
            <h2
              className="font-extrabold text-[#121B33] mb-6"
              style={{
                fontSize: "clamp(2.2rem, 4.6vw, 3.8rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
              }}
            >
              No te pierdas nada de{" "}
              <span className="text-[#00D4FF]">CENYCA Universidad</span>.
            </h2>
            <p className="text-[#45464D] text-base md:text-lg leading-relaxed max-w-xl mb-10">
              Déjanos tus datos y un asesor se comunicará contigo para
              orientarte sin compromiso y ayudarte a tomar la mejor decisión.
            </p>

            <ul className="space-y-4 max-w-md">
              {[
                { Icon: HeartHandshake, texto: "Asesoría personalizada" },
                { Icon: Sparkles, texto: "Sin costo, sin compromiso" },
                { Icon: Clock, texto: "Un asesor listo para atenderte al instante" },
              ].map(({ Icon, texto }) => (
                <li
                  key={texto}
                  className="flex items-center gap-4 text-[#121B33]"
                >
                  <span className="w-10 h-10 rounded-full bg-[#121B33] text-[#00D4FF] flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <span className="text-[15px] font-medium">{texto}</span>
                </li>
              ))}
            </ul>
          </FadeLeft>

          {/* Columna derecha — formulario en card oscura */}
          <FadeRight className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-[#121B33] p-8 md:p-10 shadow-[0_30px_80px_rgba(18,27,51,0.25)]">
              {/* Acento superior */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#E9C176] to-[#00D4FF]" />

              {enviado ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center mb-6">
                    <Check size={28} className="text-[#00D4FF]" strokeWidth={2.5} />
                  </div>
                  <h3
                    className="text-white font-extrabold mb-3"
                    style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}
                  >
                    ¡Recibimos tus datos!
                  </h3>
                  <p className="text-white/65 text-sm leading-relaxed max-w-sm mx-auto">
                    Un asesor de CENYCA Universidad se pondrá en contacto contigo
                    muy pronto. Mientras tanto, explora nuestros programas.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[#00D4FF] text-[11px] font-bold tracking-[0.3em] uppercase mb-3">
                    Recibe orientación
                  </p>
                  <h3
                    className="text-white font-extrabold mb-2"
                    style={{ fontSize: "1.6rem", letterSpacing: "-0.02em" }}
                  >
                    Déjanos tus datos
                  </h3>
                  <p className="text-white/55 text-sm mb-7">
                    Toma menos de un minuto.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <Field
                      label="Nombre completo"
                      type="text"
                      placeholder="Tu nombre"
                      required
                      value={form.nombre}
                      onChange={(v) => setForm({ ...form, nombre: v })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field
                        label="WhatsApp / Teléfono"
                        type="tel"
                        placeholder="664 000 0000"
                        required
                        value={form.telefono}
                        onChange={(v) => setForm({ ...form, telefono: v })}
                      />
                      <Field
                        label="Correo electrónico"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        value={form.email}
                        onChange={(v) => setForm({ ...form, email: v })}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold tracking-[0.18em] uppercase text-white/70 mb-2">
                        Carrera de interés
                      </label>
                      <div className="relative">
                        <select
                          value={form.carrera}
                          onChange={(e) =>
                            setForm({ ...form, carrera: e.target.value })
                          }
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white outline-none appearance-none bg-white/[0.06] border border-white/15 focus:border-[#00D4FF] focus:bg-white/[0.09] transition-all pr-10"
                          style={{
                            color: form.carrera ? "white" : "rgba(255,255,255,0.4)",
                          }}
                        >
                          <option value="" style={{ background: "#121B33" }}>
                            Aún no decido / Otra
                          </option>
                          {carreras.map((c) => (
                            <option
                              key={c}
                              value={c}
                              style={{ background: "#121B33", color: "white" }}
                            >
                              {c}
                            </option>
                          ))}
                        </select>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-xs"
                        >
                          ▼
                        </span>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                      <span className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          required
                          checked={form.acepta}
                          onChange={(e) =>
                            setForm({ ...form, acepta: e.target.checked })
                          }
                          className="peer sr-only"
                        />
                        <span className="w-5 h-5 rounded-md border border-white/25 bg-white/[0.06] peer-checked:bg-[#00D4FF] peer-checked:border-[#00D4FF] flex items-center justify-center transition-all">
                          {form.acepta && (
                            <Check
                              size={14}
                              className="text-[#121B33]"
                              strokeWidth={3}
                            />
                          )}
                        </span>
                      </span>
                      <span className="text-xs text-white/60 leading-relaxed">
                        Acepto recibir información de CENYCA Universidad y he
                        leído el{" "}
                        <Link
                          href="/avisos-de-privacidad"
                          className="text-[#00D4FF] underline-offset-2 hover:underline"
                        >
                          aviso de privacidad
                        </Link>
                        .
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={!form.acepta || enviando}
                      className="group/btn relative w-full py-4 rounded-xl bg-[#00D4FF] text-[#121B33] font-bold text-sm uppercase tracking-[0.18em] flex items-center justify-center gap-2 hover:bg-[#33DDFF] hover:shadow-[0_10px_30px_rgba(0,212,255,0.35)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all"
                    >
                      {enviando ? "Enviando…" : "Quiero recibir orientación"}
                      {!enviando && (
                        <ArrowRight
                          size={16}
                          strokeWidth={2.5}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            <FadeUp delay={0.15}>
              <p className="text-center text-[#76777E] text-xs mt-6">
                ¿Prefieres hablar ahora?{" "}
                <a
                  href="https://wa.me/526632093980"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#121B33] font-semibold underline-offset-2 hover:underline"
                >
                  Escríbenos por WhatsApp
                </a>
              </p>
            </FadeUp>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  type,
  placeholder,
  required,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-[0.18em] uppercase text-white/70 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none bg-white/[0.06] border border-white/15 focus:border-[#00D4FF] focus:bg-white/[0.09] transition-all"
      />
    </div>
  );
}
