import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { projectId, dataset, apiVersion } from "@/sanity/env";

/**
 * PROXY — Cenyca Universidad
 *
 * Hace dos cosas:
 *
 * 1) Basic Auth para /admin/* — panel interno de leads. Reusa las
 *    credenciales STUDIO_USERNAME/STUDIO_PASSWORD que ya vivían en
 *    Vercel para el Studio. Si esas vars no existen, /admin queda
 *    bloqueado por defecto (fail-closed).
 *
 * 2) Redirects 301/302 administrados desde Sanity (documento `redirect`).
 *    Útil cuando cambia el slug de una noticia/carrera, para no perder
 *    el SEO ni los links externos compartidos.
 *
 * Nota: la protección Basic Auth de /studio fue removida; el acceso al
 * Studio queda controlado únicamente por el login de Sanity (Google/GitHub
 * con miembros autorizados del proyecto).
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

// ── Basic Auth para /admin/* ────────────────────────────────────────
// Decodifica el header Authorization y compara contra las env vars.
// Comparación en tiempo constante para evitar timing attacks.

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function checkAdminAuth(request: NextRequest): boolean {
  const expectedUser = process.env.STUDIO_USERNAME;
  const expectedPass = process.env.STUDIO_PASSWORD;
  if (!expectedUser || !expectedPass) return false; // fail-closed

  const auth = request.headers.get("authorization");
  if (!auth || !auth.startsWith("Basic ")) return false;

  let decoded = "";
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return false;
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return false;
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  return timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPass);
}

function unauthorizedAdmin(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CENYCA Admin", charset="UTF-8"',
      "Content-Type": "text/plain",
    },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ── Basic Auth para /admin/* (incluye /admin y /api/leads/admin-* endpoints) ─
  if (pathname.startsWith("/admin")) {
    if (!checkAdminAuth(request)) return unauthorizedAdmin();
    return NextResponse.next();
  }

  // /studio queda abierto: el login de Sanity controla el acceso.
  if (pathname.startsWith("/studio")) {
    return NextResponse.next();
  }

  // ── Redirects desde Sanity ─────────────────────────────────────────
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
