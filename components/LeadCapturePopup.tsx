'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'

interface LeadCapturePopupProps {
  delay?: number
}

export function LeadCapturePopup({ delay = 8000 }: LeadCapturePopupProps) {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const dismiss = () => {
    setVisible(false)
    try { sessionStorage.setItem('ac_lead_dismissed', '1') } catch {}
  }

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ac_lead_dismissed')) return
      if (localStorage.getItem('ac_lead_captured')) return
    } catch {}

    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
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
          source: 'banner',
          page_url: window.location.pathname,
          product_interest: 'authichain',
          ...utm,
        }),
      })

      await fetch('/api/leads/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'banner',
          product_interest: 'authichain',
          page_url: window.location.pathname,
          ...utm,
        }),
      }).catch(() => {})

      setSubmitted(true)
      try { localStorage.setItem('ac_lead_captured', '1') } catch {}
      setTimeout(dismiss, 3000)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-500">
      <div className="border-t border-purple-500/20 bg-background/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          {submitted ? (
            <p className="text-sm text-green-400 font-medium flex-1 text-center">
              You&apos;re in! Check your email for your free demo access.
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground flex-1">
                <span className="font-semibold text-foreground">Try AuthiChain free</span> — authenticate your first product with AI + blockchain in seconds.
              </p>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-shrink-0">
                <input
                  type="email"
                  required
                  placeholder="Work email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 w-48"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading ? '...' : 'Free Demo'}
                  {!loading && <ArrowRight className="h-3 w-3" />}
                </button>
              </form>
            </>
          )}
          <button onClick={dismiss} className="text-muted-foreground hover:text-foreground flex-shrink-0" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
