// Cliente único hacia Emma (CRM de Novai) para todos los formularios del sitio.
// La key vive en NEXT_PUBLIC_EMMA_API_KEY — es la misma key pública que usan
// las landings dedicadas (sof-ia-mkt/landing-pages.cenyca), por lo que está
// diseñada para vivir en el bundle del cliente. Cambiar de key = actualizar
// el env var en Vercel y redeploy.

const API_URL = "https://emma-sistema.up.railway.app/api/landing/prospect";

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

export async function enviarLeadAEmma(payload: EmmaPayload): Promise<EmmaResult> {
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

  const apiKey = process.env.NEXT_PUBLIC_EMMA_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      reason: "auth",
      message: "Problema de configuración. Contáctanos por WhatsApp.",
    };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };
    if (res.status === 422)
      return { ok: false, reason: "invalid_phone", message: "Verifica tu teléfono. Debe ser un número válido." };
    if (res.status === 429)
      return { ok: false, reason: "rate_limited", message: "Demasiados intentos. Espera un momento e intenta de nuevo." };
    if (res.status === 401)
      return { ok: false, reason: "auth", message: "Problema de configuración. Contáctanos por WhatsApp." };
    return { ok: false, reason: "server", message: "Hubo un error. Intenta de nuevo en un momento." };
  } catch {
    return { ok: false, reason: "network", message: "Sin conexión. Verifica tu internet e intenta de nuevo." };
  }
}

// Telemetría Meta — dispara evento Lead si fbq está cargado en window.
export function trackLead() {
  if (typeof window !== "undefined") {
    const w = window as unknown as { fbq?: (action: string, event: string) => void };
    w.fbq?.("track", "Lead");
  }
}
