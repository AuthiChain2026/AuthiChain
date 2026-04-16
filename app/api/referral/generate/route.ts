import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
const E = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/authichain-referral`
const K = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export async function GET() {
  try {
    const s = await createClient(); const { data: { session } } = await s.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const res = await fetch(`${E}/generate`, { headers: { Authorization: `Bearer ${session.access_token}`, apikey: K } })
    return NextResponse.json(await res.json(), { status: res.status })
  } catch (err: any) {
    console.error('[GET] unhandled error:', err);
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
