/**
 * POST /api/leads/capture
 * Captures an email lead from non-converting visitors (pricing page, etc).
 * Body: { email: string, source?: string }
 *
 * Upserts into the `leads` table and fires a Telegram admin alert.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? '').trim().toLowerCase()
  const source = String(body.source ?? 'unknown').trim().slice(0, 64)

  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const service = createServiceClient()

  // Upsert — ignore duplicates silently
  await service
    .from('leads')
    .upsert({ email, source, created_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true })

  // Telegram admin notification (fire-and-forget)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN
  const tgChatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (tgToken && tgChatId) {
    const msg = `📬 <b>New Lead Captured</b>\nEmail: <code>${email}</code>\nSource: ${source}`
    fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: tgChatId, text: msg, parse_mode: 'HTML' }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
