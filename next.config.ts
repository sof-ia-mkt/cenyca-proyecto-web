import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },

  async headers() {
    const securityHeaders = [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
    ];

    const cspStrict = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' cdn.sanity.io data: blob:",
      "font-src 'self'",
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io",
      "frame-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "report-uri /api/csp-report",
    ].join('; ');

    const cspStudio = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' cdn.sanity.io data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io https://*.sanity.io",
      "frame-src 'self' https://*.sanity.io",
      "worker-src 'self' blob:",
      "report-uri /api/csp-report",
    ].join('; ');

    return [
      {
        source: '/studio/:path*',
        headers: [
          ...securityHeaders.filter(h => h.key !== 'X-Frame-Options'),
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspStudio,
          },
        ],
      },
      {
        source: '/((?!studio).*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Content-Security-Policy-Report-Only',
            value: cspStrict,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
