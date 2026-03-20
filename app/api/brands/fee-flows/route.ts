/**
 * GET /api/brands/fee-flows
 * Returns fee flow history for the authenticated brand, with summary stats.
 * Query params:
 *   ?limit=50&offset=0&flow_type=authentication_fee
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200)
  const offset = Number(searchParams.get('offset') ?? 0)
  const flowType = searchParams.get('flow_type')

  const service = createServiceClient()

  // Get the user's brand
  const { data: brand } = await service
    .from('brands')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!brand) {
    return NextResponse.json({ brand: null, flows: [], summary: null })
  }

  let query = service
    .from('fee_flows')
    .select('id, flow_type, gross_amount, discount_amount, net_amount, staker_reward_amount, treasury_amount, burn_amount, staking_tier_snapshot, discount_rate_snapshot, status, created_at, confirmed_at, metadata')
    .eq('brand_id', brand.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (flowType) {
    query = query.eq('flow_type', flowType)
  }

  const { data: flows, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch fee flows' }, { status: 500 })
  }

  // Aggregate summary (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: summary } = await service
    .from('fee_flows')
    .select('net_amount, gross_amount, discount_amount, burn_amount, staker_reward_amount')
    .eq('brand_id', brand.id)
    .eq('flow_type', 'authentication_fee')
    .eq('status', 'confirmed')
    .gte('created_at', thirtyDaysAgo.toISOString())

  const totals = (summary ?? []).reduce(
    (acc, row) => ({
      total_scans: acc.total_scans + 1,
      total_gross: acc.total_gross + Number(row.gross_amount),
      total_discounted: acc.total_discounted + Number(row.discount_amount),
      total_net: acc.total_net + Number(row.net_amount),
      total_burned: acc.total_burned + Number(row.burn_amount),
      total_staker_rewards: acc.total_staker_rewards + Number(row.staker_reward_amount),
    }),
    { total_scans: 0, total_gross: 0, total_discounted: 0, total_net: 0, total_burned: 0, total_staker_rewards: 0 }
  )

  return NextResponse.json({
    brand_id: brand.id,
    flows: flows ?? [],
    summary: {
      period_days: 30,
      ...totals,
      total_gross: parseFloat(totals.total_gross.toFixed(6)),
      total_discounted: parseFloat(totals.total_discounted.toFixed(6)),
      total_net: parseFloat(totals.total_net.toFixed(6)),
      total_burned: parseFloat(totals.total_burned.toFixed(6)),
      total_staker_rewards: parseFloat(totals.total_staker_rewards.toFixed(6)),
      savings_pct: totals.total_gross > 0
        ? parseFloat(((totals.total_discounted / totals.total_gross) * 100).toFixed(2))
        : 0,
    },
  })
}
