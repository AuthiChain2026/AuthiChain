'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Zap, Shield, Star, ArrowRight, Lock, AlertCircle } from 'lucide-react'

const PLANS = [
  {
    key: 'starter',
    name: 'Starter',
    monthlyPrice: 299,
    annualPrice: 239,
    description: 'For brands getting started with product authentication.',
    features: [
      'Up to 500 verified products',
      'QR code generation',
      'Blockchain verification',
      'Email support',
      'AuthiChain dashboard',
    ],
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || 'price_1TGAVRGqTruSqV8T0JkrO3Ry',
    priceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL || 'price_1TGAVSGqTruSqV8TRW1nI5K5',
    highlight: false,
    badge: null,
    trial: true,
  },
  {
    key: 'pro',
    name: 'Pro',
    monthlyPrice: 799,
    annualPrice: 639,
    description: 'For scaling brands with advanced supply chain needs.',
    features: [
      'Unlimited verified products',
      'Apollo lead enrichment',
      'Supply chain tracking',
      'API access',
      'Custom QR branding',
      'Priority support',
    ],
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_1TGAVTGqTruSqV8TTHYdqKAs',
    priceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || 'price_1TGAVTGqTruSqV8T8YXJjtSr',
    highlight: true,
    badge: 'MOST POPULAR',
    trial: true,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Custom pricing for large-scale deployments and enterprise needs.',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
      'QRON token rewards program',
    ],
    priceIdMonthly: '',
    priceIdAnnual: '',
    highlight: false,
    badge: 'ENTERPRISE',
    trial: false,
  },
]

function PricingContent() {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const router = useRouter()
  const params = useSearchParams()
  const cancelled = params?.get('checkout') === 'cancelled'

  async function handleCheckout(plan: typeof PLANS[0]) {
    setCheckoutError(null)
    if (plan.key === 'enterprise') {
      router.push('/contact?plan=enterprise')
      return
    }

    const priceId = annual ? plan.priceIdAnnual : plan.priceIdMonthly
    if (!priceId) {
      setCheckoutError('Checkout is not yet configured for this plan. Please contact support or try again later.')
      return
    }

    setLoading(plan.key)
    try {
      // Track lead event
      await fetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'checkout_started', plan: plan.key, interval: annual ? 'annual' : 'monthly' }),
      }).catch(() => {})

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = '/api/checkout'
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'priceId'
      input.value = priceId
      form.appendChild(input)
      document.body.appendChild(form)
      form.submit()
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Header */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <p className="text-sm text-cyan-400 font-semibold tracking-widest mb-4 flex items-center justify-center gap-2">
          <Shield className="h-4 w-4" />
          Trusted by 500+ brands globally
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Authenticate Products. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Build Trust.</span>
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Start with a 14-day free trial. No credit card required on monthly plans.
        </p>

        {cancelled && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-600 rounded-lg text-sm">
            <ArrowRight className="h-4 w-4" />
            Checkout was cancelled — your plan is still active. Resume anytime.
          </div>
        )}

        {checkoutError && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-600 rounded-lg text-sm text-red-300 mt-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {checkoutError}
          </div>
        )}

        {/* Toggle */}
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-800 border border-gray-700 rounded-full shadow-lg mt-6">
          <span className={!annual ? 'font-semibold' : 'text-gray-400'}>Monthly</span>
          <button onClick={() => setAnnual(!annual)} className={`relative w-14 h-7 rounded-full transition-colors ${ annual ? 'bg-purple-600' : 'bg-gray-700' }`} >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${ annual ? 'translate-x-7' : 'translate-x-0' }`} />
          </button>
          <span className={annual ? 'font-semibold' : 'text-gray-400'}>Annual</span>
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">SAVE 20%</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="relative z-10 container mx-auto px-4 pb-24 grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice
          const isLoading = loading === plan.key
          return (
            <div key={plan.key} className={`relative rounded-2xl p-8 border transition-all ${ plan.highlight ? 'bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border-purple-500/50 shadow-2xl shadow-purple-500/20' : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' }`} >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                {plan.highlight ? <Star className="h-6 w-6 text-yellow-400" /> : <Shield className="h-6 w-6 text-cyan-400" />}
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              <div className="mb-6">
                {plan.key === 'enterprise' ? (
                  <div className="text-4xl font-extrabold">Custom</div>
                ) : (
                  <div>
                    <span className="text-5xl font-extrabold">${price}</span>
                    <span className="text-gray-400 ml-2">/mo{annual ? ' (billed annually)' : ''}</span>
                  </div>
                )}
                {plan.trial && !annual && (
                  <p className="text-sm text-green-400 mt-2 flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    14-day free trial included
                  </p>
                )}
              </div>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-400 mt-0.5" />
                    <span className="text-sm text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => handleCheckout(plan)} disabled={!!loading} className={`w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${ plan.highlight ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/30' : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' } disabled:opacity-50 disabled:cursor-not-allowed`} >
                {isLoading ? (
                  <Zap className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {plan.key === 'enterprise' ? 'Contact Sales' : plan.trial && !annual ? 'Start Free Trial' : 'Get Started'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Trust Signals */}
      <div className="relative z-10 container mx-auto px-4 pb-24 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <Lock className="h-8 w-8 text-cyan-400" />
          <p className="text-sm text-gray-400">SSL encrypted</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Shield className="h-8 w-8 text-cyan-400" />
          <p className="text-sm text-gray-400">Powered by Stripe</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Check className="h-8 w-8 text-cyan-400" />
          <p className="text-sm text-gray-400">Cancel anytime</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Star className="h-8 w-8 text-cyan-400" />
          <p className="text-sm text-gray-400">30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 animate-pulse" />}>
      <PricingContent />
    </Suspense>
  )
}
