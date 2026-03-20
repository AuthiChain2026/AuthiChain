'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const FEATURES = {
  free: [
    '1 concurrent browser session',
    'All 100+ browser commands',
    'Chromium, Firefox, WebKit',
    'Mobile device emulation',
    'Community support',
  ],
  pro: [
    'Unlimited concurrent sessions',
    'All free features',
    'Session recording export',
    'Cloud relay access',
    'Priority support',
    'License key via Telegram or email',
  ],
}

export default function AgentBrowserPage() {
  const searchParams = useSearchParams()
  const [banner, setBanner] = useState<'success' | 'cancelled' | null>(null)

  useEffect(() => {
    const checkout = searchParams.get('checkout')
    if (checkout === 'success') setBanner('success')
    else if (checkout === 'cancelled') setBanner('cancelled')
  }, [searchParams])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Banner */}
      {banner === 'success' && (
        <div className="bg-emerald-600 text-white text-center py-3 px-4 text-sm font-medium">
          🎉 Subscription active! Check your email (or Telegram if connected) for your license key.
        </div>
      )}
      {banner === 'cancelled' && (
        <div className="bg-zinc-800 text-gray-300 text-center py-3 px-4 text-sm">
          Checkout cancelled — no charge made.
        </div>
      )}

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-zinc-800 border border-zinc-700 rounded-full px-4 py-1 text-zinc-400 text-sm font-mono mb-6">
          npm install -g agent-browser
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          Headless browser automation<br />
          <span className="text-emerald-400">built for AI agents.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          100+ browser commands. Rust-native CLI. Playwright-powered. Works with Claude, GPT-4, and any agent framework.
          Free forever — Pro unlocks unlimited concurrent sessions.
        </p>
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 text-emerald-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          14-day free trial — no credit card required
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-4xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
          <h2 className="text-2xl font-bold mb-1">Free</h2>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-400 mb-1">/forever</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">Open source. Apache 2.0. No account needed.</p>
          <ul className="space-y-3 mb-8 flex-1">
            {FEATURES.free.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-400 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/Z-kie/agent-browser"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white text-center block transition"
          >
            View on GitHub
          </a>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 p-8 flex flex-col">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">Most Popular</div>
          <h2 className="text-2xl font-bold mb-1">Pro</h2>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-4xl font-bold">$49</span>
            <span className="text-gray-400 mb-1">/mo</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">For teams running AI agents at scale.</p>
          <ul className="space-y-3 mb-8 flex-1">
            {FEATURES.pro.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-emerald-400 mt-0.5">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <form action="/api/agent-browser-checkout" method="POST">
            <input type="hidden" name="tier" value="pro" />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition"
            >
              Start Free Trial
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-3">
            License key delivered via Telegram or email
          </p>
        </div>
      </section>

      {/* Connect Telegram CTA */}
      <section className="border-t border-white/10 py-12 px-6 text-center">
        <p className="text-gray-400 text-sm mb-3">
          Get your license key instantly via Telegram after checkout
        </p>
        <a
          href="https://t.me/AuthiChainBot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#2AABEE]/10 border border-[#2AABEE]/30 rounded-full px-5 py-2 text-[#2AABEE] text-sm font-medium hover:bg-[#2AABEE]/20 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Connect @AuthiChainBot — then /connect your@email.com
        </a>
      </section>
    </main>
  )
}
