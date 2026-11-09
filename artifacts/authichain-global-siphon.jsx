import { useState, useEffect } from "react";

const MARKET = {
  antiCounterfeit: 128.83, // $B 2026
  counterfeitGoods: 467, // $B global trade
  authBrandProtection: 15.2, // $B 2024
  productUnits: 410, // billion units need auth
  euDppRegistry: "July 19, 2026",
  euDppMandatory: "Feb 2027",
  blockchainAdoption: 46, // %
  mobileScanning: 52, // % growth
};

const SIPHON_LAYERS = [
  {
    layer: 0, name: "FREE SCANNER", subtitle: "The Funnel Top",
    color: "#00ff88", icon: "📱",
    desc: "Free consumer-facing scanner app/web. Anyone scans any QR → gets instant authenticity verdict from 5-agent AI consensus. Generates massive behavioral data on what's being scanned, where, when.",
    revenue: "Free (data collection)", monthlyRev: 0,
    metrics: [
      { label: "Target Scans/Mo", value: "1M+" },
      { label: "Data Value", value: "$0.02/scan" },
      { label: "User CAC", value: "$0 (organic)" },
    ],
    tech: ["AuthiChain Scanner PWA", "5-Agent AI Consensus", "Polygon Verification", "$QRON Scan-to-Earn Rewards"],
  },
  {
    layer: 1, name: "BRAND API", subtitle: "The Money Layer",
    color: "#ffc800", icon: "🔌",
    desc: "Brands register products in AuthiChain. Per-product NFT certificate on Polygon. Per-scan verification fee. Monthly API subscription. Self-serve dashboard for SMBs, enterprise plans for large brands.",
    revenue: "$0.10-1.00/cert + $0.01-0.05/scan + $99-10K/mo API",
    monthlyRev: 50000,
    metrics: [
      { label: "Cert Price", value: "$0.10-1.00" },
      { label: "Scan Fee", value: "$0.01-0.05" },
      { label: "API Tiers", value: "$99-10K/mo" },
    ],
    tech: ["AuthiChain REST API v2.3", "Polygon NFT Minting", "Cloudflare Workers", "Stripe Billing"],
  },
  {
    layer: 2, name: "EU DPP COMPLIANCE", subtitle: "The Enterprise Layer",
    color: "#ff6b35", icon: "🇪🇺",
    desc: "EU Digital Product Passport generation. Mandatory from Feb 2027 — no DPP = no EU market access. QR codes are REQUIRED interface under ESPR Article 10. AuthiChain becomes the compliance engine for global manufacturers.",
    revenue: "$2K-50K setup + $500-5K/mo ongoing",
    monthlyRev: 200000,
    metrics: [
      { label: "Setup Fee", value: "$2K-50K" },
      { label: "Monthly", value: "$500-5K" },
      { label: "Market Blocked Without", value: "100%" },
    ],
    tech: ["EU ESPR Compliance Engine", "GS1 Digital Link", "JSON-LD Schema.org", "QR/NFC/RFID Data Carriers"],
  },
  {
    layer: 3, name: "INDUSTRY VERTICALS", subtitle: "The Specialization Layer",
    color: "#8866ff", icon: "🏭",
    desc: "Deep vertical solutions. Cannabis (StrainChain) already has 1,001 products seeded. Luxury, pharma, electronics, fashion/textiles each get custom compliance packages with industry-specific AI models.",
    revenue: "$1K-25K/mo per vertical client",
    monthlyRev: 150000,
    metrics: [
      { label: "Cannabis (Active)", value: "1,001 products" },
      { label: "Luxury Goods", value: "$50B counterfeit" },
      { label: "Pharma", value: "15.4% CAGR" },
    ],
    tech: ["StrainChain.io", "Vertical AI Models", "Regulatory Compliance Engines", "Supply Chain Tracking"],
  },
  {
    layer: 4, name: "DATA INTELLIGENCE", subtitle: "The Compounding Layer",
    color: "#00ccff", icon: "📊",
    desc: "Aggregate scan data → counterfeit pattern detection, supply chain analytics, brand health dashboards, geographic threat mapping. Data sells to brands, law enforcement, insurance companies, governments.",
    revenue: "$5K-50K/mo subscriptions",
    monthlyRev: 100000,
    metrics: [
      { label: "Data Points/Scan", value: "12+" },
      { label: "Counterfeit Patterns", value: "Real-time" },
      { label: "Client Types", value: "Brands/Gov/Insurance" },
    ],
    tech: ["Groq AI Analytics", "Supabase Data Lake", "Real-time Dashboards", "Threat Intelligence API"],
  },
];

