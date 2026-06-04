"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { MapPin, Star, Sparkles, Check, AlertTriangle } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type CardInversion = {
  tipo?: "escolarizada" | "entre-semana" | "fin-de-semana";
  tag?: string;
  destacada?: boolean;
  etiquetaDestacada?: string;
  diaPrincipal?: string;
  diaSecundario?: string;
  horario?: string;
  horarioCasaBlanca?: string;
  horarioOtros?: string;
  ocultarDomingoEnOtay?: boolean;
  soloCasaBlanca?: boolean;
  mensualidadBase?: number;
  mensualidadEspecial?: number;
  notaEspecial?: string;
  labelToggleEspecial?: string;
  labelToggleRegular?: string;
  becasOpciones?: number[];
  sinReinscripcion?: boolean;
  ctaLabel?: string;
};

export type InversionConfig = {
  activa?: boolean;
  inscripcionBase?: number;
  paqueteCuatrimestral?: number;
  paqueteCuatrimestralTecate?: number;
  mostrarToggleCampus?: boolean;
  plantelesDisponibles?: Campus[];
  mensajeAparta?: string;
  disclaimer?: string;
  cards?: CardInversion[];
};

type Props = {
  data: InversionConfig;
  promo?: { porcentaje?: number; activa?: boolean };
  accent?: string;
};

type Campus = "cb" | "palmas" | "otay" | "tc";

const CAMPUS_LABEL: Record<Campus, string> = {
  cb: "Casa Blanca",
  palmas: "Palmas",
  otay: "Otay",
  tc: "Tecate",
};

const CAMPUS_ORDEN: Campus[] = ["cb", "palmas", "otay", "tc"];

