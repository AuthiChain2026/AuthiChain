import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-brands`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export async function POST(r: NextRequest) {
  const s = await createClient(); const { data: { session } } = await s.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const b = await r.json().catch(() => ({}))
  const res = await fetch(`${E}/stake`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`, apikey: K }, body: JSON.stringify(b) })
  return NextResponse.json(await res.json(), { status: res.status })
}
