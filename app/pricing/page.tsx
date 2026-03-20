'use client'
import Link from 'next/link'
import { useState } from 'react'

const FOUNDERS_COUPON = 'FOUNDERS50'

const plans = [
  {
    name: 'Starter',
    price: '$299',
    period: '/mo',
    description: 'For brands getting started with product authentication.',
    features: [
      'Up to 500 verified products',
      'QR code generation',
      'Blockchain verification',
      'Email support',
      'AuthiChain dashboard',
    ],
    cta: 'Start Authenticating',
    paymentLink: 'https://buy.stripe.com/8x24gB5KP55zgzY1MgaIM07',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$799',
    period: '/mo',
    description: 'For scaling brands with advanced supply chain needs.',
    features: [
      'Unlimited verified products',
      'Apollo lead enrichment',
      'Supply chain tracking',
      'API access + webhooks',
      'Priority support',
      'Custom QR branding',
      'Analytics dashboard',
    ],
    cta: 'Go Pro',
    paymentLink: 'https://buy.stripe.com/14A3cxgptbtX2J88aEaIM08',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For luxury houses, pharma, and global supply chains.',
    features: [
      'Everything in Pro',
      'Dedicated onboarding',
      'SLA guarantee',
      'DSCSA / compliance reports',
      'Multi-brand management',
      'White-label option',
      'Contract pricing',
    ],
    cta: 'Contact Sales',
    paymentLink: null,
    highlight: false,
  },
]

export default function PricingPage() {
  const [foundersDismissed, setFoundersDismissed] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white">
      {/* FOUNDERS50 banner */}
      {!foundersDismissed && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4 text-sm font-medium">
            <span>
              🎉 <strong>Founders Offer:</strong> Use{' '}
              <span className="font-mono bg-black/20 px-1.5 py-0.5 rounded">FOUNDERS50</span>
              {' '}for 50% off — forever. Limited to the first 50 customers.
            </span>
            <button
              onClick={() => setFoundersDismissed(true)}
              className="shrink-0 opacity-70 hover:opacity-100 transition text-lg leading-none"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Protect your brand.<br />
          <span className="text-emerald-400">Verify everything.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-4">
          AuthiChain blockchain authentication for luxury goods, pharma, and enterprise supply chains.
          14-day free trial. No setup fees. Cancel anytime.
        </p>
        <p className="text-sm text-gray-500">
          Use code{' '}
          <span className="font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
            LAUNCH25
          </span>{' '}
          for 25% off your first 3 months, or{' '}
          <span className="font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            FOUNDERS50
          </span>{' '}
          for 50% off forever.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {plan.highlight && (
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-gray-400 mb-1">{plan.period}</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.paymentLink ? (
              <a
                href={plan.paymentLink}
                className={`w-full py-3 rounded-xl font-semibold transition text-center block ${
                  plan.highlight
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </a>
            ) : (
              <Link
                href="/enterprise"
                className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white text-center block transition"
              >
                {plan.cta}
              </Link>
            )}
          </div>
        ))}
      </section>

      {/* Trust bar */}
      <section className="border-t border-white/10 py-12 px-6 text-center">
        <p className="text-gray-500 text-sm mb-6">Trusted by enterprise brands for blockchain-grade authentication</p>
        <div className="flex flex-wrap justify-center gap-8 text-gray-600 text-sm font-medium">
          <span>🔒 Blockchain Verified</span>
          <span>⚡ Live QR Scanning</span>
          <span>📋 DSCSA Compliant</span>
          <span>🌍 Global Supply Chain</span>
          <span>🛡️ Anti-Counterfeit</span>
        </div>
      </section>
    </main>
  )
}