const fmt = (n: number) => `$${n.toLocaleString("es-MX")}`;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function BloqueInversion({ data, promo, accent = "#00D4FF" }: Props) {
  const [campus, setCampus] = useState<Campus>("cb");
  const [martesEsp, setMartesEsp] = useState(true);
  const [becaPct, setBecaPct] = useState(0);

  const accentStyle = useMemo(() => ({ "--accent": accent } as CSSProperties), [accent]);

  if (!data?.activa || !data.cards?.length) return null;

  // Planteles a mostrar: solo los disponibles para esta carrera. Si no se
  // especifica ninguno, se muestran los 4 (comportamiento anterior).
  const plantelesDisponibles =
    data.plantelesDisponibles?.length
      ? CAMPUS_ORDEN.filter((c) => data.plantelesDisponibles!.includes(c))
      : CAMPUS_ORDEN;

  // Si el plantel seleccionado no está disponible, usar el primero de la lista.
  const campusEfectivo = plantelesDisponibles.includes(campus)
    ? campus
    : plantelesDisponibles[0];

  const mostrarToggle = data.mostrarToggleCampus && plantelesDisponibles.length > 1;

  // Tarjetas visibles según plantel: las marcadas "solo Casa Blanca" se ocultan
  // cuando el plantel efectivo no es Casa Blanca.
  const cardsVisibles = data.cards.filter(
    (card) => !(card.soloCasaBlanca && campusEfectivo !== "cb")
  );

  const porcentajePromo = (promo?.activa ? promo.porcentaje : null) ?? 25;
  const inscripcionBase = data.inscripcionBase ?? 2000;
  const inscripcionConPromo = Math.round(inscripcionBase * (1 - porcentajePromo / 100));

  const paquete =
    campusEfectivo === "tc"
      ? data.paqueteCuatrimestralTecate ?? 800
      : data.paqueteCuatrimestral ?? 950;

  return (
    <section id="inversion" className="relative bg-[#0E1628] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-24" style={accentStyle}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/3 h-[480px] w-[480px] rounded-full opacity-15 blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span
            className="font-montserrat text-xs uppercase tracking-[0.2em] font-semibold"
            style={{ color: accent }}
          >
            Inversión
          </span>
          <h2 className="font-bebas text-white text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-[1.05] mt-3 text-balance">
            Conoce el costo de inversión y tus horarios
          </h2>
        </div>

        {/* Toggle de campus */}
        {mostrarToggle && (
          <div className="mb-8 max-w-xl mx-auto rounded-2xl px-4 py-3 sm:px-5 sm:py-4 border border-white/10 bg-white/[0.04]">
            <div className="flex items-center justify-center gap-2 font-montserrat text-xs uppercase tracking-wider font-bold mb-3" style={{ color: accent }}>
              <MapPin size={14} />
              ¿En qué plantel estudiarías?
            </div>
            <div className="flex flex-wrap gap-1 justify-center bg-white/[0.06] rounded-full p-1">
              {plantelesDisponibles.map((c) => {
                const active = campusEfectivo === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCampus(c)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full font-montserrat text-xs font-semibold transition-colors ${
                      active ? "text-[#0E1628]" : "text-white/75 hover:text-white"
                    }`}
                    style={active ? { backgroundColor: accent } : {}}
                  >
                    {CAMPUS_LABEL[c]}
                  </button>
                );
              })}
            </div>
            <div className="text-center font-montserrat text-[11px] text-white/40 mt-2">
              El costo del paquete varía según plantel
            </div>
          </div>
        )}

        {/* Grid de cards */}
        <div
          className={`grid gap-5 ${
            cardsVisibles.length >= 3
              ? "md:grid-cols-3"
              : cardsVisibles.length === 2
              ? "md:grid-cols-2"
              : "max-w-xl mx-auto"
          }`}
        >
          {cardsVisibles.map((card, i) => (
            <CardInversionUI
              key={`${card.tipo}-${i}`}
              card={card}
              campus={campusEfectivo}
              martesEsp={martesEsp}
              setMartesEsp={setMartesEsp}
              becaPct={becaPct}
              setBecaPct={setBecaPct}
              porcentajePromo={porcentajePromo}
              inscripcionBase={inscripcionBase}
              inscripcionConPromo={inscripcionConPromo}
              paquete={paquete}
              accent={accent}
              mensajeAparta={data.mensajeAparta}
            />
          ))}
        </div>

        {/* Disclaimer */}
        {data.disclaimer && (
          <p className="mt-8 flex items-center justify-center gap-2 flex-wrap text-center font-montserrat text-[14px] sm:text-[15px] text-white/70 max-w-4xl mx-auto text-pretty">
            <AlertTriangle size={16} className="flex-shrink-0 text-white/60" />
            <span>{data.disclaimer}</span>
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Card individual ──────────────────────────────────────────────────────────

function CardInversionUI({
  card,
  campus,
  martesEsp,
  setMartesEsp,
  becaPct,
  setBecaPct,
  porcentajePromo,
  inscripcionBase,
  inscripcionConPromo,
  paquete,
  accent,
  mensajeAparta,
}: {
  card: CardInversion;
  campus: Campus;
  martesEsp: boolean;
  setMartesEsp: (v: boolean) => void;
  becaPct: number;
  setBecaPct: (v: number) => void;
  porcentajePromo: number;
  inscripcionBase: number;
  inscripcionConPromo: number;
  paquete: number;
  accent: string;
  mensajeAparta?: string;
}) {
  // Cálculo de mensualidad.
  // Escolarizada y entre-semana comparten el toggle de boletos (regular ↔ especial).
  // Fin de semana usa el selector de becas.
  const usaBoletos = card.tipo === "entre-semana" || card.tipo === "escolarizada";
  const mensualidadCalc = (() => {
    if (usaBoletos) {
      return martesEsp
        ? card.mensualidadEspecial ?? card.mensualidadBase ?? 2200
        : card.mensualidadBase ?? 4000;
    }
    const base = card.mensualidadBase ?? 4000;
    return Math.round(base - base * (becaPct / 100));
  })();

  const primerPago = inscripcionConPromo + mensualidadCalc + paquete;

  // Horario dinámico por campus (solo aplica a fin de semana)
  const horarioFinal = (() => {
    if (usaBoletos) return card.horario;
    if (campus === "cb" && card.horarioCasaBlanca) return card.horarioCasaBlanca;
    if (campus !== "cb" && card.horarioOtros) return card.horarioOtros;
    return card.horario;
  })();

  const mostrarDomingo = !(card.ocultarDomingoEnOtay && campus === "otay");

  return (
    <div
      className={`relative rounded-2xl p-5 sm:p-6 flex flex-col gap-3 ${
        card.destacada
          ? "border-2"
          : "border border-white/10 bg-white/[0.04]"
      }`}
      style={
        card.destacada
          ? {
              background: `linear-gradient(160deg, ${accent}14 0%, rgba(255,255,255,0.03) 100%)`,
              borderColor: `${accent}66`,
            }
          : {}
      }
    >
      {/* Etiqueta destacada */}
      {card.destacada && card.etiquetaDestacada && (
        <div className="flex justify-center -mt-9 mb-1">
          <span
            className="inline-flex items-center gap-1 font-montserrat text-[10px] uppercase tracking-[0.15em] font-bold rounded-full px-3 py-1.5 shadow-lg"
            style={{ backgroundColor: accent, color: "#0E1628" }}
          >
            <Star size={12} fill="currentColor" strokeWidth={0} /> {card.etiquetaDestacada}
          </span>
        </div>
      )}
      {!card.destacada && card.etiquetaDestacada && (
        <div className="flex justify-center -mt-9 mb-1">
          <span className="inline-flex items-center gap-1 font-montserrat text-[10px] uppercase tracking-[0.15em] font-bold rounded-full px-3 py-1.5 bg-white/10 text-white border border-white/15">
            <Sparkles size={12} /> {card.etiquetaDestacada}
          </span>
        </div>
      )}

      {/* Cabecera: tag + día + horario */}
      <div>
        {card.tag && (
          <div className="font-montserrat text-[10px] uppercase tracking-[0.15em] font-bold text-white/40 mb-1">
            {card.tag}
          </div>
        )}
        {card.diaPrincipal && (
          <div className="font-montserrat font-extrabold text-white text-2xl leading-tight">
            {card.diaPrincipal}
            {card.diaSecundario && mostrarDomingo && (
              <span className="text-base font-medium text-white/55"> {card.diaSecundario}</span>
            )}
          </div>
        )}
        {horarioFinal && (
          <div className="font-montserrat text-sm text-white/60 mt-1">{horarioFinal}</div>
        )}
      </div>

      <hr className="border-white/10" />

      {/* Mensualidad */}
      <div>
        <div className="font-montserrat text-[11px] text-white/40 mb-1">Mensualidad desde</div>
        <div className="flex items-baseline gap-1">
          <strong className="font-montserrat font-extrabold text-white text-3xl leading-none">
            {fmt(mensualidadCalc)}
          </strong>
          <span className="font-montserrat text-white/45 text-sm">/mes</span>
        </div>
        {usaBoletos && martesEsp && card.notaEspecial && (
          <div className="font-montserrat text-[12px] text-[#FFB4B4] mt-1">{card.notaEspecial}</div>
        )}
        {!usaBoletos && becaPct > 0 && (
          <div className="font-montserrat text-[12px] text-[#FFB4B4] mt-1">
            Beca sujeta a venta de {becaPct} boletos
          </div>
        )}
      </div>

      {/* Toggle (entre semana: boletos | fin de semana: becas) */}
      {usaBoletos && (
        <div className="flex gap-1 bg-white/[0.06] rounded-full p-1">
          <ToggleButton active={martesEsp} onClick={() => setMartesEsp(true)} accent={accent}>
            {card.labelToggleEspecial ?? "Con 20 boletos"}
          </ToggleButton>
          <ToggleButton active={!martesEsp} onClick={() => setMartesEsp(false)} accent={accent}>
            {card.labelToggleRegular ?? "Precio regular"}
          </ToggleButton>
        </div>
      )}
      {!usaBoletos && card.becasOpciones && card.becasOpciones.length > 0 && (
        <div className="flex gap-1 bg-white/[0.06] rounded-full p-1">
          {card.becasOpciones.map((pct) => (
            <ToggleButton
              key={pct}
              active={becaPct === pct}
              onClick={() => setBecaPct(pct)}
              accent={accent}
            >
              {pct === 0 ? "Sin beca" : `${pct}%`}
            </ToggleButton>
          ))}
        </div>
      )}

      <hr className="border-white/10" />

      {/* Desglose */}
      <div className="space-y-2 font-montserrat text-sm">
        <Row
          label={`Inscripción (con promo -${porcentajePromo}%)`}
          value={
            <span>
              <span className="line-through text-white/30 mr-1.5">{fmt(inscripcionBase)}</span>
              <strong className="text-white">{fmt(inscripcionConPromo)}</strong>
            </span>
          }
        />
        <Row label="Paquete cuatrimestral" value={<strong className="text-white">{fmt(paquete)}</strong>} />
        {card.sinReinscripcion && (
          <Row
            label={
              <span className="flex items-center gap-1.5" style={{ color: "#64dc64" }}>
                <Check size={14} strokeWidth={2.5} /> Sin reinscripción
              </span>
            }
            value={<strong style={{ color: "#64dc64" }}>$0</strong>}
          />
        )}
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-white/10">
          <span className="font-bold text-white">Primer pago</span>
          <strong className="font-bebas text-3xl tracking-wide" style={{ color: accent }}>
            {fmt(primerPago)}
          </strong>
        </div>
      </div>

      {/* Mensaje "Aparta tu lugar" (solo en card destacada o única) */}
      {mensajeAparta && (
        <div
          className="text-center font-montserrat text-[12px] leading-relaxed rounded-lg px-3 py-2.5 border border-dashed"
          style={{ backgroundColor: `${accent}0A`, borderColor: `${accent}40`, color: "rgba(255,255,255,0.75)" }}
        >
          {mensajeAparta}
        </div>
      )}

      {/* CTA */}
      <a
        href="#promocion"
        className="mt-auto text-center font-montserrat font-bold text-sm px-5 py-3 rounded-full transition-all hover:-translate-y-[1px] hover:shadow-lg"
        style={
          card.destacada
            ? { backgroundColor: accent, color: "#0E1628" }
            : { backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }
        }
      >
        {card.ctaLabel ?? "Quiero este horario"}
      </a>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/65">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  accent,
  children,
}: {
  active: boolean;
  onClick: () => void;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 px-3 py-1.5 rounded-full font-montserrat text-[11px] font-semibold transition-colors ${
        active ? "text-[#0E1628]" : "text-white/75 hover:text-white"
      }`}
      style={active ? { backgroundColor: accent } : {}}
    >
      {children}
    </button>
  );
}
