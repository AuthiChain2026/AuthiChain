import { NextRequest, NextResponse } from 'next/server'
const CF = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'
export async function GET(_r: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const res = await fetch(`${CF}/api/verify/${encodeURIComponent(id)}`)
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[GET] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
