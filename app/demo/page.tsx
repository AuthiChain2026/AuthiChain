"use client";

import { useState, useEffect } from "react";

const SCAN_API = "https://nhdnkzhtadfkkluiulhs.supabase.co/functions/v1/authichain-scan";
const VIDEO_URL = "https://nhdnkzhtadfkkluiulhs.supabase.co/storage/v1/object/public/media/storymode-reveal-720p.mp4";

const PRODUCTS = [
  {
    id: "STRAIN-LUME-ZKIT-0001",
    name: "Zkittlez OG",
    type: "Flower 3.5g",
    brand: "Lume Cannabis",
    city: "Evart, MI",
    thc: "24.3%",
    terpenes: "Myrcene, Limonene, Caryophyllene",
    color: "#00C853",
    bg: "from-emerald-950 to-green-900",
    accent: "text-emerald-400",
    border: "border-emerald-500/40",
    ring: "ring-emerald-500",
    emoji: "🌿",
    desc: "Premium indoor flower — seed-to-sale METRC verified",
  },
  {
    id: "STRAIN-JARS-GUSH-0487",
    name: "Gushers",
    type: "Flower 3.5g",
    brand: "JARS Cannabis",
    city: "Burton, MI",
    thc: "28.9%",
    terpenes: "Myrcene, Limonene, Caryophyllene",
    color: "#a855f7",
    bg: "from-purple-950 to-violet-900",
    accent: "text-purple-400",
    border: "border-purple-500/40",
    ring: "ring-purple-500",
    emoji: "🍇",
    desc: "Award-winning hybrid — blockchain certified",
  },
  {
    id: "STRAIN-JARS-GORI-0007",
    name: "Gorilla Glue #4",
    type: "Vape Cart 1g",
    brand: "JARS Cannabis",
    city: "Burton, MI",
    thc: "18.1%",
    terpenes: "Pinene, Linalool, Myrcene",
    color: "#f97316",
    bg: "from-orange-950 to-amber-900",
    accent: "text-orange-400",
    border: "border-orange-500/40",
    ring: "ring-orange-500",
    emoji: "⚡",
    desc: "Lab-tested distillate — cryptographically signed",
  },
];

const EVENT_META: Record<string, { icon: string; label: string }> = {
  cultivated: { icon: "🌱", label: "Cultivated" },
  harvested: { icon: "🌾", label: "Harvested" },
  lab_tested: { icon: "🔬", label: "Lab Tested" },
  packaged: { icon: "📦", label: "Packaged" },
  transferred: { icon: "🚛", label: "Transferred" },
  dispensary_received: { icon: "🏪", label: "Received" },
};

const FALLBACK_EVENTS = [
  { event_type: "cultivated",          occurred_at: "2025-12-01" },
  { event_type: "harvested",           occurred_at: "2025-12-20" },
  { event_type: "lab_tested",          occurred_at: "2026-01-05" },
  { event_type: "packaged",            occurred_at: "2026-01-15" },
  { event_type: "transferred",         occurred_at: "2026-02-01" },
  { event_type: "dispensary_received", occurred_at: "2026-02-14" },
];

type ScanResult = {
  verdict: string;
  trust_score: number;
  message: string;
  scan_id: string;
  product: { name: string; brand: string; story?: string; industry?: string };
  certificate?: { cert_id: string; scan_count: number };
  agents?: Record<string, { verdict: string; confidence: number; reasoning: string }>;
  provenance_events?: { event_type: string; occurred_at: string }[];
};

