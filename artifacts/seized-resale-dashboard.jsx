import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { name: "Jewelry", margin: "60-300%", icon: "💎", risk: "Medium", volume: "High", subcats: ["Diamond Rings", "Rolexes", "Solid Gold", "Chains", "Earrings"] },
  { name: "Coins & Bullion", margin: "15-40%", icon: "🪙", risk: "Low", volume: "High", subcats: ["Gold Coins", "Silver Dollars", "Bullion Bars", "Morgan Dollars"] },
  { name: "Art", margin: "100-500%", icon: "🎨", risk: "High", volume: "Medium", subcats: ["Gallery Liquidation", "High End", "Estate"] },
  { name: "Designer", margin: "40-200%", icon: "👜", risk: "Medium", volume: "Low", subcats: ["Handbags", "Accessories"] },
  { name: "Rugs", margin: "80-400%", icon: "🏠", risk: "High", volume: "Low", subcats: ["Masterpiece Collection"] },
  { name: "Collectibles", margin: "50-1000%", icon: "🏆", risk: "High", volume: "Medium", subcats: ["Estate Collection", "Memorabilia", "Comics"] },
  { name: "Sterling Silver", margin: "30-80%", icon: "✨", risk: "Low", volume: "High", subcats: ["Rings", "Chains", "Bracelets", "Necklaces"] },
];

const RESALE_CHANNELS = [
  { name: "eBay", fee: "13.25%", audience: "Mass market", best: "Coins, Jewelry, Collectibles", setup: "API ready", color: "#0064D2" },
  { name: "Poshmark", fee: "20%", audience: "Fashion/luxury", best: "Designer, Jewelry", setup: "Manual", color: "#7F0353" },
  { name: "Whatnot", fee: "8%", audience: "Live auction", best: "Coins, Cards, Collectibles", setup: "Apply", color: "#FF6B35" },
  { name: "Shopify Store", fee: "2.9%+30¢", audience: "Direct/SEO", best: "All categories", setup: "Build", color: "#96BF48" },
  { name: "Facebook Marketplace", fee: "5%", audience: "Local", best: "Jewelry, Art, Rugs", setup: "Ready", color: "#1877F2" },
  { name: "1stDibs", fee: "20-50%", audience: "High-end", best: "Art, Rugs, Antiques", setup: "Apply", color: "#000" },
];

const AUTOMATION_PIPELINE = [
  { step: 1, name: "Monitor", desc: "CF Worker scrapes USAO categories every 30min", status: "buildable", tech: "Cloudflare Worker + D1", auto: true },
  { step: 2, name: "Analyze", desc: "Groq AI evaluates items: market value, margin potential, risk score", status: "buildable", tech: "Groq API + Supabase", auto: true },
  { step: 3, name: "Alert", desc: "Telegram bot sends top picks with bid recommendations", status: "buildable", tech: "Telegram Bot API", auto: true },
  { step: 4, name: "Bid", desc: "YOU place bids on high-confidence items", status: "manual", tech: "Your browser", auto: false },
  { step: 5, name: "Win & Pay", desc: "YOU complete checkout + payment", status: "manual", tech: "Your credit card", auto: false },
  { step: 6, name: "Receive", desc: "Items ship to your address for quality check", status: "manual", tech: "Physical inspection", auto: false },
  { step: 7, name: "Photo & List", desc: "AI generates listings with SEO titles, descriptions, pricing", status: "buildable", tech: "Claude API + eBay/Shopify API", auto: true },
  { step: 8, name: "Cross-Post", desc: "Auto-publish to all resale channels simultaneously", status: "buildable", tech: "CF Worker + APIs", auto: true },
  { step: 9, name: "Sell & Ship", desc: "Process orders, print labels, ship from home", status: "semi-auto", tech: "Shippo/Pirate Ship API", auto: true },
  { step: 10, name: "Accounting", desc: "Track P&L per item, tax prep, reinvestment signals", status: "buildable", tech: "Supabase + Stripe", auto: true },
];

const FINANCIAL_MODEL = {
  monthly_budget: 500,
  avg_win_price: 35,
  buyer_premium: 0.18,
  shipping_in: 12,
  items_per_month: 10,
  avg_resale: 95,
  resale_fees: 0.13,
  shipping_out: 8,
};

