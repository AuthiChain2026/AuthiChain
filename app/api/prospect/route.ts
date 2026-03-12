import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const APOLLO_API_KEY = process.env.APOLLO_API_KEY!
const APOLLO_BASE = 'https://api.apollo.io/v1'

// Seniority levels that qualify as decision-makers
const DEFAULT_SENIORITY = ['c_suite', 'vp', 'director', 'manager']

// AuthiChain target industries mapped to Apollo industry labels
const INDUSTRY_MAP: Record<string, string[]> = {
  luxury: ['luxury goods & jewelry', 'apparel & fashion', 'cosmetics'],
  pharma: ['pharmaceuticals', 'biotechnology', 'medical devices'],
  supplychain: ['logistics and supply chain', 'warehousing', 'transportation/trucking/railroad'],
  electronics: ['consumer electronics', 'semiconductors', 'electrical/electronic manufacturing'],
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      industry = 'luxury',        // keyof INDUSTRY_MAP
      titles,                      // string[] override
      seniority = DEFAULT_SENIORITY,
      company_size_min = 500,
      company_size_max = 100000,
      per_page = 25,
      page = 1,
      save_to_db = true,
    } = body

    const industryLabels = INDUSTRY_MAP[industry] ?? INDUSTRY_MAP['luxury']

    // ── Call Apollo mixed_people/search ──────────────────────────────────────
    const apolloRes = await fetch(`${APOLLO_BASE}/mixed_people/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY,
      },
      body: JSON.stringify({
        person_seniorities: seniority,
        person_titles: titles ?? [
          'Chief Supply Chain Officer',
          'VP Supply Chain',
          'Director of Logistics',
          'Head of Authenticity',
          'Brand Protection Manager',
          'VP Operations',
          'Chief Compliance Officer',
        ],
        organization_industry_tag_ids: industryLabels,
        organization_num_employees_ranges: [
          `${company_size_min},${company_size_max}`,
        ],
        page,
        per_page,
        contact_email_status: ['verified', 'likely to engage'],
      }),
    })

    if (!apolloRes.ok) {
      const err = await apolloRes.text()
      console.error('Apollo prospect search error:', err)
      return NextResponse.json({ error: 'Apollo API error' }, { status: 502 })
    }

    const apolloData = await apolloRes.json()
    const people = apolloData.people ?? []
    const totalCount = apolloData.pagination?.total_entries ?? people.length

    if (!save_to_db || people.length === 0) {
      return NextResponse.json({ prospects: people, total: totalCount })
    }

    // ── Bulk upsert into enriched_leads ───────────────────────────────────────
    const rows = people.map((p: any) => ({
      user_id: user.id,
      email: p.email ?? `unknown+${p.id}@apollo-noemail.invalid`,
      first_name: p.first_name ?? null,
      last_name: p.last_name ?? null,
      title: p.title ?? null,
      linkedin_url: p.linkedin_url ?? null,
      photo_url: p.photo_url ?? null,
      company_name: p.organization?.name ?? null,
      company_domain: p.organization?.website_url ?? null,
      company_size: p.organization?.estimated_num_employees ?? null,
      industry: p.organization?.industry ?? null,
      country: p.organization?.country ?? null,
      city: p.organization?.city ?? null,
      state: p.organization?.state ?? null,
      apollo_person_id: p.id,
      apollo_org_id: p.organization?.id ?? null,
      seniority: p.seniority ?? null,
      departments: p.departments ?? null,
      tier: 'cold',
      status: 'new',
    }))

    const { data: saved, error: dbError } = await supabase
      .from('enriched_leads')
      .upsert(rows, { onConflict: 'apollo_person_id', ignoreDuplicates: true })
      .select('id, email, full_name, title, company_name, tier, status')

    if (dbError) {
      console.error('Supabase bulk upsert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      saved: saved?.length ?? 0,
      total: totalCount,
      prospects: saved,
    })
  } catch (err) {
    console.error('Prospect error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
