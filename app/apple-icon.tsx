import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180x180) — usado cuando un usuario de iOS agrega el
 * sitio a su pantalla de inicio. Sin este archivo, iOS muestra una captura
 * borrosa de la página.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 130,
          fontWeight: 900,
          letterSpacing: -4,
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
