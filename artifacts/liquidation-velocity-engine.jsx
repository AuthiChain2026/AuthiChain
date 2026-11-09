import { useState, useEffect } from "react";

const SOURCES = [
  { name: "B-Stock (Amazon Official)", url: "bstock.com", cost: "$200-800/pallet", items: "30-50", speed: "Buy now", quality: "Manifested", margin: "40-60%", tier: "primary" },
  { name: "Direct Liquidation", url: "directliquidation.com", cost: "$100-500/pallet", items: "25-40", speed: "Buy now + auctions", quality: "Manifested", margin: "30-50%", tier: "primary" },
  { name: "BULQ", url: "bulq.com", cost: "$100-400/lot", items: "15-30", speed: "Fixed price", quality: "Graded (New/Like New)", margin: "50-80%", tier: "primary" },
  { name: "888Lots", url: "888lots.com", cost: "$150-600/pallet", items: "20-40", speed: "Fixed price", quality: "Inspectable", margin: "40-70%", tier: "primary" },
  { name: "Amazon Bulk Liquidation", url: "amazon.com/liquidation", cost: "$300-1200/pallet", items: "40-80", speed: "Buy now", quality: "Direct from Amazon", margin: "30-50%", tier: "secondary" },
  { name: "Local MI Liquidation", url: "FB Groups/Craigslist", cost: "$50-300/lot", items: "10-30", speed: "Same day pickup", quality: "Inspect first", margin: "60-200%", tier: "secondary" },
  { name: "Walmart Liquidation", url: "bstock.com/walmart", cost: "$200-700/pallet", items: "30-60", speed: "Auction", quality: "Manifested", margin: "35-55%", tier: "secondary" },
  { name: "Target Salvage", url: "bstock.com/target", cost: "$100-400/pallet", items: "20-40", speed: "Auction", quality: "Mixed", margin: "30-60%", tier: "secondary" },
];

const SELL_CHANNELS = [
  { name: "Whatnot Live", icon: "📺", margin: "HIGHEST", fee: "8%", speed: "Instant", why: "Live unboxing = entertainment + sales. Coins/electronics/mystery = highest engagement", priority: 1 },
  { name: "eBay (Fixed + Auction)", icon: "🏪", margin: "High", fee: "13.25%", speed: "3-14 days", why: "Largest audience. Electronics, branded goods, collectibles. API automatable", priority: 2 },
  { name: "Facebook Marketplace", icon: "📱", margin: "High", fee: "5%", speed: "Same day", why: "Zero shipping cost on local. Furniture, appliances, bulky items", priority: 3 },
  { name: "Mercari", icon: "🎯", margin: "Medium", fee: "10%", speed: "3-7 days", why: "Fashion, home goods, smaller items. Young demo, easy listing", priority: 4 },
  { name: "Poshmark", icon: "👗", margin: "Medium", fee: "20%", speed: "5-14 days", why: "Branded clothing/accessories only. High fees but captive audience", priority: 5 },
  { name: "TikTok Shop", icon: "🎬", margin: "HIGHEST", fee: "5%", speed: "Instant", why: "Live selling + short-form content. Unboxing videos = organic traffic", priority: 6 },
  { name: "Your Shopify (AuthiChain Verified)", icon: "🔗", margin: "Highest", fee: "2.9%", speed: "Varies", why: "Premium pricing via blockchain auth certs. SEO long game", priority: 7 },
];

const REVENUE_STREAMS = [
  { name: "Pallet Flipping", type: "Physical", monthlyLow: 800, monthlyHigh: 3000, startup: 300, timeToFirst: "1 week", difficulty: "Easy", icon: "📦" },
  { name: "Whatnot Live Selling", type: "Physical+Digital", monthlyLow: 500, monthlyHigh: 5000, startup: 0, timeToFirst: "2 weeks", difficulty: "Medium", icon: "📺" },
  { name: "TikTok Unboxing Content", type: "Digital", monthlyLow: 200, monthlyHigh: 2000, startup: 0, timeToFirst: "1 month", difficulty: "Medium", icon: "🎬" },
  { name: "AuthiChain Certs (addon)", type: "Digital", monthlyLow: 100, monthlyHigh: 500, startup: 0, timeToFirst: "Immediate", difficulty: "Already built", icon: "🔗" },
  { name: "QR Art (QRON)", type: "Digital", monthlyLow: 50, monthlyHigh: 500, startup: 0, timeToFirst: "Immediate", difficulty: "Already built", icon: "🎨" },
  { name: "Affiliate/Referral", type: "Digital", monthlyLow: 50, monthlyHigh: 300, startup: 0, timeToFirst: "2 weeks", difficulty: "Easy", icon: "🤝" },
];

