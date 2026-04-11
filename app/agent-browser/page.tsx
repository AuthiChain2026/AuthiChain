'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const FEATURES = {
  free: [
    '1 concurrent browser session',
    'All 100+ browser commands',
    'Chromium, Firefox, WebKit',
    'Mobile device emulation',
    'Community support',
  ],
  pro: [
    'Unlimited concurrent sessions',
    'All free features',
    'Session recording export',
    'Cloud relay access',
    'Priority support',
    'SLA guarantee',
  ],
  enterprise: [
    'Everything in Pro',
    'Custom integrations',
    'Dedicated infrastructure',
    'White-label options',
    'Enterprise SLA',
    '24/7 support',
  ],
}

function AgentBrowserInner() {
  const searchParams = useSearchParams()
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('free')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    const planParam = searchParams?.get('plan')
    if (planParam === 'pro' || planParam === 'enterprise') {
      setPlan(planParam)
    }
  }, [searchParams])

  const handleCheckout = async () => {
    if (plan === 'free') return
    setStatus('loading')
    try {
      const res = await fetch('/api/agent-browser-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const features = FEATURES[plan] || FEATURES.free

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Agent Browser</h1>
          <p className="text-muted-foreground text-lg">
            AI-powered browser automation for AuthiChain agents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {(['free', 'pro', 'enterprise'] as const).map((p) => (
            <div
              key={p}
              onClick={() => setPlan(p)}
              className={`cursor-pointer rounded-xl border p-6 transition-all ${
                plan === p
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="text-lg font-semibold capitalize mb-2">{p}</h3>
              <ul className="space-y-2">
                {FEATURES[p].map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          {plan === 'free' ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          ) : (
            <button
              onClick={handleCheckout}
              disabled={status === 'loading'}
              className="inline-flex items-center px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Processing...' : `Upgrade to ${plan}`}
            </button>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AgentBrowserPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    }>
      <AgentBrowserInner />
    </Suspense>
  )
}
