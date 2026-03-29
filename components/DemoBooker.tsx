'use client'

import { useState } from 'react'
import { Calendar, CheckCircle, ArrowRight } from 'lucide-react'

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
        // Track the demo request
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
      <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6 text-center">
        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
        <h4 className="text-lg font-bold mb-1">Demo Booked!</h4>
        <p className="text-sm text-muted-foreground">
          Check your email for confirmation. We&apos;ll send a calendar invite with a Google Meet link.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-purple-500" />
        <h4 className="text-lg font-bold">Book a Demo</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        See AuthiChain in action. 30-minute personalized demo with our team.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          required
          placeholder="Full name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          required
          placeholder="Work email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={preferredDate}
            onChange={e => setPreferredDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={preferredTime}
            onChange={e => setPreferredTime(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Booking...' : 'Book Demo'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}
