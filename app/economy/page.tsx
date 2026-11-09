'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the interactive dashboards without SSR
const AuthenticEconomyBlueprint = dynamic(
  () => import('@/artifacts/authentic-economy-blueprint'),
  { ssr: false, loading: () => <div className="p-8 text-center text-zinc-400">Loading Blueprint...</div> }
);

const GlobalAuthSiphon = dynamic(
  () => import('@/artifacts/authichain-global-siphon'),
  { ssr: false, loading: () => <div className="p-8 text-center text-zinc-400">Loading Revenue Siphon...</div> }
);

const AuthenticEconomyMarketplace = dynamic(
  () => import('@/artifacts/authentic-economy-marketplace'),
  { ssr: false, loading: () => <div className="p-8 text-center text-zinc-400">Loading Marketplace...</div> }
);

export default function EconomyPage() {
  const [activeView, setActiveView] = useState<'blueprint' | 'siphon' | 'marketplace' | 'live-api'>('blueprint');
  const [liveState, setLiveState] = useState<any>(null);
  const [tierCalc, setTierCalc] = useState('gold');
  const [calculatedFee, setCalculatedFee] = useState<any>(null);
  const [loadingApi, setLoadingApi] = useState(false);

  useEffect(() => {
    fetch('/api/economy')
      .then(res => res.json())
      .then(data => setLiveState(data))
      .catch(console.error);
  }, []);

  const handleCalculateTier = async (tier: string) => {
    setTierCalc(tier);
    setLoadingApi(true);
    try {
      const res = await fetch(`/api/economy?calculate=${tier}`);
      const data = await res.json();
      setCalculatedFee(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApi(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030308] text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🌐</span>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              The Authentic Agentic Economy
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Protocol v3.0
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              AuthiChain Protocol &bull; QRON Interface &bull; StrainChain Vertical &bull; AgentZ Autonomous Fleet
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveView('blueprint')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'blueprint'
                ? 'bg-amber-500 text-black shadow-md font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📐 Blueprint
          </button>
          <button
            onClick={() => setActiveView('siphon')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'siphon'
                ? 'bg-emerald-500 text-black shadow-md font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ⚡ 5-Layer Siphon
          </button>
          <button
            onClick={() => setActiveView('marketplace')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'marketplace'
                ? 'bg-cyan-500 text-black shadow-md font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🛍️ Products & NFTs
          </button>
          <button
            onClick={() => setActiveView('live-api')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeView === 'live-api'
                ? 'bg-indigo-500 text-white shadow-md font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📡 Live Protocol Engine
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3 text-xs">
          <Link href="/showcase" className="text-zinc-400 hover:text-cyan-400 transition-colors">
            Showcase
          </Link>
          <span className="text-zinc-700">&bull;</span>
          <Link href="/activity" className="text-zinc-400 hover:text-amber-400 transition-colors">
            Activity Log
          </Link>
          <span className="text-zinc-700">&bull;</span>
          <a
            href="https://polygonscan.com/token/0xAebfA6b08fb25b59748c93273aB8880e20FfE437"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono"
          >
            $QRON Contract &nearr;
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeView === 'blueprint' && (
          <div className="w-full">
            <AuthenticEconomyBlueprint />
          </div>
        )}

        {activeView === 'siphon' && (
          <div className="w-full">
            <GlobalAuthSiphon />
          </div>
        )}

        {activeView === 'marketplace' && (
          <div className="w-full">
            <AuthenticEconomyMarketplace />
          </div>
        )}

        {activeView === 'live-api' && (
          <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Economy State & Token Splitting Engine
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Connected to <code className="text-amber-300">/api/economy</code> endpoint and edge fee-routing mechanics.
              </p>

              {/* Fee Calculator Interactive Widget */}
              <div className="bg-zinc-950/80 rounded-lg p-5 border border-zinc-800/80 space-y-4">
                <h3 className="text-sm font-semibold text-zinc-300">⚡ Dynamic Scan Fee & Staking Simulation</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-400">Select Brand Staking Tier:</span>
                  {['none', 'bronze', 'silver', 'gold', 'platinum'].map(tier => (
                    <button
                      key={tier}
                      onClick={() => handleCalculateTier(tier)}
                      className={`text-xs px-3 py-1 rounded font-mono uppercase transition-all ${
                        tierCalc === tier
                          ? 'bg-amber-400 text-black font-bold shadow'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                  {loadingApi && <span className="text-xs text-amber-400 animate-pulse ml-2">Calculating...</span>}
                </div>

                {calculatedFee?.scanFee && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-zinc-800/60 font-mono text-xs">
                    <div className="bg-zinc-900/80 p-3 rounded border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">Gross Unit Cost</div>
                      <div className="text-sm font-bold text-white">{calculatedFee.scanFee.gross} QRON</div>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">Discount Applied</div>
                      <div className="text-sm font-bold text-amber-400">
                        -{(calculatedFee.scanFee.discount || 0).toFixed(4)} QRON ({((calculatedFee.stakingInfo?.discount || 0) * 100).toFixed(0)}%)
                      </div>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">40% Staker Pool</div>
                      <div className="text-sm font-bold text-emerald-400">
                        {(calculatedFee.scanFee.stakerReward || 0).toFixed(4)} QRON
                      </div>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">40% Treasury</div>
                      <div className="text-sm font-bold text-cyan-400">
                        {(calculatedFee.scanFee.treasury || 0).toFixed(4)} QRON
                      </div>
                    </div>
                    <div className="bg-zinc-900/80 p-3 rounded border border-zinc-800">
                      <div className="text-[10px] text-zinc-500 uppercase">20% Burn (Deflationary)</div>
                      <div className="text-sm font-bold text-rose-400">
                        {(calculatedFee.scanFee.burn || 0).toFixed(4)} QRON
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Raw JSON State */}
              <div className="mt-6">
                <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Protocol Summary Output</span>
                  <span className="font-mono text-[10px] text-zinc-500">GET /api/economy</span>
                </div>
                <pre className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto max-h-96">
                  {JSON.stringify(liveState || { loading: true }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
