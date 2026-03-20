'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 'register', label: 'Register', icon: '✏️', title: 'Designer registers collection item', description: 'The brand enters product details and configures a custom QR art tag with their visual identity.' },
  { id: 'tag', label: 'QR Art Tag', icon: '🎨', title: 'Custom QR art tag generated', description: 'AuthiChain generates a branded QR code — woven into the label or embedded in the hang tag — indistinguishable from the design.' },
  { id: 'purchase', label: 'Purchase', icon: '🛍️', title: 'Customer authenticates at purchase', description: 'The buyer scans the QR at point of sale. Authenticity is confirmed, and ownership is optionally registered to their profile.' },
  { id: 'resale', label: 'Resale', icon: '♻️', title: 'Secondhand market verification', description: 'When the item is resold, the new buyer scans the same tag. The provenance trail updates — increasing resale trust and price.' },
]

const ITEM = {
  brand: 'Bottega Veneta',
  collection: 'SS26 Intrecciato',
  ref: 'BV-INT-26-0041',
  material: 'Nappa Lamb Leather',
  color: 'Fondant',
  madeIn: 'Vicenza, Italy',
  rrp: '€3,450',
  qronId: 'QRON-BV41-9K',
  maison: 'Kering Group',
}

const BRANDS = [
  { name: 'Bottega Veneta', color: 'bg-amber-700', tag: 'BV' },
  { name: 'Gucci', color: 'bg-red-700', tag: 'GC' },
  { name: 'Saint Laurent', color: 'bg-gray-700', tag: 'SL' },
  { name: 'Balenciaga', color: 'bg-black border border-white/20', tag: 'BA' },
]

