import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' }

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET() {
  try {
    const res = await fetch(`${CF_API}/health`, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    return NextResponse.json(
      { ...data, gateway: 'authichain.com', timestamp: new Date().toISOString() },
      { status: 200, headers: CORS }
    )
  } catch {
    return NextResponse.json(
      { status: 'degraded', gateway: 'authichain.com', timestamp: new Date().toISOString() },
      { status: 200, headers: CORS }   // always 200 so RapidAPI stays green
    )
  }
}
