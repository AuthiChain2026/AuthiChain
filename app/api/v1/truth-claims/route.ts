import { NextRequest, NextResponse } from 'next/server';

const TRUTH_WORKER = 'https://qron-truth-network.undone-k.workers.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const r = await fetch(TRUTH_WORKER + '/api/v1/truth-claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: 'upstream error', detail: String(e) }, { status: 503 });
  }
}

export async function GET(req: NextRequest) {
  const certId = req.nextUrl.searchParams.get('cert_id');
  const path = certId ? `/api/v1/truth-claims/${certId}` : '/api/v1/truth-network/stats';
  try {
    const r = await fetch(TRUTH_WORKER + path);
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: 'upstream error' }, { status: 503 });
  }
}

export const runtime = 'edge';
