/**
 * POST /api/brands/unstake
 * Reduce QRON staked amount. Enforces lock period.
 * Body: { amount: number }
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
  const amount = Number(body.amount)
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
  }

  const service = createServiceClient()

  const { data: brand } = await service
    .from('brands')
    .select('id, qron_staked, staking_locked_until')
    .eq('user_id', user.id)
    .single()

  if (!brand) {
    return NextResponse.json({ error: 'No brand found' }, { status: 404 })
  }

  // Enforce lock period
  if (brand.staking_locked_until && new Date(brand.staking_locked_until) > new Date()) {
    return NextResponse.json(
      {
        error: 'Tokens are locked',
        locked_until: brand.staking_locked_until,
        message: `Your QRON stake is locked until ${brand.staking_locked_until.split('T')[0]}. Unstaking is not permitted during the lock period.`,
      },
      { status: 403 }
    )
  }

  const current = parseFloat((brand.qron_staked ?? 0).toString())
  if (amount > current) {
    return NextResponse.json(
      { error: `Cannot unstake ${amount} QRON — only ${current} staked` },
      { status: 400 }
    )
  }

  const newStaked = parseFloat((current - amount).toFixed(6))

  const { data: updated, error: updateErr } = await service
    .from('brands')
    .update({ qron_staked: newStaked })
    .eq('id', brand.id)
    .select('id, staking_tier, qron_staked, unit_cost_discount')
    .single()

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to update staking' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    unstaked: amount,
    staked: updated,
    message: `Unstaked ${amount} QRON. New balance: ${updated.qron_staked} QRON. Tier: ${updated.staking_tier}.`,
  })
}
