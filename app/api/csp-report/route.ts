import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let report: unknown;

    if (contentType.includes('application/csp-report')) {
      report = await request.json();
    } else if (contentType.includes('application/reports+json')) {
      report = await request.json();
    } else {
      report = await request.text();
    }

    console.warn('[CSP Violation]', JSON.stringify(report, null, 2));

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CSP Report Error]', error);
    return new NextResponse(null, { status: 204 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