const OWNERSHIP_HISTORY = [
  { owner: 'Bottega Veneta Boutique', date: '14 Jan 2026', event: 'Original sale — New York, 5th Avenue', type: 'sale' },
  { owner: 'First Owner (private)', date: '14 Jan 2026', event: 'Ownership registered — EU GDPR protected', type: 'register' },
  { owner: 'The RealReal', date: '01 Mar 2026', event: 'Listed for resale — authenticity scan passed', type: 'resale' },
  { owner: 'Second Owner (private)', date: '20 Mar 2026', event: 'Resale purchase — provenance transferred', type: 'transfer', current: true },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 md:gap-2">
          <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
            i < current ? 'bg-rose-500 text-white' :
            i === current ? 'bg-pink-400 text-black ring-4 ring-pink-400/30' :
            'bg-white/10 text-white/40'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 md:w-12 rounded-full transition-all ${i < current ? 'bg-rose-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function RegisterStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Item Registration</p>
          <div className="space-y-3">
            {[
              ['Maison', ITEM.maison],
              ['Brand', ITEM.brand],
              ['Collection', ITEM.collection],
              ['Reference', ITEM.ref],
              ['Material', ITEM.material],
              ['Colour', ITEM.color],
              ['Made In', ITEM.madeIn],
              ['RRP', ITEM.rrp],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-white text-sm font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Multi-Maison Dashboard</p>
            <p className="text-gray-400 text-xs mb-4">Kering manages all four brands from one AuthiChain dashboard. Each Maison gets its own branded QR art and analytics.</p>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <div key={b.name} className={`flex items-center gap-1.5 ${b.color} rounded-lg px-3 py-1.5`}>
                  <span className="text-xs font-bold text-white">{b.tag}</span>
                  <span className="text-xs text-white/70">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">GDPR Configuration</p>
            <div className="space-y-2">
              {['EU data residency (Paris servers)', 'Buyer data anonymised by default', 'Right to erasure supported', 'GDPR Art. 17 compliant'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
                  <CheckCircle className="h-3 w-3 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TagStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Tag preview */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-44 h-64 bg-gradient-to-b from-amber-50 to-amber-100 rounded-t-lg rounded-b-sm shadow-xl flex flex-col items-center justify-between p-4 border border-amber-200">
              {/* Brand mark */}
              <div className="text-center">
                <div className="text-amber-900 font-serif font-bold text-lg tracking-widest">BV</div>
                <div className="text-amber-800 text-xs tracking-[0.2em] mt-0.5">BOTTEGA VENETA</div>
              </div>
              {/* QR art area */}
              <div className="w-24 h-24 relative">
                <div className="w-full h-full rounded-lg overflow-hidden">
                  <div className="grid grid-cols-7 gap-px w-full h-full bg-amber-200 p-1">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${
                        [0,1,2,3,4,5,6,7,13,14,21,27,28,29,30,31,32,33,34,35,41,42,43,44,45,46,47,48].includes(i)
                          ? 'bg-amber-900' : 'bg-amber-100'
                      }`} />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold text-xs">BV</div>
                </div>
              </div>
              {/* Ref */}
              <div className="text-center">
                <div className="text-amber-800 text-xs font-mono">{ITEM.ref}</div>
                <div className="text-amber-600 text-xs mt-0.5">Scan to Authenticate</div>
              </div>
            </div>
            <div className="w-44 h-4 bg-amber-200 rounded-b-sm" />
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-2xl">✨</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Tag Features</p>
            {[
              { icon: '🎨', title: 'Brand-native design', body: 'QR pattern is styled with brand colours and logo — indistinguishable from standard hang tags.' },
              { icon: '🔗', title: 'QRON ID embedded', body: `Unique identifier ${ITEM.qronId} is encoded — same QR, forever linked to this specific item.` },
              { icon: '📱', title: 'No app needed', body: 'Scans with any camera app. Opens a mobile web page instantly — works for buyers and resellers alike.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PurchaseStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="font-bold text-emerald-400">Authentic — Verified</p>
                <p className="text-xs text-gray-400">{ITEM.brand} · {ITEM.collection}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Reference', ITEM.ref],
                ['Material', ITEM.material],
                ['Made In', ITEM.madeIn],
                ['QRON ID', ITEM.qronId],
                ['Trust Score', '100 / 100'],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-mono text-white text-xs">{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4">
            <p className="text-sm font-semibold text-rose-300 mb-1">Optional: register ownership</p>
            <p className="text-xs text-gray-400">The buyer can optionally register ownership — enabling future resale proof. Their identity is hashed and GDPR-protected.</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">At point of sale, the buyer scans the tag before leaving the boutique. The SA can also do it on their behalf.</p>
          {[
            { stat: '< 1 second', label: 'Verification speed' },
            { stat: 'No app', label: 'Required to scan' },
            { stat: '100%', label: 'Authenticity confidence' },
            { stat: '€3,450', label: 'Protected investment' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-4 py-3">
              <span className="text-gray-400 text-sm">{item.label}</span>
              <span className="font-bold text-white">{item.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ResaleStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-5">
        <p className="text-gray-400 text-sm">The same QR tag that shipped with the bag now travels its entire ownership history — making authenticated resale trivially easy.</p>

        <div className="space-y-3">
          {OWNERSHIP_HISTORY.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-4 flex items-center gap-4 ${
                event.current ? 'border-pink-500/40 bg-pink-500/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                event.current ? 'bg-pink-400 text-black' : 'bg-rose-500 text-white'
              }`}>
                {event.current ? i + 1 : '✓'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-white">{event.owner}</p>
                  <span className="text-xs text-gray-500 font-mono shrink-0">{event.date}</span>
                </div>
                <p className="text-xs text-gray-400">{event.event}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Resale Value Impact</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Without provenance</span>
                <span className="text-white font-semibold">~€2,100</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">With AuthiChain record</span>
                <span className="text-emerald-400 font-bold">~€2,800 (+33%)</span>
              </div>
              <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Resale Platforms</p>
            <div className="flex flex-wrap gap-2">
              {['The RealReal', 'Vestiaire', 'Chrono24', 'StockX', 'Vinted'].map((p) => (
                <span key={p} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">AuthiChain is integrated with leading resale platforms — buyers can verify before purchase.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FashionDemo() {
  const [step, setStep] = useState(0)

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/demos" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> All demos
        </Link>
        <Link href="/" className="flex items-center gap-2 text-base font-bold">
          <Shield className="h-5 w-5 text-emerald-400" />
          AuthiChain
        </Link>
        <Link href="/signup">
          <span className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition">
            Get Started
          </span>
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-3 py-1 text-rose-400 text-xs font-semibold uppercase tracking-widest mb-4">
            👜 Fashion &amp; Luxury
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Multi-Brand Fashion Authentication Demo</h1>
          <p className="text-gray-400">White-label QR art for luxury fashion — from boutique sale to verified resale.</p>
        </div>

        <StepIndicator current={step} />

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{STEPS[step].icon}</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Step {step + 1} of {STEPS.length}</p>
            <h2 className="text-xl font-bold">{STEPS[step].title}</h2>
            <p className="text-gray-400 text-sm">{STEPS[step].description}</p>
          </div>
        </div>

        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            {step === 0 && <RegisterStep key="s0" />}
            {step === 1 && <TagStep key="s1" />}
            {step === 2 && <PurchaseStep key="s2" />}
            {step === 3 && <ResaleStep key="s3" />}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-10">
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-400 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/enterprise">
              <span className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-xl transition text-sm">
                Request a fashion demo <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
