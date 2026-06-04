import { Calendar, Clock, GraduationCap, Check, type LucideIcon } from "lucide-react";
import { MODALIDAD_COPY, type ModalidadDerivada } from "@/lib/horarios";

// Las modalidades se derivan de los horarios reales de la carrera (inversion.cards).
// Se renderizan hasta tres: escolarizada (Lun–Jue), un día entre semana y ejecutivo.

const ICONO: Record<ModalidadDerivada["categoria"], LucideIcon> = {
  "escolarizado": GraduationCap,
  "entre-semana": Calendar,
  "fin-de-semana": Clock,
};

export default function ModalidadesTabla({
  accent,
  modalidades,
}: {
  accent: string;
  modalidades: ModalidadDerivada[];
}) {
  if (!modalidades.length) return null;

  const cols = modalidades.length;

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
            {cols >= 3
              ? "Tres formas de estudiar tu carrera"
              : cols === 2
                ? "Dos formas de estudiar tu carrera"
                : "Tu horario para este ciclo"}
          </h2>
          <p className="font-montserrat text-[#555] text-base sm:text-lg leading-relaxed mt-4 text-pretty">
            Todas con RVOE y el mismo plan de estudios. Elige la que mejor se acomoda
            a tu vida — puedes cambiar de modalidad entre cuatrimestres si lo necesitas.
          </p>
        </div>

        {/* Tabla comparativa */}
        <div
          className={`grid grid-cols-1 gap-px bg-[#E8E8E8] rounded-2xl overflow-hidden border border-[#E8E8E8] ${
            cols >= 3 ? "md:grid-cols-3" : cols === 2 ? "md:grid-cols-2" : ""
          }`}
        >
          {modalidades.map((m) => {
            const copy = MODALIDAD_COPY[m.categoria];
            const Icon = ICONO[m.categoria];
            return (
              <article
                key={m.categoria}
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
                <p className="font-montserrat text-[#121B33] text-sm font-semibold mb-1 min-h-[2.5rem] leading-snug">
                  {m.dias}
                </p>
                {m.horario && (
                  <p className="font-montserrat text-[#888] text-xs mb-5 leading-snug">
                    {m.horario}
                  </p>
                )}

                {/* Divider */}
                <div className="h-px bg-[#EEE] mb-5" />

                {/* Ideal para — altura fija para 3 líneas */}
                <div className="mb-5">
                  <p className="font-montserrat text-[10px] font-bold tracking-[0.2em] uppercase text-[#999] mb-1.5">
                    Ideal para
                  </p>
                  <p className="font-montserrat text-[#444] text-sm leading-relaxed text-pretty min-h-[4.5rem]">
                    {copy.idealPara}
                  </p>
                </div>

                {/* Features — cada li reserva 2 líneas para alinear checks entre cards */}
                <ul className="mt-auto flex flex-col gap-3">
                  {copy.features.map((f) => (
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
          La disponibilidad de cada modalidad puede variar por ciclo y por plantel.{" "}
          <span className="not-italic font-semibold text-[#444]">
            Consulta con un asesor antes de inscribirte.
          </span>
        </p>
      </div>
    </section>
  );
}
