import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// En worktrees, node_modules vive en el checkout principal (varios niveles arriba).
// Turbopack necesita conocer ese directorio para resolver paquetes.
function findTurbopackRoot(start: string): string {
  let dir = start;
  while (dir !== path.sep) {
    if (fs.existsSync(path.join(dir, "node_modules", "next"))) return dir;
    dir = path.dirname(dir);
  }
  return start;
}

// Para analizar bundle, usar `npm run analyze` (next build --experimental-analyze)
// Genera UI interactiva en .next/diagnostics/analyze/ — sirve con `npx serve .next/diagnostics/analyze`.

const commonHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Aislamiento cross-origin — defensa contra Spectre y leaks entre orígenes
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
];

const isDev = process.env.NODE_ENV !== "production";

// ── Dominios de analítica y publicidad ──────────────────────────────────────
// Meta Pixel y Google Tag Manager viven en app/components/Analitica.tsx.
// Se incluyen también los dominios de Google Analytics 4 y Google Ads: el
// contenedor de GTM está vacío hoy, y sin estos permisos cualquier etiqueta
// que marketing agregue después quedaría bloqueada por el navegador y haría
// falta un deploy para desbloquearla. Sigue siendo una lista cerrada.
const META = {
  script: ["https://connect.facebook.net"],
  img: ["https://www.facebook.com"],
  connect: ["https://www.facebook.com"],
  // El pixel sincroniza cookies con un iframe a facebook.com y, como respaldo,
  // envía un formulario a facebook.com/tr/. Sin estas dos el navegador lo bloquea.
  frame: ["https://www.facebook.com"],
  form: ["https://www.facebook.com"],
};

const GOOGLE = {
  script: [
    "https://www.googletagmanager.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
  ],
  img: [
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://www.google.com",
    "https://www.google.com.mx",
    "https://ad.doubleclick.net",
    "https://*.g.doubleclick.net",
  ],
  connect: [
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    // analytics.google.com SIN comodín: `*.analytics.google.com` no cubre el
    // dominio a secas, y es justo el que GA4 usa para enviar las visitas.
    // Por eso Analytics cargaba pero no reportaba nada.
    "https://analytics.google.com",
    "https://*.analytics.google.com",
    // Endpoints de conversión de Google Ads (/ccm/collect, /rmkt/collect).
    // Llegan al dominio del país del visitante, de ahí las variantes.
    "https://www.google.com",
    "https://www.google.com.mx",
    "https://ad.doubleclick.net",
    "https://*.g.doubleclick.net",
  ],
  frame: ["https://www.googletagmanager.com", "https://td.doubleclick.net"],
};

// Microsoft Clarity — mapas de calor y grabación de sesiones, añadido por
// marketing dentro de GTM. Sube los datos a subdominios regionales
// (x.clarity.ms, k.clarity.ms...), de ahí el comodín en connect.
const CLARITY = {
  script: ["https://www.clarity.ms", "https://*.clarity.ms"],
  img: ["https://www.clarity.ms", "https://*.clarity.ms", "https://c.bing.com"],
  connect: ["https://www.clarity.ms", "https://*.clarity.ms", "https://c.bing.com"],
};

const lista = (...partes: string[][]) => partes.flat().join(" ");

// Headers para el sitio público — sin unsafe-eval en producción
const publicHeaders = [
  ...commonHeaders,
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-inline' lo exigen los scripts de hidratación de Next y las
      // etiquetas HTML personalizadas de GTM.
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${lista(META.script, GOOGLE.script, CLARITY.script)}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // i.ytimg.com: thumbnails de LazyYouTubeEmbed (testimoniales en video).
      `img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com ${lista(META.img, GOOGLE.img, CLARITY.img)}`,
      `connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io ${lista(META.connect, GOOGLE.connect, CLARITY.connect)}`,
      `frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com ${lista(META.frame, GOOGLE.frame)}`,
      "media-src 'self' https://cdn.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
      `form-action 'self' ${lista(META.form)}`,
      "report-uri /api/csp-report",
    ].join("; "),
  },
];

