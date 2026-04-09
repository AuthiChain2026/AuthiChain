/**
 * Seed script — Michigan dispensary outreach, no-sales-calls edition.
 *
 * Loads the 15 Michigan cannabis operators from
 * app/outreach/michigan-dispensaries/page.tsx into the Supabase
 * `network_contacts` table (schema: supabase/migrations/20260407_strainchain_schema.sql),
 * then stages each contact for cold outbound via the outreach pipeline.
 *
 * The email body is the variant-A cold email from
 * marketing/strainchain/cold-email-michigan.md.
 *
 * Every CTA is a direct Stripe payment link for the $299 AuthiChain BTC
 * Auth product (dual-chain Polygon + Bitcoin cert). No sales calls, no
 * pilots, no demos — click, pay, receive.
 *
 * Run:
 *   npx tsx scripts/seed-michigan-outreach.ts           # dry run
 *   npx tsx scripts/seed-michigan-outreach.ts --commit  # actually insert
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (service role, not anon)
 */

import { createClient } from '@supabase/supabase-js'

// ── The offer ────────────────────────────────────────────────────────────────

const OFFER = {
  product: 'AuthiChain BTC Auth',
  price_usd: 299,
  stripe_payment_link: 'https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e',
  walkthrough_url: 'https://authichain.com/strainchain/demos/cultivator',
  delivery: 'Email cert in ~30 min via OrdinalsBot',
  mode: 'one_time',
} as const

// ── Sender config (fill these in before running --commit) ───────────────────

const SENDER = {
  name: process.env.OUTREACH_SENDER_NAME || 'Z',
  email: process.env.OUTREACH_SENDER_EMAIL || 'z@authichain.com',
  physical_address: process.env.OUTREACH_PHYSICAL_ADDRESS || '[SET OUTREACH_PHYSICAL_ADDRESS]',
  unsubscribe_base: process.env.OUTREACH_UNSUBSCRIBE_URL || 'https://authichain.com/unsubscribe',
}

// ── Michigan cannabis target list ──────────────────────────────────────────
// Source: app/outreach/michigan-dispensaries/page.tsx (MICHIGAN_TARGETS array)
// Tiering drives the send schedule (hot → day 0, warm → day 2, cold → day 5).

type Tier = 'hot' | 'warm' | 'cold'

interface Target {
  id: number
  company: string
  city: string
  state: string
  contact: string
  email: string
  phone: string
  website: string
  tier: Tier
  notes: string
}

