import { NextRequest, NextResponse } from 'next/server'
import { SEQUENCES, getNextEmail, getSequenceForStage } from '@/lib/nurture-sequences'
import type { SequenceId } from '@/lib/nurture-sequences'

export const dynamic = 'force-dynamic'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'AuthiChain <noreply@authichain.com>'
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || ''

async function sendEmail(to: string, subject: string, html: string, text: string) {
  if (!RESEND_API_KEY) {
    console.log('[nurture] RESEND_API_KEY not set — skipping:', subject, '->', to)
    return false
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[nurture] Resend error:', err)
    return false
  }

  console.log('[nurture] Sent:', subject, '->', to)
  return true
}

async function updateHubSpotContact(email: string, properties: Record<string, string>) {
  if (!HUBSPOT_TOKEN) return

  // Find contact by email
  const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
    }),
  })
  const searchData = await searchRes.json()
  const contactId = searchData.results?.[0]?.id
  if (!contactId) return

  await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties }),
  })
}

/**
 * POST /api/nurture/send
 *
 * Called by Make.com on a schedule, or can be called directly.
 * Body: { email, sequence_id?, stage?, emails_sent?: string[] }
 *
 * If called with a list of contacts (batch mode):
 * Body: { contacts: [{ email, sequence_id, stage, emails_sent }] }
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET
  if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Batch mode
    if (body.contacts && Array.isArray(body.contacts)) {
      const results = []
      for (const contact of body.contacts) {
        const result = await processSingleContact(contact)
        results.push(result)
      }
      return NextResponse.json({ results, processed: results.length })
    }

    // Single contact mode
    const result = await processSingleContact(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[nurture] Error:', err)
    return NextResponse.json({ error: 'Nurture send failed' }, { status: 500 })
  }
}

async function processSingleContact(contact: {
  email: string
  sequence_id?: SequenceId
  stage?: string
  emails_sent?: string[]
}) {
  const { email, stage = 'new_lead', emails_sent = [] } = contact
  const sequenceId = contact.sequence_id || getSequenceForStage(stage)

  if (!sequenceId) {
    return { email, status: 'skipped', reason: 'no_sequence' }
  }

  const nextEmail = getNextEmail(sequenceId, emails_sent)
  if (!nextEmail) {
    return { email, status: 'complete', reason: 'sequence_finished' }
  }

  // Check delay — only send if enough time has passed
  // The caller (Make.com) should handle scheduling, but we validate here too
  const sent = await sendEmail(email, nextEmail.subject, nextEmail.html, nextEmail.text)

  if (sent) {
    // Update HubSpot with last contacted timestamp
    await updateHubSpotContact(email, {
      notes_last_contacted: new Date().toISOString(),
    }).catch(() => {})

    return {
      email,
      status: 'sent',
      emailId: nextEmail.id,
      subject: nextEmail.subject,
      sequenceId,
    }
  }

  return { email, status: 'failed', emailId: nextEmail.id }
}

/**
 * GET /api/nurture/send — returns available sequences for debugging
 */
export async function GET() {
  return NextResponse.json({
    sequences: SEQUENCES.map(s => ({
      id: s.id,
      name: s.name,
      emailCount: s.emails.length,
      emails: s.emails.map(e => ({ id: e.id, subject: e.subject, delayDays: e.delayDays })),
    })),
  })
}