function calcFinancials(model) {
  const totalCostPerItem = model.avg_win_price * (1 + model.buyer_premium) + model.shipping_in;
  const revenuePerItem = model.avg_resale;
  const feesPerItem = model.avg_resale * model.resale_fees;
  const profitPerItem = revenuePerItem - totalCostPerItem - feesPerItem - model.shipping_out;
  const monthlyRevenue = revenuePerItem * model.items_per_month;
  const monthlyProfit = profitPerItem * model.items_per_month;
  const monthlyInvestment = totalCostPerItem * model.items_per_month;
  const roi = (monthlyProfit / monthlyInvestment) * 100;
  return { totalCostPerItem, revenuePerItem, feesPerItem, profitPerItem, monthlyRevenue, monthlyProfit, monthlyInvestment, roi };
}

const GlowDot = ({ color, size = 8, pulse = false }) => (
  <span style={{
    display: "inline-block", width: size, height: size, borderRadius: "50%",
    background: color, boxShadow: `0 0 ${size}px ${color}`,
    animation: pulse ? "pulse 2s ease-in-out infinite" : "none",
  }} />
);

export default function SeizedResaleDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [model, setModel] = useState(FINANCIAL_MODEL);
  const [selectedCat, setSelectedCat] = useState(null);
  const [animatedIn, setAnimatedIn] = useState(false);
  const financials = calcFinancials(model);

  useEffect(() => { setTimeout(() => setAnimatedIn(true), 100); }, []);

  const tabs = [
    { id: "overview", label: "⚡ Overview", desc: "Business Architecture" },
    { id: "pipeline", label: "🔄 Pipeline", desc: "Automation Flow" },
    { id: "categories", label: "📦 Categories", desc: "Product Strategy" },
    { id: "channels", label: "🏪 Channels", desc: "Resale Platforms" },
    { id: "financials", label: "💰 Financials", desc: "P&L Calculator" },
    { id: "deploy", label: "🚀 Deploy", desc: "Activation Checklist" },
  ];

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 50%, #0a0f1a 100%)",
      color: "#e0e0e0", minHeight: "100vh", padding: 0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scanline { 0% { top: -100%; } 100% { top: 200%; } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; transition: all 0.3s ease; }
        .card:hover { border-color: rgba(0, 255, 136, 0.15); background: rgba(255,255,255,0.05); transform: translateY(-2px); }
        .card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent); }
        .tab { padding: 10px 16px; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; cursor: pointer; transition: all 0.2s; background: transparent; color: #888; font-size: 11px; font-family: inherit; }
        .tab:hover { border-color: rgba(0,255,136,0.3); color: #ccc; }
        .tab.active { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.08); box-shadow: 0 0 20px rgba(0,255,136,0.1); }
        .metric { text-align: center; }
        .metric-value { font-family: 'Outfit', sans-serif; font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #00ff88, #00ccff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .metric-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
        .step-line { width: 2px; height: 24px; background: linear-gradient(to bottom, rgba(0,255,136,0.4), rgba(0,255,136,0.1)); margin: 0 auto; }
        input[type="range"] { -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #00ff88; cursor: pointer; box-shadow: 0 0 10px rgba(0,255,136,0.5); }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .badge-auto { background: rgba(0,255,136,0.15); color: #00ff88; border: 1px solid rgba(0,255,136,0.3); }
        .badge-manual { background: rgba(255,170,0,0.15); color: #ffaa00; border: 1px solid rgba(255,170,0,0.3); }
        .badge-semi { background: rgba(0,170,255,0.15); color: #00aaff; border: 1px solid rgba(0,170,255,0.3); }
        .check-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 8px; transition: all 0.2s; cursor: pointer; }
        .check-item:hover { background: rgba(255,255,255,0.03); border-color: rgba(0,255,136,0.15); }
      `}</style>

      {/* HEADER */}
      <div style={{
        padding: "24px 28px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, rgba(0,255,136,0.03) 0%, transparent 100%)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <span style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px",
                background: "linear-gradient(135deg, #00ff88, #00ccff, #8866ff)", backgroundSize: "200% 200%",
                animation: "gradient 4s ease infinite",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>SEIZED ASSET ARBITRAGE</span>
              <GlowDot color="#00ff88" pulse />
            </div>
            <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.5px" }}>
              USAuctionOnline.com → Multi-Channel Resale Pipeline
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#444" }}>SYSTEM STATUS</div>
            <div style={{ fontSize: 12, color: "#00ff88", display: "flex", alignItems: "center", gap: 6 }}>
              <GlowDot color="#00ff88" size={6} pulse /> ARCHITECTURE READY
            </div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "20px 28px", animation: "slideUp 0.4s ease" }}>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { value: `$${financials.monthlyProfit.toFixed(0)}`, label: "Est. Monthly Profit", color: "#00ff88" },
                { value: `${financials.roi.toFixed(0)}%`, label: "Return on Investment", color: "#00ccff" },
                { value: "7/10", label: "Steps Automated", color: "#8866ff" },
                { value: "6+", label: "Resale Channels", color: "#ffaa00" },
              ].map((m, i) => (
                <div key={i} className="card metric">
                  <div className="metric-value" style={{
                    background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#00ff88", marginBottom: 12 }}>⚡ BUSINESS MODEL</div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.8 }}>
                <strong style={{ color: "#e0e0e0" }}>Source:</strong> USAuctionOnline.com — seized, confiscated, estate, & bankruptcy merchandise<br/>
                <strong style={{ color: "#e0e0e0" }}>Strategy:</strong> Win auctions at 20-40% of retail → Resell at 60-85% of retail across 6+ channels<br/>
                <strong style={{ color: "#e0e0e0" }}>Categories:</strong> Jewelry, Coins/Bullion, Art, Designer, Collectibles, Sterling Silver<br/>
                <strong style={{ color: "#e0e0e0" }}>Edge:</strong> AI-powered market value analysis → Only bid on items with 50%+ margin potential<br/>
                <strong style={{ color: "#e0e0e0" }}>Automation:</strong> 7 of 10 pipeline steps are fully automated via CF Workers + Supabase + Telegram
              </div>
            </div>

            <div className="card">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#ffaa00", marginBottom: 12 }}>⚠️ HONEST CONSTRAINTS</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.8 }}>
                • <strong style={{ color: "#ffaa00" }}>Not true drop-shipping</strong> — You must win auctions, receive items, then resell (buy→hold→flip)<br/>
                • <strong style={{ color: "#ffaa00" }}>Bidding is manual</strong> — Financial transactions require your direct action<br/>
                • <strong style={{ color: "#ffaa00" }}>No public API</strong> — Monitoring relies on web scraping (may violate ToS, use responsibly)<br/>
                • <strong style={{ color: "#ffaa00" }}>Physical handling</strong> — You receive, photograph, and ship items from Michigan<br/>
                • <strong style={{ color: "#ffaa00" }}>Authentication risk</strong> — Some items may not match descriptions; build refund buffer<br/>
                • <strong style={{ color: "#ffaa00" }}>Capital at risk</strong> — Auction wins are non-refundable (except guarantee discrepancies)
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {activeTab === "pipeline" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#00ccff", marginBottom: 16 }}>🔄 10-STEP AUTOMATION PIPELINE</div>
            {AUTOMATION_PIPELINE.map((step, i) => (
              <div key={i}>
                <div className="card" style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                    background: step.auto ? "rgba(0,255,136,0.1)" : step.status === "semi-auto" ? "rgba(0,170,255,0.1)" : "rgba(255,170,0,0.1)",
                    border: `1px solid ${step.auto ? "rgba(0,255,136,0.3)" : step.status === "semi-auto" ? "rgba(0,170,255,0.3)" : "rgba(255,170,0,0.3)"}`,
                    fontSize: 14, fontWeight: 700, color: step.auto ? "#00ff88" : step.status === "semi-auto" ? "#00aaff" : "#ffaa00",
                    flexShrink: 0,
                  }}>{step.step}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{step.name}</span>
                      <span className={`badge ${step.auto ? "badge-auto" : step.status === "semi-auto" ? "badge-semi" : "badge-manual"}`}>
                        {step.auto ? "AUTO" : step.status === "semi-auto" ? "SEMI" : "MANUAL"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{step.desc}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>Tech: {step.tech}</div>
                  </div>
                  <div style={{
                    fontSize: 10, padding: "4px 8px", borderRadius: 4,
                    background: step.status === "buildable" ? "rgba(0,255,136,0.08)" : step.status === "manual" ? "rgba(255,170,0,0.08)" : "rgba(0,170,255,0.08)",
                    color: step.status === "buildable" ? "#00ff88" : step.status === "manual" ? "#ffaa00" : "#00aaff",
                    border: `1px solid ${step.status === "buildable" ? "rgba(0,255,136,0.2)" : step.status === "manual" ? "rgba(255,170,0,0.2)" : "rgba(0,170,255,0.2)"}`,
                    textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
                  }}>{step.status}</div>
                </div>
                {i < AUTOMATION_PIPELINE.length - 1 && <div className="step-line" />}
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES */}
        {activeTab === "categories" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8866ff", marginBottom: 16 }}>📦 CATEGORY STRATEGY — USAuctionOnline.com</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="card" onClick={() => setSelectedCat(selectedCat === i ? null : i)}
                  style={{ cursor: "pointer", borderColor: selectedCat === i ? "rgba(136,102,255,0.4)" : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 15 }}>{cat.icon} <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{cat.name}</span></span>
                    <span style={{ fontSize: 11, color: "#00ff88", fontWeight: 600 }}>{cat.margin}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 10, color: "#666" }}>
                    <span>Risk: <span style={{ color: cat.risk === "Low" ? "#00ff88" : cat.risk === "Medium" ? "#ffaa00" : "#ff4444" }}>{cat.risk}</span></span>
                    <span>Volume: <span style={{ color: "#aaa" }}>{cat.volume}</span></span>
                  </div>
                  {selectedCat === i && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ fontSize: 10, color: "#555", marginBottom: 6 }}>SUBCATEGORIES</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {cat.subcats.map((s, j) => (
                          <span key={j} style={{
                            fontSize: 10, padding: "3px 8px", borderRadius: 4,
                            background: "rgba(136,102,255,0.08)", border: "1px solid rgba(136,102,255,0.2)",
                            color: "#aa88ff",
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#00ff88", marginBottom: 8 }}>🎯 RECOMMENDED START — Low Risk / High Volume</div>
              <div style={{ fontSize: 11, color: "#999", lineHeight: 1.7 }}>
                1. <strong style={{ color: "#e0e0e0" }}>Coins & Bullion</strong> — Predictable margins, easy to verify, strong eBay market<br/>
                2. <strong style={{ color: "#e0e0e0" }}>Sterling Silver</strong> — Low risk, melt value floor, consistent demand<br/>
                3. <strong style={{ color: "#e0e0e0" }}>Certified Jewelry</strong> — GIA/IGI certs reduce authentication risk
              </div>
            </div>
          </div>
        )}

        {/* CHANNELS */}
        {activeTab === "channels" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#ffaa00", marginBottom: 16 }}>🏪 RESALE CHANNELS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {RESALE_CHANNELS.map((ch, i) => (
                <div key={i} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: ch.color }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e0e0e0" }}>{ch.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#ff6b6b", fontWeight: 600 }}>{ch.fee} fee</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#888", lineHeight: 1.7 }}>
                    <span style={{ color: "#666" }}>Audience:</span> {ch.audience}<br/>
                    <span style={{ color: "#666" }}>Best for:</span> {ch.best}<br/>
                    <span style={{ color: "#666" }}>Setup:</span>{" "}
                    <span style={{ color: ch.setup === "API ready" || ch.setup === "Ready" ? "#00ff88" : "#ffaa00" }}>{ch.setup}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#00ccff", marginBottom: 8 }}>📋 CROSS-POSTING STRATEGY</div>
              <div style={{ fontSize: 11, color: "#999", lineHeight: 1.7 }}>
                Primary: eBay (largest audience, API automation) + Shopify (brand building, SEO)<br/>
                Secondary: Whatnot (live auctions for coins/collectibles) + Poshmark (designer/jewelry)<br/>
                Tertiary: FB Marketplace (local, zero shipping) + 1stDibs (high-end art/rugs)<br/>
                <strong style={{ color: "#e0e0e0" }}>Automation:</strong> CF Worker cross-posts to all channels via APIs from single Supabase listing
              </div>
            </div>
          </div>
        )}

        {/* FINANCIALS */}
        {activeTab === "financials" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#00ff88", marginBottom: 16 }}>💰 INTERACTIVE P&L CALCULATOR</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="card">
                <div style={{ fontSize: 12, fontWeight: 600, color: "#00ccff", marginBottom: 16 }}>ADJUST MODEL</div>
                {[
                  { key: "items_per_month", label: "Items/Month", min: 1, max: 50, step: 1, unit: "" },
                  { key: "avg_win_price", label: "Avg Win Price", min: 5, max: 200, step: 5, unit: "$" },
                  { key: "avg_resale", label: "Avg Resale Price", min: 20, max: 500, step: 5, unit: "$" },
                  { key: "buyer_premium", label: "Buyer's Premium", min: 0.10, max: 0.25, step: 0.01, unit: "%", pct: true },
                  { key: "shipping_in", label: "Shipping (Inbound)", min: 5, max: 30, step: 1, unit: "$" },
                  { key: "shipping_out", label: "Shipping (Outbound)", min: 5, max: 20, step: 1, unit: "$" },
                  { key: "resale_fees", label: "Platform Fees", min: 0.05, max: 0.25, step: 0.01, unit: "%", pct: true },
                ].map((s, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                      <span>{s.label}</span>
                      <span style={{ color: "#00ff88", fontWeight: 600 }}>
                        {s.pct ? `${(model[s.key] * 100).toFixed(0)}%` : `${s.unit}${model[s.key]}`}
                      </span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={model[s.key]}
                      onChange={e => setModel(m => ({ ...m, [s.key]: parseFloat(e.target.value) }))} />
                  </div>
                ))}
              </div>

              <div>
                <div className="card" style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#00ff88", marginBottom: 12 }}>PER ITEM BREAKDOWN</div>
                  {[
                    { label: "Winning Bid", val: `$${model.avg_win_price.toFixed(2)}`, color: "#ff6b6b" },
                    { label: `+ Buyer Premium (${(model.buyer_premium*100).toFixed(0)}%)`, val: `$${(model.avg_win_price * model.buyer_premium).toFixed(2)}`, color: "#ff6b6b" },
                    { label: "+ Inbound Shipping", val: `$${model.shipping_in.toFixed(2)}`, color: "#ff6b6b" },
                    { label: "= Total Cost", val: `$${financials.totalCostPerItem.toFixed(2)}`, color: "#ffaa00", bold: true },
                    { label: "Resale Price", val: `$${model.avg_resale.toFixed(2)}`, color: "#00ff88" },
                    { label: `- Platform Fees (${(model.resale_fees*100).toFixed(0)}%)`, val: `-$${financials.feesPerItem.toFixed(2)}`, color: "#ff6b6b" },
                    { label: "- Outbound Shipping", val: `-$${model.shipping_out.toFixed(2)}`, color: "#ff6b6b" },
                    { label: "= PROFIT PER ITEM", val: `$${financials.profitPerItem.toFixed(2)}`, color: financials.profitPerItem > 0 ? "#00ff88" : "#ff4444", bold: true },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", padding: "4px 0",
                      fontSize: r.bold ? 12 : 11, fontWeight: r.bold ? 700 : 400,
                      color: r.color, borderTop: r.bold ? "1px solid rgba(255,255,255,0.08)" : "none",
                      marginTop: r.bold ? 6 : 0, paddingTop: r.bold ? 8 : 4,
                    }}>
                      <span>{r.label}</span><span>{r.val}</span>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#8866ff", marginBottom: 12 }}>MONTHLY PROJECTION</div>
                  {[
                    { label: "Items Flipped", val: model.items_per_month, color: "#e0e0e0" },
                    { label: "Total Investment", val: `$${financials.monthlyInvestment.toFixed(0)}`, color: "#ffaa00" },
                    { label: "Total Revenue", val: `$${financials.monthlyRevenue.toFixed(0)}`, color: "#00ccff" },
                    { label: "NET PROFIT", val: `$${financials.monthlyProfit.toFixed(0)}`, color: financials.monthlyProfit > 0 ? "#00ff88" : "#ff4444", bold: true },
                    { label: "ROI", val: `${financials.roi.toFixed(0)}%`, color: financials.roi > 0 ? "#00ff88" : "#ff4444", bold: true },
                    { label: "Annual (projected)", val: `$${(financials.monthlyProfit * 12).toFixed(0)}`, color: "#8866ff" },
                  ].map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", padding: "5px 0",
                      fontSize: r.bold ? 13 : 11, fontWeight: r.bold ? 700 : 400, color: r.color,
                    }}>
                      <span style={{ color: r.bold ? r.color : "#888" }}>{r.label}</span><span>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEPLOY */}
        {activeTab === "deploy" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#00ff88", marginBottom: 16 }}>🚀 ACTIVATION CHECKLIST</div>
            {[
              { phase: "PHASE 1: FOUNDATION", color: "#00ff88", items: [
                { task: "Register on USAuctionOnline.com", who: "YOU", status: "todo", detail: "Free account, need name + address + email + phone" },
                { task: "Create eBay seller account", who: "YOU", status: "todo", detail: "Business account with PayPal/bank linked" },
                { task: "Set up Shopify store", who: "CLAUDE", status: "ready", detail: "Can build storefront on Vercel with Stripe checkout" },
                { task: "Create Supabase inventory schema", who: "CLAUDE", status: "ready", detail: "Products, bids, wins, listings, P&L tables" },
                { task: "Get Pirate Ship account", who: "YOU", status: "todo", detail: "Discounted USPS/UPS labels, free account" },
              ]},
              { phase: "PHASE 2: MONITORING", color: "#00ccff", items: [
                { task: "Deploy USAO monitor CF Worker", who: "CLAUDE", status: "ready", detail: "Scrapes categories every 30min, stores in D1" },
                { task: "Deploy Groq valuation engine", who: "CLAUDE", status: "ready", detail: "AI estimates market value from item descriptions + images" },
                { task: "Configure Telegram alerts", who: "CLAUDE", status: "ready", detail: "Bot sends top picks with margin analysis to your phone" },
              ]},
              { phase: "PHASE 3: RESALE ENGINE", color: "#8866ff", items: [
                { task: "Deploy listing generator CF Worker", who: "CLAUDE", status: "ready", detail: "AI creates SEO titles, descriptions, pricing from your photos" },
                { task: "Deploy cross-poster Worker", who: "CLAUDE", status: "ready", detail: "Publishes to eBay + Shopify + FB simultaneously" },
                { task: "Deploy Shippo/Pirate Ship integration", who: "CLAUDE", status: "ready", detail: "Auto-generates labels when orders come in" },
                { task: "Deploy P&L tracker", who: "CLAUDE", status: "ready", detail: "Supabase edge function tracks margin per item, monthly rollup" },
              ]},
              { phase: "PHASE 4: SCALE", color: "#ffaa00", items: [
                { task: "Add Whatnot live selling", who: "YOU", status: "future", detail: "Live auction format for coins/collectibles, apply for seller account" },
                { task: "Add 1stDibs for high-end", who: "YOU", status: "future", detail: "Application-based, for art/rugs/antiques over $500" },
                { task: "Hire VA for shipping", who: "YOU", status: "future", detail: "When doing 30+ items/month, outsource physical handling" },
                { task: "AuthiChain integration", who: "CLAUDE", status: "future", detail: "Blockchain authentication certificates for resold items (premium pricing)" },
              ]},
            ].map((phase, pi) => (
              <div key={pi} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: phase.color, marginBottom: 10, letterSpacing: "0.5px" }}>
                  {phase.phase}
                </div>
                {phase.items.map((item, ii) => (
                  <div key={ii} className="check-item">
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `2px solid ${item.status === "ready" ? "#00ff88" : item.status === "future" ? "#555" : "#ffaa00"}`,
                      background: item.status === "ready" ? "rgba(0,255,136,0.15)" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, color: "#00ff88",
                    }}>{item.status === "ready" ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: "#e0e0e0", fontWeight: 500 }}>{item.task}</div>
                      <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{item.detail}</div>
                    </div>
                    <span className={`badge ${item.who === "CLAUDE" ? "badge-auto" : "badge-manual"}`}>
                      {item.who}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{
        padding: "12px 28px", borderTop: "1px solid rgba(255,255,255,0.04)",
        fontSize: 10, color: "#333", display: "flex", justifyContent: "space-between",
      }}>
        <span>Seized Asset Arbitrage Engine — Built for Zac</span>
        <span>Authentic Economy Infrastructure</span>
      </div>
    </div>
  );
}
