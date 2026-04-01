import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// authichain-api: the RapidAPI gateway worker (v2.4)
const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  const serial = req.nextUrl.searchParams.get('id') || req.nextUrl.searchParams.get('productId') || req.nextUrl.searchParams.get('serial')
  if (!serial) {
    return NextResponse.json(
      { error: 'Missing required parameter: id or serial', usage: 'GET /api/v1/verify?id={serial}' },
      { status: 400, headers: CORS }
    )
  }
  return proxyVerify(serial, req.headers.get('X-RapidAPI-Key') || '')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const serial = body.serial || body.productId || body.id
  if (!serial) {
    return NextResponse.json(
      { error: 'Missing required field: serial or productId', usage: 'POST { "serial": "..." }' },
      { status: 400, headers: CORS }
    )
  }
  return proxyVerify(serial, req.headers.get('X-RapidAPI-Key') || '', body)
}

async function proxyVerify(serial: string, apiKey: string, extra: Record<string, unknown> = {}) {
  try {
    const res = await fetch(`${CF_API}/api/v1/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-RapidAPI-Key': apiKey } : {}),
      },
      body: JSON.stringify({ serial, product: extra.product || serial, ...extra }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: CORS })
  } catch (err) {
    console.error('[v1/verify] Error:', err)
    return NextResponse.json(
      { error: 'Verification service temporarily unavailable' },
      { status: 503, headers: CORS }
    )
  }
}
