import { NextRequest, NextResponse } from 'next/server';

// Rate limiting en memoria — máximo MAX_REPORTS por IP en WINDOW_MS.
// Suficiente para CSP reports (tráfico bajo). Para mayor escala migrar a Upstash/Vercel KV.
const WINDOW_MS = 60_000;
const MAX_REPORTS = 30;
const buckets = new Map<string, { count: number; reset: number }>();

// Limpieza ocasional para no crecer indefinidamente
function sweep(now: number) {
  if (buckets.size < 1000) return;
  for (const [ip, b] of buckets) {
    if (b.reset < now) buckets.delete(ip);
  }
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(ip);
  if (!bucket || bucket.reset < now) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_REPORTS) return false;
  bucket.count += 1;
  return true;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (!rateLimit(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  try {
    const contentType = request.headers.get('content-type') ?? '';

    // Solo aceptamos los content-types de CSP reports — todo lo demás se rechaza
    const isCspReport =
      contentType.includes('application/csp-report') ||
      contentType.includes('application/reports+json');

    if (!isCspReport) {
      return new NextResponse(null, { status: 415 });
    }

    // Limita tamaño del body a 16KB — reports legítimos son <2KB
    const raw = await request.text();
    if (raw.length > 16_384) {
      return new NextResponse(null, { status: 413 });
    }

    let report: unknown;
    try {
      report = JSON.parse(raw);
    } catch {
      return new NextResponse(null, { status: 400 });
    }

    console.warn('[CSP Violation]', JSON.stringify(report).slice(0, 2000));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CSP Report Error]', error);
    return new NextResponse(null, { status: 204 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
