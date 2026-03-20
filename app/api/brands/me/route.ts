import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient()
  const { data: brand, error } = await service
    .from('brands')
    .select('id, name, domain, logo_url, industry, staking_tier, qron_staked, staking_locked_until, unit_cost_discount, base_unit_cost, is_verified, is_active, created_at')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 })
  }

  return NextResponse.json({ brand: brand ?? null })
}

export async function PUT(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const allowed = ['name', 'domain', 'logo_url', 'industry']
  const updates: Record<string, string> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 })
  }

  const service = createServiceClient()

  // Upsert brand (create if doesn't exist)
  const { data: brand, error } = await service
    .from('brands')
    .upsert(
      { user_id: user.id, ...updates },
      { onConflict: 'user_id', ignoreDuplicates: false }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }

  return NextResponse.json({ brand })
}