// Headers para /studio — necesita unsafe-eval para el editor de Sanity
const studioHeaders = [
  ...commonHeaders,
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com",
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://api.sanity.io https://sanity-cdn.com https://*.sanity-cdn.com",
      "frame-src 'self' https://cdn.sanity.io",
      "media-src 'self' https://cdn.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: findTurbopackRoot(__dirname),
  },

  async headers() {
    return [
      { source: "/((?!studio).*)", headers: publicHeaders },
      { source: "/studio/:path*", headers: studioHeaders },
    ];
  },

  // Redirects 308 (permanentes) para typos comunes y alias singulares.
  // Captura el tráfico cuando el usuario escribe la URL "casi bien" en
  // vez de mandarlo a 404. Sólo cosas obvias y deterministas — el resto
  // se resuelve con sugerencias en la página 404 inteligente.
  async redirects() {
    return [
      // Plurales / singulares de secciones
      { source: "/oferta", destination: "/oferta-academica", permanent: true },
      { source: "/licenciatura", destination: "/licenciaturas", permanent: true },
      { source: "/ingenieria", destination: "/ingenierias", permanent: true },
      { source: "/admision", destination: "/admisiones", permanent: true },
      { source: "/beca", destination: "/becas", permanent: true },
      { source: "/posgrado", destination: "/posgrados", permanent: true },
      { source: "/intercambio", destination: "/intercambios", permanent: true },
      { source: "/documento", destination: "/documentos", permanent: true },
      { source: "/aviso-de-privacidad", destination: "/avisos-de-privacidad", permanent: true },

      // Slugs dinámicos en singular → plural
      { source: "/carrera/:slug", destination: "/carreras/:slug", permanent: true },
      { source: "/noticia/:slug", destination: "/noticias/:slug", permanent: true },
      { source: "/aviso/:slug", destination: "/avisos-de-privacidad/:slug", permanent: true },
      { source: "/aviso-de-privacidad/:slug", destination: "/avisos-de-privacidad/:slug", permanent: true },

      // Intenciones de contacto / inscripción
      { source: "/contacto", destination: "/#contacto", permanent: true },
      { source: "/inscripcion", destination: "/#contacto", permanent: true },
      { source: "/inscripciones", destination: "/#contacto", permanent: true },

      // URLs del sitio anterior que siguen recibiendo tráfico (medido en los
      // logs de Vercel). Sin esto caen en 404 y se pierde el enlace entrante.
      { source: "/licenciatura-en-:slug", destination: "/carreras/:slug", permanent: true },
      { source: "/ingenieria-en-:slug", destination: "/carreras/ingenieria-en-:slug", permanent: true },
      { source: "/oferta/:path*", destination: "/oferta-academica", permanent: true },
      { source: "/licenciaturas/cyc", destination: "/carreras/criminologia-y-criminalistica", permanent: true },
      { source: "/vida_estudiantil/:path*", destination: "/noticias", permanent: true },
      { source: "/contact-us", destination: "/#contacto", permanent: true },

      // Alias EN/típicos
      { source: "/about", destination: "/nosotros", permanent: true },
      { source: "/acerca", destination: "/nosotros", permanent: true },
      { source: "/acerca-de", destination: "/nosotros", permanent: true },
      { source: "/quienes-somos", destination: "/nosotros", permanent: true },
      { source: "/news", destination: "/noticias", permanent: true },
      { source: "/blog", destination: "/noticias", permanent: true },
      { source: "/careers", destination: "/oferta-academica", permanent: true },
      { source: "/planteles", destination: "/#planteles", permanent: true },
      { source: "/campus", destination: "/#planteles", permanent: true },
    ];
  },

  // Optimización de imágenes: permite el CDN de Sanity
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // AVIF primero (20-40% más ligero que WebP en fotos); WebP como fallback.
    formats: ["image/avif", "image/webp"],
    // Los assets de cdn.sanity.io y /public son inmutables (URL cambia si
    // cambia el contenido): cachear las transformaciones 31 días reduce
    // invocaciones de optimización en Vercel.
    minimumCacheTTL: 2678400,
  },

  // Compresión habilitada
  compress: true,

  // Elimina el header "x-powered-by: Next.js" (no revelar el stack)
  poweredByHeader: false,
};

export default nextConfig;
