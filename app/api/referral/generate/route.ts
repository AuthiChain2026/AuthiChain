/**
 * GET /api/referral/generate
 * Returns the authenticated user's referral code, creating one if needed.
 * Also returns stats: how many referred users converted.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

function generateCode(userId: string): string {
  // Deterministic prefix from user ID + random suffix
  const prefix = userId.replace(/-/g, '').slice(0, 4).toUpperCase()
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `REF-${prefix}${suffix}`
}

export async function GET(_req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const service = createServiceClient()

  // Check for existing referral code
  const { data: existing } = await service
    .from('referrals')
    .select('id, code, status, referred_email, converted_at, rewarded_at, created_at')
    .eq('referrer_user_id', user.id)
    .order('created_at', { ascending: true })

  let code: string
  if (existing?.length) {
    // Reuse the first (canonical) code
    code = existing[0].code
  } else {
    // Create new referral code
    let newCode = generateCode(user.id)
    // Retry on collision
    for (let i = 0; i < 5; i++) {
      const { error } = await service
        .from('referrals')
        .insert({ referrer_user_id: user.id, code: newCode })
      if (!error) break
      newCode = generateCode(user.id)
    }
    code = newCode
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'
  const referralUrl = `${baseUrl}/register?ref=${code}`

  const stats = {
    total_referred: existing?.filter((r) => r.referred_email).length ?? 0,
    converted: existing?.filter((r) => r.status === 'converted' || r.status === 'rewarded').length ?? 0,
    rewarded: existing?.filter((r) => r.status === 'rewarded').length ?? 0,
  }

  return NextResponse.json({ code, referral_url: referralUrl, stats })
}
