/**
 * POST /api/referral/apply
 * Called during checkout to associate a referral code with the signing-up user.
 * Body: { code: string }
 *
 * The referrer reward (Stripe coupon) is applied by the webhook on
 * checkout.session.completed when the referred user's subscription activates.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const code = String(body.code ?? '').trim().toUpperCase()
  if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 })

  const service = createServiceClient()

  // Find referral row
  const { data: referral } = await service
    .from('referrals')
    .select('id, referrer_user_id, status')
    .eq('code', code)
    .single()

  if (!referral) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
  }

  if (referral.referrer_user_id === user.id) {
    return NextResponse.json({ error: 'You cannot use your own referral code' }, { status: 400 })
  }

  if (referral.status !== 'pending') {
    return NextResponse.json({ error: 'This referral code has already been used' }, { status: 409 })
  }

  // Mark as associated with referred user (still 'pending' until they pay)
  await service
    .from('referrals')
    .update({
      referred_user_id: user.id,
      referred_email: user.email,
    })
    .eq('id', referral.id)

  // Store in user session so checkout can pass it to Stripe metadata
  return NextResponse.json({ success: true, code, referral_id: referral.id })
}