const VERTICALS = [
  { name: "Cannabis", icon: "🌿", status: "ACTIVE", products: "1,001", market: "$100B+", counterfeitRate: "30%+", color: "#00ff88", platform: "StrainChain.io" },
  { name: "Luxury Goods", icon: "👜", status: "TARGET", products: "—", market: "$362B", counterfeitRate: "27%", color: "#ffc800", platform: "AuthiChain.com" },
  { name: "Pharmaceuticals", icon: "💊", status: "TARGET", products: "—", market: "$1.5T", counterfeitRate: "10-30%", color: "#ff6b35", platform: "AuthiChain.com" },
  { name: "Electronics", icon: "📱", status: "TARGET", products: "—", market: "$1T+", counterfeitRate: "15%", color: "#00ccff", platform: "AuthiChain.com" },
  { name: "Fashion/Textiles", icon: "👗", status: "EU DPP 2027", products: "—", market: "$1.7T", counterfeitRate: "27%", color: "#8866ff", platform: "AuthiChain.com" },
  { name: "Food & Beverage", icon: "🍷", status: "TARGET", products: "—", market: "$8.7T", counterfeitRate: "8%", color: "#ff4488", platform: "AuthiChain.com" },
];

const TIMELINE = [
  { date: "NOW", title: "Foundation Live", items: ["AuthiChain API v2.3 deployed", "5-agent AI consensus active", "1,001 cannabis products on-chain", "56+ Cloudflare Workers running", "EU DPP compliance page live", "QR generation pipeline ready"], color: "#00ff88" },
  { date: "Q2 2026", title: "API Launch", items: ["Public API developer portal", "Self-serve brand onboarding", "Stripe billing integration", "Free scanner PWA launch", "Developer documentation", "First 100 brand signups"], color: "#ffc800" },
  { date: "Q3 2026", title: "EU DPP Push", items: ["EU DPP registry opens Jul 19", "DPP compliance engine v1", "Target EU exporters (textiles/batteries)", "GS1 Digital Link integration", "Partner with EU compliance consultancies"], color: "#ff6b35" },
  { date: "Q4 2026", title: "Scale", items: ["1,000+ brand accounts", "100K+ monthly scans", "Enterprise sales team", "Series A preparation", "Geographic expansion", "Insurance/gov data partnerships"], color: "#8866ff" },
  { date: "Q1 2027", title: "EU Mandate", items: ["EU DPP MANDATORY for batteries", "Textiles/steel DPPs follow", "Massive demand spike", "Enterprise pipeline conversion", "$QRON token utility surge", "Revenue inflection point"], color: "#ff4444" },
];

const EXISTING_INFRA = [
  { name: "AuthiChain API v2.3", status: "✅ Live", detail: "5-agent AI consensus authentication" },
  { name: "Polygon Smart Contracts", status: "✅ Live", detail: "NFT minting + $QRON token" },
  { name: "56+ CF Workers", status: "✅ Live", detail: "Serverless compute layer" },
  { name: "78+ Supabase Functions", status: "✅ Live", detail: "Backend logic + data" },
  { name: "QRON QR Pipeline", status: "✅ Live", detail: "AI-generated QR art codes" },
  { name: "StrainChain.io", status: "✅ Live", detail: "Cannabis vertical w/ 1,001 products" },
  { name: "Stripe Integration", status: "✅ Live", detail: "Payment processing ready" },
  { name: "EU DPP Page", status: "✅ Live", detail: "Compliance documentation" },
  { name: "HubSpot CRM", status: "✅ 172 deals", detail: "Sales pipeline active" },
  { name: "Telegram Bot", status: "✅ Live", detail: "@Authichainbot notifications" },
];