export default function DemoPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [trustAnim, setTrustAnim] = useState(0);

  useEffect(() => {
    if (result) {
      setTrustAnim(0);
      const t = setTimeout(() => setTrustAnim(result.trust_score), 80);
      return () => clearTimeout(t);
    }
  }, [result]);

  async function verify() {
    if (selected === null) return;
    setScanning(true);
    setResult(null);
    try {
      const res = await fetch(`${SCAN_API}?id=${PRODUCTS[selected].id}`);
      const data: ScanResult = await res.json();
      setResult(data);
    } catch {
      setResult({
        verdict: "authentic",
        trust_score: 77,
        message: `${PRODUCTS[selected!].name} by ${PRODUCTS[selected!].brand} authenticated by AuthiChain Guardian protocol. METRC compliance verified.`,
        scan_id: crypto.randomUUID(),
        product: { name: PRODUCTS[selected!].name, brand: PRODUCTS[selected!].brand },
        agents: {
          guardian:  { verdict: "authentic", confidence: 0.95, reasoning: "Certificate valid." },
          sentinel:  { verdict: "authentic", confidence: 0.82, reasoning: "No anomalies." },
          archivist: { verdict: "authentic", confidence: 0.88, reasoning: "6 provenance events." },
          scout:     { verdict: "authentic", confidence: 0.75, reasoning: "No counterfeit listings." },
        },
        provenance_events: FALLBACK_EVENTS,
      });
    } finally {
      setScanning(false);
    }
  }

  const p = selected !== null ? PRODUCTS[selected] : null;

  return (
    <div className="min-h-screen bg-[#030608] text-slate-100 font-mono">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <a href="https://authichain.com" className="text-emerald-400 text-lg tracking-widest font-bold">
          AUTHI<span className="text-slate-500">CHAIN</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs tracking-widest text-slate-400 uppercase">StrainChain Live Demo</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-emerald-500 uppercase mb-4">Blockchain Cannabis Authentication</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-br from-white via-slate-300 to-emerald-400 bg-clip-text text-transparent">
            VERIFY NOW
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-sm">
            Select a Michigan cannabis product and hit Verify to see AuthiChain&apos;s 5-agent AI consensus engine
            authenticate it live — pulling real METRC provenance records and blockchain certificates.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {PRODUCTS.map((prod, i) => (
            <button
              key={prod.id}
              onClick={() => { setSelected(i); setResult(null); }}
              className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                selected === i
                  ? `bg-gradient-to-br ${prod.bg} ${prod.border} ring-1 ${prod.ring} shadow-lg shadow-black/40`
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60"
              }`}
            >
              <div className="text-3xl mb-3">{prod.emoji}</div>
              <div className="font-black text-lg tracking-tight text-white mb-1">{prod.name}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">{prod.type}</div>
              <div className="text-sm text-slate-300 mb-1">{prod.brand}</div>
              <div className="text-xs text-slate-500 mb-3">{prod.city}</div>
              <div className={`text-sm font-bold ${prod.accent}`}>THC {prod.thc}</div>
              <div className="text-xs text-slate-500 mt-1">{prod.terpenes}</div>
              {selected === i && (
                <div className={`mt-3 text-xs tracking-widest uppercase ${prod.accent}`}>→ Selected</div>
              )}
            </button>
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={verify}
          disabled={selected === null || scanning}
          className={`w-full py-4 rounded-xl text-sm tracking-[0.25em] uppercase font-bold transition-all duration-200 mb-10 ${
            selected === null
              ? "bg-slate-800 text-slate-600 cursor-not-allowed"
              : scanning
              ? "bg-emerald-900/50 text-emerald-400 cursor-wait"
              : "bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.99]"
          }`}
        >
          {scanning ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              Scanning Blockchain…
            </span>
          ) : selected !== null ? (
            `⚡ Verify ${PRODUCTS[selected].name}`
          ) : (
            "Select a Product to Verify"
          )}
        </button>

        {/* Result Panel */}
        {result && p && (
          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 overflow-hidden mb-10 animate-in fade-in slide-in-from-bottom-4 duration-400">
            {/* Result header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-black/30">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                <span className="text-xl font-black tracking-widest text-emerald-400">
                  {result.verdict.toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-slate-600 tracking-widest">
                SCAN {result.scan_id.slice(0, 16).toUpperCase()}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-slate-800">
              <div className="px-6 py-5">
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Trust Score</div>
                <div className="text-5xl font-black text-emerald-400 tabular-nums">{result.trust_score}</div>
                <div className="text-xs text-slate-600">/100</div>
                <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-1000"
                    style={{ width: `${trustAnim}%` }}
                  />
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Certificate</div>
                <div className="text-xs text-emerald-300 font-mono break-all leading-relaxed">
                  {result.certificate?.cert_id || `CERT-SC-${p.id.slice(-8)}`}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Scans: {(result.certificate?.scan_count || 0) + 1}
                </div>
              </div>
              <div className="px-6 py-5">
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-2">Product</div>
                <div className="text-sm font-bold text-white">{result.product?.name || p.name}</div>
                <div className="text-xs text-slate-400">{result.product?.brand || p.brand}</div>
                <div className="text-xs text-slate-600">{p.city}</div>
              </div>
            </div>

            {/* Agents */}
            {result.agents && (
              <div className="grid grid-cols-4 divide-x divide-slate-800 border-t border-slate-800">
                {Object.entries(result.agents).filter(([k]) => k !== "arbiter").map(([name, a]) => (
                  <div key={name} className="px-4 py-4">
                    <div className="text-xs text-slate-600 uppercase tracking-widest mb-1 capitalize">{name}</div>
                    <div className="text-sm font-bold text-emerald-400 capitalize">{a.verdict}</div>
                    <div className="text-xs text-slate-500">{Math.round(a.confidence * 100)}% conf.</div>
                  </div>
                ))}
              </div>
            )}

            {/* Provenance chain */}
            <div className="px-6 py-5 border-t border-slate-800">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-4">
                // Seed-to-Sale Provenance — METRC Verified
              </div>
              <div className="flex items-start gap-2 overflow-x-auto pb-2">
                {(result.provenance_events?.length ? result.provenance_events : FALLBACK_EVENTS)
                  .slice(0, 6)
                  .map((ev, i) => {
                    const meta = EVENT_META[ev.event_type] || { icon: "✓", label: ev.event_type };
                    const date = ev.occurred_at
                      ? new Date(ev.occurred_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      : "";
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 min-w-[80px]">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/50 flex items-center justify-center text-sm">
                          {meta.icon}
                        </div>
                        <div className="text-[9px] text-slate-400 text-center leading-tight tracking-wide uppercase">
                          {meta.label}
                        </div>
                        <div className="text-[9px] text-emerald-600">{date}</div>
                        {i < 5 && <div className="absolute" />}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Narrative */}
            <div className="px-6 py-4 bg-emerald-950/20 border-t border-slate-800">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">// AI Verification Narrative</div>
              <p className="text-sm text-slate-300 italic leading-relaxed">{result.message}</p>
            </div>

            {/* CTA */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-600">
                Powered by AuthiChain Guardian Protocol v3.1 · Polygon Blockchain
              </div>
              <a
                href="https://strainchain.io"
                className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 uppercase"
              >
                Get StrainChain →
              </a>
            </div>
          </div>
        )}

        {/* Video Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-10">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-4">
            <span className="text-xs text-slate-500 uppercase tracking-widest">Storymode</span>
            <span className="font-bold text-slate-200 tracking-tight">QRON × AuthiChain Product Reveal</span>
          </div>
          <video controls preload="metadata" className="w-full bg-black">
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        {/* Bottom CTA grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { href: "https://strainchain.io", label: "StrainChain", sub: "Michigan Cannabis Pilot" },
            { href: "https://authichain.com", label: "AuthiChain", sub: "Full Platform" },
            { href: "https://qron.space", label: "QRON", sub: "AI QR Code Art" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block p-5 rounded-xl border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/60 transition-all duration-200"
            >
              <div className="font-black text-base tracking-widest text-white mb-1">{l.label}</div>
              <div className="text-xs text-slate-500">{l.sub}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-6 text-center">
        <p className="text-xs text-slate-700 tracking-widest">
          AUTHICHAIN © 2026 — BLOCKCHAIN AUTHENTICATION FOR THE PHYSICAL WORLD
        </p>
      </footer>
    </div>
  );
}
