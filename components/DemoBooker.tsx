'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

export function DemoBooker() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/demo/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          preferred_date: preferredDate || undefined,
          preferred_time: preferredTime || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          message: message || undefined,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        fetch('/api/sales/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'demo_requested', plan: 'enterprise' }),
        }).catch(() => {})
      } else {
        setError('Could not book demo. Please try again or email Z@authichain.com.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="protocol-card p-8 text-center">
        <CheckCircle className="h-12 w-12 mx-auto mb-4" style={{ color: '#c9a227' }} />
        <h4 className="text-xl font-bold text-white mb-2">Demo Booked!</h4>
        <p className="text-sm text-muted-foreground">
          Check your email for confirmation. We&apos;ll send a calendar invite with a Google Meet link.
        </p>
      </div>
    )
  }

  const inputClass = 'protocol-input w-full px-4 py-3 rounded-lg text-sm'

  return (
    <div className="protocol-card p-7">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
             style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.3)' }}>
          <Calendar className="h-5 w-5" style={{ color: '#c9a227' }} />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">Book a Demo</h4>
          <p className="text-xs text-muted-foreground">30-minute personalized walkthrough</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Full name *"
            value={name}
            onChange={e => setName(e.target.value)}
            className={inputClass}
          />
          <input
            type="email"
            required
            placeholder="Work email *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={preferredDate}
            onChange={e => setPreferredDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={inputClass}
          />
          <select
            value={preferredTime}
            onChange={e => setPreferredTime(e.target.value)}
            className={inputClass}
          >
            <option value="">Preferred time</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
          </select>
        </div>
        <textarea
          placeholder="Anything you'd like us to cover? (optional)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={2}
          className={`${inputClass} resize-none`}
        />

        {error && (
          <p className="text-sm px-3 py-2 rounded-lg"
             style={{ background: 'rgba(255,68,68,0.08)', color: '#ff9999', border: '1px solid rgba(255,68,68,0.2)' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</>
          ) : (
            <>Book Demo <ArrowRight className="h-4 w-4" /></>
          )}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Or email us directly at{' '}
          <a href="mailto:Z@authichain.com" style={{ color: '#c9a227' }}>Z@authichain.com</a>
        </p>
      </form>
    </div>
  )
}
