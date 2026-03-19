import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription, checkProductQuota, PLAN_LIMITS } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await getUserSubscription()
  const quota = await checkProductQuota(user.id, subscription)
  const limits = PLAN_LIMITS[subscription.plan]

  return NextResponse.json({
    subscription,
    quota,
    limits,
  })
}
