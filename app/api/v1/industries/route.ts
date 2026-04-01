import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  try {
    const res = await fetch(`${CF_API}/api/v1/industries`, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: CORS })
  } catch {
    return NextResponse.json({ success: false, error: 'Service unavailable' }, { status: 503, headers: CORS })
  }
}
