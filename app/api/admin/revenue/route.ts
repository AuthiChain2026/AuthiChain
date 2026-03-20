/**
 * GET /api/admin/revenue
 * Internal revenue dashboard stats. Protected by ADMIN_API_KEY header.
 *
 * Returns:
 *   - Active subscription counts by plan
 *   - QRON fee_flows totals (30d / all-time)
 *   - Recent authentication fee events (last 10)
 *   - Brand staking tier distribution
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-api-key') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  const adminKey = process.env.ADMIN_API_KEY
  if (!adminKey) return false
  return key === adminKey
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [subsByPlan, feeFlows30d, feeFlowsAllTime, stakingTiers, recentFees] = await Promise.allSettled([
    // Subscription counts by plan
    supabase
      .from('subscriptions')
      .select('plan, status')
      .in('status', ['active', 'trialing']),

    // QRON fee flows last 30 days
    supabase
      .from('fee_flows')
      .select('net_amount, gross_amount, discount_amount, burn_amount, staker_reward_amount, treasury_amount')
      .eq('flow_type', 'authentication_fee')
      .eq('status', 'confirmed')
      .gte('created_at', thirtyDaysAgo.toISOString()),

    // QRON fee flows all-time
    supabase
      .from('fee_flows')
      .select('net_amount, burn_amount')
      .eq('flow_type', 'authentication_fee')
      .eq('status', 'confirmed'),

    // Brand staking tier distribution
    supabase
      .from('brands')
      .select('staking_tier')
      .eq('is_active', true),

    // Recent fee events
    supabase
      .from('fee_flows')
      .select('id, flow_type, net_amount, staking_tier_snapshot, created_at, metadata')
      .eq('flow_type', 'authentication_fee')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Subscriptions
  const subs = subsByPlan.status === 'fulfilled' ? subsByPlan.value.data ?? [] : []
  const subsByPlanMap = subs.reduce((acc: Record<string, number>, row: any) => {
    acc[row.plan] = (acc[row.plan] ?? 0) + 1
    return acc
  }, {})

  // Fee flows 30d
  const fees30d = feeFlows30d.status === 'fulfilled' ? feeFlows30d.value.data ?? [] : []
  const fees30dTotals = fees30d.reduce(
    (acc, row: any) => ({
      scans: acc.scans + 1,
      gross: acc.gross + Number(row.gross_amount),
      net: acc.net + Number(row.net_amount),
      discounted: acc.discounted + Number(row.discount_amount),
      burned: acc.burned + Number(row.burn_amount),
      staker_rewards: acc.staker_rewards + Number(row.staker_reward_amount),
      treasury: acc.treasury + Number(row.treasury_amount),
    }),
    { scans: 0, gross: 0, net: 0, discounted: 0, burned: 0, staker_rewards: 0, treasury: 0 }
  )

  // Fee flows all-time
  const feesAll = feeFlowsAllTime.status === 'fulfilled' ? feeFlowsAllTime.value.data ?? [] : []
  const feesAllTotals = feesAll.reduce(
    (acc, row: any) => ({
      scans: acc.scans + 1,
      net: acc.net + Number(row.net_amount),
      burned: acc.burned + Number(row.burn_amount),
    }),
    { scans: 0, net: 0, burned: 0 }
  )

  // Staking tiers
  const tiers = stakingTiers.status === 'fulfilled' ? stakingTiers.value.data ?? [] : []
  const tierDist = tiers.reduce((acc: Record<string, number>, row: any) => {
    acc[row.staking_tier] = (acc[row.staking_tier] ?? 0) + 1
    return acc
  }, {})

  const round = (n: number) => parseFloat(n.toFixed(6))

  return NextResponse.json({
    generated_at: new Date().toISOString(),
    subscriptions: {
      total_active: subs.length,
      by_plan: subsByPlanMap,
    },
    qron_fees: {
      last_30_days: {
        scans: fees30dTotals.scans,
        gross_qron: round(fees30dTotals.gross),
        net_qron: round(fees30dTotals.net),
        discounted_qron: round(fees30dTotals.discounted),
        burned_qron: round(fees30dTotals.burned),
        staker_rewards_qron: round(fees30dTotals.staker_rewards),
        treasury_qron: round(fees30dTotals.treasury),
        avg_discount_pct: fees30dTotals.gross > 0
          ? parseFloat(((fees30dTotals.discounted / fees30dTotals.gross) * 100).toFixed(2))
          : 0,
      },
      all_time: {
        scans: feesAllTotals.scans,
        net_qron: round(feesAllTotals.net),
        burned_qron: round(feesAllTotals.burned),
      },
    },
    brands: {
      total_active: tiers.length,
      by_staking_tier: tierDist,
    },
    recent_fees: recentFees.status === 'fulfilled' ? recentFees.value.data ?? [] : [],
  })
}
