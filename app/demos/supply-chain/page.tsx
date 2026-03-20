'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react'

const STEPS = [
  { id: 'origin', label: 'Origin', icon: '🏭', title: 'Product authenticated at origin', description: 'The manufacturer seals the product with a TrueMark™ tag. QRON ID, batch number, and GPS coordinates are recorded on-chain.' },
  { id: 'transit', label: 'In Transit', icon: '🚢', title: 'Live handoff verification in transit', description: 'Every time the cargo changes hands — port, customs, warehouse — the operator scans and signs the transfer event.' },
  { id: 'tamper', label: 'Tamper Alert', icon: '🚨', title: 'Tamper attempt detected & flagged', description: "A rogue distributor attempts to swap the TrueMark seal with a counterfeit. AuthiChain detects the anomaly and raises an alert." },
  { id: 'delivery', label: 'Delivery', icon: '📦', title: 'Verified delivery at destination', description: 'The retailer receives the goods and scans at point of acceptance. Full audit trail is confirmed — no gaps, no substitutions.' },
]

const PRODUCT = {
  name: 'Patagonia Fleece — Batch #WH-2026-0314',
  origin: 'Hanoi, Vietnam',
  batchSize: '12,000 units',
  qronId: 'QRON-SCH-28451',
  destination: 'Seattle Distribution Center, WA',
  shipper: 'Evergreen Marine Corp.',
  forwarder: 'Flexport',
}

const NODES = [
  { id: 'factory', label: 'Factory', flag: '🇻🇳', location: 'Hanoi, Vietnam', actor: 'Patagonia Manufacturer', coords: { x: 82, y: 55 } },
  { id: 'port_vn', label: 'Port of Haiphong', flag: '🇻🇳', location: 'Haiphong, Vietnam', actor: 'VN Port Authority', coords: { x: 76, y: 48 } },
  { id: 'ocean', label: 'Pacific Ocean', flag: '🌊', location: 'At Sea (21 days)', actor: 'Evergreen Marine', coords: { x: 50, y: 42 } },
  { id: 'port_us', label: 'Port of LA', flag: '🇺🇸', location: 'Los Angeles, CA', actor: 'US Customs & CBP', coords: { x: 14, y: 45 } },
  { id: 'dc', label: 'Distribution Center', flag: '🇺🇸', location: 'Seattle, WA', actor: 'Patagonia US DC', coords: { x: 11, y: 30 } },
]

const TRANSIT_EVENTS = [
  { node: 'Hanoi Factory', date: '01 Mar 2026', action: 'Goods sealed & TrueMark tagged', signed: true, signedBy: 'Factory Manager', hash: '0x4a9f…c2e4' },
  { node: 'Port of Haiphong', date: '05 Mar 2026', action: 'Container loaded — Vessel EVER GLOBE', signed: true, signedBy: 'Port Authority', hash: '0x7b3c…d8f1' },
  { node: 'Pacific Ocean (Day 12)', date: '17 Mar 2026', action: 'Satellite position verified — on course', signed: true, signedBy: 'Auto-GPS Oracle', hash: '0x2f8a…9b5c' },
  { node: 'Port of Los Angeles', date: '26 Mar 2026', action: 'Customs cleared — CBP Form 7501 filed', signed: true, signedBy: 'US Customs (CBP)', hash: '0x1d6e…7a2b' },
  { node: 'Seattle DC', date: '28 Mar 2026', action: 'Received — scan-in at dock door 7', signed: false, pending: true, hash: '—' },
]

