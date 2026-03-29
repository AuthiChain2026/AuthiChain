'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Sparkles, ArrowRight } from 'lucide-react'

interface LeadCapturePopupProps {
  /** Delay in ms before scroll/idle triggers become active */
  delay?: number
}

export function LeadCapturePopup({ delay = 5000 }: LeadCapturePopupProps) {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const dismiss = useCallback(() => {
    setVisible(false)
    try { sessionStorage.setItem('ac_lead_dismissed', '1') } catch {}
  }, [])

  useEffect(() => {
    // Don't show if already dismissed or already captured
    try {
      if (sessionStorage.getItem('ac_lead_dismissed')) return
      if (localStorage.getItem('ac_lead_captured')) return
    } catch {}

    let timer: ReturnType<typeof setTimeout>

    // Exit intent (desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) setVisible(true)
    }

    // Scroll trigger (50% of page)
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.5) setVisible(true)
    }

    // Idle trigger
    timer = setTimeout(() => {
      setVisible(true)
    }, delay + 30000) // 30s idle after initial delay

    const activateTimer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, delay)

    return () => {
      clearTimeout(timer)
      clearTimeout(activateTimer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [delay])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      // Collect UTM params
      const params = new URLSearchParams(window.location.search)
      const utm = {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
      }

      await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          company,
          source: 'popup',
          page_url: window.location.pathname,
          product_interest: 'authichain',
          ...utm,
        }),
      })

      // Also fire to Make.com webhook if available
      await fetch('/api/leads/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, name, company,
          source: 'popup',
          product_interest: 'authichain',
          page_url: window.location.pathname,
          ...utm,
        }),
      }).catch(() => {})

      setSubmitted(true)
      try { localStorage.setItem('ac_lead_captured', '1') } catch {}
    } catch {
      // Still show success to not frustrate user
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-purple-500/30 bg-background p-8 shadow-2xl">
        <button onClick={dismiss} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
              <Sparkles className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">You&apos;re In!</h3>
            <p className="text-muted-foreground">
              Check your email for your free product authentication demo. We&apos;ll show you how to protect your products with blockchain verification.
            </p>
            <button onClick={dismiss} className="mt-6 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium">
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="h-3 w-3" />
              Free Demo
            </div>
            <h3 className="text-2xl font-bold mb-2">
              Authenticate Your First Product Free
            </h3>
            <p className="text-muted-foreground mb-6">
              See how AI AutoFlow™ classifies and protects your products with blockchain authentication in under 3 seconds.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Work email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Company"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? 'Submitting...' : 'Get Free Demo'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              No credit card required. Instant access.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