const MICHIGAN_TARGETS: Target[] = [
  { id: 1,  company: 'Lume Cannabis Co.',      city: 'Kalamazoo',         state: 'MI', contact: 'VP of Operations',       email: 'ops@lumecannabis.com',         phone: '', website: 'lumecannabis.com',     tier: 'hot',  notes: 'Multi-location MSO, active brand protection interest' },
  { id: 2,  company: 'Gage Cannabis Co.',      city: 'Detroit',           state: 'MI', contact: 'Director of Compliance', email: 'compliance@gagecannabis.com',  phone: '', website: 'gagecannabis.com',     tier: 'hot',  notes: 'Public company, strict METRC compliance needs' },
  { id: 3,  company: 'Herbology Cannabis Co.', city: 'Saginaw',           state: 'MI', contact: 'Dispensary Manager',     email: 'info@herbologycannabis.com',   phone: '', website: 'herbologycannabis.com',tier: 'warm', notes: 'Premium flower brand, packaging authenticity focus' },
  { id: 4,  company: 'Green Peak Cannabis',    city: 'Lansing',           state: 'MI', contact: 'CEO / Founder',          email: '',                              phone: '', website: 'greenpeakmi.com',      tier: 'warm', notes: 'MI-first brand, open to blockchain verification pilots' },
  { id: 5,  company: 'Skymint Brands',         city: 'Grand Rapids',      state: 'MI', contact: 'VP Brand & Marketing',   email: '',                              phone: '', website: 'skymint.com',          tier: 'warm', notes: 'Strong retail footprint, interested in consumer-facing QR' },
  { id: 6,  company: 'Cookies Michigan',       city: 'Detroit',           state: 'MI', contact: 'Store Director',         email: '',                              phone: '', website: 'cookiesmelrose.com',   tier: 'hot',  notes: 'Premium brand, counterfeiting is active pain point' },
  { id: 7,  company: 'High Life Farms',        city: 'Chesaning',         state: 'MI', contact: 'COO',                    email: '',                              phone: '', website: 'highlifefarms.com',    tier: 'cold', notes: 'Craft cultivator, supply chain transparency angle' },
  { id: 8,  company: 'Pleasantrees',           city: 'Harrison Township', state: 'MI', contact: 'Director of Sales',      email: '',                              phone: '', website: 'pleasantrees.com',     tier: 'warm', notes: 'Vertically integrated, packaging + batch tracking' },
  { id: 9,  company: 'Puff Cannabis Company',  city: 'Sterling Heights',  state: 'MI', contact: 'Founder',                email: '',                              phone: '', website: 'puffcannabisco.com',   tier: 'cold', notes: 'Growing multi-store chain' },
  { id: 10, company: 'Verilife Michigan',      city: 'Romulus',           state: 'MI', contact: 'Compliance Manager',     email: '',                              phone: '', website: 'verilife.com',         tier: 'warm', notes: 'PharmaCann subsidiary, enterprise deal potential' },
  { id: 11, company: 'JARS Cannabis',          city: 'Flint',             state: 'MI', contact: 'VP Operations',          email: '',                              phone: '', website: 'jarscannabis.com',     tier: 'hot',  notes: 'Rapid expansion, brand integrity critical' },
  { id: 12, company: 'MedMen Michigan',        city: 'Ann Arbor',         state: 'MI', contact: 'Regional Director',      email: '',                              phone: '', website: 'medmen.com',           tier: 'cold', notes: 'National brand, MI flagship store' },
  { id: 13, company: 'Common Citizen',         city: 'Marshall',          state: 'MI', contact: 'Head of Product',        email: '',                              phone: '', website: 'commoncitizen.com',    tier: 'warm', notes: 'Premium positioning, authenticity story strong fit' },
  { id: 14, company: 'TreeHouse Cannabis',     city: 'Detroit',           state: 'MI', contact: 'Operations Lead',        email: '',                              phone: '', website: 'treehousecannabis.com',tier: 'cold', notes: 'Detroit-based, community-first brand' },
  { id: 15, company: 'Canna Provisions',       city: 'Holyoke (MI expansion)', state: 'MI', contact: 'Founder & CEO',     email: '',                              phone: '', website: 'cannaprovisions.com',  tier: 'warm', notes: 'Expanding into MI, premium positioning, early mover' },
]

// ── Send schedule ──────────────────────────────────────────────────────────

const TIER_OFFSETS: Record<Tier, number> = { hot: 0, warm: 2, cold: 5 } // days

function scheduledAt(tier: Tier): string {
  const d = new Date()
  d.setDate(d.getDate() + TIER_OFFSETS[tier])
  d.setHours(13, 0, 0, 0) // 9am ET send window
  return d.toISOString()
}

// ── Email template (variant A, 90 words) ───────────────────────────────────

function firstNameFrom(contact: string): string {
  // Title-based contacts don't have a first name, so fall back gracefully.
  return 'there'
}

function renderSubject(t: Target): string {
  return `$${OFFER.price_usd} Bitcoin cert for ${t.company}'s flagship strain`
}

