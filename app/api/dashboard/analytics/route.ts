import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(req: NextRequest) {
  const userSupabase = await createClient()
  const { data: { user } } = await userSupabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = parseInt(req.nextUrl.searchParams.get('days') || '30')
  const supabase = createServiceClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('id, name')
    .eq('owner_id', user.id)
    .single()

  if (!brand) {
    return NextResponse.json({ brand: null, subscription: null, analytics: null })
  }

  const { data: subscription } = await supabase
    .from('brand_subscriptions')
    .select('plan, status, scans_used, scan_quota, current_period_end')
    .eq('brand_id', brand.id)
    .single()

  const { data: analytics } = await supabase.rpc('get_brand_analytics', {
    p_brand_id: brand.id,
    p_days: days,
  })

  return NextResponse.json({
    brand_name: brand.name,
    subscription,
    analytics,
  })
}
