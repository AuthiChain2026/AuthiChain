import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { SUBSCRIPTION_TIERS, type SubscriptionPlan } from '@/lib/web3/config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const brandId = session.metadata?.brand_id
      const plan = session.metadata?.plan as SubscriptionPlan
      if (!brandId || !plan) break

      const tier = SUBSCRIPTION_TIERS[plan]
      const sub = await stripe.subscriptions.retrieve(session.subscription as string)

      await supabase.from('brand_subscriptions').upsert({
        brand_id: brandId,
        plan,
        status: 'active',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: sub.id,
        stripe_price_id: tier.stripePriceId,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        scan_quota: tier.scanQuota === -1 ? 999999 : tier.scanQuota,
        scans_used: 0,
        features: tier.features,
      }, { onConflict: 'brand_id' })

      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const brandId = sub.metadata?.brand_id
      if (!brandId) break

      const status = sub.status === 'active' ? 'active'
        : sub.status === 'past_due' ? 'past_due'
        : sub.status === 'trialing' ? 'trialing'
        : 'canceled'

      await supabase.from('brand_subscriptions').update({
        status: status as any,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', sub.id)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await supabase.from('brand_subscriptions').update({
        status: 'canceled' as any,
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
