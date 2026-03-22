import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const VALID_EVENTS = [
  'pricing_viewed',
  'checkout_started',
  'checkout_completed',
  'checkout_abandoned',
  'demo_requested',
  'trial_started',
] as const

type SalesEvent = typeof VALID_EVENTS[number]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, plan, interval, metadata = {}, session_id } = body

    if (!event || !VALID_EVENTS.includes(event as SalesEvent)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const userAgent = req.headers.get('user-agent') || null

    const { error } = await supabase.from('sales_events').insert({
      user_id: user?.id || null,
      session_id: session_id || null,
      event,
      plan: plan || null,
      interval: interval || null,
      metadata,
      ip_address: ip,
      user_agent: userAgent,
    })

    if (error) {
      // Don't expose DB errors to client, just log and continue
      console.error('[sales/leads] Insert error:', error.message)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[sales/leads] Error:', err)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Admin summary — only accessible to authenticated users
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('sales_events')
    .select('event, plan, interval, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Aggregate counts by event type
  const summary: Record<string, number> = {}
  for (const row of data ?? []) {
    summary[row.event] = (summary[row.event] || 0) + 1
  }

  // Funnel conversion rates
  const views = summary['pricing_viewed'] || 0
  const starts = summary['checkout_started'] || 0
  const completed = summary['checkout_completed'] || 0
  const conversionRate = views > 0 ? ((completed / views) * 100).toFixed(1) : '0.0'
  const startRate = views > 0 ? ((starts / views) * 100).toFixed(1) : '0.0'

  return NextResponse.json({
    since,
    summary,
    funnel: {
      views,
      starts,
      completed,
      startRate: `${startRate}%`,
      conversionRate: `${conversionRate}%`,
    },
    events: data,
  })
}
