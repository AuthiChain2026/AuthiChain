import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || ''
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const EMAIL_FROM = process.env.EMAIL_FROM || 'AuthiChain <noreply@authichain.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'
const MAKE_DEMO_WEBHOOK_URL = process.env.MAKE_DEMO_WEBHOOK_URL || ''

interface BookingRequest {
  name: string
  email: string
  company?: string
  preferred_date?: string  // ISO date string
  preferred_time?: string  // e.g. "10:00", "14:00"
  timezone?: string
  message?: string
}

async function createHubSpotDeal(booking: BookingRequest) {
  if (!HUBSPOT_TOKEN) return null

  // First, create/find contact
  const nameParts = booking.name.split(' ')
  const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: booking.email }] }],
    }),
  })
  const searchData = await searchRes.json()
  let contactId = searchData.results?.[0]?.id

  if (!contactId) {
    const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          email: booking.email,
          firstname: nameParts[0] || '',
          lastname: nameParts.slice(1).join(' ') || '',
          company: booking.company || '',
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
          lead_score: '30',
        },
      }),
    })
    const created = await createRes.json()
    contactId = created.id
  } else {
    // Update lead score for existing contact
    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        properties: {
          hs_lead_status: 'IN_PROGRESS',
          lead_score: '50',
        },
      }),
    })
  }

  // Create deal
  const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: {
        dealname: `Demo — ${booking.company || booking.name}`,
        dealstage: 'appointmentscheduled',
        pipeline: 'default',
        amount: '799', // Enterprise monthly
      },
    }),
  })
  const deal = await dealRes.json()

  // Associate deal with contact
  if (deal.id && contactId) {
    await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${deal.id}/associations/contacts/${contactId}/deal_to_contact`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    })
  }

  return deal.id || null
}

async function sendConfirmationEmail(booking: BookingRequest) {
  if (!RESEND_API_KEY) return

  const dateStr = booking.preferred_date
    ? new Date(booking.preferred_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'soon'
  const timeStr = booking.preferred_time || 'TBD'

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: booking.email,
      subject: 'AuthiChain Demo Confirmed',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        body{font-family:Inter,sans-serif;background:#0f0f0f;color:#e2e8f0;margin:0;padding:0}
        .wrap{max-width:600px;margin:0 auto;padding:40px 24px}
        .logo{font-size:24px;font-weight:700;background:linear-gradient(135deg,#a855f7,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .card{background:#1a1a2e;border:1px solid #2d2d5e;border-radius:12px;padding:32px;margin:24px 0}
        .btn{display:inline-block;background:linear-gradient(135deg,#a855f7,#22d3ee);color:#fff!important;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;margin-top:16px}
        .muted{color:#94a3b8;font-size:14px}
      </style></head><body><div class="wrap">
        <div class="logo">AuthiChain</div>
        <div class="card">
          <h2 style="margin:0 0 12px">Demo Confirmed!</h2>
          <p>Hi ${booking.name.split(' ')[0]},</p>
          <p>Your AuthiChain demo is scheduled. Here are the details:</p>
          <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0 0 4px;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin:0 0 4px;"><strong>Time:</strong> ${timeStr} ${booking.timezone || ''}</p>
            <p style="margin:0;"><strong>Duration:</strong> 30 minutes</p>
          </div>
          <p>We'll show you:</p>
          <ul style="line-height:2;color:#94a3b8;">
            <li>AI AutoFlow&trade; live product classification</li>
            <li>Blockchain authentication in action</li>
            <li>TrueMark&trade; QR verification</li>
            <li>Analytics and supply chain dashboard</li>
          </ul>
          <p>A calendar invite with a Google Meet link will be sent separately.</p>
          <a href="${APP_URL}/demo" class="btn">Try the Live Demo Now &rarr;</a>
        </div>
        <p class="muted">&copy; 2026 AuthiChain</p>
      </div></body></html>`,
      text: `Demo confirmed! Date: ${dateStr}, Time: ${timeStr}. We'll send a calendar invite with Google Meet link. Try the live demo: ${APP_URL}/demo`,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const booking: BookingRequest = await req.json()

    if (!booking.email || !booking.name) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    // Process in parallel
    const [dealId] = await Promise.all([
      createHubSpotDeal(booking).catch(err => {
        console.error('[demo-book] HubSpot error:', err)
        return null
      }),
      sendConfirmationEmail(booking).catch(err => {
        console.error('[demo-book] Email error:', err)
      }),
      // Fire to Make.com for calendar creation
      MAKE_DEMO_WEBHOOK_URL ? fetch(MAKE_DEMO_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'demo_booked',
          ...booking,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}) : Promise.resolve(),
    ])

    return NextResponse.json({
      ok: true,
      dealId,
      message: 'Demo booked successfully. Check your email for confirmation.',
    })
  } catch (err) {
    console.error('[demo-book] Error:', err)
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}
