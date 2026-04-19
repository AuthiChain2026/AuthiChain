import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  const userSupabase = await createClient()
  const { data: { user } } = await userSupabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, slug, industry, website, crm_webhook } = await req.json()

    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: existing } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Brand slug already taken' }, { status: 409 })
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .insert({
        owner_id: user.id,
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        industry: industry || 'general',
        website,
        crm_webhook,
      })
      .select('id, name, slug')
      .single()

    if (error) throw error

    return NextResponse.json({ brand })
  } catch (err: any) {
    console.error('[brands/register]', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
