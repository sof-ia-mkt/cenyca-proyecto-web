import type { NextConfig } from "next";

const commonHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
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
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io",
      "frame-src 'none'",
      "media-src 'self'",
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
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://api.sanity.io",
      "frame-src 'self' https://cdn.sanity.io",
      "media-src 'self' https://cdn.sanity.io",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
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