const WEEK_PLAN = [
  { week: 1, title: "FOUNDATION", tasks: [
    { task: "Buy first manifested pallet from BULQ or 888Lots ($150-300)", who: "YOU", money: "-$250", result: "30+ items in hand" },
    { task: "Register eBay seller account + Mercari + FB Marketplace", who: "YOU", money: "$0", result: "3 channels active" },
    { task: "Sort, test, photograph all items (4-6 hours)", who: "YOU", money: "$0", result: "Inventory documented" },
    { task: "List top 15 items across all channels", who: "YOU", money: "$0", result: "First listings live" },
  ]},
  { week: 2, title: "FIRST REVENUE", tasks: [
    { task: "First sales start hitting (eBay + FB Marketplace)", who: "AUTO", money: "+$200-400", result: "Revenue validated" },
    { task: "Apply for Whatnot seller account", who: "YOU", money: "$0", result: "Live selling unlocked (in ~2 weeks)" },
    { task: "Film 3 TikTok unboxing videos from pallet items", who: "YOU", money: "$0", result: "Content pipeline started" },
    { task: "Deploy CF Worker: auto-price-checker (scans eBay sold listings)", who: "CLAUDE", money: "$0", result: "Pricing automation" },
  ]},
  { week: 3, title: "ACCELERATION", tasks: [
    { task: "Buy second pallet using profits from first ($200-400)", who: "YOU", money: "-$300", result: "Reinvesting profits" },
    { task: "First Whatnot live stream (coins, electronics, mystery items)", who: "YOU", money: "+$200-800", result: "Live selling revenue" },
    { task: "Deploy Supabase inventory tracker + P&L per item", who: "CLAUDE", money: "$0", result: "Full financial visibility" },
    { task: "Add AuthiChain certs to premium items ($5 addon per item)", who: "CLAUDE", money: "+$50-100", result: "Premium differentiation" },
  ]},
  { week: 4, title: "SYSTEM LOCK", tasks: [
    { task: "Total Month 1 projection: $800-2,000 revenue on $550 invested", who: "RESULT", money: "+$250-1450", result: "45-260% ROI" },
    { task: "Deploy Telegram deal alert bot (monitors B-Stock/BULQ prices)", who: "CLAUDE", money: "$0", result: "Never miss a deal" },
    { task: "Deploy cross-listing automation (one entry → all platforms)", who: "CLAUDE", money: "$0", result: "10x listing speed" },
    { task: "Create SOPs for repeatable weekly pallet processing", who: "CLAUDE", money: "$0", result: "System documented" },
  ]},
];

function ModelSlider({ label, value, onChange, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: "#8a8f98" }}>{label}</span>
        <span style={{ color: "#00ff88", fontWeight: 600 }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, WebkitAppearance: "none", outline: "none" }} />
    </div>
  );
}

