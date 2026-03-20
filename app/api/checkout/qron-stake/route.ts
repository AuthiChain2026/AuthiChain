/**
 * POST /api/checkout/qron-stake
 * Creates a Stripe one-time payment session to purchase and auto-stake QRON tokens.
 *
 * On successful payment the Stripe webhook handles:
 *   checkout.session.completed (product=qron_stake)
 *   → credits qron_amount to brands.qron_staked for the authenticated user
 *   → DB trigger auto-recomputes staking_tier + unit_cost_discount
 *
 * QRON Staking Bundles (fiat → QRON):
 *   bronze   —  1,000 QRON  → $49
 *   silver   — 10,000 QRON  → $349
 *   gold     — 100,000 QRON → $2,499
 *   platinum — 1,000,000 QRON → $14,999
 */
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const QRON_STAKE_BUNDLES = {
  bronze:   { qron_amount: 1_000,       price_usd_cents: 4900,   label: '1,000 QRON — Bronze Tier' },
  silver:   { qron_amount: 10_000,      price_usd_cents: 34900,  label: '10,000 QRON — Silver Tier' },
  gold:     { qron_amount: 100_000,     price_usd_cents: 249900, label: '100,000 QRON — Gold Tier' },
  platinum: { qron_amount: 1_000_000,   price_usd_cents: 1499900, label: '1,000,000 QRON — Platinum Tier' },
} as const

export type StakingBundle = keyof typeof QRON_STAKE_BUNDLES

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const tier = body.tier as StakingBundle

  if (!tier || !QRON_STAKE_BUNDLES[tier]) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${Object.keys(QRON_STAKE_BUNDLES).join(', ')}` },
      { status: 400 }
    )
  }

  const bundle = QRON_STAKE_BUNDLES[tier]
  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: bundle.price_usd_cents,
          product_data: {
            name: `AuthiChain QRON Stake — ${bundle.label}`,
            description: `Stakes ${bundle.qron_amount.toLocaleString()} QRON tokens to your brand account, reducing per-scan authentication fees permanently.`,
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/dashboard?qron_stake=success&tier=${tier}`,
    cancel_url: `${baseUrl}/qron#staking`,
    allow_promotion_codes: true,
    metadata: {
      product: 'qron_stake',
      staking_tier: tier,
      qron_amount: String(bundle.qron_amount),
      user_id: user.id,
      user_email: user.email ?? '',
    },
  })

  return NextResponse.json({ url: session.url })
}
