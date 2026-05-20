"use client";

import { useEffect, useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Send,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MessageCircle,
} from "lucide-react";

// Endpoint Emma (Novai). Misma key que el resto del sitio — ya pública.
const API_URL = "https://emma-sistema.up.railway.app/api/landing/prospect";
const API_KEY = "sofia-cenyca-2026-xK9mP4";

const PLANTEL_LABEL: Record<string, string> = {
  casablanca: "Casa Blanca",
  palmas: "Palmas",
  otay: "Otay",
  tecate: "Tecate",
};

const CIUDAD_POR_PLANTEL: Record<string, string> = {
  casablanca: "Tijuana",
  palmas: "Tijuana",
  otay: "Tijuana",
  tecate: "Tecate",
};

export type CicloInicioConfig = {
  activo?: boolean;
  fecha?: string; // ISO string
  kicker?: string;
  slogan?: string;
  mensaje?: string;
  mensajeCicloIniciado?: string;
};

type Props = {
  data?: CicloInicioConfig;
  porcentajeDescuento?: number;
  whatsappFallback?: string;
};

type FormState = { nombre: string; telefono: string; plantel: string };
type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success" };

function trackLead() {
  if (typeof window !== "undefined") {
    const w = window as unknown as { fbq?: (a: string, e: string) => void };
    w.fbq?.("track", "Lead");
  }
}

function useCountdown(targetISO?: string) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!targetISO) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  if (!targetISO) return null;
  const target = new Date(targetISO).getTime();
  if (Number.isNaN(target)) return null;
  const diff = target - now;
  if (diff <= 0) return { dias: 0, horas: 0, min: 0, seg: 0, finished: true };

  const dias = Math.floor(diff / 86400000);
  const horas = Math.floor((diff % 86400000) / 3600000);
  const min = Math.floor((diff % 3600000) / 60000);
  const seg = Math.floor((diff % 60000) / 1000);
  return { dias, horas, min, seg, finished: false };
}

