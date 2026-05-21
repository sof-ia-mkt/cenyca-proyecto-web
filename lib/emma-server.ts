// Cliente server-side para Emma (CRM de Novai).
// Este archivo SOLO debe ser importado desde route handlers o server
// components — nunca desde código que corre en el navegador. La key
// vive en EMMA_API_KEY (sin prefijo NEXT_PUBLIC_) para que jamás
// llegue al bundle del cliente.
//
// Convención: el nombre del archivo termina en -server.ts y solo se
// importa desde rutas API. No usamos `import "server-only"` porque
// añadiría una dep extra; la garantía es manual + convención.

const API_URL = "https://emma-sistema.up.railway.app/api/landing/prospect";

export type EmmaServerPayload = {
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

export type EmmaServerResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_phone" | "rate_limited" | "auth" | "server" | "network" | "config";
      status?: number;
      message: string;
    };

export async function enviarLeadAEmmaServer(
  payload: EmmaServerPayload,
): Promise<EmmaServerResult> {
  const apiKey = process.env.EMMA_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      reason: "config",
      message: "EMMA_API_KEY no configurada en el servidor.",
    };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(payload),
      // Timeout razonable para no colgar el endpoint si Emma está lento.
      signal: AbortSignal.timeout(10_000),
    });

    if (res.ok) return { ok: true };

    let detalle = "";
    try {
      detalle = (await res.text()).slice(0, 500);
    } catch {
      /* ignore */
    }

    if (res.status === 422) {
      return {
        ok: false,
        reason: "invalid_phone",
        status: 422,
        message: detalle || "Teléfono inválido según Emma.",
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        reason: "rate_limited",
        status: 429,
        message: detalle || "Rate limit en Emma.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        reason: "auth",
        status: res.status,
        message: detalle || "Credenciales rechazadas por Emma.",
      };
    }
    return {
      ok: false,
      reason: "server",
      status: res.status,
      message: detalle || `Emma respondió ${res.status}.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return {
      ok: false,
      reason: "network",
      message: `Fallo de red al llamar Emma: ${msg}`,
    };
  }
}
