import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { SUBSCRIPTION_TIERS, type SubscriptionPlan } from '@/lib/web3/constants'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any })
}

/**
 * POST /api/subscribe
 * Creates a Stripe Checkout session for brand subscription.
 * Body: { brand_id: string, plan: 'starter' | 'pro' | 'enterprise', return_url?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const { brand_id, plan, return_url } = await req.json()

    if (!brand_id || !plan || !(plan in SUBSCRIPTION_TIERS)) {
      return NextResponse.json({ error: 'Invalid brand_id or plan' }, { status: 400 })
    }

    const tier = SUBSCRIPTION_TIERS[plan as SubscriptionPlan]
    if (!tier.stripePriceId) {
      return NextResponse.json({ error: 'Price not configured for this plan' }, { status: 500 })
    }

    const supabase = createServiceClient()

    const { data: brand } = await supabase
      .from('brands')
      .select('id, name, owner_id')
      .eq('id', brand_id)
      .single()

    if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })

    const { data: user } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', brand.owner_id)
      .single()

    // Check for existing Stripe customer
    const { data: existingSub } = await supabase
      .from('brand_subscriptions')
      .select('stripe_customer_id')
      .eq('brand_id', brand_id)
      .single()

    let customerId = existingSub?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || undefined,
        metadata: { brand_id, brand_name: brand.name },
      })
      customerId = customer.id
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: tier.stripePriceId, quantity: 1 }],
      success_url: `${return_url || process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=${plan}`,
      cancel_url: `${return_url || process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { brand_id, plan },
      subscription_data: {
        metadata: { brand_id, plan },
      },
    })

    return NextResponse.json({ checkout_url: session.url })
  } catch (err: any) {
    console.error('[subscribe] Error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
