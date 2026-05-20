"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Calendar,
  Hash,
  Smartphone,
} from "lucide-react";
import { getCarreraIdentificadores } from "@/lib/carreraIdentificadores";

// Endpoint Emma (Novai). Misma key que las landings dedicadas — ya es pública
// porque vive en HTML estático de landing-pages-cenyca/*/index.html.
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

export type PromocionConfig = {
  activa?: boolean;
  porcentaje?: number;
  kicker?: string;
  titulo?: string;
  subtitulo?: string;
  mensajeComprobante?: string;
  diasExpiracion?: number;
  whatsappAsesor?: string;
};

type Props = {
  carreraSlug: string;
  carreraNombre: string;
  gradoLabel: string;
  promo: PromocionConfig;
  whatsappFallback: string;
  accent?: string;
};

type FormState = {
  nombre: string;
  email: string;
  telefono: string;
  plantel: string;
  turno: string;
  mensaje: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      data: FormState & {
        codigo: string;
        emitidoEn: Date;
        expiraEn: Date;
      };
    };

// Genera un código tipo DESC-YYYYMMDD-XXXX. El XXXX es random base36 estable
// porque se calcula una sola vez en el submit, no en cada render.
function generarCodigo(): string {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DESC-${yyyy}${mm}${dd}-${rand}`;
}

function formatFecha(d: Date): string {
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

// Telemetría Meta — si fbq está cargado, dispara Lead (igual que en las landings).
function trackLead() {
  if (typeof window !== "undefined") {
    const w = window as unknown as { fbq?: (action: string, event: string) => void };
    w.fbq?.("track", "Lead");
  }
}

export default function PromocionFormulario({
  carreraSlug,
  carreraNombre,
  gradoLabel,
  promo,
  whatsappFallback,
  accent = "#00D4FF",
}: Props) {
  const porcentaje = promo.porcentaje ?? 20;
  const dias = promo.diasExpiracion ?? 30;
  const tituloRaw = promo.titulo ?? "Reclama tu descuento del {porcentaje}%";
  const titulo = tituloRaw.replace(/\{porcentaje\}/g, String(porcentaje));
  const subtitulo = promo.subtitulo ?? "Solo por tiempo limitado para nuevos alumnos.";
  const kicker = promo.kicker ?? "Descuento de inscripción";
  const mensajeComprobante =
    promo.mensajeComprobante ?? "Envía este comprobante a tu asesor o preséntalo al inscribirte";
  const whatsappAsesor = promo.whatsappAsesor || whatsappFallback;

  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    plantel: "",
    turno: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const accentStyle = useMemo(() => ({ "--accent": accent } as CSSProperties), [accent]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    setStatus({ kind: "submitting" });

    const telefonoNorm = form.telefono.replace(/\D/g, "").slice(-10);
    if (telefonoNorm.length !== 10) {
      setStatus({ kind: "error", message: "Verifica tu teléfono (debe tener 10 dígitos)." });
      return;
    }

    const { carrera, source } = getCarreraIdentificadores(carreraSlug, carreraNombre);

    const body = {
      telefono: telefonoNorm,
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      carrera,
      plantel: PLANTEL_LABEL[form.plantel] || form.plantel,
      ciudad: CIUDAD_POR_PLANTEL[form.plantel] || "Tijuana",
      turno: form.turno || undefined,
      mensaje: form.mensaje.trim() || undefined,
      source,
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const emitidoEn = new Date();
        const expiraEn = new Date(emitidoEn);
        expiraEn.setDate(expiraEn.getDate() + dias);
        trackLead();
        setStatus({
          kind: "success",
          data: { ...form, telefono: telefonoNorm, codigo: generarCodigo(), emitidoEn, expiraEn },
        });
        return;
      }

      if (res.status === 422) {
        setStatus({ kind: "error", message: "Verifica tu teléfono. Debe ser un número válido." });
      } else if (res.status === 429) {
        setStatus({ kind: "error", message: "Demasiados intentos. Espera un momento e intenta de nuevo." });
      } else if (res.status === 401) {
        setStatus({ kind: "error", message: "Problema de configuración. Contáctanos por WhatsApp." });
      } else {
        setStatus({ kind: "error", message: "Hubo un error. Intenta de nuevo en un momento." });
      }
    } catch {
      setStatus({ kind: "error", message: "Sin conexión. Verifica tu internet e intenta de nuevo." });
    }
  }

  if (status.kind === "success") {
    return (
      <Comprobante
        data={status.data}
        carreraNombre={carreraNombre}
        gradoLabel={gradoLabel}
        porcentaje={porcentaje}
        kicker={kicker}
        mensajeComprobante={mensajeComprobante}
        whatsappAsesor={whatsappAsesor}
        accent={accent}
        accentStyle={accentStyle}
        onReset={() => {
          setStatus({ kind: "idle" });
          setForm({ nombre: "", email: "", telefono: "", plantel: "", turno: "", mensaje: "" });
        }}
      />
    );
  }

  return (
    <section
      id="promocion"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0E1628] overflow-hidden"
      style={accentStyle}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[360px] w-[360px] rounded-full opacity-10 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Lado izquierdo — pitch */}
        <div className="lg:col-span-5">
          <span
            className="inline-flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] font-semibold mb-4"
            style={{ color: accent }}
          >
            <Sparkles size={14} /> {kicker}
          </span>
          <h2 className="font-bebas text-white text-[2.5rem] sm:text-5xl lg:text-[3.25rem] xl:text-6xl tracking-wide leading-[1.05] mb-6 text-balance">
            {titulo}
          </h2>
          <p className="font-montserrat text-white/70 text-base sm:text-lg leading-relaxed mb-8 text-balance">
            {subtitulo}
          </p>

          <ul className="space-y-3">
            {[
              "Asesoría educativa personalizada por WhatsApp",
              "Sin compromiso de inscripción",
              "Recibe tu comprobante al instante",
            ].map((bullet) => (
              <li key={bullet} className="flex gap-3 items-start font-montserrat text-white/80 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lado derecho — formulario */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-[#1E2348] to-[#161A35] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl"
          >
            <h3 className="font-montserrat font-bold text-white text-xl mb-2">Regístrate ahora</h3>
            <p className="font-montserrat text-white/60 text-sm mb-6">
              Completa tus datos y un asesor te contactará.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Campo
                label="Nombre completo"
                icon={<User size={16} />}
                accent={accent}
                wrapperClassName="sm:col-span-2"
              >
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre completo"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  className="form-input"
                />
              </Campo>

              <Campo label="Correo electrónico" icon={<Mail size={16} />} accent={accent}>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="form-input"
                />
              </Campo>

              <Campo label="Teléfono / WhatsApp" icon={<Phone size={16} />} accent={accent}>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="(664) 000-0000"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  className="form-input"
                />
              </Campo>

              <Campo label="Plantel de interés" icon={<MapPin size={16} />} accent={accent}>
                <select
                  required
                  value={form.plantel}
                  onChange={(e) => update("plantel", e.target.value)}
                  className="form-input form-select"
                >
                  <option value="" disabled>
                    Selecciona un plantel
                  </option>
                  <option value="casablanca">CENYCA Casa Blanca</option>
                  <option value="palmas">CENYCA Palmas</option>
                  <option value="otay">CENYCA Otay</option>
                  <option value="tecate">CENYCA Tecate</option>
                </select>
              </Campo>

              <Campo label="Horario de preferencia" icon={<Clock size={16} />} accent={accent}>
                <select
                  required
                  value={form.turno}
                  onChange={(e) => update("turno", e.target.value)}
                  className="form-input form-select"
                >
                  <option value="" disabled>
                    Selecciona un horario
                  </option>
                  <option value="Sin preferencia">Sin preferencia</option>
                  <option value="Entre Semana">Entre semana (Martes)</option>
                  <option value="Sabado Matutino">Fin de semana (Sábado o Domingo)</option>
                </select>
              </Campo>

              <Campo label="¿Alguna pregunta? (opcional)" accent={accent} wrapperClassName="sm:col-span-2">
                <textarea
                  rows={3}
                  placeholder="Escribe tu mensaje aquí..."
                  value={form.mensaje}
                  onChange={(e) => update("mensaje", e.target.value)}
                  className="form-input min-h-[80px] resize-y"
                />
              </Campo>
            </div>

            {status.kind === "error" && (
              <div className="mt-4 flex gap-2 items-start text-[#FFB4B4] bg-[#FFB4B4]/10 border border-[#FFB4B4]/30 rounded-lg px-4 py-3 font-montserrat text-sm">
                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status.kind === "submitting"}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 font-montserrat font-bold text-base px-6 py-4 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:translate-y-[-1px] hover:shadow-lg"
              style={{ backgroundColor: accent, color: "#0E1628" }}
            >
              {status.kind === "submitting" ? (
                "Enviando..."
              ) : (
                <>
                  <Send size={16} /> Reclamar mi {porcentaje}% de descuento
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 font-montserrat text-xs text-white/40">
              <ShieldCheck size={14} style={{ color: accent }} />
              Tus datos están protegidos. Respuesta en menos de 24 hrs.
            </div>
          </form>
        </div>
      </div>

      {/* Estilos locales de los inputs */}
      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.5rem;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        :global(.form-input::placeholder) {
          color: rgba(255, 255, 255, 0.35);
        }
        :global(.form-input:focus) {
          border-color: ${accent};
          background: ${accent}0F;
          box-shadow: 0 0 0 3px ${accent}1A;
        }
        :global(.form-select) {
          appearance: none;
          padding-right: 2.5rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(
            accent
          )}' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
        }
        :global(.form-select option) {
          background: #1E2348;
          color: #fff;
        }
      `}</style>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-componentes

