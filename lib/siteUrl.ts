// Fallback unificado para la URL pública del sitio. En producción debe definirse
// NEXT_PUBLIC_SITE_URL en las variables de entorno (Vercel). El fallback apunta
// al dominio de preview de Vercel hasta que se configure el dominio definitivo.
export const SITE_URL_FALLBACK = "https://cenyca-proyecto-web.vercel.app";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_FALLBACK;
