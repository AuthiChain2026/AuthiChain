/**
 * POST /api/brands/stake
 * Increase QRON staked amount for the authenticated user's brand.
 * Body: { amount: number, wallet_address?: string }
 *
 * The staking_tier and unit_cost_discount are auto-computed by the DB trigger.
 * In production this would be gated on an on-chain confirmation; here we
 * trust the server-side call (admin/service role) and record the amount.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { applyStakingCouponToSubscription } from '@/lib/stripe-billing'

export const dynamic = 'force-dynamic'

// Minimum lock period: 30 days
const LOCK_DAYS = 30

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

  // Get or create brand
  let { data: brand } = await service
    .from('brands')
    .select('id, qron_staked, staking_locked_until')
    .eq('user_id', user.id)
    .single()

  if (!brand) {
    // Create brand record on first stake
    const { data: newBrand, error: createErr } = await service
      .from('brands')
      .insert({ user_id: user.id, name: user.email ?? user.id, qron_staked: 0 })
      .select()
      .single()

    if (createErr) {
      return NextResponse.json({ error: 'Failed to create brand record' }, { status: 500 })
    }
    brand = newBrand
  }

  const newStaked = parseFloat(((brand.qron_staked ?? 0) + amount).toFixed(6))

  const lockedUntil = new Date()
  lockedUntil.setDate(lockedUntil.getDate() + LOCK_DAYS)

  const { data: updated, error: updateErr } = await service
    .from('brands')
    .update({
      qron_staked: newStaked,
      staking_wallet_address: body.wallet_address ?? null,
      staking_locked_until: lockedUntil.toISOString(),
    })
    .eq('id', brand.id)
    .select('id, staking_tier, qron_staked, unit_cost_discount, staking_locked_until')
    .single()

  if (updateErr) {
    return NextResponse.json({ error: 'Failed to update staking' }, { status: 500 })
  }

  // Apply Stripe subscription coupon for the new tier (fire-and-forget)
  applyStakingCouponToSubscription(user.id, updated.staking_tier).catch(() => {})

  return NextResponse.json({
    success: true,
    staked: updated,
    message: `Staked ${amount} QRON. Tier: ${updated.staking_tier} (${(updated.unit_cost_discount * 100).toFixed(0)}% discount on scans). Locked until ${updated.staking_locked_until?.split('T')[0]}.`,
  })
}
