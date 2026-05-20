// Fallback unificado para la URL pública del sitio. En producción debe definirse
// NEXT_PUBLIC_SITE_URL en las variables de entorno (Vercel).
export const SITE_URL_FALLBACK = "https://oficial.cenyca.edu.mx";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK;
