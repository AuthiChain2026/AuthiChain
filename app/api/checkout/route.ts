import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { planFromPriceId } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-06-20' as any,
  })

  try {
    const formData = await req.formData()
    const priceId = formData.get('priceId') as string

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // Attach authenticated user ID so the webhook can link subscription → user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'
    const plan = planFromPriceId(priceId)

    const price = await stripe.prices.retrieve(priceId, { expand: ['product'] })
    const product = price.product as Stripe.Product
    const planName = product?.name || priceId

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      // priceId is included so the license-issuer Cloudflare Worker can determine
      // the subscription tier from the webhook payload without expanding line_items
      // (Stripe does not include line_items in webhook payloads by default).
      metadata: { plan: planName, planKey: plan, priceId },
    }

    // Attach authenticated user so webhook can link subscription → user row
    if (user) {
      sessionParams.metadata = { ...sessionParams.metadata, userId: user.id }
      sessionParams.customer_email = user.email ?? undefined
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    console.error('[checkout] Stripe error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