export default function CtaContadorClases({
  data,
  porcentajeDescuento = 20,
  whatsappFallback = "526632093980",
}: Props) {
  const countdown = useCountdown(data?.fecha);
  const [form, setForm] = useState<FormState>({ nombre: "", telefono: "", plantel: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  if (!data?.activo) return null;

  const slogan = data.slogan ?? "Donde tu potencial se vuelve éxito";
  const kicker = data.kicker ?? "Iniciamos clases pronto";
  const mensajeRaw = data.mensaje ?? "Deja tus datos y obtén un {porcentaje}% de descuento en tu inscripción";
  // Partimos el mensaje alrededor del placeholder para poder destacar el porcentaje visualmente.
  const mensajePartes = mensajeRaw.split(/\{porcentaje\}%?/);
  const mensaje = mensajeRaw.replace(/\{porcentaje\}/g, String(porcentajeDescuento));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    setStatus({ kind: "submitting" });

    const telefonoNorm = form.telefono.replace(/\D/g, "").slice(-10);
    if (telefonoNorm.length !== 10) {
      setStatus({ kind: "error", message: "Verifica tu teléfono (10 dígitos)." });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify({
          telefono: telefonoNorm,
          nombre: form.nombre.trim(),
          email: "",
          carrera: "Sin especificar",
          plantel: PLANTEL_LABEL[form.plantel] || form.plantel,
          ciudad: CIUDAD_POR_PLANTEL[form.plantel] || "Tijuana",
          source: "home-cta-contador",
        }),
      });

      if (res.ok) {
        trackLead();
        setStatus({ kind: "success" });
        return;
      }
      if (res.status === 422) {
        setStatus({ kind: "error", message: "Verifica tu teléfono. Debe ser válido." });
      } else if (res.status === 429) {
        setStatus({ kind: "error", message: "Demasiados intentos. Espera un momento." });
      } else {
        setStatus({ kind: "error", message: "Hubo un error. Intenta de nuevo." });
      }
    } catch {
      setStatus({ kind: "error", message: "Sin conexión. Intenta de nuevo." });
    }
  }

  return (
    <section
      id="contacto"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24"
      style={{
        background:
          "linear-gradient(135deg, #121B33 0%, #1A2748 45%, #142042 70%, #121B33 100%)",
      }}
    >
      {/* Línea sutil cian al borde superior — marca la sección como especial */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.45) 50%, transparent 100%)",
        }}
      />
      {/* Halos cian intensificados — más presencia, mismo lenguaje del resto del sitio */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-20 h-[560px] w-[560px] rounded-full bg-[#00D4FF]/20 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-[#00D4FF]/15 blur-[140px]"
      />
      {/* Línea sutil cian al borde inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.45) 50%, transparent 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Izquierda — pitch + contador */}
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] text-[#00D4FF] font-semibold mb-5">
            <Sparkles size={14} />
            {kicker}
          </span>

          <h2 className="font-bebas text-white text-[2.75rem] sm:text-6xl lg:text-7xl tracking-wide leading-[1.02] mb-8 text-balance uppercase">
            {slogan}
          </h2>

          {/* Contador */}
          {countdown && !countdown.finished && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3 max-w-md mb-8">
              {[
                { label: "Días", value: countdown.dias },
                { label: "Horas", value: countdown.horas },
                { label: "Min", value: countdown.min },
                { label: "Seg", value: countdown.seg },
              ].map((u) => (
                <div
                  key={u.label}
                  className="bg-white/[0.06] border border-white/10 rounded-2xl px-3 py-3.5 sm:px-3 sm:py-4 text-center"
                >
                  <div className="font-bebas text-white text-3xl sm:text-4xl lg:text-5xl tracking-wider leading-none tabular-nums">
                    {String(u.value).padStart(2, "0")}
                  </div>
                  <div className="font-montserrat text-[10px] sm:text-xs uppercase tracking-wider text-white/45 mt-1.5">
                    {u.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {countdown?.finished && data.mensajeCicloIniciado && (
            <div className="bg-white/[0.06] border border-white/10 rounded-xl px-5 py-4 mb-6 font-montserrat text-white/75 text-sm flex gap-2 items-start">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-[#00D4FF]" />
              <span>{data.mensajeCicloIniciado}</span>
            </div>
          )}

          <p className="font-montserrat text-white/85 text-xl sm:text-2xl leading-snug max-w-xl text-balance">
            {mensajePartes.length === 2 ? (
              <>
                {mensajePartes[0]}
                <span
                  className="inline-flex items-baseline font-bebas text-[#00D4FF] tracking-wider"
                  style={{ fontSize: "1.6em", lineHeight: 0.9 }}
                >
                  {porcentajeDescuento}%
                </span>
                <span className="inline-block w-0.5" />
                {mensajePartes[1]}
              </>
            ) : (
              mensaje
            )}
          </p>
        </div>

        {/* Derecha — formulario o success */}
        <div className="lg:col-span-5">
          {status.kind === "success" ? (
            <div className="bg-gradient-to-br from-[#1E2348] to-[#161A35] rounded-2xl border border-[#00D4FF]/40 p-8 text-center shadow-2xl">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center mb-5">
                <CheckCircle2 size={28} className="text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-bebas text-white text-3xl tracking-wide mb-2">¡Listo!</h3>
              <p className="font-montserrat text-white/65 text-sm leading-relaxed mb-6 text-pretty">
                Un asesor educativo te contactará por WhatsApp en menos de 24 hrs para confirmar tu{" "}
                {porcentajeDescuento}% de descuento.
              </p>
              <a
                href={`https://wa.me/${whatsappFallback}?text=${encodeURIComponent(
                  `Hola, soy ${form.nombre}. Acabo de registrarme para el próximo ciclo de clases.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1FB055] text-white font-montserrat font-bold px-6 py-3 rounded-full transition-colors text-sm"
              >
                <MessageCircle size={16} />
                Adelantar contacto por WhatsApp
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#1E2348] to-[#161A35] rounded-2xl border border-white/10 p-6 sm:p-7 shadow-2xl"
            >
              <h3 className="font-montserrat font-bold text-white text-xl mb-1">
                Reclama tu {porcentajeDescuento}%
              </h3>
              <p className="font-montserrat text-white/55 text-sm mb-5">
                Tres datos. Un asesor te contacta hoy mismo.
              </p>

              <div className="space-y-3">
                <Campo icon={<User size={16} />} label="Nombre completo">
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
                    className="cta-input"
                  />
                </Campo>
                <Campo icon={<Phone size={16} />} label="WhatsApp">
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="(664) 000-0000"
                    value={form.telefono}
                    onChange={(e) => setForm((s) => ({ ...s, telefono: e.target.value }))}
                    className="cta-input"
                  />
                </Campo>
                <Campo icon={<MapPin size={16} />} label="Plantel de interés">
                  <select
                    required
                    value={form.plantel}
                    onChange={(e) => setForm((s) => ({ ...s, plantel: e.target.value }))}
                    className="cta-input cta-select"
                  >
                    <option value="" disabled>
                      Selecciona
                    </option>
                    <option value="casablanca">Casa Blanca</option>
                    <option value="palmas">Palmas</option>
                    <option value="otay">Otay</option>
                    <option value="tecate">Tecate</option>
                  </select>
                </Campo>
              </div>

              {status.kind === "error" && (
                <div className="mt-3 flex gap-2 items-start text-[#FFB4B4] bg-[#FFB4B4]/10 border border-[#FFB4B4]/30 rounded-lg px-3 py-2 font-montserrat text-xs">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status.kind === "submitting"}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-[#00D4FF] hover:bg-white text-[#0E1628] font-montserrat font-bold text-base px-5 py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status.kind === "submitting" ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={16} /> Reclamar mi {porcentajeDescuento}%
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Estilos locales */}
      <style jsx>{`
        :global(.cta-input) {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.5rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #fff;
          font-family: inherit;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        :global(.cta-input::placeholder) {
          color: rgba(255, 255, 255, 0.35);
        }
        :global(.cta-input:focus) {
          border-color: #00d4ff;
          background: rgba(0, 212, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.12);
        }
        :global(.cta-select) {
          appearance: none;
          padding-right: 2.5rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300D4FF' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        :global(.cta-select option) {
          background: #1e2348;
          color: #fff;
        }
      `}</style>
    </section>
  );
}

function Campo({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-montserrat text-[11px] font-semibold text-white/65 mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#00D4FF]/80">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
