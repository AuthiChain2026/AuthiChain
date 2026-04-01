import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const CF_API = process.env.CF_API_URL || 'https://authichain-api.undone-k.workers.dev'
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, X-RapidAPI-Key, X-RapidAPI-Host, Authorization' }
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }) }
async function proxy(req: NextRequest, method: string) {
  try {
    const url = new URL(req.url)
    const headers: Record<string, string> = {}
    req.headers.forEach((v, k) => { if (!['host','connection'].includes(k)) headers[k] = v })
    const init: RequestInit = { method, headers, signal: AbortSignal.timeout(15000) }
    if (method === 'POST') init.body = await req.text()
    const res = await fetch(`${CF_API}${url.pathname}${url.search}`, init)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status, headers: CORS })
  } catch { return NextResponse.json({ error: 'Service unavailable' }, { status: 503, headers: CORS }) }
}
export const GET  = (req: NextRequest) => proxy(req, 'GET')
export const POST = (req: NextRequest) => proxy(req, 'POST')