export default function GlobalAuthSiphon() {
  const [tab, setTab] = useState("siphon");
  const [expandedLayer, setExpandedLayer] = useState(null);
  const [revenueMultiplier, setRevenueMultiplier] = useState(1);

  const totalMonthlyRev = SIPHON_LAYERS.reduce((a, l) => a + l.monthlyRev, 0) * revenueMultiplier;
  const totalAnnualRev = totalMonthlyRev * 12;

  const tabs = [
    { id: "siphon", label: "🌐 Siphon Architecture" },
    { id: "market", label: "📈 Market Thesis" },
    { id: "verticals", label: "🏭 Verticals" },
    { id: "infra", label: "⚙️ Live Infrastructure" },
    { id: "timeline", label: "🗓️ Roadmap" },
    { id: "eu", label: "🇪🇺 EU DPP Trigger" },
  ];

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      background: "radial-gradient(ellipse at 20% 0%, rgba(0,80,40,0.15) 0%, #030308 50%), #030308",
      color: "#c8ccd4", minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes enter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flow { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 15px rgba(0,255,136,0.1); } 50% { box-shadow: 0 0 30px rgba(0,255,136,0.2); } }
        .p { background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; position: relative; overflow: hidden; }
        .p::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 50%, transparent 100%); }
        .tb { cursor: pointer; padding: 7px 12px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.05); font-size: 10px; font-family: inherit; color: #555; background: transparent; transition: all 0.15s; white-space: nowrap; }
        .tb:hover { color: #999; border-color: rgba(0,255,136,0.15); }
        .tb.on { color: #00ff88; border-color: rgba(0,255,136,0.4); background: rgba(0,255,136,0.04); }
        .tg { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 8px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; }
        input[type="range"] { -webkit-appearance: none; width: 100%; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #00ff88; cursor: pointer; box-shadow: 0 0 8px rgba(0,255,136,0.4); }
        .layer-card { border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.01); position: relative; overflow: hidden; }
        .layer-card:hover { background: rgba(255,255,255,0.025); transform: translateY(-1px); }
        .connector { width: 2px; height: 20px; margin: 0 auto; background: linear-gradient(to bottom, rgba(0,255,136,0.3), rgba(0,255,136,0.05)); }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "18px 22px 12px", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 900, letterSpacing: "-0.5px",
              background: "linear-gradient(90deg, #00ff88, #00ccff, #8866ff, #00ff88)", backgroundSize: "200% 100%",
              animation: "flow 6s linear infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>AUTHICHAIN GLOBAL AUTHENTICATION SIPHON</div>
            <div style={{ fontSize: 9, color: "#333", marginTop: 2, letterSpacing: "0.5px" }}>
              THE STRIPE OF PRODUCT AUTHENTICATION — EVERY SCAN = REVENUE — EVERY CERTIFICATE = REVENUE — EVERY API CALL = REVENUE
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#00ff88" }}>${(totalAnnualRev/1000000).toFixed(1)}M</div>
            <div style={{ fontSize: 8, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>annual target @ {revenueMultiplier}x scale</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 12, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} className={`tb ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 22px", animation: "enter 0.25s ease" }} key={tab}>

        {/* SIPHON ARCHITECTURE */}
        {tab === "siphon" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 10, color: "#555" }}>Scale:</span>
              <input type="range" min={0.1} max={10} step={0.1} value={revenueMultiplier}
                onChange={e => setRevenueMultiplier(parseFloat(e.target.value))}
                style={{ width: 200 }} />
              <span style={{ fontSize: 11, color: "#00ff88", fontWeight: 600 }}>{revenueMultiplier}x</span>
              <span style={{ fontSize: 10, color: "#444" }}>→ ${(totalMonthlyRev).toLocaleString()}/mo</span>
            </div>

            {SIPHON_LAYERS.map((layer, i) => (
              <div key={i}>
                <div className="layer-card"
                  style={{ borderColor: expandedLayer === i ? `${layer.color}33` : undefined }}
                  onClick={() => setExpandedLayer(expandedLayer === i ? null : i)}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: layer.color }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingLeft: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16 }}>{layer.icon}</span>
                        <span style={{ fontSize: 9, color: layer.color, fontWeight: 700, letterSpacing: "1px" }}>LAYER {layer.layer}</span>
                        <span style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: "#e0e0e0" }}>{layer.name}</span>
                        <span style={{ fontSize: 9, color: "#555" }}>— {layer.subtitle}</span>
                      </div>
                      <div style={{ fontSize: 10, color: "#666", lineHeight: 1.5, maxWidth: 600 }}>{layer.desc}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 800, color: layer.monthlyRev > 0 ? layer.color : "#444" }}>
                        {layer.monthlyRev > 0 ? `$${(layer.monthlyRev * revenueMultiplier).toLocaleString()}` : "FREE"}
                      </div>
                      <div style={{ fontSize: 8, color: "#444" }}>/month @ {revenueMultiplier}x</div>
                    </div>
                  </div>

                  {expandedLayer === i && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${layer.color}15`, paddingLeft: 8 }}>
                      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                        {layer.metrics.map((m, j) => (
                          <div key={j} style={{ textAlign: "center", flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: layer.color }}>{m.value}</div>
                            <div style={{ fontSize: 8, color: "#555", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 9, color: "#444", marginBottom: 4 }}>TECH STACK</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {layer.tech.map((t, j) => (
                          <span key={j} className="tg" style={{ background: `${layer.color}10`, color: `${layer.color}cc`, border: `1px solid ${layer.color}20` }}>{t}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: 9, color: "#555", marginTop: 8 }}>Revenue: {layer.revenue}</div>
                    </div>
                  )}
                </div>
                {i < SIPHON_LAYERS.length - 1 && <div className="connector" />}
              </div>
            ))}

            <div className="p" style={{ marginTop: 16, animation: "glow 3s ease-in-out infinite", borderColor: "rgba(0,255,136,0.1)" }}>
              <div style={{ fontFamily: "'Outfit'", fontSize: 12, fontWeight: 700, color: "#00ff88", marginBottom: 6 }}>THE SIPHON LOGIC</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.7 }}>
                Every product manufactured on Earth has an authenticity question. AuthiChain answers it. The siphon works because each layer feeds the next: free scans generate data → data attracts brands → brands pay for API → API generates DPP compliance → compliance generates enterprise contracts → enterprise contracts generate intelligence data → intelligence data makes the free scanner smarter → cycle compounds. <strong style={{ color: "#ffc800" }}>This is the flywheel. Every scan makes the system more valuable.</strong>
              </div>
            </div>
          </div>
        )}

        {/* MARKET THESIS */}
        {tab === "market" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>📈 THE $128B OPPORTUNITY</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Anti-Counterfeit Market 2026", value: `$${MARKET.antiCounterfeit}B`, color: "#00ff88" },
                { label: "Global Counterfeit Trade", value: `$${MARKET.counterfeitGoods}B`, color: "#ff4444" },
                { label: "Auth & Brand Protection", value: `$${MARKET.authBrandProtection}B`, color: "#ffc800" },
                { label: "Products Need Auth", value: `${MARKET.productUnits}B units`, color: "#00ccff" },
                { label: "EU DPP Registry Opens", value: MARKET.euDppRegistry, color: "#ff6b35" },
                { label: "EU DPP Mandatory", value: MARKET.euDppMandatory, color: "#ff4444" },
                { label: "Blockchain Adoption", value: `${MARKET.blockchainAdoption}%`, color: "#8866ff" },
                { label: "Mobile Scan Growth", value: `${MARKET.mobileScanning}% YoY`, color: "#00ff88" },
              ].map((m, i) => (
                <div key={i} className="p" style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 8, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            <div className="p" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#00ff88", marginBottom: 8 }}>WHY AUTHICHAIN WINS</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8 }}>
                <strong style={{ color: "#ffc800" }}>1. Timing:</strong> EU DPP registry opens July 19, 2026 — 3 months from now. Mandatory Feb 2027. Companies are SCRAMBLING for compliance partners. First movers capture lock-in.<br/>
                <strong style={{ color: "#ffc800" }}>2. Stack:</strong> Already have blockchain (Polygon), QR generation (QRON), AI consensus (5-agent), and scan infrastructure. Competitors are still building.<br/>
                <strong style={{ color: "#ffc800" }}>3. Cost:</strong> Polygon gas = fractions of a penny. CF Workers = near-zero compute. This means we can offer 10x cheaper than incumbents (Authentix, SICPA, Avery Dennison).<br/>
                <strong style={{ color: "#ffc800" }}>4. Vertical Proof:</strong> Cannabis vertical already live with 1,001 products. Proves the system works. Horizontal expansion from proven vertical.<br/>
                <strong style={{ color: "#ffc800" }}>5. Token Economics:</strong> $QRON Scan-to-Earn creates consumer incentive to scan — competitors don't have this. More scans = more data = more value.
              </div>
            </div>

            <div className="p">
              <div style={{ fontSize: 11, fontWeight: 600, color: "#ff4444", marginBottom: 8 }}>CAPTURE MATH</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8 }}>
                Total addressable market: $128.83B in anti-counterfeit spending (2026)<br/>
                Auth & brand protection software specifically: $3.30B (2025) → $7.64B (2032)<br/>
                AuthiChain target: 0.1% of software market = <strong style={{ color: "#00ff88" }}>$3.3M/year at MVP scale</strong><br/>
                AuthiChain stretch: 1% of software market = <strong style={{ color: "#ffc800" }}>$33M/year at growth scale</strong><br/>
                EU DPP compliance alone (100 enterprise clients × $24K/yr) = <strong style={{ color: "#ff6b35" }}>$2.4M/year</strong>
              </div>
            </div>
          </div>
        )}

        {/* VERTICALS */}
        {tab === "verticals" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#8866ff", marginBottom: 14 }}>🏭 INDUSTRY VERTICALS — Horizontal Platform, Vertical Expertise</div>
            {VERTICALS.map((v, i) => (
              <div key={i} className="layer-card" style={{ marginBottom: 8 }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: v.color }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingLeft: 8 }}>
                  <span style={{ fontSize: 22 }}>{v.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{v.name}</span>
                      <span className="tg" style={{
                        background: v.status === "ACTIVE" ? "rgba(0,255,136,0.1)" : v.status.includes("DPP") ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.04)",
                        color: v.status === "ACTIVE" ? "#00ff88" : v.status.includes("DPP") ? "#ff6b35" : "#666",
                        border: `1px solid ${v.status === "ACTIVE" ? "rgba(0,255,136,0.2)" : v.status.includes("DPP") ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.06)"}`,
                      }}>{v.status}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 10, color: "#666", marginTop: 4 }}>
                      <span>Market: <span style={{ color: v.color }}>{v.market}</span></span>
                      <span>Counterfeit Rate: <span style={{ color: "#ff4444" }}>{v.counterfeitRate}</span></span>
                      <span>Products: <span style={{ color: "#ccc" }}>{v.products}</span></span>
                      <span>Platform: <span style={{ color: "#00ccff" }}>{v.platform}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p" style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#ffc800", marginBottom: 6 }}>EXPANSION STRATEGY</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.7 }}>
                Phase 1 (NOW): Cannabis — already live, prove revenue model, case study for other verticals.<br/>
                Phase 2 (Q3 2026): Luxury goods + Fashion/Textiles — EU DPP pressure creates urgency, highest brand protection spending.<br/>
                Phase 3 (Q4 2026): Electronics + Pharma — highest volume, regulatory mandates (FDA serialization, EU Falsified Medicines Directive).<br/>
                Phase 4 (2027): Food & Beverage — massive scale, lowest margin per-unit but highest volume.
              </div>
            </div>
          </div>
        )}

        {/* LIVE INFRASTRUCTURE */}
        {tab === "infra" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#00ff88", marginBottom: 14 }}>⚙️ ALREADY DEPLOYED — This isn't a whitepaper, it's a running system</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
              {EXISTING_INFRA.map((item, i) => (
                <div key={i} className="p" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#00ff88" }}>{item.status.includes("✅") ? "✅" : "⏳"}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#e0e0e0" }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: "#555" }}>{item.detail}</div>
                  </div>
                  <span className="tg" style={{ marginLeft: "auto", background: "rgba(0,255,136,0.08)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.15)" }}>
                    {item.status.replace("✅ ", "")}
                  </span>
                </div>
              ))}
            </div>
            <div className="p" style={{ marginTop: 12, borderColor: "rgba(0,255,136,0.1)" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#00ff88", marginBottom: 6 }}>INFRASTRUCTURE IDS</div>
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1.8, fontFamily: "'JetBrains Mono'" }}>
                CF: 4c1869b90f13f86940aa3747839bf420 | Supabase: nhdnkzhtadfkkluiulhs<br/>
                Polygon $QRON: 0xAebfA6b08fb25b59748c93273aB8880e20FfE437<br/>
                AuthiChain NFT: 0x4da4D2675e52374639C9c954f4f653887A9972BE<br/>
                Stripe: acct_1SXIyEGqTruSqV8T | Vercel: team_PKVRDwUXPRFjmGTM7PZxjNys
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE */}
        {tab === "timeline" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>🗓️ SIPHON ACTIVATION ROADMAP</div>
            {TIMELINE.map((phase, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 80, flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 800, color: phase.color }}>{phase.date}</div>
                  <div style={{ fontSize: 9, color: "#444" }}>{phase.title}</div>
                </div>
                <div style={{ width: 2, background: `linear-gradient(to bottom, ${phase.color}, ${phase.color}22)`, borderRadius: 1, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  {phase.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 10, color: "#888", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: phase.color, flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EU DPP TRIGGER */}
        {tab === "eu" && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ff6b35", marginBottom: 14 }}>🇪🇺 THE EU DPP TRIGGER — WHY THIS CREATES A $BILLION SIPHON</div>
            <div className="p" style={{ marginBottom: 12, borderColor: "rgba(255,107,53,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ff6b35", marginBottom: 8 }}>THE REGULATORY FORCING FUNCTION</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8 }}>
                <strong style={{ color: "#ff4444" }}>July 19, 2026</strong> — EU DPP central registry OPENS. Every product category gets a timeline.<br/>
                <strong style={{ color: "#ff4444" }}>Feb 18, 2027</strong> — MANDATORY for all EV/industrial batteries &gt;2kWh. No DPP = blocked from EU market.<br/>
                <strong style={{ color: "#ff4444" }}>Mid 2027</strong> — Textiles, iron, steel, aluminum DPPs mandatory.<br/>
                <strong style={{ color: "#ff4444" }}>2028-2029</strong> — Electronics, furniture, tyres, detergents.<br/>
                <strong style={{ color: "#ff4444" }}>2030</strong> — ALL physical products sold in EU must have a DPP.<br/><br/>
                <strong style={{ color: "#ffc800" }}>This affects EVERY manufacturer globally that sells into the EU.</strong> It doesn't matter where you're based — China, USA, India — if you sell into the EU, you need a DPP. The QR code is the MANDATORY interface under ESPR Article 10.
              </div>
            </div>

            <div className="p" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00ff88", marginBottom: 8 }}>WHY AUTHICHAIN IS THE ANSWER</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8 }}>
                EU DPP requires: QR codes ✅ (QRON pipeline), blockchain verification ✅ (Polygon), machine-readable data ✅ (JSON-LD), lifecycle tracking ✅ (Supabase), supply chain traceability ✅ (5-agent AI).<br/><br/>
                Competitors charge $50K-500K for enterprise DPP implementation. AuthiChain runs on Polygon (gas: $0.001) and CF Workers (compute: near-zero). We can offer <strong style={{ color: "#ffc800" }}>10-100x cheaper</strong> than SICPA, Avery Dennison, or Authentix — and we're already built.<br/><br/>
                <strong style={{ color: "#00ff88" }}>The play:</strong> Position AuthiChain as the <em>affordable DPP compliance engine for SMBs and mid-market manufacturers</em> who can't afford the enterprise incumbents. There are millions of them. They need this by 2027. We're ready now.
              </div>
            </div>

            <div className="p" style={{ borderColor: "rgba(255,200,0,0.1)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#ffc800", marginBottom: 8 }}>IMMEDIATE ACTIONS</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.8 }}>
                1. Build DPP-compliant certificate template with GS1 Digital Link format<br/>
                2. Create "EU DPP Ready" landing page on authichain.com targeting manufacturers<br/>
                3. SEO campaign: "EU Digital Product Passport compliance" — 500K+ monthly searches by Q3<br/>
                4. Outreach to EU trade compliance consultancies for partnership referrals<br/>
                5. Launch self-serve DPP generation tool — $99/mo for SMBs, $999/mo for mid-market<br/>
                6. Submit to EU ESPR working group as technology provider<br/>
                7. HubSpot campaign targeting 172 existing deals + new EU DPP segment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
