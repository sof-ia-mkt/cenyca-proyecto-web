import { GraduationCap, Calendar, Clock, Check, type LucideIcon } from "lucide-react";

// ── Fuente única de verdad ──────────────────────────────────────────────
// Si el dato cambia, se actualiza acá y se refleja en home + carreras.
type Modalidad = {
  tag: string;
  freq: string;
  freqUnit: string;
  dia: string;
  idealPara: string;
  features: string[];
  icon: LucideIcon;
};

const MODALIDADES: Modalidad[] = [
  {
    tag: "Escolarizada",
    freq: "4 días",
    freqUnit: "/sem",
    dia: "Lunes a jueves · Matutino",
    idealPara: "Recién egresados de prepa que buscan la experiencia universitaria completa.",
    features: [
      "Vida universitaria activa todos los días",
      "Aprendizaje continuo con seguimiento diario",
      "Red de compañeros sólida desde el primer cuatrimestre",
    ],
    icon: GraduationCap,
  },
  {
    tag: "Un solo día",
    freq: "1 día",
    freqUnit: "/sem",
    dia: "Martes · Una vez por semana",
    idealPara: "Quien combina la carrera con trabajo, familia o emprendimiento entre semana.",
    features: [
      "Sigues trabajando los otros días sin afectar tu ingreso",
      "Concentras tu energía académica en una sola jornada",
      "Aplicas lo aprendido en tu empleo desde el día siguiente",
    ],
    icon: Calendar,
  },
  {
    tag: "Ejecutivo",
    freq: "1 día",
    freqUnit: "/fin",
    dia: "Sábado o domingo",
    idealPara: "Profesionistas con compromisos de lunes a viernes que quieren su próximo nivel.",
    features: [
      "Mantienes tu empleo de tiempo completo",
      "Convives con otros profesionistas — red de pares de alto nivel",
      "Casos prácticos pensados para quien ya está en la industria",
    ],
    icon: Clock,
  },
];

export default function ModalidadesTabla({ accent }: { accent: string }) {
  return (
    <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span
            className="font-montserrat text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: accent }}
          >
            Elige tu modalidad
          </span>
          <h2 className="font-bebas text-[#121B33] text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 text-balance">
            Tres formas de estudiar tu carrera
          </h2>
          <p className="font-montserrat text-[#555] text-base sm:text-lg leading-relaxed mt-4 text-pretty">
            Todas con RVOE y el mismo plan de estudios. Elige la que mejor se acomoda
            a tu vida — puedes cambiar de modalidad entre cuatrimestres si lo necesitas.
          </p>
        </div>

        {/* Tabla comparativa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#E8E8E8] rounded-2xl overflow-hidden border border-[#E8E8E8]">
          {MODALIDADES.map((m) => {
            const Icon = m.icon;
            return (
              <article
                key={m.tag}
                className="bg-white p-7 sm:p-8 flex flex-col"
              >
                {/* Icon + tag */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="inline-flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-[0.18em] font-bold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    {m.tag}
                  </span>
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                </div>

                {/* Frecuencia (big number) */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="font-bebas text-[#121B33] text-5xl sm:text-6xl tracking-wide leading-none">
                    {m.freq}
                  </span>
                  <span className="font-montserrat text-[#888] text-sm font-semibold">
                    {m.freqUnit}
                  </span>
                </div>

                {/* Día — altura fija para 2 líneas, así todas las cards alinean */}
                <p className="font-montserrat text-[#121B33] text-sm font-semibold mb-5 min-h-[2.5rem] leading-snug">
                  {m.dia}
                </p>

                {/* Divider */}
                <div className="h-px bg-[#EEE] mb-5" />

                {/* Ideal para — altura fija para 3 líneas */}
                <div className="mb-5">
                  <p className="font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1.5">
                    Ideal para
                  </p>
                  <p className="font-montserrat text-[#444] text-sm leading-relaxed text-pretty min-h-[4.5rem]">
                    {m.idealPara}
                  </p>
                </div>

                {/* Features — cada li reserva 2 líneas para alinear checks entre cards */}
                <ul className="mt-auto flex flex-col gap-3">
                  {m.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 font-montserrat text-[13px] text-[#333] leading-snug min-h-[2.5rem]"
                    >
                      <Check
                        size={15}
                        strokeWidth={2.5}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: accent }}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Sello común */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <span
            className="font-montserrat text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]"
            style={{ color: accent }}
          >
            RVOE con validez oficial
          </span>
          <span aria-hidden className="hidden sm:block h-3 w-px bg-[#CCC]" />
          <span className="font-montserrat text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#444]">
            Mismo plan de estudios
          </span>
        </div>

        {/* Footnote */}
        <p className="font-montserrat text-[#888] text-xs sm:text-sm leading-relaxed mt-4 text-center italic">
          La disponibilidad de cada modalidad puede variar por ciclo y por carrera.{" "}
          <span className="not-italic font-semibold text-[#444]">
            Consulta con un asesor antes de inscribirte.
          </span>
        </p>
      </div>
    </section>
  );
}
