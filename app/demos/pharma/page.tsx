'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ArrowRight, ArrowLeft, CheckCircle, ChevronRight } from 'lucide-react'

const STEPS = [
  { id: 'serialize', label: 'Serialise', icon: '🏭', title: 'Product serialised at line speed', description: 'Each bottle receives a unique GS1-compliant SNDC — serialised product identifier anchored to the blockchain.' },
  { id: 'transfer', label: 'Transfer', icon: '🚚', title: 'DSCSA supply chain transfer', description: 'Every custody handoff — manufacturer to 3PL to distributor — generates a signed Transaction Statement that satisfies DSCSA §582.' },
  { id: 'dispense', label: 'Dispense', icon: '💊', title: 'Pharmacy verification at point of dispense', description: 'The pharmacist scans the package. AuthiChain confirms the serial number, lot, expiry, and full pedigree in under 500ms.' },
  { id: 'audit', label: 'Audit Trail', icon: '📋', title: 'Instant DSCSA compliance report', description: 'A full audit trail is generated on demand — transaction history, EPCIS events, and FDA-ready export. No manual reconciliation.' },
]

const PRODUCT = {
  name: 'Lisinopril 10mg Tablets',
  ndc: '0143-1444-01',
  serial: 'SN-2026031400042',
  lot: 'LOT-240814',
  expiry: '2028-03',
  manufacturer: 'Accord BioPharma Inc.',
  gtin: '00843-1444-01003',
  qronId: 'QRON-PHARMA-42891',
}

const SUPPLY_CHAIN = [
  { actor: 'Accord BioPharma Inc.', role: 'Manufacturer', location: 'Durham, NC', date: '14 Mar 2026', type: 'T1', action: 'Lot released — serialisation complete', verified: true },
  { actor: 'Cardinal Health 3PL', role: '3PL Warehouse', location: 'Columbus, OH', date: '17 Mar 2026', type: 'T2', action: 'Received & verified 12,000 units', verified: true },
  { actor: 'AmerisourceBergen', role: 'Distributor', location: 'Conshohocken, PA', date: '20 Mar 2026', type: 'T3', action: 'Shipped to retail pharmacy network', verified: true },
  { actor: 'CVS Pharmacy #7214', role: 'Dispenser', location: 'Boston, MA', date: '20 Mar 2026', type: 'T4', action: 'Received · Verified · Awaiting dispense', verified: false, current: true },
]

const COMPLIANCE_FLAGS = [
  { label: 'DSCSA §582', status: 'pass', note: 'All transaction statements present' },
  { label: 'FDA 21 CFR Part 11', status: 'pass', note: 'Electronic records, audit trail intact' },
  { label: 'EU FMD', status: 'pass', note: 'EMVO endpoint verified' },
  { label: 'Saleable Returns', status: 'pass', note: 'Chain of custody unbroken — saleable' },
  { label: 'Suspect Product', status: 'pass', note: 'No anomaly flags on this serial' },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1 md:gap-2">
          <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
            i < current ? 'bg-blue-500 text-white' :
            i === current ? 'bg-cyan-400 text-black ring-4 ring-cyan-400/30' :
            'bg-white/10 text-white/40'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 md:w-12 rounded-full transition-all ${i < current ? 'bg-blue-500' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function SerialiseStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Serialisation Record</p>
          {[
            ['Product Name', PRODUCT.name],
            ['NDC', PRODUCT.ndc],
            ['GTIN', PRODUCT.gtin],
            ['Serial Number', PRODUCT.serial],
            ['Lot Number', PRODUCT.lot],
            ['Expiry Date', PRODUCT.expiry],
            ['Manufacturer', PRODUCT.manufacturer],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/5">
              <span className="text-gray-400 text-sm">{label}</span>
              <span className="text-white text-sm font-mono">{val}</span>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-5">
            <p className="text-blue-300 font-semibold text-sm mb-2">GS1 DataMatrix Label</p>
            <div className="bg-white rounded-xl p-4 flex items-center justify-center mb-3">
              <div className="grid grid-cols-10 gap-px w-24 h-24">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className={`${[0,1,10,11,2,20,22,30,33,40,44,50,55,60,66,70,77,80,88,90,91,99,5,15,25,35,45,57,65,75,85,95,3,13,23,43,53,63,73,83,93].includes(i) ? 'bg-gray-900' : 'bg-white'}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">SNDC DataMatrix — contains GTIN + serial + lot + expiry</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest">EPCIS Event</p>
            <pre className="text-xs text-emerald-300 overflow-x-auto">{`{
  "epcList": ["${PRODUCT.gtin}"],
  "serial": "${PRODUCT.serial}",
  "lot": "${PRODUCT.lot}",
  "expiry": "${PRODUCT.expiry}",
  "bizStep": "commissioning",
  "disposition": "active"
}`}</pre>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TransferStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-3">
        <p className="text-gray-400 text-sm mb-4">DSCSA §582 requires a Transaction Statement at every sale. AuthiChain records each transfer on-chain — no manual paperwork.</p>
        {SUPPLY_CHAIN.map((node, i) => (
          <motion.div
            key={node.actor}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-4 flex items-center gap-4 ${
              node.current ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
              node.current ? 'bg-cyan-400 text-black' : 'bg-blue-500 text-white'
            }`}>
              {node.type}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm text-white">{node.actor}</p>
                <span className="text-xs font-mono text-gray-400 shrink-0">{node.date}</span>
              </div>
              <p className="text-xs text-gray-400">{node.role} · {node.location}</p>
              <p className="text-xs text-gray-500 mt-0.5">{node.action}</p>
            </div>
            <span className={`shrink-0 text-xs font-semibold ${node.current ? 'text-cyan-400' : 'text-blue-400'}`}>
              {node.verified ? 'TS Signed' : 'Pending'}
            </span>
          </motion.div>
        ))}
        <div className="mt-2 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm">
          <span className="text-blue-300 font-semibold">DSCSA §582(b)(1):</span>
          <span className="text-gray-400 ml-2">Transaction Statements generated and signed at each T1→T4 transfer. All compliant with 2026 enhanced requirements.</span>
        </div>
      </div>
    </motion.div>
  )
}

function DispenseStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Scan animation */}
        <div className="flex justify-center">
          <div className="relative w-56 h-44 bg-gray-900 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Pharmacy Scanner</p>
            <motion.div
              animate={{ scaleX: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="relative w-36 h-16 bg-white rounded flex items-center justify-center"
            >
              <div className="grid grid-cols-10 gap-px w-20 h-10">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className={`${[0,9,90,99,1,8,91,98,10,19,80,89,11,18,81,88,20,29,70,79].includes(i) ? 'bg-gray-900' : 'bg-white'}`} />
                ))}
              </div>
              <motion.div
                animate={{ top: ['10%', '80%', '10%'] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute left-0 right-0 h-0.5 bg-red-500/80"
                style={{ position: 'absolute' }}
              />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-xs text-cyan-300 font-mono"
            >
              Scanning…
            </motion.p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Verification Result · 420ms</p>
            {[
              ['Serial Number', PRODUCT.serial, 'text-white'],
              ['Status', 'Active — Not Dispensed', 'text-emerald-400'],
              ['Chain of Custody', 'Manufacturer → 3PL → ABS → CVS', 'text-blue-300'],
              ['Suspect Product', 'No flags — Saleable', 'text-emerald-400'],
              ['Expiry', PRODUCT.expiry, 'text-gray-200'],
            ].map(([label, val, color]) => (
              <div key={label} className="flex justify-between items-start gap-2">
                <span className="text-gray-400 text-xs shrink-0">{label}</span>
                <span className={`text-xs font-mono text-right ${color}`}>{val}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <p className="font-semibold text-emerald-400 text-sm">Approved for Dispense</p>
            </div>
            <p className="text-gray-400 text-xs">Pharmacist &amp; Pharmacist Tech authorisation recorded on blockchain at point of dispense.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AuditStep() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <div className="space-y-6">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest">DSCSA Compliance Report</p>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">All Pass</span>
          </div>
          <div className="space-y-3">
            {COMPLIANCE_FLAGS.map((flag, i) => (
              <motion.div
                key={flag.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
              >
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-sm text-white w-40 shrink-0">{flag.label}</span>
                <span className="text-gray-400 text-xs flex-1">{flag.note}</span>
                <span className="text-xs text-emerald-400 font-semibold">PASS</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { label: 'EPCIS Events', value: '6', sub: 'All signed & timestamped' },
            { label: 'Days Tracked', value: '6', sub: 'Manufacturer to dispense' },
            { label: 'Export Format', value: 'FDA XML', sub: 'DSCSA §582 ready' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-center">
              <p className="text-2xl font-bold text-blue-300 mb-1">{item.value}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5 flex items-start gap-3">
          <span className="text-2xl">📤</span>
          <div>
            <p className="font-semibold text-white text-sm mb-1">FDA Inspection Ready</p>
            <p className="text-gray-400 text-xs">In a regulatory inspection, AuthiChain generates a complete DSCSA Transaction History package as a signed FDA XML export — in seconds, not weeks.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function PharmaDemo() {
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
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            💊 Pharmaceutical
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">DSCSA Pharma Serialisation Demo</h1>
          <p className="text-gray-400">Full Drug Supply Chain Security Act compliance — from manufacturer to pharmacy dispense.</p>
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
            {step === 0 && <SerialiseStep key="s0" />}
            {step === 1 && <TransferStep key="s1" />}
            {step === 2 && <DispenseStep key="s2" />}
            {step === 3 && <AuditStep key="s3" />}
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
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-xl transition text-sm"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href="/enterprise">
              <span className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2.5 rounded-xl transition text-sm">
                Talk to our pharma team <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
