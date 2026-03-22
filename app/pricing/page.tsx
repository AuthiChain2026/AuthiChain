'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Zap, Shield, Star, ArrowRight, Lock } from 'lucide-react'

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
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || '',
    priceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL || '',
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
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    priceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || '',
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
  const router = useRouter()
  const params = useSearchParams()
  const cancelled = params.get('checkout') === 'cancelled'

  async function handleCheckout(plan: typeof PLANS[0]) {
    if (plan.key === 'enterprise') {
      router.push('/contact?plan=enterprise')
      return
    }
    const priceId = annual ? plan.priceIdAnnual : plan.priceIdMonthly
    if (!priceId) {
      alert('Stripe price not configured yet. Check NEXT_PUBLIC_STRIPE_PRICE_* env vars.')
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
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 px-4 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-400 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trusted by 500+ brands globally
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Authenticate Products.
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> Build Trust.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required on monthly plans.
          </p>

          {cancelled && (
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-2 text-yellow-400 text-sm">
              Checkout was cancelled — your plan is still active. Resume anytime.
            </div>
          )}
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              annual ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
              annual ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-gray-400'}`}>
            Annual
            <span className="ml-2 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full border border-green-500/30">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            const isLoading = loading === plan.key
            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl p-8 border transition-all ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-purple-900/60 to-gray-900 border-purple-500/60 shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'bg-gray-900/60 border-gray-700/60 hover:border-gray-600'
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                    plan.highlight ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  {plan.highlight ? <Star className="w-5 h-5 text-purple-400" /> : <Zap className="w-5 h-5 text-gray-400" />}
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                </div>

                <div className="mb-4">
                  {plan.key === 'enterprise' ? (
                    <p className="text-3xl font-bold text-white">Custom</p>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">${price}</span>
                      <span className="text-gray-400 mb-1">/mo{annual ? ' (billed annually)' : ''}</span>
                    </div>
                  )}
                  {plan.trial && !annual && (
                    <p className="text-xs text-cyan-400 mt-1">14-day free trial included</p>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={!!loading}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-500 hover:to-cyan-500 shadow-lg shadow-purple-500/30'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      {plan.key === 'enterprise' ? 'Contact Sales' : plan.trial && !annual ? 'Start Free Trial' : 'Get Started'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> SSL encrypted</div>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Powered by Stripe</div>
          <div className="flex items-center gap-2"><Check className="w-4 h-4" /> Cancel anytime</div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> 30-day money-back guarantee</div>
        </div>
      </div>
    </main>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 animate-pulse" />}>
      <PricingContent />
    </Suspense>
  )
}
