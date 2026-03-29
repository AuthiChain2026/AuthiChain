import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || ''
const HUBSPOT_BASE = 'https://api.hubapi.com'

interface DealContact {
  dealId: string
  dealName: string
  amount: number
  contactEmail: string
  contactName: string
  companyName: string
}

async function hubspotGet(path: string) {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`HubSpot GET ${path}: ${res.status}`)
  return res.json()
}

async function hubspotPatch(path: string, body: object) {
  const res = await fetch(`${HUBSPOT_BASE}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HubSpot PATCH ${path}: ${res.status}`)
  return res.json()
}

async function getContractSentDeals(): Promise<DealContact[]> {
  const searchBody = {
    filterGroups: [{
      filters: [{
        propertyName: 'dealstage',
        operator: 'EQ',
        value: 'contractsent',
      }],
    }],
    properties: ['dealname', 'amount', 'dealstage', 'pipeline'],
    limit: 50,
  }

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(searchBody),
  })
  if (!res.ok) return []
  const data = await res.json()

  const deals: DealContact[] = []

  for (const deal of data.results || []) {
    try {
      const assocRes = await hubspotGet(
        `/crm/v3/objects/deals/${deal.id}/associations/contacts`
      )
      const contactId = assocRes.results?.[0]?.id
      if (!contactId) continue

      const contact = await hubspotGet(`/crm/v3/objects/contacts/${contactId}?properties=email,firstname,lastname,company`)
      const email = contact.properties?.email
      if (!email) continue

      deals.push({
        dealId: deal.id,
        dealName: deal.properties.dealname || 'AuthiChain Deal',
        amount: parseFloat(deal.properties.amount || '0'),
        contactEmail: email,
        contactName: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim(),
        companyName: contact.properties.company || '',
      })
    } catch (err) {
      console.error(`[pipeline] Error fetching contact for deal ${deal.id}:`, err)
    }
  }

  return deals
}

function buildPaymentEmail(deal: DealContact, paymentLink: string) {
  const name = deal.contactName || 'there'
  return {
    subject: `AuthiChain Enterprise — Complete Your ${deal.companyName || ''} Partnership`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:Inter,sans-serif;background:#0f0f0f;color:#e2e8f0;margin:0;padding:0}
      .wrap{max-width:600px;margin:0 auto;padding:40px 24px}
      .logo{font-size:24px;font-weight:700;background:linear-gradient(135deg,#a855f7,#22d3ee);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      .card{background:#1a1a2e;border:1px solid #2d2d5e;border-radius:12px;padding:32px;margin:24px 0}
      .btn{display:inline-block;background:linear-gradient(135deg,#a855f7,#22d3ee);color:#fff!important;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:16px;margin-top:16px}
      .muted{color:#94a3b8;font-size:14px}
    </style></head><body><div class="wrap">
      <div class="logo">AuthiChain</div>
      <div class="card">
        <h2 style="margin:0 0 12px;color:#fff;">Hi ${name},</h2>
        <p>Your AuthiChain Enterprise partnership agreement for <strong>${deal.companyName}</strong> is ready to activate.</p>
        <p>Click below to complete payment and instantly activate your enterprise authentication platform:</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${paymentLink}" class="btn">Activate Enterprise Partnership →</a>
        </div>
        <div style="background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.2);border-radius:8px;padding:16px;margin-top:20px;">
          <p style="margin:0 0 8px;font-weight:600;color:#a855f7;">Your Partnership Includes:</p>
          <ul style="margin:0;padding-left:20px;color:#94a3b8;">
            <li>Unlimited product authentication</li>
            <li>AI AutoFlow™ classification across 10 industries</li>
            <li>Blockchain-backed NFT certificates</li>
            <li>Custom API integration</li>
            <li>Dedicated enterprise support</li>
            <li>Supply chain tracking dashboard</li>
          </ul>
        </div>
        <p class="muted" style="margin-top:20px;">This payment link is unique to your organization. If you have any questions, reply to this email or contact us at Z@authichain.com.</p>
      </div>
      <p class="muted">© 2026 AuthiChain. Blockchain-Grade Product Authentication.</p>
    </div></body></html>`,
    text: `Hi ${name}, your AuthiChain Enterprise partnership for ${deal.companyName} is ready. Complete payment here: ${paymentLink}`,
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const adminSecret = process.env.ADMIN_SECRET || process.env.CRON_SECRET
  if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'
  const enterprisePriceId = process.env.STRIPE_ENTERPRISE_PRICE_ID

  try {
    const deals = await getContractSentDeals()
    if (deals.length === 0) {
      return NextResponse.json({ message: 'No contract-sent deals found', converted: 0 })
    }

    const results: Array<{ dealId: string; dealName: string; status: string; paymentLink?: string }> = []

    for (const deal of deals) {
      try {
        // Create a Stripe checkout session for each deal
        const session = await stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [{
            price: enterprisePriceId || undefined,
            quantity: 1,
            // If no enterprise price, create a custom line item
            ...(!enterprisePriceId ? {
              price_data: {
                currency: 'usd',
                unit_amount: Math.max(Math.round((deal.amount / 12) * 100), 79900), // Monthly from annual, min $799/mo
                recurring: { interval: 'month' as const },
                product_data: {
                  name: `AuthiChain Enterprise — ${deal.companyName}`,
                  description: 'Unlimited product authentication with AI AutoFlow™',
                },
              },
            } : {}),
          }],
          customer_email: deal.contactEmail,
          success_url: `${baseUrl}/dashboard?checkout=success&deal=${deal.dealId}`,
          cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
          allow_promotion_codes: true,
          billing_address_collection: 'required',
          metadata: {
            plan: 'enterprise',
            planKey: 'enterprise',
            dealId: deal.dealId,
            companyName: deal.companyName,
            source: 'pipeline_conversion',
          },
        })

        const paymentLink = session.url!

        // Send email via Resend
        const resendKey = process.env.RESEND_API_KEY
        if (resendKey) {
          const emailContent = buildPaymentEmail(deal, paymentLink)
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || 'AuthiChain <noreply@authichain.com>',
              to: deal.contactEmail,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text,
            }),
          })
        }

        // Update HubSpot deal with payment link
        if (HUBSPOT_TOKEN) {
          await hubspotPatch(`/crm/v3/objects/deals/${deal.dealId}`, {
            properties: {
              description: `Payment link sent: ${paymentLink}`,
              notes_last_updated: new Date().toISOString(),
            },
          })
        }

        // Fire Make.com webhook if configured
        const makeWebhookUrl = process.env.MAKE_PIPELINE_WEBHOOK_URL
        if (makeWebhookUrl) {
          await fetch(makeWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'payment_link_sent',
              deal: deal.dealName,
              company: deal.companyName,
              email: deal.contactEmail,
              amount: deal.amount,
              paymentLink,
              timestamp: new Date().toISOString(),
            }),
          }).catch(() => {})
        }

        results.push({ dealId: deal.dealId, dealName: deal.dealName, status: 'sent', paymentLink })
        console.log(`[pipeline] Payment link sent to ${deal.contactEmail} for ${deal.companyName}`)
      } catch (err) {
        console.error(`[pipeline] Failed for deal ${deal.dealId}:`, err)
        results.push({ dealId: deal.dealId, dealName: deal.dealName, status: 'failed' })
      }
    }

    return NextResponse.json({
      message: `Processed ${results.length} pipeline deals`,
      converted: results.filter(r => r.status === 'sent').length,
      results,
    })
  } catch (err) {
    console.error('[pipeline] Error:', err)
    return NextResponse.json({ error: 'Pipeline conversion failed' }, { status: 500 })
  }
}
