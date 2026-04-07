import { NextResponse } from 'next/server';

const TRUTH_WORKER = 'https://qron-truth-network.undone-k.workers.dev';

export async function GET() {
  try {
    const r = await fetch(TRUTH_WORKER + '/api/v1/truth-network/stats');
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: 'upstream error', detail: String(e) }, { status: 503 });
  }
}

export const runtime = 'edge';
