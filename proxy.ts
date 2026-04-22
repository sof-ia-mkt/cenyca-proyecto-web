import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * PROXY DE SEGURIDAD — Cenyca Universidad
 *
 * Protege el panel de administración de Sanity Studio (/studio)
 * con autenticación básica HTTP cuando se accede en producción.
 *
 * En desarrollo local no se requiere contraseña.
 *
 * Variables de entorno requeridas en producción:
 *   STUDIO_USERNAME=admin
 *   STUDIO_PASSWORD=tu_contrasena_segura
 */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo proteger rutas del Studio
  if (pathname.startsWith("/studio")) {
    // En desarrollo no bloqueamos
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    const username = process.env.STUDIO_USERNAME;
    const password = process.env.STUDIO_PASSWORD;

    // Si no hay credenciales configuradas en producción, bloquear acceso
    if (!username || !password) {
      return new NextResponse("Studio no disponible: credenciales no configuradas.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Verificar el header Authorization
    const authHeader = request.headers.get("authorization");

    if (authHeader) {
      const [scheme, encoded] = authHeader.split(" ");

      if (scheme === "Basic" && encoded) {
        const decoded = Buffer.from(encoded, "base64").toString("utf-8");
        const [user, pass] = decoded.split(":");

        if (user === username && pass === password) {
          return NextResponse.next();
        }
      }
    }

    // Solicitar credenciales al navegador
    return new NextResponse("Acceso restringido.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Cenyca Studio - Solo administradores"',
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
