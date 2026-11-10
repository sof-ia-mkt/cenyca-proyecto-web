import type { CardInversion } from "@/components/BloqueInversion";

// ─── Derivación de horarios desde inversion.cards ──────────────────────────────
// Fuente única de verdad: las cards de inversión ya codifican exactamente qué
// días/horarios abren en el ciclo. El HERO y la tabla de modalidades derivan su
// contenido de acá — nunca texto hardcodeado. Las modalidades por día son de 1
// día; la modalidad escolarizada (tipo "escolarizada") es de 4 días (Lun–Jue).

export type ModalidadCategoria = "escolarizado" | "entre-semana" | "fin-de-semana";

const DIAS_ENTRE_SEMANA = ["Lunes", "Martes", "Miércoles", "Miercoles", "Jueves", "Viernes"];

/** Categoriza una card. El escolarizado se identifica por `tipo` (abarca varios
 *  días Lun–Jue, no por un solo nombre de día). El resto se clasifica por el día
 *  (robusto: ignora `tipo`, que a veces marca "entre-semana" para un Domingo de
 *  Casa Blanca en Gastronomía). */
function categoriaDeCard(card: CardInversion): ModalidadCategoria {
  if (card.tipo === "escolarizada") return "escolarizado";
  return categoriaDeDia(card.diaPrincipal);
}

function categoriaDeDia(dia?: string): Exclude<ModalidadCategoria, "escolarizado"> {
  const d = (dia ?? "").trim();
  return DIAS_ENTRE_SEMANA.some((x) => d.startsWith(x)) ? "entre-semana" : "fin-de-semana";
}

const PLANTEL_NOMBRE: Record<string, string> = {
  cb: "Casa Blanca",
  palmas: "Palmas",
  otay: "Otay",
  tc: "Tecate",
};

/** Días sueltos de una card: "Sábado" + "o Domingo" → ["Sábado", "Domingo"].
 *  La escolarizada (un rango Lun–Jue) se trata aparte y devuelve []. */
function diasDeCard(card: CardInversion): string[] {
  if (card.tipo === "escolarizada") return [];
  const principal = (card.diaPrincipal ?? "").trim();
  const secundario = (card.diaSecundario ?? "").trim().replace(/^[oy]\s+/i, "");
  return [principal, secundario].filter(Boolean);
}

/** Planteles donde aplica una card; null = todos los de la carrera. */
function plantelesDeCard(card: CardInversion): string[] | null {
  if (card.planteles?.length) return card.planteles;
  if (card.soloCasaBlanca) return ["cb"];
  return null;
}

/** Horario representativo de una card (el de Casa Blanca si existe split). */
function horarioDeCard(card: CardInversion): string | undefined {
  return card.horarioCasaBlanca ?? card.horario ?? card.horarioOtros ?? undefined;
}

export type ModalidadDerivada = {
  categoria: ModalidadCategoria;
  /** Tag corto para la card de la tabla. */
  tag: string;
  /** Días reales del ciclo para esta categoría, p.ej. "Martes · Jueves (Casa Blanca)". */
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

const COPY: Record<ModalidadCategoria, { tag: string; freq: string; freqUnit: string; idealPara: string; features: string[] }> = {
  "escolarizado": {
    tag: "Escolarizada",
    freq: "4 días",
    freqUnit: "/sem",
    idealPara: "Quien puede dedicar las mañanas de lunes a jueves a estudiar de tiempo completo y avanzar más rápido.",
    features: [
      "Clases de lunes a jueves por la mañana",
      "Ambiente universitario de tiempo completo",
      "Disponible en planteles seleccionados",
    ],
  },
  "entre-semana": {
    tag: "Un día entre semana",
    freq: "1 día",
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
    freq: "1 día",
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
 *  una sola). Refleja las tres formas de CENYCA; la disponibilidad de cada una
 *  varía por carrera y plantel (nota al pie de la tabla). */
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
    horario: "8:00 am – 12:00 pm",
    freq: "1 día",
    freqUnit: COPY["fin-de-semana"].freqUnit,
  },
];

export function derivarHorarios(cards?: CardInversion[]): HorariosDerivados {
  const lista = cards ?? [];

  // Agrupar días por categoría, deduplicando y anotando "Casa Blanca" si aplica.
  const porCategoria = new Map<ModalidadCategoria, { dias: string[]; horario?: string }>();

  // Planteles donde se ofrece cada día (null = todos los de la carrera). Con las
  // tarjetas por plantel un mismo día aparece en varias tarjetas: aquí se junta.
  const plantelesPorDia = new Map<string, Set<string> | null>();
  const alcances = new Set<string>();
  for (const card of lista) {
    const alcance = plantelesDeCard(card);
    alcances.add(alcance ? [...alcance].sort().join(",") : "*");
    for (const dia of diasDeCard(card)) {
      if (!plantelesPorDia.has(dia)) {
        plantelesPorDia.set(dia, alcance ? new Set(alcance) : null);
        continue;
      }
      const previo = plantelesPorDia.get(dia);
      if (previo === null || previo === undefined || !alcance) plantelesPorDia.set(dia, null);
      else alcance.forEach((p) => previo.add(p));
    }
  }
  // Un día se anota con su plantel solo si existe en un único plantel y la
  // carrera tiene otras tarjetas con otro alcance (si toda la carrera es de un
  // plantel, anotarlo en cada día sería ruido).
  const etiquetaDia = (dia: string): string => {
    const set = plantelesPorDia.get(dia);
    if (set && set.size === 1 && alcances.size > 1) {
      const unico = [...set][0];
      return `${dia} (${PLANTEL_NOMBRE[unico] ?? unico})`;
    }
    return dia;
  };

  for (const card of lista) {
    const cat = categoriaDeCard(card);
    const dias = diasDeCard(card);
    const labels = dias.length
      ? dias.map(etiquetaDia)
      : cat === "escolarizado"
        ? ["Lunes a Jueves"]
        : [];
    if (!labels.length) continue;

    const entry = porCategoria.get(cat) ?? { dias: [], horario: undefined };
    for (const label of labels) if (!entry.dias.includes(label)) entry.dias.push(label);
    if (!entry.horario) entry.horario = horarioDeCard(card);
    porCategoria.set(cat, entry);
  }

  const modalidades: ModalidadDerivada[] = (["escolarizado", "entre-semana", "fin-de-semana"] as ModalidadCategoria[])
    .filter((cat) => porCategoria.has(cat))
    .map((cat) => {
      const entry = porCategoria.get(cat)!;
      const dias = entry.dias.sort((a, b) => ordenDeLabel(a) - ordenDeLabel(b));
      return {
        categoria: cat,
        tag: COPY[cat].tag,
        dias: dias.join(" · "),
        horario: entry.horario,
        freq: COPY[cat].freq,
        freqUnit: COPY[cat].freqUnit,
      };
    });

  // Resumen de días para el HERO: en orden Lun→Dom.
  const todosLabels = modalidades
    .flatMap((m) => m.dias.split(" · "))
    .sort((a, b) => ordenDeLabel(a) - ordenDeLabel(b));
  const diasResumen = todosLabels.join(" · ");

  const tieneEsc = porCategoria.has("escolarizado");
  const tieneEntre = porCategoria.has("entre-semana");
  const tieneFin = porCategoria.has("fin-de-semana");
  const modalidadLabel = tieneEsc
    ? "Escolarizada o ejecutiva"
    : tieneEntre && tieneFin
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
