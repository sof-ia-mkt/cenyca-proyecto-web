// Cliente server-side para el Dashboard de inscripciones (plataforma propia,
// dashboard.cenycauniversidad.mx). Sustituye al viejo cliente de Emma (CRM de
// Novai en Railway), apagado en junio 2026 — ver git log de lib/emma-server.ts.
//
// SOLO debe importarse desde route handlers o server components. El token vive
// en DASHBOARD_WEBHOOK_TOKEN (sin prefijo NEXT_PUBLIC_) para que jamás llegue
// al bundle del cliente.

const TIMEOUT_MS = 10_000;

export type DashboardLeadPayload = {
  telefono: string;
  nombre: string;
  email?: string;
  carrera?: string;
  plantel?: string;
  ciudad?: string;
  turno?: string;
  mensaje?: string;
  source: string;
};

export type DashboardResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_phone" | "rate_limited" | "auth" | "server" | "network" | "config";
      status?: number;
      message: string;
    };

export async function enviarLeadADashboard(
  payload: DashboardLeadPayload,
): Promise<DashboardResult> {
  const url = process.env.DASHBOARD_WEBHOOK_URL;
  const token = process.env.DASHBOARD_WEBHOOK_TOKEN;
  if (!url || !token) {
    return {
      ok: false,
      reason: "config",
      message: "DASHBOARD_WEBHOOK_URL / DASHBOARD_WEBHOOK_TOKEN no configuradas.",
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-webhook-token": token,
      },
      body: JSON.stringify({
        nombre: payload.nombre,
        telefono: payload.telefono,
        email: payload.email,
        fuente: "web",
        campania: payload.source, // ej. "web-industrial", "home-cta-contador"
        plantel: payload.plantel,
        carrera: payload.carrera,
        ciudad: payload.ciudad,
        turno: payload.turno,
        mensaje: payload.mensaje,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (res.ok) return { ok: true };

    let detalle = "";
    try {
      detalle = (await res.text()).slice(0, 500);
    } catch {
      /* ignore */
    }

    if (res.status === 422 || res.status === 400) {
      return {
        ok: false,
        reason: "invalid_phone",
        status: res.status,
        message: detalle || "Payload rechazado por el dashboard.",
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        reason: "rate_limited",
        status: 429,
        message: detalle || "Rate limit en el dashboard.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        reason: "auth",
        status: res.status,
        message: detalle || "Token del webhook rechazado.",
      };
    }
    return {
      ok: false,
      reason: "server",
      status: res.status,
      message: detalle || `El dashboard respondió ${res.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "network",
      message: err instanceof Error ? err.message : "Error de red hacia el dashboard.",
    };
  }
}
