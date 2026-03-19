import Link from 'next/link'

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
    cta: 'Start Free Trial',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
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
    cta: 'Try Pro Free',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
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
    priceId: null,
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
          Simple, transparent pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Protect your brand.<br />
          <span className="text-emerald-400">Verify everything.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          AuthiChain blockchain authentication for luxury goods, pharma, and enterprise supply chains.
          No setup fees. Cancel anytime.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 text-emerald-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          14-day free trial on all plans — no credit card required to start
        </div>
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
            {plan.priceId ? (
              <form action="/api/checkout" method="POST">
                <input type="hidden" name="priceId" value={plan.priceId} />
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-semibold transition ${
                    plan.highlight
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </form>
            ) : (
              <Link
                href="mailto:z@authichain.com?subject=Enterprise%20Inquiry"
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
