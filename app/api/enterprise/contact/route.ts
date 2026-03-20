/**
 * POST /api/enterprise/contact
 * Handles enterprise sales inquiry form submissions.
 *
 * 1. Creates / updates Airtable Contact + Account records
 * 2. Sends admin Telegram notification
 * 3. Optionally creates a Stripe invoice for the deposit (if product ID passed)
 */
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!

async function airtableRequest(table: string, method: 'GET' | 'POST' | 'PATCH', body?: object, params?: string) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}${params ?? ''}`
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Airtable ${method} ${table}: ${await res.text()}`)
  return res.json()
}

async function notifyAdminViaTelegram(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
  }).catch(() => {})
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name, email, company, role, monthly_units, message, product_interest } = body

  if (!email || !company) {
    return NextResponse.json({ error: 'email and company are required' }, { status: 400 })
  }

  try {
    // Upsert Account
    const accountExisting = await airtableRequest(
      'Accounts', 'GET', undefined,
      `?filterByFormula={Name}="${encodeURIComponent(company)}"`
    )
    let accountId: string | null = null

    const accountFields: Record<string, unknown> = {
      Name: company,
      Status: 'Prospect',
      'Revenue Stage': 'Enterprise Lead',
      'Escalation Level': 'Green',
    }

    if (accountExisting.records?.length > 0) {
      accountId = accountExisting.records[0].id
      await airtableRequest('Accounts', 'PATCH', { records: [{ id: accountId, fields: accountFields }] })
    } else {
      const created = await airtableRequest('Accounts', 'POST', { records: [{ fields: accountFields }] })
      accountId = created.records?.[0]?.id ?? null
    }

    // Upsert Contact
    const contactExisting = await airtableRequest('Contacts', 'GET', undefined, `?filterByFormula={Email}="${email}"`)
    const contactFields: Record<string, unknown> = {
      Email: email,
      Name: name ?? email,
      ...(role ? { Role: role } : {}),
      Status: 'Lead',
      ...(accountId ? { Account: [accountId] } : {}),
    }

    if (contactExisting.records?.length > 0) {
      await airtableRequest('Contacts', 'PATCH', { records: [{ id: contactExisting.records[0].id, fields: contactFields }] })
    } else {
      await airtableRequest('Contacts', 'POST', { records: [{ fields: contactFields }] })
    }

    // Log to Events Log
    await airtableRequest('Events Log', 'POST', {
      records: [{
        fields: {
          'Stripe Event ID': `enterprise_inquiry_${Date.now()}`,
          'Event Type': 'enterprise.inquiry',
          Status: 'new',
          Details: JSON.stringify({ name, email, company, role, monthly_units, product_interest, message }),
          'Processed At': new Date().toISOString(),
        },
      }],
    })

    // Telegram admin alert
    await notifyAdminViaTelegram([
      `🏢 <b>New Enterprise Inquiry</b>`,
      ``,
      `Company: <b>${company}</b>`,
      `Contact: ${name ?? 'unknown'} &lt;${email}&gt;`,
      ...(role ? [`Role: ${role}`] : []),
      ...(monthly_units ? [`Units/month: ${monthly_units}`] : []),
      ...(product_interest ? [`Interest: ${product_interest}`] : []),
      ...(message ? [`\n"${message.slice(0, 200)}"` ] : []),
    ].join('\n'))

    return NextResponse.json({ success: true, message: "We'll be in touch within 24 hours." })
  } catch (err: any) {
    console.error('[enterprise/contact]', err?.message ?? err)
    // Still succeed for the user even if Airtable write fails
    await notifyAdminViaTelegram(`⚠️ Enterprise inquiry from ${email} (${company}) — Airtable write failed. Check logs.`).catch(() => {})
    return NextResponse.json({ success: true, message: "We'll be in touch within 24 hours." })
  }
}
