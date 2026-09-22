/**
 * FECHAS — formato único y con zona horaria fija.
 *
 * Por qué existe este módulo: `toLocaleDateString` usa la zona horaria de
 * quien lo ejecuta. En el servidor (Vercel) eso es UTC; en el navegador es la
 * del visitante. Una noticia fechada 2026-04-09T03:25Z se renderizaba como
 * "9 abr 2026" en el HTML del servidor y "8 abr 2026" al hidratar, y React
 * abortaba la hidratación de ese árbol con el error #418.
 *
 * Al fijar la zona, servidor y cliente producen siempre el mismo texto. Se usa
 * America/Tijuana porque es donde están los planteles y es la fecha que el
 * lector espera ver.
 *
 * Regla: ninguna fecha que se renderice en el servidor debe formatearse fuera
 * de aquí.
 */

const TZ = "America/Tijuana";
const LOCALE = "es-MX";

function parse(iso?: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "9 de abril de 2026" — cuerpo de noticias, avisos y listados. */
export function fechaLarga(iso?: string | null): string | null {
  const d = parse(iso);
  if (!d) return null;
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: TZ,
  }).format(d);
}

/** "9 abr 2026" — tarjetas compactas. */
export function fechaCorta(iso?: string | null): string | null {
  const d = parse(iso);
  if (!d) return null;
  return new Intl.DateTimeFormat(LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: TZ,
  }).format(d);
}

/**
 * Año en curso en Baja California. `new Date().getFullYear()` usaría UTC en el
 * servidor: la noche del 31 de diciembre el pie de página mostraría el año
 * siguiente en el HTML y el correcto al hidratar.
 */
export function anioActual(ahora: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: TZ }).format(ahora)
  );
}
