// Utilidades del ciclo de admisión.
//
// Fuente única de verdad: `configuracion.cicloInicio.fecha` en Sanity. Todo lo
// que antes decía "Septiembre 2026" a mano (pill del home, tarjeta de carrera,
// popup) se deriva de esa fecha, así que cambiar el ciclo es editar un campo.
//
// Las funciones son deterministas (zona horaria fija) para que server y cliente
// produzcan exactamente el mismo texto y no haya mismatch de hidratación.

const TZ = "America/Tijuana";

export type CicloInicio = {
  activo?: boolean;
  fecha?: string; // ISO string
};

function parse(fechaISO?: string | null): Date | null {
  if (!fechaISO) return null;
  const d = new Date(fechaISO);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "Enero 2027" — nombre del ciclo para pills y tarjetas. */
export function nombreCiclo(fechaISO?: string | null): string | null {
  const d = parse(fechaISO);
  if (!d) return null;
  const mes = new Intl.DateTimeFormat("es-MX", { month: "long", timeZone: TZ }).format(d);
  const anio = new Intl.DateTimeFormat("es-MX", { year: "numeric", timeZone: TZ }).format(d);
  return `${mes.charAt(0).toUpperCase()}${mes.slice(1)} ${anio}`;
}

/** "11 de enero" — fecha corta para copys ("Clases inician el 11 de enero"). */
export function fechaCicloCorta(fechaISO?: string | null): string | null {
  const d = parse(fechaISO);
  if (!d) return null;
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", timeZone: TZ }).format(d);
}

/** "enero" — mes del ciclo en minúsculas para copys ("comienza clases en enero"). */
export function mesCiclo(fechaISO?: string | null): string | null {
  const d = parse(fechaISO);
  if (!d) return null;
  return new Intl.DateTimeFormat("es-MX", { month: "long", timeZone: TZ }).format(d);
}

/** Días completos que faltan para el inicio (negativo si ya pasó). */
export function diasParaCiclo(fechaISO?: string | null, ahora: number = Date.now()): number | null {
  const d = parse(fechaISO);
  if (!d) return null;
  return Math.ceil((d.getTime() - ahora) / 86_400_000);
}

/** true si el ciclo está activo en Sanity y su fecha aún no pasó. */
export function cicloVigente(ciclo?: CicloInicio | null, ahora: number = Date.now()): boolean {
  if (!ciclo || ciclo.activo === false) return false;
  const d = parse(ciclo.fecha);
  return !!d && d.getTime() > ahora;
}
