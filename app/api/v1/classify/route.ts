import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'
const ALLOWED_ORIGINS = new Set((process.env.CORS_ALLOWED_ORIGINS || 'https://authichain.com').split(','));
function getCorsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization',
  };
}
export async function OPTIONS(req: NextRequest) { return new NextResponse(null, { status: 204, headers: getCorsHeaders(req) }) }
async function proxy(req: NextRequest, method: string) {
  const cors = getCorsHeaders(req)
  try {
    const url = new URL(req.url)
    const target = `${CF_API}${url.pathname}${url.search}`
    const headers: Record<string, string> = {}
    req.headers.forEach((v, k) => { if (!['host','connection'].includes(k)) headers[k] = v })
    const init: RequestInit = { method, headers, signal: AbortSignal.timeout(15000) }
    if (method === 'POST') init.body = await req.text()
    const res = await fetch(target, init)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: cors })
  } catch { return NextResponse.json({ error: 'Service unavailable' }, { status: 503, headers: cors }) }
}
export const GET  = (req: NextRequest) => proxy(req, 'GET')
export const POST = (req: NextRequest) => proxy(req, 'POST')