export default function LiquidationVelocityEngine() {
  const [tab, setTab] = useState("model");
  const [palletsPerMonth, setPalletsPerMonth] = useState(3);
  const [avgPalletCost, setAvgPalletCost] = useState(250);
  const [itemsPerPallet, setItemsPerPallet] = useState(35);
  const [sellableRate, setSellableRate] = useState(0.75);
  const [avgResalePrice, setAvgResalePrice] = useState(32);
  const [avgFeeRate, setAvgFeeRate] = useState(0.11);
  const [avgShipCost, setAvgShipCost] = useState(6);
  const [liveSellingPct, setLiveSellingPct] = useState(0.3);
  const [liveMarkup, setLiveMarkup] = useState(1.4);

  const totalItems = palletsPerMonth * itemsPerPallet;
  const sellableItems = Math.floor(totalItems * sellableRate);
  const liveItems = Math.floor(sellableItems * liveSellingPct);
  const listingItems = sellableItems - liveItems;
  const liveRevenue = liveItems * avgResalePrice * liveMarkup;
  const listingRevenue = listingItems * avgResalePrice;
  const totalRevenue = liveRevenue + listingRevenue;
  const totalFees = totalRevenue * avgFeeRate;
  const totalShipping = listingItems * avgShipCost;
  const totalCost = palletsPerMonth * avgPalletCost;
  const freight = palletsPerMonth * 75;
  const totalExpense = totalCost + totalFees + totalShipping + freight;
  const profit = totalRevenue - totalExpense;
  const roi = totalCost > 0 ? ((profit / totalCost) * 100) : 0;
  const digitalAddon = (sellableItems * 0.15 * 10) + 200;
  const totalWithDigital = profit + digitalAddon;

  const tabs = [
    { id: "model", label: "💰 Revenue Model" },
    { id: "sources", label: "📦 Supply Chain" },
    { id: "channels", label: "🏪 Sell Channels" },
    { id: "streams", label: "⚡ Income Streams" },
    { id: "plan", label: "🗓️ 4-Week Launch" },
    { id: "vs", label: "⚔️ USAO vs This" },
  ];

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      background: "#050508", color: "#c8ccd4", minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes enter { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 18px; position: relative; }
        .panel::after { content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,200,0,0.2), transparent); }
        .t { cursor: pointer; padding: 8px 14px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); font-size: 11px; font-family: inherit; color: #666; background: transparent; transition: all 0.2s; white-space: nowrap; }
        .t:hover { color: #aaa; border-color: rgba(255,200,0,0.2); }
        .t.on { color: #ffc800; border-color: #ffc800; background: rgba(255,200,0,0.06); box-shadow: 0 0 15px rgba(255,200,0,0.08); }
        .tag { display: inline-block; padding: 2px 7px; border-radius: 3px; font-size: 9px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; }
        input[type="range"] { -webkit-appearance: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #ffc800; cursor: pointer; box-shadow: 0 0 8px rgba(255,200,0,0.5); }
        .row { display: flex; gap: 12px; }
        @media (max-width: 700px) { .row { flex-direction: column; } }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "linear-gradient(180deg, rgba(255,200,0,0.02) 0%, transparent 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: "#ffc800", letterSpacing: "-0.5px" }}>
              LIQUIDATION VELOCITY ENGINE
            </div>
            <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>Multi-Source Pallet Arbitrage + Live Selling + Digital Hybrid</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#444" }}>vs USAO Model</div>
            <div style={{ fontSize: 11, color: "#00ff88" }}>3-5x faster to revenue</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.id} className={`t ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 24px", animation: "enter 0.3s ease" }} key={tab}>

        {/* REVENUE MODEL */}
        {tab === "model" && (
          <div>
            <div className="row">
              <div className="panel" style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>TUNE YOUR MODEL</div>
                <ModelSlider label="Pallets/Month" value={palletsPerMonth} onChange={setPalletsPerMonth} min={1} max={10} step={1} format={v => v} />
                <ModelSlider label="Avg Pallet Cost" value={avgPalletCost} onChange={setAvgPalletCost} min={100} max={800} step={25} format={v => `$${v}`} />
                <ModelSlider label="Items per Pallet" value={itemsPerPallet} onChange={setItemsPerPallet} min={10} max={80} step={5} format={v => v} />
                <ModelSlider label="Sellable Rate" value={sellableRate} onChange={setSellableRate} min={0.5} max={0.95} step={0.05} format={v => `${(v*100).toFixed(0)}%`} />
                <ModelSlider label="Avg Resale Price" value={avgResalePrice} onChange={setAvgResalePrice} min={10} max={80} step={2} format={v => `$${v}`} />
                <ModelSlider label="Avg Platform Fee" value={avgFeeRate} onChange={setAvgFeeRate} min={0.05} max={0.2} step={0.01} format={v => `${(v*100).toFixed(0)}%`} />
                <ModelSlider label="Avg Ship Cost" value={avgShipCost} onChange={setAvgShipCost} min={0} max={15} step={1} format={v => `$${v}`} />
                <ModelSlider label="% Sold via Live Stream" value={liveSellingPct} onChange={setLiveSellingPct} min={0} max={0.8} step={0.05} format={v => `${(v*100).toFixed(0)}%`} />
                <ModelSlider label="Live Stream Markup" value={liveMarkup} onChange={setLiveMarkup} min={1} max={2.5} step={0.1} format={v => `${v.toFixed(1)}x`} />
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="panel">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#00ff88", marginBottom: 10 }}>MONTHLY P&L</div>
                  {[
                    { l: "Total Items Processed", v: totalItems, c: "#c8ccd4" },
                    { l: "Sellable Items", v: `${sellableItems} (${(sellableRate*100).toFixed(0)}%)`, c: "#c8ccd4" },
                    { l: "Listed Items Revenue", v: `$${listingRevenue.toFixed(0)}`, c: "#00ccff" },
                    { l: `Live Stream Revenue (${(liveSellingPct*100).toFixed(0)}% × ${liveMarkup}x)`, v: `$${liveRevenue.toFixed(0)}`, c: "#ffc800" },
                    { l: "TOTAL REVENUE", v: `$${totalRevenue.toFixed(0)}`, c: "#00ff88", bold: true },
                    {},
                    { l: "Pallet Costs", v: `-$${totalCost.toFixed(0)}`, c: "#ff6b6b" },
                    { l: "Platform Fees", v: `-$${totalFees.toFixed(0)}`, c: "#ff6b6b" },
                    { l: "Shipping Out", v: `-$${totalShipping.toFixed(0)}`, c: "#ff6b6b" },
                    { l: "Freight/Pickup", v: `-$${freight.toFixed(0)}`, c: "#ff6b6b" },
                    { l: "TOTAL EXPENSES", v: `-$${totalExpense.toFixed(0)}`, c: "#ff6b6b", bold: true },
                    {},
                    { l: "NET PROFIT (Physical)", v: `$${profit.toFixed(0)}`, c: profit > 0 ? "#00ff88" : "#ff4444", bold: true },
                    { l: "+ Digital Layer (AuthiChain + QRON)", v: `+$${digitalAddon.toFixed(0)}`, c: "#ffc800" },
                    { l: "TOTAL w/ DIGITAL", v: `$${totalWithDigital.toFixed(0)}`, c: "#ffc800", bold: true },
                  ].map((r, i) => r.l ? (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", padding: "3px 0",
                      fontSize: r.bold ? 12 : 10, fontWeight: r.bold ? 700 : 400, color: r.c,
                      borderTop: r.bold ? "1px solid rgba(255,255,255,0.06)" : "none",
                      marginTop: r.bold ? 4 : 0, paddingTop: r.bold ? 6 : 3,
                    }}>
                      <span style={{ color: r.bold ? r.c : "#666" }}>{r.l}</span><span>{r.v}</span>
                    </div>
                  ) : <div key={i} style={{ height: 4 }} />)}
                </div>

                <div className="panel" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "ROI", value: `${roi.toFixed(0)}%`, color: roi > 0 ? "#00ff88" : "#ff4444" },
                    { label: "$/Hour (est 20h/mo)", value: `$${(totalWithDigital/20).toFixed(0)}`, color: "#ffc800" },
                    { label: "Annual Projection", value: `$${(totalWithDigital*12).toFixed(0)}`, color: "#00ccff" },
                    { label: "Break-even Items", value: `${Math.ceil(totalExpense / avgResalePrice)}`, color: "#c8ccd4" },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOURCES */}
        {tab === "sources" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>📦 MULTI-SOURCE SUPPLY CHAIN</div>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 14 }}>Why this beats USAO: Fixed prices, manifests, bulk buying, no auction waiting. Buy → Sort → Sell in days, not weeks.</div>
            {["primary", "secondary"].map(tier => (
              <div key={tier} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: tier === "primary" ? "#00ff88" : "#666", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                  {tier === "primary" ? "⭐ PRIMARY SOURCES — Start Here" : "SECONDARY SOURCES — Scale Into"}
                </div>
                {SOURCES.filter(s => s.tier === tier).map((s, i) => (
                  <div key={i} className="panel" style={{ marginBottom: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e0", marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: "#555" }}>{s.url}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, auto)", gap: 10, fontSize: 10 }}>
                      {[
                        { l: "Cost", v: s.cost, c: "#ffaa00" },
                        { l: "Items", v: s.items, c: "#c8ccd4" },
                        { l: "Speed", v: s.speed, c: "#00ff88" },
                        { l: "Quality", v: s.quality, c: "#00ccff" },
                        { l: "Margin", v: s.margin, c: "#ffc800" },
                      ].map((f, j) => (
                        <div key={j} style={{ textAlign: "center" }}>
                          <div style={{ color: "#444", fontSize: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.l}</div>
                          <div style={{ color: f.c, fontWeight: 500, whiteSpace: "nowrap" }}>{f.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* CHANNELS */}
        {tab === "channels" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>🏪 SELL CHANNELS — Ranked by Velocity × Margin</div>
            {SELL_CHANNELS.map((ch, i) => (
              <div key={i} className="panel" style={{ marginBottom: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{ch.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{ch.name}</span>
                    <span className="tag" style={{
                      background: ch.margin === "HIGHEST" ? "rgba(255,200,0,0.12)" : ch.margin === "High" ? "rgba(0,255,136,0.1)" : "rgba(255,255,255,0.05)",
                      color: ch.margin === "HIGHEST" ? "#ffc800" : ch.margin === "High" ? "#00ff88" : "#888",
                      border: `1px solid ${ch.margin === "HIGHEST" ? "rgba(255,200,0,0.3)" : ch.margin === "High" ? "rgba(0,255,136,0.2)" : "rgba(255,255,255,0.08)"}`,
                    }}>{ch.margin} margin</span>
                    <span className="tag" style={{ background: "rgba(255,255,255,0.04)", color: "#888", border: "1px solid rgba(255,255,255,0.06)" }}>{ch.fee} fee</span>
                    <span className="tag" style={{ background: "rgba(0,204,255,0.08)", color: "#00ccff", border: "1px solid rgba(0,204,255,0.2)" }}>{ch.speed}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#666", lineHeight: 1.5 }}>{ch.why}</div>
                </div>
              </div>
            ))}
            <div className="panel" style={{ marginTop: 12, borderColor: "rgba(255,200,0,0.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#ffc800", marginBottom: 6 }}>🔑 KEY INSIGHT: Live Selling is the Multiplier</div>
              <div style={{ fontSize: 10, color: "#888", lineHeight: 1.6 }}>
                Whatnot/TikTok Live selling turns a $300 pallet into entertainment. Unboxing creates urgency + FOMO → items sell at 1.3-2x what they'd get on eBay. One 2-hour stream can clear half a pallet. This is the single biggest margin lever in the entire model.
              </div>
            </div>
          </div>
        )}

        {/* INCOME STREAMS */}
        {tab === "streams" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>⚡ 6 REVENUE STREAMS — Physical + Digital Hybrid</div>
            {REVENUE_STREAMS.map((s, i) => (
              <div key={i} className="panel" style={{ marginBottom: 8, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 24, width: 40, textAlign: "center", flexShrink: 0 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e0" }}>{s.name}</span>
                    <span className="tag" style={{
                      background: s.type === "Digital" ? "rgba(136,102,255,0.1)" : s.type.includes("+") ? "rgba(255,200,0,0.1)" : "rgba(0,204,255,0.08)",
                      color: s.type === "Digital" ? "#aa88ff" : s.type.includes("+") ? "#ffc800" : "#00ccff",
                      border: `1px solid ${s.type === "Digital" ? "rgba(136,102,255,0.2)" : s.type.includes("+") ? "rgba(255,200,0,0.2)" : "rgba(0,204,255,0.15)"}`,
                    }}>{s.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 10, color: "#666" }}>
                    <span>Range: <span style={{ color: "#00ff88" }}>${s.monthlyLow}-${s.monthlyHigh}/mo</span></span>
                    <span>Startup: <span style={{ color: s.startup === 0 ? "#00ff88" : "#ffaa00" }}>{s.startup === 0 ? "Free" : `$${s.startup}`}</span></span>
                    <span>First $: <span style={{ color: "#ffc800" }}>{s.timeToFirst}</span></span>
                    <span>Difficulty: <span style={{ color: s.difficulty === "Already built" ? "#00ff88" : "#ccc" }}>{s.difficulty}</span></span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: "#00ff88" }}>${s.monthlyHigh}</div>
                  <div style={{ fontSize: 8, color: "#444", textTransform: "uppercase" }}>max/mo</div>
                </div>
              </div>
            ))}
            <div className="panel" style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { l: "Combined Low", v: `$${REVENUE_STREAMS.reduce((a, s) => a + s.monthlyLow, 0).toLocaleString()}`, c: "#888" },
                { l: "Combined High", v: `$${REVENUE_STREAMS.reduce((a, s) => a + s.monthlyHigh, 0).toLocaleString()}`, c: "#ffc800" },
                { l: "Annual Ceiling", v: `$${(REVENUE_STREAMS.reduce((a, s) => a + s.monthlyHigh, 0) * 12).toLocaleString()}`, c: "#00ff88" },
              ].map((m, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, color: m.c }}>{m.v}</div>
                  <div style={{ fontSize: 9, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>{m.l}/mo</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4-WEEK PLAN */}
        {tab === "plan" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>🗓️ 4-WEEK LAUNCH → FIRST DOLLAR IN 7 DAYS</div>
            {WEEK_PLAN.map((w, wi) => (
              <div key={wi} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#ffc800", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "rgba(255,200,0,0.1)", border: "1px solid rgba(255,200,0,0.3)", borderRadius: 4, padding: "2px 8px", fontSize: 10 }}>WEEK {w.week}</span>
                  {w.title}
                </div>
                {w.tasks.map((t, ti) => (
                  <div key={ti} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.04)", marginBottom: 4, background: "rgba(255,255,255,0.01)" }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, border: "2px solid rgba(255,255,255,0.12)", flexShrink: 0, marginTop: 1 }} />
                    <div style={{ flex: 1, fontSize: 11, color: "#c8ccd4" }}>{t.task}</div>
                    <span className="tag" style={{
                      background: t.who === "CLAUDE" ? "rgba(0,255,136,0.1)" : t.who === "AUTO" ? "rgba(0,204,255,0.1)" : t.who === "RESULT" ? "rgba(255,200,0,0.1)" : "rgba(255,170,0,0.1)",
                      color: t.who === "CLAUDE" ? "#00ff88" : t.who === "AUTO" ? "#00ccff" : t.who === "RESULT" ? "#ffc800" : "#ffaa00",
                      border: `1px solid ${t.who === "CLAUDE" ? "rgba(0,255,136,0.2)" : t.who === "AUTO" ? "rgba(0,204,255,0.2)" : t.who === "RESULT" ? "rgba(255,200,0,0.2)" : "rgba(255,170,0,0.2)"}`,
                    }}>{t.who}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.money.startsWith("+") ? "#00ff88" : t.money.startsWith("-") ? "#ff6b6b" : "#888", minWidth: 80, textAlign: "right" }}>{t.money}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* VS COMPARISON */}
        {tab === "vs" && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#ffc800", marginBottom: 14 }}>⚔️ HEAD-TO-HEAD: USAO Auction Arbitrage vs Liquidation Velocity</div>
            <div className="panel">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <th style={{ textAlign: "left", padding: "8px 0", color: "#555", fontWeight: 600 }}>METRIC</th>
                    <th style={{ textAlign: "center", padding: "8px", color: "#ff6b6b", fontWeight: 600 }}>USAO Arbitrage</th>
                    <th style={{ textAlign: "center", padding: "8px", color: "#00ff88", fontWeight: 600 }}>Liquidation Velocity</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "Time to first $", usao: "2-3 weeks", lv: "5-7 days", winner: "lv" },
                    { metric: "Buying method", usao: "Bid & hope", lv: "Fixed price / Buy now", winner: "lv" },
                    { metric: "Items per purchase", usao: "1 item", lv: "30-50 items (pallet)", winner: "lv" },
                    { metric: "Cost per item", usao: "$35-50 + 18% premium", lv: "$5-15 per item", winner: "lv" },
                    { metric: "Inventory visibility", usao: "No API, manual browsing", lv: "Manifests + API access", winner: "lv" },
                    { metric: "Monthly revenue (realistic)", usao: "$500-950", lv: "$1,500-4,000", winner: "lv" },
                    { metric: "Startup capital needed", usao: "$500+", lv: "$150-300", winner: "lv" },
                    { metric: "Live selling opportunity", usao: "Low (luxury niche)", lv: "High (mass market)", winner: "lv" },
                    { metric: "Content potential", usao: "Low", lv: "High (unboxing/mystery)", winner: "lv" },
                    { metric: "Scalability", usao: "Linear (1 item/bid)", lv: "Exponential (pallets → trucks)", winner: "lv" },
                    { metric: "AuthiChain integration", usao: "Possible (luxury items)", lv: "Possible (premium items)", winner: "tie" },
                    { metric: "Automation potential", usao: "7/10 steps", lv: "8/10 steps", winner: "lv" },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td style={{ padding: "6px 0", color: "#888" }}>{r.metric}</td>
                      <td style={{ textAlign: "center", padding: "6px 8px", color: r.winner === "usao" ? "#00ff88" : "#666" }}>{r.usao}</td>
                      <td style={{ textAlign: "center", padding: "6px 8px", color: r.winner === "lv" ? "#00ff88" : r.winner === "tie" ? "#ffc800" : "#666", fontWeight: r.winner === "lv" ? 600 : 400 }}>{r.lv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="panel" style={{ marginTop: 12, borderColor: "rgba(0,255,136,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#00ff88", marginBottom: 6 }}>VERDICT</div>
              <div style={{ fontSize: 11, color: "#999", lineHeight: 1.7 }}>
                Liquidation Velocity wins on every metric except item quality (USAO has higher-end goods). The play: start with pallets for immediate cash flow, then funnel profits into selective USAO bids for premium items that get AuthiChain certificates and premium pricing on Shopify/1stDibs. Two tiers, one engine.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
