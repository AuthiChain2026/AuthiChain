import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const PLANS = {
  pro: {
    priceId: process.env.STRIPE_AGENT_BROWSER_PRO_PRICE_ID!,
    name: 'agent-browser Pro',
  },
  enterprise: {
    priceId: process.env.STRIPE_AGENT_BROWSER_ENTERPRISE_PRICE_ID!,
    name: 'agent-browser Enterprise',
  },
} as const

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const formData = await req.formData()
  const tier = (formData.get('tier') as string) ?? 'pro'
  const email = formData.get('email') as string | null

  const plan = PLANS[tier as keyof typeof PLANS] ?? PLANS.pro

  if (!plan.priceId) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' as any })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${baseUrl}/agent-browser?checkout=success`,
    cancel_url: `${baseUrl}/agent-browser?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    ...(email ? { customer_email: email } : {}),
    metadata: { tier, product: 'agent-browser' },
    subscription_data: {
      metadata: { tier, product: 'agent-browser' },
      trial_period_days: 14,
    },
  })

  return NextResponse.redirect(session.url!, 303)
}
