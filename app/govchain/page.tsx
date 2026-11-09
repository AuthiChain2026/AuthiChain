/**
 * GovChain — Government Contract & Grant Tracking
 * Domain: govchain.us (rewritten from / via middleware)
 * AuthiChain blockchain verification for SBIR, MEDC, DoD contracts.
 * Seed-to-award immutable ledger. Real-time compliance & fraud prevention.
 */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GovChain — Government Contract & Grant Tracking on Blockchain',
  description:
    'Blockchain-verified government grants, SBIR, MEDC, DoD contracts. Immutable award ledger, real-time compliance, and fraud prevention powered by AuthiChain.',
  openGraph: {
    title: 'GovChain',
    description: 'Immutable blockchain tracking for US government contracts and grants.',
    url: 'https://govchain.us',
    siteName: 'GovChain',
    locale: 'en_US',
    type: 'website',
  },
}

type Feature = { icon: string; t: string; d: string }

const feats: Feature[] = [
  { icon: '\u{1F4DC}', t: 'Award Verification', d: 'Every grant and contract award anchored on-chain with tamper-proof hash. Instant SAM.gov cross-reference.' },
  { icon: '\u{1F4B0}', t: 'Funding Flow Ledger', d: 'Track disbursements milestone-by-milestone. SBIR Phase I/II/III, MEDC, DoD STTR — all auditable in real time.' },
  { icon: '\u{1F50D}', t: 'Contractor Verification', d: 'QR-scan any contract document to authenticate in 2.1 seconds. Eliminates fraudulent award claims instantly.' },
  { icon: '\u{1F6E1}\uFE0F', t: 'Compliance Automation', d: 'FAR/DFARS clause monitoring. Auto-flag non-compliance before audits. Built for DCAA and IG requirements.' },
  { icon: '\u{1F310}', t: 'Multi-Agency Support', d: 'DoD, SBA, MEDC, HHS, NSF — one dashboard. Cross-agency deduplication and conflict-of-interest detection.' },
  { icon: '\u{1F916}', t: 'AI Grant Matching', d: 'Autonomous agent scans Grants.gov daily. Match score, deadline alerts, and one-click application packaging.' },
]

type StatCard = { value: string; label: string }

const stats: StatCard[] = [
  { value: '$2.4T', label: 'Federal contracts tracked annually' },
  { value: '2.1s', label: 'Blockchain verification time' },
  { value: '99.97%', label: 'Audit accuracy rate' },
  { value: '40+', label: 'Agencies supported' },
]

export default function GovChainPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          Live on AuthiChain Blockchain
        </div>
        <h1 className="mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-6xl font-black tracking-tight text-transparent md:text-7xl">
          GovChain
        </h1>
        <p className="mx-auto mb-4 max-w-2xl text-xl text-slate-300 md:text-2xl">
          Immutable blockchain tracking for US government grants,
          SBIR, MEDC &amp; DoD contracts.
        </p>
        <p className="mx-auto mb-10 max-w-xl text-base text-slate-400">
          Verify compliance, track funding flows, and prevent fraud —
          every award anchored on-chain in 2.1 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/grants"
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
          >
            Browse Grants
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-8 py-3 font-semibold text-blue-300 transition hover:border-blue-400 hover:bg-blue-500/20"
          >
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 pb-16 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center"
          >
            <p className="mb-1 text-3xl font-black text-blue-300">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">
          Everything government compliance needs
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feats.map((f) => (
            <div
              key={f.t}
              className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur transition hover:border-blue-500/40 hover:bg-slate-800/60"
            >
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-white">{f.t}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-slate-800 bg-slate-900/60 px-4 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to verify your award?</h2>
        <p className="mx-auto mb-8 max-w-lg text-slate-400">
          Join contractors, agencies, and compliance officers already using
          GovChain to secure federal award integrity.
        </p>
        <Link
          href="/sign-up"
          className="inline-block rounded-xl bg-blue-600 px-10 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500"
        >
          Get Started Free
        </Link>
      </section>
    </main>
  )
}
