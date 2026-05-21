import Link from "next/link";
import { CalendarClock, Clock, GraduationCap, MapPin, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

type Props = {
  accent: string;
  whatsapp: string;
  carreraNombre: string;
  gradoLabel: string;
  duracion?: string;
  promoActiva?: boolean;
};

// ⚠️ Próximo inicio: actualizar cuando cambie el ciclo de admisión activo.
const PROXIMO_INICIO = {
  ciclo: "Septiembre 2026",
};

const MODALIDAD_LABEL = "Ejecutivo (1 día a la semana) · Escolarizado (Lun-Jue)";
const HORARIOS_LABEL = "Martes, sábado, domingo o escolarizado (Lun-Jue)";
const BECAS_LABEL = "Hasta 30%";

export default function CarreraHeroCard({
  accent,
  whatsapp,
  carreraNombre,
  gradoLabel,
  duracion,
  promoActiva,
}: Props) {
  const waText = encodeURIComponent(
    `Hola, me interesa la ${gradoLabel} en ${carreraNombre}.`,
  );

  return (
    <div
      className="relative w-full rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden"
    >
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-[260px] h-[260px] rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      {/* Header — Próximo inicio */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <CalendarClock size={14} style={{ color: accent }} />
          <span
            className="font-montserrat text-[10px] font-bold tracking-[0.25em] uppercase"
            style={{ color: accent }}
          >
            Próximo inicio
          </span>
        </div>
        <p className="font-bebas text-white text-3xl sm:text-4xl tracking-wide leading-none">
          {PROXIMO_INICIO.ciclo}
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-white/10" />

      {/* Datos clave */}
      <dl className="space-y-3.5">
        <Row
          icon={<Clock size={15} className="text-white/55" strokeWidth={2} />}
          label="Duración"
          value={duracion ?? "3 años · 9 cuatrimestres"}
        />
        <Row
          icon={<GraduationCap size={15} className="text-white/55" strokeWidth={2} />}
          label="Modalidad"
          value={MODALIDAD_LABEL}
        />
        <Row
          icon={<MapPin size={15} className="text-white/55" strokeWidth={2} />}
          label="Horarios"
          value={HORARIOS_LABEL}
        />
        <Row
          icon={<Sparkles size={15} className="text-white/55" strokeWidth={2} />}
          label="Becas"
          value={BECAS_LABEL}
        />
      </dl>

      {/* Leyenda */}
      <p className="mt-4 text-white/55 text-[11px] leading-snug italic">
        Consulta la disponibilidad de tu horario para{" "}
        <span className="font-semibold text-white/75 not-italic">
          {PROXIMO_INICIO.ciclo.toLowerCase()}
        </span>
        .
      </p>

      {/* Divider */}
      <div className="my-5 border-t border-white/10" />

      {/* CTAs */}
      <div className="flex flex-col gap-2.5">
        <a
          href={promoActiva ? "#promocion" : `https://wa.me/${whatsapp}?text=${waText}`}
          {...(promoActiva ? {} : { target: "_blank", rel: "noopener noreferrer" })}
          className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-montserrat font-bold text-sm transition-colors"
          style={{ backgroundColor: accent, color: "#121B33" }}
        >
          <span className="inline-flex flex-col items-center leading-tight text-center">
            <span>Solicitar 20% de descuento</span>
            <span className="text-[10px] font-semibold opacity-70 mt-0.5">
              Sobre la inscripción
            </span>
          </span>
          <ArrowRight
            size={16}
            className="absolute right-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
          />
        </a>
        <a
          href={`https://wa.me/${whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white/85 hover:bg-white/5 hover:border-white/40 font-montserrat font-semibold text-sm transition-colors"
        >
          <WhatsAppIcon size={15} />
          WhatsApp directo
        </a>
      </div>

      {/* Footer microcopy */}
      <p className="mt-4 text-center text-white/40 text-[10px] tracking-wide">
        Respuesta de un asesor en menos de 24 hrs.
      </p>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <dt className="font-montserrat text-[10px] font-bold tracking-[0.22em] uppercase text-white/45 mb-0.5">
          {label}
        </dt>
        <dd className="font-montserrat text-white text-sm leading-snug">
          {value}
        </dd>
      </div>
    </div>
  );
}

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.45 0-9.89 4.43-9.9 9.88a9.85 9.85 0 0 0 1.32 4.94L2 22l5.32-1.4a9.88 9.88 0 0 0 4.72 1.2h.01c5.45 0 9.89-4.43 9.9-9.88a9.81 9.81 0 0 0-2.9-7.01Zm-7.01 15.21a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.16.83.84-3.08-.2-.32a8.18 8.18 0 0 1-1.26-4.36c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.81 2.41a8.17 8.17 0 0 1 2.41 5.82c-.01 4.53-3.69 8.24-8.19 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
