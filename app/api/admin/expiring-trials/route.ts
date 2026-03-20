/**
 * GET /api/admin/expiring-trials
 * Returns trialing subscriptions expiring within the next N days.
 * Protected by ADMIN_API_KEY header. Used by the Telegram bot for nudge campaigns.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

function isAuthorized(req: NextRequest): boolean {
  const key = req.headers.get('x-admin-api-key') ?? req.headers.get('authorization')?.replace('Bearer ', '')
  return !!process.env.ADMIN_API_KEY && key === process.env.ADMIN_API_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const withinDays = Math.min(Number(searchParams.get('days') ?? 3), 30)

  const supabase = createServiceClient()
  const now = new Date()
  const cutoff = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000)

  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, stripe_customer_id, current_period_end')
    .eq('status', 'trialing')
    .gte('current_period_end', now.toISOString())
    .lte('current_period_end', cutoff.toISOString())

  if (!subs?.length) {
    return NextResponse.json({ trials: [], count: 0 })
  }

  // Look up email from auth.users via service role
  const userIds = subs.map((s) => s.user_id)
  const { data: users } = await supabase.auth.admin.listUsers()

  const emailMap = new Map<string, string>()
  for (const u of users?.users ?? []) {
    if (userIds.includes(u.id)) emailMap.set(u.id, u.email ?? '')
  }

  const trials = subs.map((s) => {
    const msLeft = new Date(s.current_period_end).getTime() - now.getTime()
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
    return {
      user_id: s.user_id,
      email: emailMap.get(s.user_id) ?? null,
      stripe_customer_id: s.stripe_customer_id,
      current_period_end: s.current_period_end,
      days_left: daysLeft,
    }
  })

  return NextResponse.json({ trials, count: trials.length })
}
