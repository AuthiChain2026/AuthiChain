import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/analytics/conversion
 *
 * Returns funnel conversion metrics from sales_events table.
 * Used by the Make.com weekly analytics scenario and admin dashboard.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET

  // Allow admin token or authenticated user
  let authorized = false
  if (adminSecret && authHeader === `Bearer ${adminSecret}`) {
    authorized = true
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) authorized = true
  }

  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30', 10)
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Get sales events
    const { data: events } = await supabase
      .from('sales_events')
      .select('event, plan, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(5000)

    // Aggregate by event type
    const counts: Record<string, number> = {}
    const dailyCounts: Record<string, Record<string, number>> = {}

    for (const e of events || []) {
      counts[e.event] = (counts[e.event] || 0) + 1

      const day = e.created_at.split('T')[0]
      if (!dailyCounts[day]) dailyCounts[day] = {}
      dailyCounts[day][e.event] = (dailyCounts[day][e.event] || 0) + 1
    }

    // Calculate funnel
    const pricingViewed = counts['pricing_viewed'] || 0
    const checkoutStarted = counts['checkout_started'] || 0
    const checkoutCompleted = counts['checkout_completed'] || 0
    const checkoutAbandoned = counts['checkout_abandoned'] || 0
    const demoRequested = counts['demo_requested'] || 0
    const trialStarted = counts['trial_started'] || 0
    const leadsCapured = counts['lead_captured'] || 0

    const viewToStart = pricingViewed > 0 ? (checkoutStarted / pricingViewed * 100) : 0
    const startToComplete = checkoutStarted > 0 ? (checkoutCompleted / checkoutStarted * 100) : 0
    const overallConversion = pricingViewed > 0 ? (checkoutCompleted / pricingViewed * 100) : 0

    // Get subscription counts from Supabase
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: totalProducts } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })

    return NextResponse.json({
      period: { days, since },
      funnel: {
        leads_captured: leadsCapured,
        pricing_viewed: pricingViewed,
        demos_requested: demoRequested,
        checkout_started: checkoutStarted,
        checkout_completed: checkoutCompleted,
        checkout_abandoned: checkoutAbandoned,
        trial_started: trialStarted,
      },
      rates: {
        view_to_checkout: `${viewToStart.toFixed(1)}%`,
        checkout_completion: `${startToComplete.toFixed(1)}%`,
        overall_conversion: `${overallConversion.toFixed(1)}%`,
      },
      totals: {
        active_subscriptions: activeSubscriptions || 0,
        total_products: totalProducts || 0,
      },
      daily: dailyCounts,
      raw_counts: counts,
    })
  } catch (err) {
    console.error('[analytics] Error:', err)
    return NextResponse.json({ error: 'Analytics query failed' }, { status: 500 })
  }
}
