'use client'

import Link from 'next/link'
import { Shield, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { DemoBooker } from '@/components/DemoBooker'

const USE_CASES = [
  {
    href: '/demos/luxury-watch',
    icon: '⌚',
    sector: 'Luxury Goods',
    headline: 'Luxury Watch Authentication',
    tagline: 'End-to-end provenance from manufacture to resale',
    stats: ['NFC + QR dual-mode', 'Blockchain-anchored', 'Instant resale value'],
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/pharma',
    icon: '💊',
    sector: 'Pharmaceutical',
    headline: 'DSCSA Pharma Serialisation',
    tagline: 'FDA-compliant drug traceability from line to pharmacy',
    stats: ['DSCSA compliant', 'FDA 21 CFR Part 11', 'Full audit trail'],
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/fashion',
    icon: '👜',
    sector: 'Fashion & Luxury',
    headline: 'Multi-Brand Fashion Authentication',
    tagline: 'QR art tags for luxury fashion — resale proof included',
    stats: ['White-label QR art', 'Secondhand market', 'Multi-Maison support'],
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/supply-chain',
    icon: '🚢',
    sector: 'Supply Chain',
    headline: 'Global Supply Chain Tracking',
    tagline: 'Live handoff verification across the entire logistics chain',
    stats: ['Real-time handoffs', 'GPS + blockchain', 'Tamper detection'],
    time: '~2 min walkthrough',
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen protocol-bg text-white">

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="border-b border-[rgba(201,162,39,0.15)] sticky top-0 z-50 backdrop-blur-md bg-background/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227] to-[#A07D10] flex items-center justify-center glow-gold-sm">
            <Shield className="h-4 w-4 text-black" />
          </div>
          <span className="text-xl font-bold gradient-text">AuthiChain</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-sm text-muted-foreground hover:text-[#e8c547] transition-colors">
            AI AutoFlow™
          </Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-[#e8c547] transition-colors">
            Pricing
          </Link>
          <Link href="/signup" className="btn-gold px-5 py-2 rounded-lg text-sm font-bold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-14 text-center">
        <div className="protocol-badge mb-6 inline-flex">
          <Sparkles className="h-3.5 w-3.5" />
          Interactive Use Case Demos
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-5">
          See AuthiChain in action
          <br />
          <span className="gradient-text">for your industry.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
          Step-by-step interactive walkthroughs showing exactly how blockchain authentication
          works for luxury goods, pharma, fashion, and global supply chains.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/demo" className="btn-gold px-8 py-3 rounded-xl inline-flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4" />
            Try AI AutoFlow™ Live
          </Link>
          <a href="#use-cases" className="btn-outline-gold px-8 py-3 rounded-xl inline-flex items-center gap-2">
            Browse Use Cases
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs">
          {[
            'No login required',
            'Live blockchain writes',
            'Real AI classification',
            'QRON QR verification',
          ].map(text => (
            <span key={text} className="flex items-center gap-1.5" style={{ color: '#9e9e9e' }}>
              <CheckCircle className="h-3.5 w-3.5" style={{ color: '#c9a227' }} />
              {text}
            </span>
          ))}
        </div>
      </section>

      <div className="gold-divider max-w-5xl mx-auto px-6" />

      {/* ── Use case cards ──────────────────────────────────────────────── */}
      <section id="use-cases" className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {USE_CASES.map((uc) => (
          <Link key={uc.href} href={uc.href} className="group block">
            <div className="protocol-card p-7 h-full flex flex-col gap-4 transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{uc.icon}</div>
                <span className="protocol-badge text-xs">{uc.sector}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{uc.headline}</h2>
                <p className="text-sm text-muted-foreground">{uc.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {uc.stats.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', color: '#c9a227' }}>
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">{uc.time}</span>
                <span className="flex items-center gap-1 text-sm font-semibold gradient-text group-hover:gap-2 transition-all">
                  Start demo <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ── AI AutoFlow CTA ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="protocol-card p-8 text-center"
             style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(10,8,0,0.95) 100%)' }}>
          <div className="text-5xl mb-4">🤖</div>
          <div className="protocol-badge mb-4 inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            AI AutoFlow™ — Live Demo
          </div>
          <h2 className="text-2xl font-bold mb-3">
            <span className="gradient-text">Any Product. Any Industry.</span>
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Upload any product image and watch our AI instantly classify it across 10 industries,
            generate an authentication workflow, and write a provenance story — in under 3 seconds.
          </p>
          <Link href="/demo" className="btn-gold px-8 py-3 rounded-xl inline-flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4" />
            Try AI AutoFlow™ Live →
          </Link>
        </div>
      </section>

      <div className="gold-divider max-w-5xl mx-auto px-6 mb-16" />

      {/* ── Book a Demo ─────────────────────────────────────────────────── */}
      <section id="book-demo" className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="protocol-badge mb-4 inline-flex">Enterprise</div>
          <h2 className="text-3xl font-bold mb-3">
            Want a <span className="gradient-text">Guided Demo</span>?
          </h2>
          <p className="text-muted-foreground">
            Schedule a 30-minute live walkthrough with our team — tailored to your industry and stack.
          </p>
        </div>
        <DemoBooker />
      </section>

    </div>
  )
}