function renderBody(t: Target, leadId: string): string {
  const unsubscribe = `${SENDER.unsubscribe_base}?id=${leadId}`
  return `Hi ${firstNameFrom(t.contact)},

I built StrainChain — we inscribe cannabis product auth certs on Bitcoin L1 (dual-chain: Polygon + BTC). Every bag gets a scannable code that resolves to a permanent authichain.com/verify page. Uncopyable. Goes on the bag, the dispensary shelf, and your website as a brand story asset.

$${OFFER.price_usd} one-time, direct checkout, ${OFFER.delivery.toLowerCase()}:
${OFFER.stripe_payment_link}

No call, no demo, no pilot. Click, pay, receive.

Walkthrough first: ${OFFER.walkthrough_url}

— ${SENDER.name}
StrainChain · strainchain.io
${SENDER.physical_address}
Unsubscribe: ${unsubscribe}
`
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const commit = process.argv.includes('--commit')
  const sendable = MICHIGAN_TARGETS.filter(t => t.email && t.email.trim() !== '')
  const missing = MICHIGAN_TARGETS.filter(t => !t.email || t.email.trim() === '')

  console.log('Michigan cannabis outreach seed — no-sales-calls edition')
  console.log(`Offer: ${OFFER.product} — $${OFFER.price_usd} one-time`)
  console.log(`Stripe: ${OFFER.stripe_payment_link}`)
  console.log(`Targets: ${MICHIGAN_TARGETS.length} total`)
  console.log(`  ✓ sendable now: ${sendable.length}`)
  console.log(`  ⚠ need email lookup: ${missing.length}`)
  console.log('')

  if (missing.length > 0) {
    console.log('Contacts missing email (look these up before --commit):')
    for (const t of missing) {
      console.log(`  - ${t.company} (${t.tier}) · ${t.contact} · ${t.website}`)
    }
    console.log('')
  }

  if (!commit) {
    console.log('=== DRY RUN ===')
    console.log('Preview first email:')
    if (sendable.length > 0) {
      const t = sendable[0]
      console.log('---')
      console.log(`To: ${t.email}`)
      console.log(`Subject: ${renderSubject(t)}`)
      console.log(`Scheduled: ${scheduledAt(t.tier)}`)
      console.log('')
      console.log(renderBody(t, 'dry-run-lead-id'))
      console.log('---')
    }
    console.log('\nRe-run with --commit to insert into Supabase.')
    return
  }

  // ── Commit mode: insert into Supabase ─────────────────────────────────────

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  if (SENDER.physical_address.startsWith('[SET')) {
    console.error('Set OUTREACH_PHYSICAL_ADDRESS env var before --commit (CAN-SPAM requirement).')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  let inserted = 0
  let skipped = 0
  for (const t of sendable) {
    // Upsert into network_contacts
    const { data: contact, error: contactErr } = await supabase
      .from('network_contacts')
      .upsert(
        {
          name: t.contact,
          company: t.company,
          title: t.contact,
          email: t.email,
          phone: t.phone || null,
          notes: `[${t.tier}] ${t.city}, ${t.state} · ${t.notes} · ${t.website}`,
        },
        { onConflict: 'email' }
      )
      .select()
      .single()

    if (contactErr) {
      console.error(`✗ ${t.company}: ${contactErr.message}`)
      skipped++
      continue
    }

    // Upsert into leads (tracks outbound funnel)
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .upsert(
        {
          email: t.email,
          source: `michigan_outreach_${t.tier}`,
        },
        { onConflict: 'email' }
      )
      .select()
      .single()

    if (leadErr) {
      console.error(`✗ ${t.company} (leads): ${leadErr.message}`)
      skipped++
      continue
    }

    const leadId = lead?.id || contact?.id || 'unknown'
    const subject = renderSubject(t)
    const body = renderBody(t, leadId)
    const scheduled = scheduledAt(t.tier)

    console.log(`✓ ${t.company} (${t.tier}) · scheduled ${scheduled.slice(0, 10)} · lead ${leadId}`)
    console.log(`  Subject: ${subject}`)
    inserted++

    // NOTE: To actually queue the send, POST to the outreach-queue-worker
    // endpoint with { to: t.email, subject, body, scheduled_at: scheduled }.
    // That endpoint lives at outreach-queue-worker.authichain2026.workers.dev
    // and is called by the Make.com scenario in make-scenarios/
    // outreach-queue-daily-sender.json. Wire that in a follow-up PR once the
    // D1 schema is confirmed.
  }

  console.log('')
  console.log(`Done. Inserted ${inserted}, skipped ${skipped}.`)
  console.log('')
  console.log('Next: POST each {to, subject, body, scheduled_at} to the')
  console.log('outreach-queue-worker to stage the actual sends. See')
  console.log('marketing/strainchain/ACTIVATION.md for the full sequence.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
