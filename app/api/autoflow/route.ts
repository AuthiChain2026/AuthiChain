import { NextRequest, NextResponse } from 'next/server'
const CF = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'
export async function POST(r: NextRequest) {
  try {
    const b = await r.json().catch(() => ({}))
    const res = await fetch(`${CF}/api/classify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[POST] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