const ANOMALY = {
  detected: true,
  type: 'Seal substitution attempt',
  location: 'Unauthorized 3PL — Compton, CA',
  description: 'A parallel shipment carrying counterfeit units with cloned QRON IDs was intercepted. The blockchain immediately flagged the duplicate — counterfeit ID rejected.',
  impact: '0 counterfeit units entered supply chain',
  status: 'Contained',
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 md:gap-2">
          <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
            i < current ? 'bg-emerald-500 text-black' :
            i === current ? 'bg-teal-400 text-black ring-4 ring-teal-400/30' :
            'bg-white/10 text-white/40'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 md:w-12 rounded-full transition-all ${i < current ? 'bg-emerald-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function OriginStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Batch Registration</p>
          <div className="space-y-3">
            {[
              ['Product', PRODUCT.name],
              ['Origin', PRODUCT.origin],
              ['Batch Size', PRODUCT.batchSize],
              ['QRON ID', PRODUCT.qronId],
              ['Destination', PRODUCT.destination],
              ['Ocean Carrier', PRODUCT.shipper],
              ['Forwarder', PRODUCT.forwarder],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-white text-sm font-medium text-right max-w-[60%]">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">What &apos;sealed at origin&apos; means</p>
            <ul className="space-y-2">
              {[
                '12,000 individual TrueMark seals applied at factory',
                'Each unit gets a unique QRON — batch level + unit level',
                'Factory GPS coordinates recorded on-chain',
                'Factory manager signs with AuthiChain key',
                'Blockchain record is immutable from this point',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 font-mono text-xs text-emerald-300">
            <p className="text-gray-500 mb-1">Batch anchor TX</p>
            <p className="break-all">0x9a7c3f2e1b4d6a8c0e2f4b6d8a0c2e4f6b8d0a2c4e6f8b0d2a4c6e8f0b2d4a6c</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TransitStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-3">
        <p className="text-gray-400 text-sm mb-4">Every custody transfer — port, vessel, warehouse — is signed and anchored. Gaps in the chain are impossible to hide.</p>
        {TRANSIT_EVENTS.map((event, i) => (
          <motion.div
            key={event.node}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-4 flex items-center gap-4 ${
              event.pending ? 'border-teal-500/40 bg-teal-500/5' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              event.pending ? 'bg-teal-400 text-black' : 'bg-emerald-500 text-black'
            }`}>
              {event.pending ? '⏳' : '✓'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm text-white">{event.node}</p>
                <span className="text-xs font-mono text-gray-400 shrink-0">{event.date}</span>
              </div>
              <p className="text-xs text-gray-400">{event.action}</p>
              {event.signed && (
                <p className="text-xs text-gray-600 mt-0.5">Signed by {event.signedBy} · TX {event.hash}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function TamperStep() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-5">
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl bg-red-500/10 border-2 border-red-500/40 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ repeat: 2, duration: 0.4 }}
                >
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-red-400 text-lg">⚠️ Tamper Alert Triggered</h3>
                  <p className="text-gray-400 text-sm">{ANOMALY.type}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  ['Location', ANOMALY.location],
                  ['Alert Type', ANOMALY.type],
                  ['Impact', ANOMALY.impact],
                  ['Status', ANOMALY.status],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg bg-black/30 p-3">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className={`font-semibold text-sm ${label === 'Status' ? 'text-emerald-400' : label === 'Alert Type' ? 'text-red-300' : 'text-white'}`}>{val}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4">{ANOMALY.description}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Why blockchain stops this</p>
          <div className="space-y-3">
            {[
              { icon: '🔒', point: 'Each QRON ID is a unique cryptographic hash — cloning produces a different hash that doesn\'t match.' },
              { icon: '📡', point: 'The blockchain registry rejects duplicate registrations in real time — the counterfeit batch is flagged at first scan.' },
              { icon: '🚔', point: 'The anomaly is auto-reported to the brand\'s security team with full chain-of-custody evidence for legal action.' },
            ].map((item) => (
              <div key={item.icon} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <p className="text-gray-300 text-sm">{item.point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-400 text-sm">Legitimate shipment continues unaffected</p>
            <p className="text-xs text-gray-400">The real goods carry the original QRON signatures and proceed to delivery without interruption.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DeliveryStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 p-6 text-center"
        >
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-2xl font-bold text-emerald-400 mb-1">Delivery Verified — Chain Intact</h3>
          <p className="text-gray-300 text-sm">{PRODUCT.batchSize} · {PRODUCT.name}</p>
          <p className="text-gray-400 text-xs mt-1">Seattle Distribution Center · 28 Mar 2026</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'Custody Events', value: '8', color: 'text-emerald-400', sub: 'All signed & anchored' },
            { label: 'Days in Transit', value: '27', color: 'text-blue-300', sub: 'Origin → Destination' },
            { label: 'Tamper Attempts', value: '1', color: 'text-red-400', sub: 'Detected & contained' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
              <p className={`text-3xl font-bold mb-1 ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Audit Report Summary</p>
          <div className="space-y-2">
            {[
              ['Full chain of custody', 'Complete — no gaps'],
              ['Tamper events', '1 detected · 0 succeeded'],
              ['Unit count', '12,000 / 12,000 confirmed'],
              ['Compliance', 'CBP, CPSC, ISO 28000'],
              ['Export format', 'EPCIS 2.0 XML ready'],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-gray-400 text-sm">{label}</span>
                <span className="text-emerald-300 text-sm font-medium">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5 flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-white text-sm mb-1">What this means for your brand</p>
            <p className="text-gray-400 text-xs">With AuthiChain, every unit in every shipment carries a tamper-proof identity from factory to shelf. One counterfeit incident can cost a brand €10M+ in recalls and reputational damage. We make that impossible.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SupplyChainDemo() {
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
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
            🚢 Supply Chain
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Global Supply Chain Tracking Demo</h1>
          <p className="text-gray-400">Real-time handoff verification and tamper detection across a 27-day ocean freight journey.</p>
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
            {step === 0 && <OriginStep key="s0" />}
            {step === 1 && <TransitStep key="s1" />}
            {step === 2 && <TamperStep key="s2" />}
            {step === 3 && <DeliveryStep key="s3" />}
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
              className={`flex items-center gap-2 font-semibold px-6 py-2.5 rounded-xl transition text-sm ${
                step === 2 ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-teal-500 hover:bg-teal-400 text-black'
              }`}
            >
              {step === 2 ? 'See resolution' : 'Next'} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/enterprise">
              <span className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-xl transition text-sm">
                Protect your supply chain <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
