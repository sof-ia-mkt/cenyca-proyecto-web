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

// Headers para el sitio público — sin unsafe-eval en producción
const publicHeaders = [
  ...commonHeaders,
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Access-Control-Allow-Origin", value: "https://cenyca-proyecto-web.vercel.app" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://connect.facebook.net`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://www.facebook.com",
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://emma-sistema.up.railway.app",
      "frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com",
      "media-src 'self' https://cdn.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
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

  // Optimización de imágenes: permite el CDN de Sanity
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // Compresión habilitada
  compress: true,

  // Elimina el header "x-powered-by: Next.js" (no revelar el stack)
  poweredByHeader: false,
};

export default nextConfig;
