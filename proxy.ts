import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { projectId, dataset, apiVersion } from "@/sanity/env";

/**
 * PROXY — Cenyca Universidad
 *
 * Hace dos cosas:
 *
 * 1) Redirects 301/302 administrados desde Sanity (documento `redirect`).
 *    Útil cuando cambia el slug de una noticia/carrera, para no perder
 *    el SEO ni los links externos compartidos.
 *
 * 2) Protege /studio con Basic Auth en producción.
 *
 * Variables de entorno requeridas en producción para el Studio:
 *   STUDIO_USERNAME=admin
 *   STUDIO_PASSWORD=tu_contrasena_segura
 */

type RedirectRow = { from: string; to: string; permanent: boolean };

const REDIRECTS_URL = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
  `*[_type == "redirect" && defined(from) && defined(to)]{ from, to, "permanent": coalesce(permanent, true) }`
)}`;

async function fetchRedirects(): Promise<RedirectRow[]> {
  try {
    const res = await fetch(REDIRECTS_URL, {
      // Re-fetch cada 60s. Next dedupea entre requests.
      next: { revalidate: 60, tags: ["redirects"] },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { result?: RedirectRow[] };
    return json.result ?? [];
  } catch {
    return [];
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── 1) Studio: Basic Auth en producción ─────────────────────────────
  if (pathname.startsWith("/studio")) {
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.next();
    }

    const username = process.env.STUDIO_USERNAME;
    const password = process.env.STUDIO_PASSWORD;

    if (!username || !password) {
      return new NextResponse(
        "Studio no disponible: credenciales no configuradas.",
        {
          status: 503,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

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

    return new NextResponse("Acceso restringido.", {
      status: 401,
      headers: {
        "WWW-Authenticate":
          'Basic realm="Cenyca Studio - Solo administradores"',
        "Content-Type": "text/plain",
      },
    });
  }

  // ── 2) Redirects desde Sanity ──────────────────────────────────────
  // No tocar rutas internas, API ni archivos con extensión.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const redirects = await fetchRedirects();
  const match = redirects.find((r) => r.from === pathname);
  if (match) {
    const destination = match.to.startsWith("http")
      ? match.to
      : new URL(match.to + (search || ""), request.url).toString();
    return NextResponse.redirect(destination, match.permanent ? 301 : 302);
  }

  return NextResponse.next();
}

export const config = {
  // Aplica a todo excepto assets de Next y archivos estáticos.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
