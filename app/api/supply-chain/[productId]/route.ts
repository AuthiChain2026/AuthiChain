import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-supply-chain`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
async function getSession() { const s = await createClient(); const { data: { session } } = await s.auth.getSession(); return session; }
export async function GET(_r: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params; const s = await getSession(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const res = await fetch(`${E}/${productId}`, { headers: { Authorization: `Bearer ${s.access_token}`, apikey: K } })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[GET] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
export async function POST(r: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params; const s = await getSession(); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const b = await r.json().catch(() => ({}))
    const res = await fetch(`${E}/${productId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${s.access_token}`, apikey: K }, body: JSON.stringify(b) })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[POST] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
