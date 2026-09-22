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

// apicdn: la API con CDN de Sanity — misma data, cacheada y sin quemar la
// cuota de "API requests" del plan (la API directa se topó en jul 2026).
const REDIRECTS_URL = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
  `*[_type == "redirect" && defined(from) && defined(to)]{ from, to, "permanent": coalesce(permanent, true) }`
)}`;

// Caché en memoria del módulo: dentro del Proxy las opciones next.revalidate
// de fetch NO tienen efecto (docs de Next 16), así que la frescura se maneja
// aquí. Vive mientras viva la instancia; cada instancia hace ~1 fetch/min en
// lugar de 1 por página vista.
const REDIRECTS_TTL_MS = 60_000;
let redirectsCache: { rows: RedirectRow[]; fetchedAt: number } | null = null;

async function fetchRedirects(): Promise<RedirectRow[]> {
  const now = Date.now();
  if (redirectsCache && now - redirectsCache.fetchedAt < REDIRECTS_TTL_MS) {
    return redirectsCache.rows;
  }
  try {
    // Sin tiempo límite, una respuesta lenta de Sanity bloquea TODA página
    // HTML del sitio: este fetch corre antes del render en cada navegación.
    const res = await fetch(REDIRECTS_URL, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) {
      console.warn(`[proxy] redirects: Sanity respondió ${res.status}; usando caché previa`);
      redirectsCache = { rows: redirectsCache?.rows ?? [], fetchedAt: now };
      return redirectsCache.rows;
    }
    const json = (await res.json()) as { result?: RedirectRow[] };
    redirectsCache = { rows: json.result ?? [], fetchedAt: now };
    return redirectsCache.rows;
  } catch (err) {
    console.warn("[proxy] redirects: fetch a Sanity falló; usando caché previa", err);
    // Se refresca `fetchedAt` aunque haya fallado: de lo contrario cada
    // petición reintentaría contra un servicio ya caído, multiplicando la
    // carga y quemando la cuota de API justo cuando menos conviene.
    redirectsCache = { rows: redirectsCache?.rows ?? [], fetchedAt: now };
    return redirectsCache.rows;
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
  // Aplica a todo excepto assets de Next y archivos estáticos. El patrón
  // exige una extensión al final (\.\w+$) en vez de "cualquier punto": así
  // una ruta como /noticias/version-2.0 sí recibe los redirects de Sanity.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)"],
};
