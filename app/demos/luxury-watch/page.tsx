'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    id: 'register',
    label: 'Register Product',
    icon: '📝',
    title: 'Brand registers the watch',
    description: 'The luxury brand enters product details into AuthiChain. Every field is hashed and anchored to the blockchain.',
  },
  {
    id: 'seal',
    label: 'TrueMark™ Seal',
    icon: '🔐',
    title: 'TrueMark™ NFC seal generated',
    description: 'An NFC + QR dual-mode seal is created with a unique QRON identifier. The blockchain record is immutable from this point.',
  },
  {
    id: 'ship',
    label: 'Supply Chain',
    icon: '🚢',
    title: 'Supply chain events recorded',
    description: 'Each handoff — from manufacturer to distributor to boutique — creates a signed blockchain event.',
  },
  {
    id: 'scan',
    label: 'Customer Scans',
    icon: '📱',
    title: 'Customer scans the NFC seal',
    description: 'The buyer taps the embedded NFC chip or scans the QR. Verification is instant — no app required.',
  },
  {
    id: 'verify',
    label: 'Verified',
    icon: '✅',
    title: 'Full provenance confirmed',
    description: 'The watch is verified authentic with a complete provenance trail — manufacture to current owner.',
  },
]

const WATCH = {
  brand: 'Audemars Piguet',
  model: 'Royal Oak 15500ST',
  serial: 'AP-RO-2024-77391',
  movement: 'Calibre 4302',
  material: 'Stainless Steel / Blue Dial',
  manufacturedAt: 'Le Brassus, Switzerland',
  manufacturedDate: '14 Jan 2026',
  retailPrice: 'CHF 26,900',
  qronId: 'QRON-AP77391-7X',
  blockchainTx: '0x4a9f2c8d1e3b5f7a9c2e4d6f8a0b2c4d',
}

const SUPPLY_CHAIN_EVENTS = [
  { node: 'Manufacture', location: 'Le Brassus, Switzerland', date: '14 Jan 2026', actor: 'AP Manufacture SA', status: 'confirmed' },
  { node: 'Quality Control', location: 'Geneva, Switzerland', date: '21 Jan 2026', actor: 'AP QC Division', status: 'confirmed' },
  { node: 'Distribution', location: 'Dubai Logistics Hub', date: '02 Feb 2026', actor: 'Swiss Prestige Logistics', status: 'confirmed' },
  { node: 'Boutique Receipt', location: 'Dubai Mall Boutique', date: '07 Feb 2026', actor: 'AP Dubai Boutique', status: 'confirmed' },
  { node: 'Point of Sale', location: 'Dubai Mall', date: '20 Mar 2026', actor: 'Customer Handoff', status: 'current' },
]

