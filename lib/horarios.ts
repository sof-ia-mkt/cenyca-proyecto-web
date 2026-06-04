import type { CardInversion } from "@/components/BloqueInversion";

// ─── Derivación de horarios desde inversion.cards ──────────────────────────────
// Fuente única de verdad: las cards de inversión ya codifican exactamente qué
// días/horarios abren en el ciclo. El HERO y la tabla de modalidades derivan su
// contenido de acá — nunca texto hardcodeado. CENYCA no oferta escolarizado, así
// que ningún día entre Lunes-Viernes de 4 días aparece; cada card es 1 día.

export type ModalidadCategoria = "entre-semana" | "fin-de-semana";

const DIAS_ENTRE_SEMANA = ["Lunes", "Martes", "Miércoles", "Miercoles", "Jueves", "Viernes"];

/** Categoriza por nombre de día (robusto: ignora el campo `tipo`, que a veces
 *  marca "entre-semana" para un Domingo de Casa Blanca en Gastronomía). */
function categoriaDeDia(dia?: string): ModalidadCategoria {
  const d = (dia ?? "").trim();
  return DIAS_ENTRE_SEMANA.some((x) => d.startsWith(x)) ? "entre-semana" : "fin-de-semana";
}

/** Etiqueta de día de una card: "Sábado o Domingo", "Jueves", etc. */
function diaLabelDeCard(card: CardInversion): string {
  const principal = (card.diaPrincipal ?? "").trim();
  const secundario = (card.diaSecundario ?? "").trim();
  return secundario ? `${principal} ${secundario}` : principal;
}

/** Horario representativo de una card (el de Casa Blanca si existe split). */
function horarioDeCard(card: CardInversion): string | undefined {
  return card.horarioCasaBlanca ?? card.horario ?? card.horarioOtros ?? undefined;
}

export type ModalidadDerivada = {
  categoria: ModalidadCategoria;
  /** Tag corto para la card de la tabla. */
  tag: string;
  /** Días reales de septiembre de esta categoría, p.ej. "Martes · Jueves (Casa Blanca)". */
  dias: string;
  /** Horario representativo. */
  horario?: string;
  /** "1 día" — frecuencia (todas las modalidades de CENYCA son 1 día). */
  freq: string;
  /** Unidad: "/sem" o "/fin". */
  freqUnit: string;
};

export type HorariosDerivados = {
  /** Resumen compacto de días para el HERO, p.ej. "Martes · Jueves · Sábado o Domingo". */
  diasResumen: string;
  /** Etiqueta de modalidad para el HERO. */
  modalidadLabel: string;
  /** Máximo % de beca por boletos entre las cards (0 si ninguna). */
  becasMax: number;
  /** Modalidades para la tabla comparativa, ya agrupadas por categoría. */
  modalidades: ModalidadDerivada[];
};

const ORDEN_DIA: Record<string, number> = {
  Lunes: 1, Martes: 2, Miércoles: 3, Miercoles: 3, Jueves: 4,
  Viernes: 5, Sábado: 6, Sabado: 6, Domingo: 7,
};

function ordenDeLabel(label: string): number {
  const primera = label.split(/\s|·/)[0];
  return ORDEN_DIA[primera] ?? 99;
}

const COPY: Record<ModalidadCategoria, { tag: string; freqUnit: string; idealPara: string; features: string[] }> = {
  "entre-semana": {
    tag: "Un día entre semana",
    freqUnit: "/sem",
    idealPara: "Quien combina la carrera con trabajo, familia o emprendimiento entre semana.",
    features: [
      "Sigues trabajando los otros días sin afectar tu ingreso",
      "Concentras tu energía académica en una sola jornada",
      "Aplicas lo aprendido en tu empleo desde el día siguiente",
    ],
  },
  "fin-de-semana": {
    tag: "Ejecutivo",
    freqUnit: "/fin",
    idealPara: "Profesionistas con compromisos de lunes a viernes que quieren su próximo nivel.",
    features: [
      "Mantienes tu empleo de tiempo completo",
      "Convives con otros profesionistas — red de pares de alto nivel",
      "Casos prácticos pensados para quien ya está en la industria",
    ],
  },
};

export const MODALIDAD_COPY = COPY;

/** Modalidades genéricas para páginas de área (varias carreras, sin contexto de
 *  una sola). Refleja las dos formas reales de CENYCA — nunca escolarizado. */
export const MODALIDADES_GENERICAS: ModalidadDerivada[] = [
  {
    categoria: "entre-semana",
    tag: COPY["entre-semana"].tag,
    dias: "Martes",
    horario: "6:00 pm – 10:00 pm",
    freq: "1 día",
    freqUnit: COPY["entre-semana"].freqUnit,
  },
  {
    categoria: "fin-de-semana",
    tag: COPY["fin-de-semana"].tag,
    dias: "Sábado o Domingo",
    horario: "Matutino",
    freq: "1 día",
    freqUnit: COPY["fin-de-semana"].freqUnit,
  },
];

export function derivarHorarios(cards?: CardInversion[]): HorariosDerivados {
  const lista = cards ?? [];

  // Agrupar días por categoría, deduplicando y anotando "Casa Blanca" si aplica.
  const porCategoria = new Map<ModalidadCategoria, { dias: string[]; horario?: string }>();

  for (const card of lista) {
    const cat = categoriaDeDia(card.diaPrincipal);
    let label = diaLabelDeCard(card);
    if (!label) continue;
    if (card.soloCasaBlanca) label = `${label} (Casa Blanca)`;

    const entry = porCategoria.get(cat) ?? { dias: [], horario: undefined };
    if (!entry.dias.includes(label)) entry.dias.push(label);
    if (!entry.horario) entry.horario = horarioDeCard(card);
    porCategoria.set(cat, entry);
  }

  const modalidades: ModalidadDerivada[] = (["entre-semana", "fin-de-semana"] as ModalidadCategoria[])
    .filter((cat) => porCategoria.has(cat))
    .map((cat) => {
      const entry = porCategoria.get(cat)!;
      const dias = entry.dias.sort((a, b) => ordenDeLabel(a) - ordenDeLabel(b));
      return {
        categoria: cat,
        tag: COPY[cat].tag,
        dias: dias.join(" · "),
        horario: entry.horario,
        freq: "1 día",
        freqUnit: COPY[cat].freqUnit,
      };
    });

  // Resumen de días para el HERO: en orden Lun→Dom.
  const todosLabels = modalidades
    .flatMap((m) => m.dias.split(" · "))
    .sort((a, b) => ordenDeLabel(a) - ordenDeLabel(b));
  const diasResumen = todosLabels.join(" · ");

  const tieneEntre = porCategoria.has("entre-semana");
  const tieneFin = porCategoria.has("fin-de-semana");
  const modalidadLabel =
    tieneEntre && tieneFin
      ? "Entre semana o fin de semana · 1 día"
      : tieneFin
        ? "Ejecutivo · fin de semana"
        : "Entre semana · 1 día";

  const becasMax = lista.reduce(
    (max, c) => Math.max(max, ...(c.becasOpciones ?? [0])),
    0,
  );

  return { diasResumen, modalidadLabel, becasMax, modalidades };
}