function Campo({
  label,
  icon,
  accent,
  children,
  wrapperClassName = "",
}: {
  label: string;
  icon?: React.ReactNode;
  accent: string;
  children: React.ReactNode;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <label className="block font-montserrat text-xs font-semibold text-white/70 mb-1.5">{label}</label>
      <div className="relative">
        {icon && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
            style={{ color: accent }}
          >
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

function Comprobante({
  data,
  carreraNombre,
  gradoLabel,
  porcentaje,
  kicker,
  mensajeComprobante,
  whatsappAsesor,
  accent,
  accentStyle,
  onReset,
}: {
  data: {
    nombre: string;
    email: string;
    telefono: string;
    plantel: string;
    codigo: string;
    emitidoEn: Date;
    expiraEn: Date;
  };
  carreraNombre: string;
  gradoLabel: string;
  porcentaje: number;
  kicker: string;
  mensajeComprobante: string;
  whatsappAsesor: string;
  accent: string;
  accentStyle: CSSProperties;
  onReset: () => void;
}) {
  const plantelNice = PLANTEL_LABEL[data.plantel] || data.plantel;
  // Evita "Ingeniería en Ingeniería Mecatrónica" cuando el nombre de la carrera ya incluye el grado.
  const programa = carreraNombre.toLowerCase().startsWith(gradoLabel.toLowerCase())
    ? carreraNombre
    : `${gradoLabel} en ${carreraNombre}`;
  const waMessage = encodeURIComponent(
    `Hola, soy ${data.nombre}. Acabo de reclamar mi descuento del ${porcentaje}% para ${programa}.\n\nCódigo: ${data.codigo}\nPlantel: ${plantelNice}\nTeléfono: ${data.telefono}\nVálido hasta: ${formatFecha(data.expiraEn)}`
  );
  const waLink = `https://wa.me/${whatsappAsesor.replace(/\D/g, "")}?text=${waMessage}`;

  return (
    <section
      id="promocion"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0E1628] overflow-hidden"
      style={accentStyle}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${accent} 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: accent }}
          >
            <CheckCircle2 size={14} /> Registro exitoso
          </span>
          <h2 className="font-bebas text-white text-4xl sm:text-5xl tracking-wide leading-[1.05] mt-3 text-balance">
            Tu comprobante está listo
          </h2>
        </div>

        {/* Tarjeta tipo ticket */}
        <div
          className="relative bg-gradient-to-br from-white to-[#F5F7FB] rounded-3xl p-8 sm:p-10 shadow-2xl"
          style={{ boxShadow: `0 30px 80px ${accent}25, 0 10px 30px rgba(0,0,0,0.3)` }}
        >
          {/* Notch top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0E1628]" />
            <span className="w-2 h-2 rounded-full bg-[#0E1628]" />
            <span className="w-2 h-2 rounded-full bg-[#0E1628]" />
          </div>

          {/* Header */}
          <div className="text-center pb-6 border-b border-dashed border-[#121B33]/15">
            <div className="font-bebas text-[#121B33] text-2xl tracking-wider">CENYCA UNIVERSIDAD</div>
            <div className="mt-1 font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#666]">
              {kicker}
            </div>
          </div>

          {/* Porcentaje gigante */}
          <div className="text-center py-8">
            <div
              className="font-bebas leading-none tracking-tight"
              style={{ color: accent, fontSize: "clamp(5rem, 18vw, 9rem)" }}
            >
              {porcentaje}%
            </div>
            <div className="font-montserrat font-bold text-[#121B33] uppercase tracking-wider text-sm mt-1">
              de descuento en tu inscripción
            </div>
          </div>

          {/* Datos */}
          <div className="space-y-3 pt-6 border-t border-dashed border-[#121B33]/15">
            <ComprobanteRow label="Otorgado a" value={data.nombre} />
            <ComprobanteRow label="Programa" value={programa} />
            <ComprobanteRow label="Plantel" value={plantelNice} />
            <ComprobanteRow
              label="Código"
              value={data.codigo}
              icon={<Hash size={14} className="text-[#121B33]/40" />}
              mono
            />
            <ComprobanteRow
              label="Válido hasta"
              value={formatFecha(data.expiraEn)}
              icon={<Calendar size={14} className="text-[#121B33]/40" />}
            />
          </div>

          {/* Mensaje grande */}
          <div
            className="mt-8 text-center font-bebas tracking-wide leading-tight px-4 py-5 rounded-xl flex items-center justify-center gap-3"
            style={{ backgroundColor: `${accent}1A`, color: "#121B33" }}
          >
            <Smartphone size={28} strokeWidth={2.25} className="flex-shrink-0" />
            <div className="text-2xl sm:text-3xl">{mensajeComprobante}</div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1FB055] text-white font-montserrat font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            <MessageCircle size={18} /> Enviar por WhatsApp al asesor
          </a>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/80 hover:bg-white/5 font-montserrat font-semibold px-7 py-3.5 rounded-full transition-colors"
          >
            Registrar otra persona
          </button>
        </div>

        <p className="mt-6 text-center font-montserrat text-xs text-white/40">
          Captura de pantalla recomendada · Un asesor te contactará en menos de 24 hrs
        </p>
      </div>
    </section>
  );
}

function ComprobanteRow({
  label,
  value,
  icon,
  mono = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 font-montserrat text-xs uppercase tracking-wider text-[#666] flex-shrink-0">
        {icon}
        {label}
      </div>
      <div
        className={`font-montserrat font-semibold text-[#121B33] text-sm text-right ${
          mono ? "font-mono tracking-wider" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
