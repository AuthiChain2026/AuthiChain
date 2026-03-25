import { NextRequest, NextResponse } from 'next/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-classify`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export async function GET(r: NextRequest) { const res = await fetch(E + r.nextUrl.search, { headers: { apikey: K } }); return NextResponse.json(await res.json(), { status: res.status }) }
export async function POST(r: NextRequest) { const b = await r.json().catch(() => ({})); const res = await fetch(E, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: K }, body: JSON.stringify(b) }); return NextResponse.json(await res.json(), { status: res.status }) }
