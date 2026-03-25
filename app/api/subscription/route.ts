import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-subscription`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
async function sess() { const s = await createClient(); const { data: { session } } = await s.auth.getSession(); return session; }
export async function GET(r: NextRequest) { const s = await sess(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const res = await fetch(E + r.nextUrl.search, { headers: { Authorization: `Bearer ${s.access_token}`, apikey: K } }); return NextResponse.json(await res.json(), { status: res.status }) }
export async function POST(r: NextRequest) { const s = await sess(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const b = await r.json().catch(() => ({})); const res = await fetch(E, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}`, apikey: K }, body: JSON.stringify(b) }); return NextResponse.json(await res.json(), { status: res.status }) }
export async function PUT(r: NextRequest) { const s = await sess(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const b = await r.json().catch(() => ({})); const res = await fetch(E, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}`, apikey: K }, body: JSON.stringify(b) }); return NextResponse.json(await res.json(), { status: res.status }) }