function StepIndicator({ step, current }: { step: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 md:gap-2">
          <button
            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
              i < current ? 'bg-emerald-500 text-black' :
              i === current ? 'bg-amber-400 text-black ring-4 ring-amber-400/30' :
              'bg-white/10 text-white/40'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </button>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 md:w-12 rounded-full transition-all ${i < current ? 'bg-emerald-500' : 'bg-white/10'}`} />
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white/60 uppercase tracking-wide text-xs mb-4">Product Details</h3>
          {[
            ['Brand', WATCH.brand],
            ['Model', WATCH.model],
            ['Serial Number', WATCH.serial],
            ['Movement', WATCH.movement],
            ['Material', WATCH.material],
            ['Manufactured', WATCH.manufacturedAt],
            ['Date', WATCH.manufacturedDate],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/5">
              <span className="text-gray-400 text-sm">{label}</span>
              <span className="text-white text-sm font-medium font-mono">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Blockchain Record Preview</p>
            <div className="font-mono text-xs text-emerald-300 space-y-1 break-all">
              <p><span className="text-gray-500">product:</span> &quot;{WATCH.serial}&quot;</p>
              <p><span className="text-gray-500">brand:</span> &quot;{WATCH.brand}&quot;</p>
              <p><span className="text-gray-500">model:</span> &quot;{WATCH.model}&quot;</p>
              <p><span className="text-gray-500">timestamp:</span> 1742335200</p>
              <p><span className="text-gray-500">hash:</span> &quot;{WATCH.blockchainTx.slice(0, 22)}…&quot;</p>
            </div>
          </div>
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5">
            <p className="text-amber-400 text-sm font-semibold mb-1">Why blockchain?</p>
            <p className="text-gray-400 text-xs">Once registered, the record is immutable. Even AuthiChain cannot alter it — the watch&apos;s provenance is permanently sealed.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SealStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">TrueMark™ Seal Generated</p>
            <div className="flex items-center justify-center mb-5">
              {/* Stylized QR code placeholder */}
              <div className="relative w-32 h-32 bg-white rounded-xl p-2 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-gray-900 rounded-lg grid grid-cols-7 gap-px p-1">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        [0,1,2,3,4,5,7,14,21,28,35,42,44,45,46,47,48,6,13,20,27,34,41,8,15,22,29,36,43,10,11,12,16,23,30,37].includes(i)
                          ? 'bg-gray-900' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold text-black shadow">
                  ✓
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">QRON ID</span>
                <span className="font-mono text-amber-300">{WATCH.qronId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Modes</span>
                <span className="text-white">NFC + QR Code</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Blockchain TX</span>
                <span className="font-mono text-emerald-300 text-xs">{WATCH.blockchainTx.slice(0, 18)}…</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: '📡', title: 'NFC Chip Embedded', body: 'A tamper-evident NFC chip is bonded to the case back. Removing it breaks the seal and flags the blockchain record.' },
            { icon: '📸', title: 'QR Backup Mode', body: 'If NFC is unavailable, the QR code on the inner box lid provides identical verification — same QRON identifier.' },
            { icon: '🔒', title: 'Immutable Record', body: 'The QRON ID is now permanently associated with this serial number. It cannot be duplicated or transferred without cryptographic proof.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-sm text-white mb-1">{item.title}</p>
                  <p className="text-gray-400 text-xs">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ShipStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-3">
        <p className="text-gray-400 text-sm mb-6">Every custody transfer is recorded on-chain. Each actor signs with their AuthiChain key — creating a tamper-proof audit trail.</p>
        {SUPPLY_CHAIN_EVENTS.map((event, i) => (
          <motion.div
            key={event.node}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
            className={`rounded-xl border p-4 flex items-center gap-4 ${
              event.status === 'current'
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              event.status === 'current' ? 'bg-amber-400 text-black' : 'bg-emerald-500 text-black'
            }`}>
              {event.status === 'current' ? i + 1 : '✓'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm text-white">{event.node}</p>
                <span className={`text-xs font-mono shrink-0 ${event.status === 'current' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {event.date}
                </span>
              </div>
              <p className="text-gray-400 text-xs truncate">{event.actor} · {event.location}</p>
            </div>
            {event.status !== 'current' && (
              <span className="shrink-0 text-emerald-400 text-xs font-semibold">Signed</span>
            )}
          </motion.div>
        ))}
        <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-sm font-semibold text-white">5 custody events · 67 days tracked</p>
            <p className="text-xs text-gray-400">All signatories verified · No anomalies detected</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ScanStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Animated phone */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-52 h-96 bg-gray-900 rounded-[2.5rem] border-4 border-gray-700 shadow-2xl overflow-hidden flex flex-col">
              <div className="h-6 flex items-center justify-center">
                <div className="w-16 h-1.5 bg-gray-700 rounded-full" />
              </div>
              <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 gap-3">
                <motion.div
                  animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-28 h-28 rounded-xl border-4 border-amber-400 flex items-center justify-center bg-black/40"
                >
                  <span className="text-4xl">⌚</span>
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  className="text-xs text-amber-300 font-mono"
                >
                  Scanning NFC…
                </motion.div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Hold near watch</p>
                  <p className="text-xs text-gray-400">case back</p>
                </div>
              </div>
              <div className="h-10 flex items-center justify-center pb-2">
                <div className="w-24 h-1 bg-gray-700 rounded-full" />
              </div>
            </div>
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -right-12 top-1/2 -translate-y-1/2 text-4xl"
            >
              📡
            </motion.div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">What the buyer sees</p>
            <p className="text-sm text-gray-300 mb-3">The customer taps their phone to the NFC chip on the watch case back. Within 1 second:</p>
            <ul className="space-y-2">
              {[
                'Product identity confirmed on blockchain',
                'Full provenance trail displayed',
                'Ownership transfer recorded (optional)',
                'Certificate of authenticity downloadable',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5">
            <p className="text-sm font-semibold text-amber-400 mb-1">No app required</p>
            <p className="text-xs text-gray-400">The NFC tap opens a mobile-optimised web page. No download, no account needed for buyers — frictionless for luxury retail.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function VerifyStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-6">
        {/* Verified banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="text-6xl mb-3"
          >
            ✅
          </motion.div>
          <h3 className="text-2xl font-bold text-emerald-400 mb-1">Authentic — Verified on Blockchain</h3>
          <p className="text-gray-300 text-sm">{WATCH.brand} · {WATCH.model} · {WATCH.serial}</p>
        </motion.div>

        {/* Verification details */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'QRON ID', value: WATCH.qronId, color: 'text-amber-300' },
            { label: 'Trust Score', value: '100 / 100', color: 'text-emerald-400' },
            { label: 'Custody Events', value: '5 signed', color: 'text-blue-300' },
            { label: 'Blockchain TX', value: WATCH.blockchainTx.slice(0, 14) + '…', color: 'text-purple-300' },
            { label: 'First Registered', value: WATCH.manufacturedDate, color: 'text-gray-200' },
            { label: 'Retail Value', value: WATCH.retailPrice, color: 'text-gray-200' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className={`font-mono font-semibold text-sm ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Resale value note */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-5 flex items-start gap-4">
          <span className="text-3xl">📈</span>
          <div>
            <p className="font-semibold text-white mb-1">Provenance increases resale value</p>
            <p className="text-gray-400 text-sm">Verified pre-owned Audemars Piguet watches with blockchain provenance sell for 12–18% above market average on secondhand platforms. This TrueMark™ seal travels with the watch forever.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const STEP_COMPONENTS = [RegisterStep, SealStep, ShipStep, ScanStep, VerifyStep]

export default function LuxuryWatchDemo() {
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
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
            ⌚ Luxury Goods
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Luxury Watch Authentication Demo</h1>
          <p className="text-gray-400">Follow the complete journey of an Audemars Piguet Royal Oak — from manufacture to customer.</p>
        </div>

        {/* Step indicator */}
        <StepIndicator step={STEPS.length} current={step} />

        {/* Step header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{STEPS[step].icon}</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Step {step + 1} of {STEPS.length}</p>
            <h2 className="text-xl font-bold">{STEPS[step].title}</h2>
            <p className="text-gray-400 text-sm">{STEPS[step].description}</p>
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[380px]">
          <AnimatePresence mode="wait">
            {step === 0 && <RegisterStep key="register" />}
            {step === 1 && <SealStep key="seal" />}
            {step === 2 && <ShipStep key="ship" />}
            {step === 3 && <ScanStep key="scan" />}
            {step === 4 && <VerifyStep key="verify" />}
          </AnimatePresence>
        </div>

        {/* Navigation */}
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
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-semibold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/signup">
              <span className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-xl transition text-sm">
                Start protecting your products <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
