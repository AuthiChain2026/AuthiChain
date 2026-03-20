'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield } from 'lucide-react'

const CASE_STUDIES = [
  {
    sector: 'Luxury Watches',
    headline: 'NFC + blockchain seal for mechanical timepieces',
    detail: 'Every watch ships with an AuthiChain-issued TrueMark™ NFC seal. Resellers and buyers verify provenance in seconds. Counterfeit incidents reduced to zero within 90 days of deployment.',
    metrics: ['50,000 seals/mo', 'NFC + QR dual-mode', 'Full supply chain trail'],
  },
  {
    sector: 'Fashion & Luxury Goods',
    headline: 'Multi-Maison authentication across 10 brands',
    detail: 'Centralised AuthiChain dashboard manages authentication across 10 separate fashion houses. Custom QR branding per Maison, shared analytics, GDPR-compliant data residency.',
    metrics: ['10 sub-brands', 'White-label QR art', 'EU data residency'],
  },
  {
    sector: 'Pharmaceutical',
    headline: 'DSCSA-compliant serialisation for pharmaceutical distributors',
    detail: 'AuthiChain integrates with existing ERP to generate blockchain-anchored product identifiers at line speed. Audit trail satisfies DSCSA, FDA 21 CFR Part 11, and EU FMD requirements.',
    metrics: ['DSCSA / EU FMD', 'ERP integration', '100K+ units/day'],
  },
]

const TIERS = [
  { label: 'Growth', price: '$499/mo', units: 'Up to 5,000 seals/mo', features: ['Analytics dashboard', 'Priority support', 'API access'] },
  { label: 'Scale',  price: '$999/mo', units: 'Up to 15,000 seals/mo', features: ['Everything in Growth', 'Dedicated onboarding', 'Advanced analytics'] },
  { label: 'Enterprise', price: 'Custom', units: 'Up to 50,000+ seals/mo', features: ['Everything in Scale', 'SLA guarantee', 'White-label option', 'DSCSA / compliance reports', 'Multi-brand management'] },
]

export default function EnterprisePage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', monthly_units: '', product_interest: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/enterprise/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-6 w-6 text-emerald-400" />
          AuthiChain
        </Link>
        <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition">← Pricing</Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1 text-emerald-400 text-sm font-medium mb-6">
          Enterprise Sales
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Blockchain authentication<br />
          <span className="text-emerald-400">at enterprise scale.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Purpose-built for luxury goods, pharmaceutical supply chains, and global brands
          that cannot afford a counterfeit incident. DSCSA-compliant, NFC-ready, SLA-backed.
        </p>
      </section>

      {/* Social proof — sectors */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {CASE_STUDIES.map((cs) => (
          <div key={cs.sector} className="rounded-2xl border border-white/10 bg-white/5 p-7">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">{cs.sector}</div>
            <h3 className="font-semibold text-white mb-3 leading-snug">{cs.headline}</h3>
            <p className="text-sm text-gray-400 mb-4">{cs.detail}</p>
            <div className="flex flex-wrap gap-2">
              {cs.metrics.map((m) => (
                <span key={m} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Pricing tiers */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Enterprise Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <div key={tier.label} className={`rounded-2xl border p-7 flex flex-col ${i === 2 ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/5'}`}>
              {i === 2 && <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-3">Most Flexible</div>}
              <h3 className="text-xl font-bold mb-1">{tier.label}</h3>
              <div className="text-3xl font-bold mb-1">{tier.price}</div>
              <p className="text-sm text-gray-400 mb-4">{tier.units}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-2.5 rounded-xl font-semibold text-sm transition text-center bg-white/10 hover:bg-white/20"
              >
                Request a Demo
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact form */}
      <section id="contact-form" className="max-w-2xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-2">Talk to Sales</h2>
          <p className="text-gray-400 text-sm mb-6">We respond within 24 hours. For urgent inquiries call or WhatsApp.</p>

          {status === 'done' ? (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
              <p className="text-emerald-400 font-semibold text-lg mb-1">Message received.</p>
              <p className="text-gray-400 text-sm">Our enterprise team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Work email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    placeholder="jane@brand.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Company *</label>
                  <input
                    required
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    placeholder="LVMH, Rolex, Pfizer…"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your role</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    placeholder="VP Supply Chain, CTO…"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Monthly product units</label>
                  <select
                    value={form.monthly_units}
                    onChange={(e) => setForm((f) => ({ ...f, monthly_units: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select range</option>
                    <option value="<1000">&lt; 1,000 / mo</option>
                    <option value="1k-5k">1,000 – 5,000 / mo</option>
                    <option value="5k-50k">5,000 – 50,000 / mo</option>
                    <option value="50k+">50,000+ / mo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary interest</label>
                  <select
                    value={form.product_interest}
                    onChange={(e) => setForm((f) => ({ ...f, product_interest: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select</option>
                    <option value="luxury_auth">Luxury Authentication</option>
                    <option value="pharma_dscsa">Pharma / DSCSA</option>
                    <option value="supply_chain">Supply Chain Tracking</option>
                    <option value="qron_art">QRON Art QR</option>
                    <option value="white_label">White-Label Platform</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Message</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Tell us about your use case, timeline, or specific requirements…"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm">Something went wrong — please try again or email us directly.</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Request Enterprise Demo'}
              </button>
              <p className="text-xs text-gray-600 text-center">
                We respond within 24 hours. Your data is never sold.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
