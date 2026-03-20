import type { Env } from '../index'
import type { Telegram } from './telegram'

export async function notifyAdmin(env: Env, telegram: Telegram, message: string): Promise<void> {
  if (!env.TELEGRAM_ADMIN_CHAT_ID) return
  await telegram.sendMessage(env.TELEGRAM_ADMIN_CHAT_ID, message, { parse_mode: 'HTML' })
}

export async function sendDailyDigest(env: Env, telegram: Telegram): Promise<void> {
  // Local D1 message stats
  const msgStats = await env.DATABASE
    .prepare(
      `SELECT COUNT(*) as total,
              COUNT(CASE WHEN created_at >= datetime('now', '-1 day') THEN 1 END) as last_24h
       FROM messages`
    )
    .first<{ total: number; last_24h: number }>()

  // Revenue stats from AuthiChain admin API
  let revenue: any = null
  if (env.ADMIN_API_KEY && env.SITE_URL) {
    try {
      const res = await fetch(`${env.SITE_URL}/api/admin/revenue`, {
        headers: { 'x-admin-api-key': env.ADMIN_API_KEY },
        signal: AbortSignal.timeout(10_000),
      })
      if (res.ok) revenue = await res.json()
    } catch {
      // Non-fatal — digest still sends bot activity stats
    }
  }

  const lines: string[] = [
    `📊 <b>AuthiChain Daily Digest</b>`,
    ``,
    `<b>Bot Activity</b>`,
    `  Total messages : ${msgStats?.total ?? 0}`,
    `  Last 24h       : ${msgStats?.last_24h ?? 0}`,
  ]

  if (revenue) {
    const subs = revenue.subscriptions
    const fees = revenue.qron_fees?.last_30_days
    const brands = revenue.brands

    lines.push(``, `<b>Subscriptions</b>`)
    lines.push(`  Active : ${subs.total_active}`)
    const planLine = Object.entries(subs.by_plan as Record<string, number>)
      .map(([plan, count]) => `${plan}:${count}`)
      .join('  ')
    if (planLine) lines.push(`  Plans  : ${planLine}`)

    if (fees) {
      lines.push(``, `<b>QRON Fees (30d)</b>`)
      lines.push(`  Scans           : ${fees.scans}`)
      lines.push(`  Net QRON        : ${fees.net_qron}`)
      lines.push(`  Burned          : ${fees.burned_qron} 🔥`)
      lines.push(`  Staker rewards  : ${fees.staker_rewards_qron}`)
      lines.push(`  Avg discount    : ${fees.avg_discount_pct}%`)
    }

    if (brands) {
      lines.push(``, `<b>Brands (${brands.total_active} active)</b>`)
      const tierLine = Object.entries(brands.by_staking_tier as Record<string, number>)
        .filter(([, count]) => count > 0)
        .map(([tier, count]) => `${tier}:${count}`)
        .join('  ')
      if (tierLine) lines.push(`  Tiers : ${tierLine}`)
    }
  }

  lines.push(``, `<i>${new Date().toUTCString()}</i>`)

  await notifyAdmin(env, telegram, lines.join('\n'))
}
