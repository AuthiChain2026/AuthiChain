import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Cron-triggered worker that actively seeks funding opportunities
// Run weekly via Vercel Cron or Make.com scheduler
// POST /api/funding/seek with Authorization: Bearer <ADMIN_SECRET>

const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.CRON_SECRET || ''
const AIRTABLE_TOKEN = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN || ''
const AIRTABLE_BASE = 'app4lw5wNMNmzTNMn'
const AIRTABLE_TABLE = 'tblP4F42eiJTt2OfG'
const MAKE_WEBHOOK = process.env.MAKE_LEAD_WEBHOOK_URL || ''

// Keywords that match AuthiChain's domain
const SEARCH_KEYWORDS = [
  'blockchain anti-counterfeiting grant',
  'distributed ledger SBIR',
  'supply chain authentication funding',
  'AI product verification grant',
  'blockchain startup grant 2026',
  'DHS counterfeiting technology',
  'NSF distributed ledger',
  'NIST AI measurement',
]

// Known grant sources to check
const GRANT_SOURCES = [
  {
    name: 'SBIR.gov',
    url: 'https://www.sbir.gov/api/solicitations.json?keyword=blockchain',
    parser: 'sbir',
  },
  {
    name: 'Grants.gov',
    url: 'https://www.grants.gov/grantsws/rest/opportunities/search/cfda/keyword/blockchain',
    parser: 'grants_gov',
  },
  {
    name: 'NSF Seed Fund',
    url: 'https://seedfund.nsf.gov/topics/distributed-ledger/',
    parser: 'html_check',
  },
  {
    name: 'DHS SVIP',
    url: 'https://www.dhs.gov/science-and-technology/svip',
    parser: 'html_check',
  },
]

interface FundingOpportunity {
  name: string
  source: string
  amount?: number
  deadline?: string
  url?: string
  description?: string
}

async function checkSBIR(): Promise<FundingOpportunity[]> {
  const opportunities: FundingOpportunity[] = []
  try {
    // Check SBIR.gov API for blockchain-related solicitations
    const res = await fetch('https://www.sbir.gov/api/solicitations.json?keyword=blockchain&rows=10', {
      signal: AbortSignal.timeout(10000),
    })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) {
        for (const item of data.slice(0, 5)) {
          opportunities.push({
            name: item.solicitation_title || item.title || 'SBIR Solicitation',
            source: 'SBIR/STTR',
            amount: item.award_amount_max || undefined,
            deadline: item.close_date || undefined,
            url: item.solicitation_url || `https://www.sbir.gov/node/${item.id}`,
            description: (item.abstract || '').slice(0, 500),
          })
        }
      }
    }
  } catch (err) {
    console.log('[funding-seek] SBIR check failed:', err)
  }
  return opportunities
}

async function checkGrantsGov(): Promise<FundingOpportunity[]> {
  const opportunities: FundingOpportunity[] = []
  try {
    const res = await fetch('https://www.grants.gov/grantsws/rest/opportunities/search/keyword/blockchain+anti-counterfeiting', {
      signal: AbortSignal.timeout(10000),
    })
    if (res.ok) {
      const data = await res.json()
      const opps = data?.oppHits || data?.opportunities || []
      for (const item of (Array.isArray(opps) ? opps : []).slice(0, 5)) {
        opportunities.push({
          name: item.title || item.oppTitle || 'Grants.gov Opportunity',
          source: 'Other',
          amount: item.awardCeiling || undefined,
          deadline: item.closeDate || undefined,
          url: item.id ? `https://www.grants.gov/search-results-detail/${item.id}` : undefined,
          description: (item.synopsis || item.description || '').slice(0, 500),
        })
      }
    }
  } catch (err) {
    console.log('[funding-seek] Grants.gov check failed:', err)
  }
  return opportunities
}

async function checkPageForUpdates(name: string, url: string): Promise<FundingOpportunity[]> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (res.ok) {
      const html = await res.text()
      // Check for keywords indicating new opportunities
      const hasNewOpportunity = /open\s+solicitation|now\s+accepting|apply\s+now|project\s+pitch/i.test(html)
      const hasBlockchain = /blockchain|distributed\s+ledger|anti-counterfeit/i.test(html)
      if (hasNewOpportunity && hasBlockchain) {
        return [{
          name: `${name} — New Opportunity Detected`,
          source: name.includes('DHS') ? 'DHS SVIP' : 'NSF',
          url,
          description: `Active opportunity detected on ${name} page. Manual review recommended.`,
        }]
      }
    }
  } catch (err) {
    console.log(`[funding-seek] ${name} check failed:`, err)
  }
  return []
}

async function getExistingOpportunities(): Promise<Set<string>> {
  const existing = new Set<string>()
  if (!AIRTABLE_TOKEN) return existing
  try {
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?fields%5B%5D=Opportunity+Name&maxRecords=100`,
      { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } }
    )
    if (res.ok) {
      const data = await res.json()
      for (const record of data.records || []) {
        const name = record.fields?.['Opportunity Name']
        if (name) existing.add(name.toLowerCase())
      }
    }
  } catch {}
  return existing
}

async function addToAirtable(opp: FundingOpportunity) {
  if (!AIRTABLE_TOKEN) return
  try {
    await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: {
            'Opportunity Name': opp.name,
            'Source': opp.source,
            'Amount': opp.amount || null,
            'Deadline': opp.deadline || null,
            'Status': 'Identified',
            'URL': opp.url || null,
            'Notes': opp.description || '',
            'Last Updated': new Date().toISOString().split('T')[0],
          },
        }],
        typecast: true,
      }),
    })
  } catch (err) {
    console.error('[funding-seek] Airtable insert failed:', err)
  }
}

async function notifyFounder(opportunities: FundingOpportunity[]) {
  if (!MAKE_WEBHOOK || opportunities.length === 0) return
  try {
    await fetch(MAKE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'funding_opportunities_found',
        count: opportunities.length,
        opportunities: opportunities.map(o => ({
          name: o.name,
          source: o.source,
          amount: o.amount,
          deadline: o.deadline,
          url: o.url,
        })),
        timestamp: new Date().toISOString(),
      }),
    })
  } catch {}
}

export async function POST(req: NextRequest) {
  // Auth check
  const authHeader = req.headers.get('authorization')
  if (ADMIN_SECRET && authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await getExistingOpportunities()
  const allOpportunities: FundingOpportunity[] = []

  // Run all checks in parallel
  const [sbirResults, grantsResults, nsfResults, dhsResults] = await Promise.all([
    checkSBIR(),
    checkGrantsGov(),
    checkPageForUpdates('NSF Seed Fund', 'https://seedfund.nsf.gov/topics/distributed-ledger/'),
    checkPageForUpdates('DHS SVIP', 'https://www.dhs.gov/science-and-technology/svip'),
  ])

  const allResults = [...sbirResults, ...grantsResults, ...nsfResults, ...dhsResults]

  // Filter out duplicates
  for (const opp of allResults) {
    if (!existing.has(opp.name.toLowerCase())) {
      allOpportunities.push(opp)
      await addToAirtable(opp)
    }
  }

  // Notify if new opportunities found
  await notifyFounder(allOpportunities)

  return NextResponse.json({
    ok: true,
    checked_sources: GRANT_SOURCES.length,
    existing_count: existing.size,
    new_opportunities: allOpportunities.length,
    opportunities: allOpportunities,
    timestamp: new Date().toISOString(),
  })
}
