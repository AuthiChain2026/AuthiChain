import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { getUserSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function POST() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const subscription = await getUserSubscription()
  if (!subscription.stripeCustomerId) {
    return NextResponse.json(
      { error: 'No billing account found. Please subscribe to a plan first.', upgradeUrl: '/pricing' },
      { status: 404 }
    )
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${baseUrl}/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
