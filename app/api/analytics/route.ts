import { NextRequest, NextResponse } from 'next/server'
const CF = process.env.CF_WORKER_URL || 'https://authichain-unified.undone-k.workers.dev'
export async function GET(r: NextRequest) {
  try {
    const res = await fetch(`${CF}/api/analytics`, { headers: { 'Content-Type': 'application/json' } })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[GET] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,OPTIONS' } }) }
