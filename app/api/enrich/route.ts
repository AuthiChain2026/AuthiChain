import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const APOLLO_API_KEY = process.env.APOLLO_API_KEY!
const APOLLO_BASE = 'https://api.apollo.io/v1'

interface ApolloPersonMatch {
  id: string
  first_name: string
  last_name: string
  name: string
  linkedin_url: string | null
  title: string | null
  photo_url: string | null
  email: string | null
  seniority: string | null
  departments: string[] | null
  organization: {
    id: string
    name: string
    website_url: string | null
    estimated_num_employees: string | null
    industry: string | null
    country: string | null
    city: string | null
    state: string | null
  } | null
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, first_name, last_name, company_name, domain } = body

    if (!email && !(first_name && last_name && (company_name || domain))) {
      return NextResponse.json(
        { error: 'Provide email OR (first_name + last_name + company/domain)' },
        { status: 400 }
      )
    }

    // ── Call Apollo people/match ──────────────────────────────────────────────
    const apolloRes = await fetch(`${APOLLO_BASE}/people/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': APOLLO_API_KEY,
      },
      body: JSON.stringify({
        email,
        first_name,
        last_name,
        organization_name: company_name,
        domain,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }),
    })

    if (!apolloRes.ok) {
      const err = await apolloRes.text()
      console.error('Apollo people/match error:', err)
      return NextResponse.json({ error: 'Apollo API error' }, { status: 502 })
    }

    const apolloData = await apolloRes.json()
    const person: ApolloPersonMatch = apolloData.person

    if (!person) {
      return NextResponse.json({ error: 'No match found' }, { status: 404 })
    }

    const resolvedEmail = person.email ?? email ?? ''

    // ── Upsert into enriched_leads ────────────────────────────────────────────
    const { data: lead, error: dbError } = await supabase
      .from('enriched_leads')
      .upsert(
        {
          user_id: user.id,
          email: resolvedEmail,
          first_name: person.first_name,
          last_name: person.last_name,
          title: person.title,
          linkedin_url: person.linkedin_url,
          photo_url: person.photo_url,
          company_name: person.organization?.name ?? company_name ?? null,
          company_domain: person.organization?.website_url ?? domain ?? null,
          company_size: person.organization?.estimated_num_employees ?? null,
          industry: person.organization?.industry ?? null,
          country: person.organization?.country ?? null,
          city: person.organization?.city ?? null,
          state: person.organization?.state ?? null,
          apollo_person_id: person.id,
          apollo_org_id: person.organization?.id ?? null,
          seniority: person.seniority,
          departments: person.departments,
        },
        { onConflict: 'apollo_person_id', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (dbError) {
      console.error('Supabase upsert error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ lead }, { status: 200 })
  } catch (err) {
    console.error('Enrich error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
