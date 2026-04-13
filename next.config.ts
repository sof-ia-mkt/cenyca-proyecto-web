import type { NextConfig } from "next";

const securityHeaders = [
  // Evita que el sitio sea embebido en iframes (clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Evita que el navegador adivine el tipo de contenido
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controla la información de referencia enviada en requests
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Fuerza HTTPS por 2 años (activar solo cuando el dominio tenga SSL)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Restringe acceso a APIs del navegador
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Política de seguridad de contenido
  // Permite Sanity Studio, Google Fonts y el CDN de imágenes de Sanity
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "connect-src 'self' https://api.sanity.io https://cdn.sanity.io wss://*.sanity.io",
      "frame-src 'self' https://cdn.sanity.io",
      "media-src 'self' https://cdn.sanity.io",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Headers de seguridad en todas las rutas
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
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
