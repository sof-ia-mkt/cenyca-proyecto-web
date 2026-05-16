import type { CSSProperties } from "react";
import { CalendarDays, Sun, Laptop, Calendar, type LucideIcon } from "lucide-react";

export type ModalidadCard = {
  tag?: string;
  titulo?: string;
  valorDestacado?: string;
  descripcion?: string;
};

export type ModalidadesHorariosConfig = {
  activa?: boolean;
  kicker?: string;
  titulo?: string;
  subtitulo?: string;
  cards?: ModalidadCard[];
};

type Props = {
  data: ModalidadesHorariosConfig;
  accent?: string;
};

// Selecciona un icono Lucide según el contenido de la tarjeta. Reglas simples
// por palabras clave del tag/título — sin emojis, consistente con el resto del sitio.
function pickIcon(card: ModalidadCard): LucideIcon {
  const text = `${card.tag ?? ""} ${card.titulo ?? ""} ${card.valorDestacado ?? ""}`.toLowerCase();
  if (/linea|online|virtual|remoto/.test(text)) return Laptop;
  if (/sabado|s[áa]bado|domingo|fin de semana|ejecutivo/.test(text)) return Sun;
  if (/entre semana|martes|d[íi]a|1 d[íi]a/.test(text)) return CalendarDays;
  return Calendar;
}

export default function ModalidadesHorarios({ data, accent = "#00D4FF" }: Props) {
  if (!data?.activa || !data.cards || data.cards.length === 0) return null;

  const accentStyle = { "--accent": accent } as CSSProperties;
  const gridCols =
    data.cards.length === 2 ? "sm:grid-cols-2" : data.cards.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="relative bg-[#121B33] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" style={accentStyle}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full opacity-15 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-14">
          {data.kicker && (
            <span
              className="font-montserrat text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accent }}
            >
              {data.kicker}
            </span>
          )}
          {data.titulo && (
            <h2 className="font-bebas text-white text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3">
              {data.titulo}
            </h2>
          )}
          {data.subtitulo && (
            <p className="font-montserrat text-white/65 text-base sm:text-lg leading-relaxed mt-4">
              {data.subtitulo}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {data.cards.map((card, i) => {
            const Icon = pickIcon(card);
            return (
              <div
                key={`${card.titulo ?? i}-${i}`}
                className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 transition-all duration-300 hover:bg-white/[0.07] hover:border-[color:var(--accent)]/40 hover:-translate-y-1"
              >
                {/* Icono */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${accent}1A`, color: accent }}
                >
                  <Icon size={22} strokeWidth={1.75} />
                </div>

                {/* Tag chip */}
                {card.tag && (
                  <span
                    className="inline-block font-montserrat text-[10px] uppercase tracking-[0.15em] font-bold rounded-md px-2 py-1 mb-4"
                    style={{ backgroundColor: `${accent}1A`, color: accent }}
                  >
                    {card.tag}
                  </span>
                )}

                {/* Título */}
                {card.titulo && (
                  <h3 className="font-montserrat font-bold text-white text-lg leading-snug mb-1">
                    {card.titulo}
                  </h3>
                )}

                {/* Valor destacado */}
                {card.valorDestacado && (
                  <div
                    className="font-montserrat font-extrabold text-xl sm:text-2xl mt-1 mb-3"
                    style={{ color: accent }}
                  >
                    {card.valorDestacado}
                  </div>
                )}

                {/* Descripción */}
                {card.descripcion && (
                  <p className="font-montserrat text-white/65 text-sm leading-relaxed">
                    {card.descripcion}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
