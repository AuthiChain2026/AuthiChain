import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAKE_WEBHOOK_URL = process.env.MAKE_LEAD_WEBHOOK_URL || ''
const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || ''

interface LeadPayload {
  email: string
  name?: string
  company?: string
  source?: string
  product_interest?: string
  page_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  lead_score?: number
}

async function syncToHubSpot(lead: LeadPayload) {
  if (!HUBSPOT_TOKEN) return null

  const nameParts = (lead.name || '').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  // Search for existing contact
  const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: lead.email }] }],
      properties: ['email', 'firstname', 'lastname', 'lead_score'],
    }),
  })

  const searchData = await searchRes.json()
  const existingContact = searchData.results?.[0]

  const properties: Record<string, string> = {
    email: lead.email,
    ...(firstName && { firstname: firstName }),
    ...(lastName && { lastname: lastName }),
    ...(lead.company && { company: lead.company }),
    hs_lead_status: 'NEW',
    lifecyclestage: 'lead',
  }

  if (existingContact) {
    // Update existing contact — increment lead score
    const currentScore = parseInt(existingContact.properties?.lead_score || '0', 10)
    const scoreIncrement = lead.lead_score || 10
    properties.lead_score = String(currentScore + scoreIncrement)

    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingContact.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties }),
    })
    return existingContact.id
  } else {
    // Create new contact
    properties.lead_score = String(lead.lead_score || 10)
    const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${HUBSPOT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ properties }),
    })
    const created = await createRes.json()
    return created.id || null
  }
}

async function fireToMake(lead: LeadPayload) {
  if (!MAKE_WEBHOOK_URL) return
  await fetch(MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...lead,
      timestamp: new Date().toISOString(),
      event: 'lead_captured',
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadPayload = await req.json()
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Calculate initial lead score based on source
    const scoreMap: Record<string, number> = {
      popup: 10,
      inline: 15,
      pricing: 20,
      demo: 30,
      enterprise: 25,
    }
    body.lead_score = scoreMap[body.source || ''] || 10

    // Sync in parallel
    const [hubspotId] = await Promise.all([
      syncToHubSpot(body).catch(err => { console.error('[lead-webhook] HubSpot error:', err); return null }),
      fireToMake(body).catch(err => { console.error('[lead-webhook] Make error:', err) }),
    ])

    return NextResponse.json({ ok: true, hubspotId })
  } catch (err) {
    console.error('[lead-webhook] Error:', err)
    return NextResponse.json({ error: 'Failed to process lead' }, { status: 500 })
  }
}
