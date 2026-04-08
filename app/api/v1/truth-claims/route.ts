import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const r = await fetch('https://qron-truth-network.undone-k.workers.dev/api/v1/truth-claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).catch(() => null)
  if (!r) return NextResponse.json({ error: 'upstream unavailable' }, { status: 503 })
  const data = await r.json()
  return NextResponse.json(data, { headers: { 'Access-Control-Allow-Origin': '*' } })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }})
}
