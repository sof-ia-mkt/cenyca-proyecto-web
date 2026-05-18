import { ImageResponse } from "next/og";

/**
 * Icono generado dinámicamente para tabs de browser, PWA y resultados de
 * búsqueda. Next sirve esto en /icon (32x32) y reemplaza la necesidad de
 * favicon.ico (que se mantiene como fallback para browsers viejos).
 *
 * Diseño: monograma "C" sobre fondo de marca (#121B33) con acento cian
 * (#00D4FF). Reemplazo temporal hasta tener un isotipo cuadrado oficial.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121B33",
          color: "#00D4FF",
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: -1,
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
