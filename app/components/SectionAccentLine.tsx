/**
 * Línea sutil de acento horizontal — se desvanece hacia los bordes.
 * Se usa al inicio o al final de una sección para crear separación visual
 * sin romper el flujo. Mantiene coherencia con las líneas cian del CTA Contador.
 *
 * Convención visual del sitio:
 *  - Secciones de fondo oscuro: usar accent cian (#00D4FF)
 *  - Secciones de fondo claro: usar accent dorado (#E9C176)
 */
export default function SectionAccentLine({
  accent = "#E9C176",
  position = "top",
  opacity = 0.5,
}: {
  accent?: string;
  position?: "top" | "bottom";
  opacity?: number;
}) {
  const rgb =
    accent === "#00D4FF" ? "0,212,255" : accent === "#E9C176" ? "233,193,118" : "0,0,0";

  return (
    <div
      aria-hidden
      className={`absolute ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 h-px pointer-events-none`}
      style={{
        background: `linear-gradient(90deg, transparent 0%, rgba(${rgb},${opacity}) 50%, transparent 100%)`,
      }}
    />
  );
}
