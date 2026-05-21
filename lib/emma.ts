// Cliente único para enviar leads desde los formularios del sitio.
//
// HISTORIA: antes este archivo llamaba directamente al CRM Emma desde
// el navegador del cliente, exponiendo la API key en el bundle público
// (NEXT_PUBLIC_EMMA_API_KEY). Ahora se llama a /api/leads — un endpoint
// server-side que:
//   1) Respalda el lead en nuestra propia DB (Neon) — cero pérdida si
//      Emma se cae o la key expira.
//   2) Llama a Emma con la key server-only (EMMA_API_KEY).
//   3) Marca el estado de cada lead (sent | failed | invalid) en DB.
//
// La interfaz pública (enviarLeadAEmma, esTelefonoValido, etc.) se
// mantiene idéntica para que los componentes de formularios no se
// modifiquen.

export const PLANTEL_LABEL: Record<string, string> = {
  casablanca: "Casa Blanca",
  palmas: "Palmas",
  otay: "Otay",
  tecate: "Tecate",
};

export const CIUDAD_POR_PLANTEL: Record<string, string> = {
  casablanca: "Tijuana",
  palmas: "Tijuana",
  otay: "Tijuana",
  tecate: "Tecate",
};

export type EmmaPayload = {
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

export type EmmaResult =
  | { ok: true }
  | {
      ok: false;
      reason: "invalid_phone" | "invalid_name" | "rate_limited" | "auth" | "server" | "network";
      message: string;
    };

export function normalizarTelefono(input: string): string {
  return input.replace(/\D/g, "").slice(-10);
}

// Validación de teléfono MX: 10 dígitos, no todos iguales, primer dígito 2-9.
// Bloquea "0000000000", "1111111111", "5555555555", etc.
export function esTelefonoValido(tel: string): boolean {
  if (tel.length !== 10) return false;
  if (/^(\d)\1{9}$/.test(tel)) return false;
  if (!/^[2-9]/.test(tel)) return false;
  return true;
}

type EmmaErrorReason = Extract<EmmaResult, { ok: false }>["reason"];

type ApiErrorBody = {
  ok?: boolean;
  reason?: string;
  message?: string;
};

const VALID_REASONS: ReadonlySet<EmmaErrorReason> = new Set([
  "invalid_phone",
  "invalid_name",
  "rate_limited",
  "auth",
  "server",
  "network",
]);

function reasonFromApi(reason: string | undefined): EmmaErrorReason {
  if (reason && VALID_REASONS.has(reason as EmmaErrorReason)) {
    return reason as EmmaErrorReason;
  }
  return "server";
}

export async function enviarLeadAEmma(payload: EmmaPayload): Promise<EmmaResult> {
  // Validación local (mismo contrato que antes) — devuelve feedback
  // inmediato sin necesidad de roundtrip al server.
  if (!esTelefonoValido(payload.telefono)) {
    return {
      ok: false,
      reason: "invalid_phone",
      message: "Verifica tu teléfono. Debe ser un número mexicano válido de 10 dígitos.",
    };
  }
  if (!payload.nombre.trim()) {
    return {
      ok: false,
      reason: "invalid_name",
      message: "Por favor escribe tu nombre completo.",
    };
  }

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };

    let data: ApiErrorBody = {};
    try {
      data = (await res.json()) as ApiErrorBody;
    } catch {
      /* respuesta sin JSON, usamos defaults */
    }

    if (res.status === 422) {
      return {
        ok: false,
        reason: reasonFromApi(data.reason),
        message: data.message || "Verifica tus datos.",
      };
    }
    if (res.status === 429) {
      return {
        ok: false,
        reason: "rate_limited",
        message: data.message || "Demasiados intentos. Espera un momento e intenta de nuevo.",
      };
    }
    return {
      ok: false,
      reason: "server",
      message: data.message || "Hubo un error. Intenta de nuevo en un momento.",
    };
  } catch {
    return {
      ok: false,
      reason: "network",
      message: "Sin conexión. Verifica tu internet e intenta de nuevo.",
    };
  }
}

// Telemetría Meta — dispara evento Lead si fbq está cargado en window.
export function trackLead() {
  if (typeof window !== "undefined") {
    const w = window as unknown as { fbq?: (action: string, event: string) => void };
    w.fbq?.("track", "Lead");
  }
}
