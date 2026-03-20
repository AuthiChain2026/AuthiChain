'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, Clock, Pill, Shirt, Truck, Sparkles } from 'lucide-react'

const USE_CASES = [
  {
    href: '/demos/luxury-watch',
    icon: '⌚',
    sector: 'Luxury Goods',
    headline: 'Luxury Watch Authentication',
    tagline: 'End-to-end provenance from manufacture to resale',
    stats: ['NFC + QR dual-mode', 'Blockchain-anchored', 'Instant resale value'],
    color: 'from-amber-500/20 to-yellow-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/pharma',
    icon: '💊',
    sector: 'Pharmaceutical',
    headline: 'DSCSA Pharma Serialisation',
    tagline: 'FDA-compliant drug traceability from line to pharmacy',
    stats: ['DSCSA compliant', 'FDA 21 CFR Part 11', 'Full audit trail'],
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/fashion',
    icon: '👜',
    sector: 'Fashion & Luxury',
    headline: 'Multi-Brand Fashion Authentication',
    tagline: 'QR art tags for luxury fashion — resale proof included',
    stats: ['White-label QR art', 'Secondhand market', 'Multi-Maison support'],
    color: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    time: '~2 min walkthrough',
  },
  {
    href: '/demos/supply-chain',
    icon: '🚢',
    sector: 'Supply Chain',
    headline: 'Global Supply Chain Tracking',
    tagline: 'Live handoff verification across the entire logistics chain',
    stats: ['Real-time handoffs', 'GPS + blockchain', 'Tamper detection'],
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    time: '~2 min walkthrough',
  },
]

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Shield className="h-6 w-6 text-emerald-400" />
          AuthiChain
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/demo" className="text-sm text-gray-400 hover:text-white transition">AI AutoFlow™</Link>
          <Link href="/pricing">
            <span className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition">
              Get Started
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Interactive Use Case Demos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            See AuthiChain in action<br />
            <span className="text-emerald-400">for your industry.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Step-by-step interactive walkthroughs showing exactly how blockchain authentication
            works for luxury goods, pharma, fashion, and global supply chains.
          </p>
        </motion.div>
      </section>

      {/* Use case cards */}
      <section className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {USE_CASES.map((uc, i) => (
          <motion.div
            key={uc.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
          >
            <Link href={uc.href} className="group block">
              <div className={`rounded-2xl border ${uc.border} bg-gradient-to-br ${uc.color} p-7 h-full hover:border-white/30 transition-all duration-300 group-hover:translate-y-[-2px]`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{uc.icon}</div>
                  <span className={`text-xs font-semibold uppercase tracking-widest border rounded-full px-2.5 py-0.5 ${uc.badge}`}>
                    {uc.sector}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{uc.headline}</h2>
                <p className="text-gray-400 text-sm mb-5">{uc.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {uc.stats.map((s) => (
                    <span key={s} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{uc.time}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold text-white group-hover:gap-2 transition-all">
                    Start demo <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* AI AutoFlow CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-8 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">AI AutoFlow™ — Any Product</h2>
          <p className="text-gray-400 text-sm mb-6">
            Upload any product image and watch our AI instantly classify it across 10 industries,
            generate an authentication workflow, and write a provenance story.
          </p>
          <Link href="/demo">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white font-semibold px-6 py-3 rounded-xl transition">
              <Sparkles className="h-4 w-4" />
              Try AI AutoFlow™ Live
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
