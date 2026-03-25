import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Map product names → QRON credit amounts
const CREDIT_MAP: Record<string, number> = {
  'qron starter': 100,
  'qron creator': 500,
  'qron studio': 2000,
}

function creditsFromProductName(name: string): number {
  const key = name.toLowerCase()
  for (const [k, v] of Object.entries(CREDIT_MAP)) {
    if (key.includes(k)) return v
  }
  return 0
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-06-20',
  })

  try {
    const formData = await req.formData()
    const priceId = formData.get('priceId') as string

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    // Attach authenticated user so webhook can credit their balance
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://authichain.com'

    const price = await stripe.prices.retrieve(priceId, { expand: ['product'] })
    const product = price.product as Stripe.Product
    const planName = product?.name || priceId
    const creditAmount = creditsFromProductName(planName)

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/qron?purchase=success`,
      cancel_url: `${baseUrl}/qron?purchase=cancelled`,
      allow_promotion_codes: true,
      metadata: {
        plan: planName,
        type: 'qron_credits',
        credits: String(creditAmount),
        priceId,
      },
    }

    if (user) {
      sessionParams.metadata = { ...sessionParams.metadata, userId: user.id }
      sessionParams.customer_email = user.email ?? undefined
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    console.error('[checkout/one-time] Stripe error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
