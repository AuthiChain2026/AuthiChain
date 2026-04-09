"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const gold = "#c9a227";
const goldDim = "rgba(201,162,39,0.12)";
const goldBorder = "rgba(201,162,39,0.22)";
const green = "#22c55e";
const greenDim = "rgba(34,197,94,0.10)";
const greenBorder = "rgba(34,197,94,0.22)";
const purple = "#a78bfa";
const purpleDim = "rgba(167,139,250,0.10)";
const purpleBorder = "rgba(167,139,250,0.22)";
const bg = "#060608";
const border = "rgba(255,255,255,0.07)";

const AGENTS = [
  { name:"Guardian",  weight:"35%", color:green },
  { name:"Archivist", weight:"20%", color:gold },
  { name:"Sentinel",  weight:"25%", color:purple },
  { name:"Scout",     weight:"8%",  color:"#38bdf8" },
  { name:"Arbiter",   weight:"12%", color:"#fb923c" },
];

const STEPS = [
  { n:"01", title:"Seal",      desc:"Brand submits product batch. AuthiChain mints ERC-721 NFT on Polygon with cryptographic hash of product data. Cost: $0.004.", color:gold },
  { n:"02", title:"Embed",     desc:"QRON generates AI QR art encoding the NFT certificate. Each code is visually unique and mathematically scannable.", color:purple },
  { n:"03", title:"Scan",      desc:"Consumer scans QR. Five agents simultaneously query blockchain, verify hash, check provenance history.", color:green },
  { n:"04", title:"Consensus", desc:"Guardian (35%) + Sentinel (25%) + Archivist (20%) + Arbiter (12%) + Scout (8%) reach weighted consensus.", color:"#38bdf8" },
  { n:"05", title:"Certify",   desc:"Result in 2.1 seconds: AUTHENTIC certificate with full provenance chain, visible to consumer.", color:"#fb923c" },
];

const MARKETS = [
  { icon:"💎", label:"Luxury Goods",      desc:"LVMH, Hermès — certificate every piece",      color:gold },
  { icon:"💊", label:"Pharma",            desc:"Serialized drug batch auth + DPP",             color:"#38bdf8" },
  { icon:"🌿", label:"Cannabis",          desc:"Lume, JARS, Gage — METRC + blockchain",        color:green },
  { icon:"🚗", label:"Automotive",        desc:"Parts provenance, recall verification",         color:purple },
  { icon:"👟", label:"Streetwear",        desc:"Sneaker drops, limited collab auth",            color:"#fb923c" },
  { icon:"🍷", label:"Fine Wine",         desc:"Vintage provenance, cellar-to-glass",           color:gold },
  { icon:"⚗️", label:"Chemicals",        desc:"Industrial batch certification + DPP",          color:"#38bdf8" },
  { icon:"🎨", label:"Art/Collectibles",  desc:"Physical artwork + NFT digital twin",           color:purple },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 55);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const cycle = () => {
      setScanActive(true);
      setVerifyStep(0);
      [480, 900, 1300, 1700, 2100].forEach((ms, i) =>
        setTimeout(() => setVerifyStep(i + 1), ms)
      );
      setTimeout(() => { setScanActive(false); setVerifyStep(0); }, 5400);
    };
    cycle();
    const t = setInterval(cycle, 7000);
    return () => clearInterval(t);
  }, []);

  const scanY = ((tick % 100) / 100) * 84 + 6;

  return (
    <main style={{ background:bg, color:"#e5e5e5", minHeight:"100vh", fontFamily:"'DM Mono','Courier New',monospace", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .syne{font-family:'Syne',sans-serif;}
        .nav-a{color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;letter-spacing:.08em;transition:color .2s;}
        .nav-a:hover{color:#e5e5e5;}
        .card{background:rgba(255,255,255,0.03);border-radius:20px;transition:all .3s;}
        .card-gold{border:1px solid ${goldBorder};}
        .card-gold:hover{border-color:${gold};background:${goldDim};}
        .card-green{border:1px solid ${greenBorder};}
        .card-green:hover{border-color:${green};background:${greenDim};}
        .card-purple{border:1px solid ${purpleBorder};}
        .card-purple:hover{border-color:${purple};background:${purpleDim};}
        .card-base{border:1px solid ${border};}
        .card-base:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.05);}
        .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:11px;letter-spacing:.08em;border:1px solid;}
        .gt-gold{background:linear-gradient(135deg,${gold},#ffe082);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .gt-green{background:linear-gradient(135deg,${green},#86efac);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .gt-purple{background:linear-gradient(135deg,${purple},#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .cta-gold{background:${gold};color:#000;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.06em;transition:all .2s;display:inline-block;}
        .cta-gold:hover{background:#ffe082;transform:translateY(-1px);box-shadow:0 8px 32px rgba(201,162,39,.35);}
        .cta-out{background:transparent;border:1px solid rgba(255,255,255,.18);color:#e5e5e5;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:13px;transition:all .2s;display:inline-block;}
        .cta-out:hover{border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.05);}
        .divider{height:1px;background:linear-gradient(to right,transparent,${border},transparent);}
        .plink{text-decoration:none;color:inherit;display:block;height:100%;}
        @keyframes pr{0%,100%{opacity:.4;transform:scale(1);}50%{opacity:.9;transform:scale(1.1);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}
        .blink{animation:blink 1.8s ease infinite;}

        /* ── LAYOUT HELPERS ── */
        .hero-grid{display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:center;}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;}
        .three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        .four-col{display:grid;grid-template-columns:repeat(4,1fr);}
        .eight-col{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
        .section{max-width:1200px;margin:0 auto;padding:72px 32px;}
        .nav-links{display:flex;gap:22px;align-items:center;}

        /* ── MOBILE ── */
        @media(max-width:768px){
          /* Nav */
          .nav-links{display:none!important;}
          nav{padding:0 16px!important;height:52px!important;}

          /* Hero */
          .hero-grid{grid-template-columns:1fr!important;gap:32px!important;padding:40px 20px 32px!important;}
          .hero-h{font-size:2.2rem!important;line-height:1.1!important;}
          .hero-scanner{display:none!important;}

          /* Stats row under hero */
          .hero-stats{gap:20px!important;flex-wrap:wrap!important;}
          .hero-ctas{gap:10px!important;}
          .cta-gold,.cta-out{padding:10px 20px!important;font-size:12px!important;}

          /* Metrics */
          .four-col{grid-template-columns:1fr 1fr!important;}
          .metric-cell{padding:24px 14px!important;border-right:none!important;border-bottom:0.5px solid ${border};}

          /* Section padding */
          .section{padding:48px 20px!important;}

          /* Cards */
          .three-col{grid-template-columns:1fr!important;}
          .card-gold,.card-green,.card-purple{padding:24px 20px!important;}

          /* How it works / token columns */
          .two-col{grid-template-columns:1fr!important;gap:40px!important;}
          .two-col-gap-tight{gap:32px!important;}

          /* Markets */
          .eight-col{grid-template-columns:repeat(2,1fr)!important;}

          /* CTA section */
          .final-ctas{gap:10px!important;}
          .final-h{font-size:2rem!important;}

          /* Footer */
          .footer-inner{flex-direction:column!important;gap:12px!important;align-items:flex-start!important;}
          .footer-links{gap:14px!important;}
        }

        @media(max-width:420px){
          .hero-h{font-size:1.9rem!important;}
          .eight-col{grid-template-columns:1fr!important;}
          .metric-num{font-size:1.7rem!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ padding:"0 32px", height:56, display:"flex", alignItems:"center", gap:20, borderBottom:`0.5px solid ${border}`, position:"sticky", top:0, background:"rgba(6,6,8,.97)", backdropFilter:"blur(16px)", zIndex:50 }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <span className="syne" style={{ color:gold, fontWeight:800, fontSize:"1rem", letterSpacing:".15em" }}>◆ AUTHICHAIN</span>
        </Link>
        <div style={{ flex:1 }}/>
        <div className="nav-links">
          {[["Products","#products"],["How It Works","#how-it-works"],["Demo","/demo-video"],["Verify","/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"],["EU DPP","/compliance"],["Grants","/grants"]].map(([l,h])=>(
            <a key={l} href={h} className="nav-a">{l}</a>
          ))}
        </div>
        <a href="https://authichain.com/portal" className="cta-gold" style={{ padding:"7px 16px", fontSize:12 }}>Get Started →</a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-grid section">
        {/* Left */}
        <div>
          <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:gold, animation:"pr 2s infinite" }}/>
            THE AUTHENTIC ECONOMY
          </div>
          <h1 className="syne hero-h" style={{ fontSize:"3.6rem", fontWeight:800, marginBottom:20, lineHeight:1.05 }}>
            <span className="gt-gold">Truth</span> as<br/>
            infrastructure<br/>
            <span style={{ color:"rgba(255,255,255,.2)" }}>for physical things</span>
          </h1>
          <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(255,255,255,.5)", maxWidth:480, marginBottom:32 }}>
            Every physical product has a story. AuthiChain makes it verifiable — blockchain-sealed, AI-enforced, scan-in-2.1-seconds authentic. Three platforms. One truth layer.
          </p>
          <div className="hero-ctas" style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:36 }}>
            <a href="https://authichain.com/demo-video" className="cta-gold">Watch Demo</a>
            <a href="https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E" className="cta-out" target="_blank" rel="noopener">Live Verify →</a>
          </div>
          <div className="hero-stats" style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
            {[["$0.004","per seal"],["2.1s","verify time"],["1B","$QRON supply"],["EU DPP","compliant"]].map(([v,l])=>(
              <div key={l}>
                <div className="syne" style={{ fontWeight:800, fontSize:"1.4rem", color:gold }}>{v}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".1em" }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — scanner widget (hidden on mobile via CSS) */}
        <div className="hero-scanner">
          <div style={{ background:"rgba(201,162,39,.05)", border:`1px solid ${goldBorder}`, borderRadius:24, padding:24, position:"relative", overflow:"hidden" }}>
            {/* Corner marks */}
            {[[false,false],[false,true],[true,false],[true,true]].map(([b,r],i)=>(
              <div key={i} style={{ position:"absolute", width:16, height:16,
                top:b?undefined:10, bottom:b?10:undefined,
                left:r?undefined:10, right:r?10:undefined,
                borderTop:b?"none":`1px solid ${gold}`,  borderBottom:b?`1px solid ${gold}`:"none",
                borderLeft:r?"none":`1px solid ${gold}`, borderRight:r?`1px solid ${gold}`:"none",
                opacity:.5 }}/>
            ))}
            {/* Scan beam */}
            <div style={{ position:"absolute", left:24, right:24, height:2,
              background:`linear-gradient(to right,transparent,${gold},transparent)`,
              top:`${scanY}%`, opacity:scanActive?.8:.2,
              transition:"opacity .5s", boxShadow:`0 0 12px ${gold}` }}/>
            {/* QR grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:18 }}>
              {Array.from({length:49}).map((_,i)=>{
                const pat=[1,1,1,1,1,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0];
                const on=pat[i]===1||Math.sin(i*2.1+tick*.04)>.2;
                return <div key={i} style={{ aspectRatio:"1", borderRadius:3, background:on?gold:"rgba(201,162,39,.07)", transition:"background .8s", opacity:on?(scanActive?.9:.55):.12 }}/>;
              })}
            </div>
            {/* Agents */}
            <div style={{ background:"rgba(0,0,0,.45)", borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".15em", marginBottom:8 }}>5-AGENT CONSENSUS</div>
              {AGENTS.map((a,i)=>(
                <div key={a.name} style={{ display:"flex", alignItems:"center", gap:9, padding:"6px 0", borderBottom:`1px solid rgba(255,255,255,.04)`, fontSize:11 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:verifyStep>i?a.color:"rgba(255,255,255,.1)", transition:"all .4s", boxShadow:verifyStep>i?`0 0 6px ${a.color}`:"none" }}/>
                  <span style={{ flex:1, color:"rgba(255,255,255,.55)" }}>{a.name}</span>
                  <span style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>{a.weight}</span>
                  <div style={{ width:52, height:3, background:"rgba(255,255,255,.08)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, background:a.color, width:verifyStep>i?a.weight:"0%", transition:"width 1.1s ease" }}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, textAlign:"center", fontSize:12, color:verifyStep>=4?green:"rgba(255,255,255,.3)", transition:"color .5s" }}>
              {verifyStep<3?"⟳ Verifying...":verifyStep<5?"✓ CONSENSUS REACHED":"✓ AUTHENTIC — 2.1s"}
            </div>
            <div style={{ position:"absolute", top:10, right:10 }}>
              <div className="pill" style={{ color:green, borderColor:greenBorder, background:greenDim, fontSize:10 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:green, animation:"pr 1.5s infinite" }}/>
                LIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── METRICS ── */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px" }}>
        <div className="four-col" style={{ borderLeft:`0.5px solid ${border}` }}>
          {[["$500B","Global counterfeiting loss/yr"],["1,001","Michigan products on-chain"],["16","AuthiChain NFTs minted"],["EU DPP","Digital Product Passport ready"]].map(([n,l])=>(
            <div key={n} className="metric-cell" style={{ textAlign:"center", padding:"32px 16px", borderRight:`0.5px solid ${border}` }}>
              <div className="syne gt-gold metric-num" style={{ fontWeight:800, fontSize:"2rem", lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:6, letterSpacing:".08em" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* ── PLATFORMS ── */}
      <section id="products" className="section">
        <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>THE AUTHENTIC ECONOMY</div>
        <h2 className="syne" style={{ fontWeight:800, fontSize:"2rem", marginBottom:12 }}>Three platforms. <span className="gt-gold">One truth layer.</span></h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", maxWidth:540, marginBottom:44, lineHeight:1.8 }}>
          Objects have authenticity. People have authenticity reputation. AI agents enforce authenticity.
        </p>
        <div className="three-col">
          {/* AuthiChain */}
          <a href="https://authichain.com/portal" className="plink">
            <div className="card card-gold" style={{ padding:"32px 24px", height:"100%", display:"flex", flexDirection:"column" }}>
              <div style={{ fontSize:24, marginBottom:14 }}>◆</div>
              <div className="syne gt-gold" style={{ fontWeight:800, fontSize:"1.4rem", marginBottom:6 }}>AuthiChain</div>
              <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:16, fontSize:10 }}>authichain.com</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", marginBottom:20, flex:1 }}>
                Blockchain product authentication. ERC-721 NFTs seal every batch. Five AI agents reach consensus in 2.1 seconds. $0.004 per product seal.
              </p>
              {["ERC-721 NFT per product batch","5-agent AI consensus engine","QR scan → blockchain proof","EU Digital Product Passport"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
                  <span style={{ color:gold, flexShrink:0 }}>◆</span>{f}
                </div>
              ))}
              <div style={{ marginTop:20, fontSize:12, color:gold, letterSpacing:".06em" }}>Launch Portal →</div>
            </div>
          </a>

          {/* QRON */}
          <a href="https://qron.space" className="plink" target="_blank" rel="noopener">
            <div className="card card-purple" style={{ padding:"32px 24px", height:"100%", display:"flex", flexDirection:"column" }}>
              <div style={{ fontSize:24, marginBottom:14 }}>⬡</div>
              <div className="syne gt-purple" style={{ fontWeight:800, fontSize:"1.4rem", marginBottom:6 }}>QRON</div>
              <div className="pill" style={{ color:purple, borderColor:purpleBorder, background:purpleDim, marginBottom:16, fontSize:10 }}>qron.space</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", marginBottom:20, flex:1 }}>
                AI-generated QR art that encodes authenticity. Every QR code is a living artwork — generative, beautiful, scannable, tied to $QRON on Polygon.
              </p>
              {["AI-generated QR artwork","$QRON ecosystem token","Three-tier checkout ($9/$29/$49)","Fiverr referral integration"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
                  <span style={{ color:purple, flexShrink:0 }}>⬡</span>{f}
                </div>
              ))}
              <div style={{ marginTop:20, fontSize:12, color:purple, letterSpacing:".06em" }}>Order QR Art →</div>
            </div>
          </a>

          {/* StrainChain */}
          <a href="https://strainchain.io" className="plink" target="_blank" rel="noopener">
            <div className="card card-green" style={{ padding:"32px 24px", height:"100%", display:"flex", flexDirection:"column" }}>
              <div style={{ fontSize:24, marginBottom:14 }}>⬢</div>
              <div className="syne gt-green" style={{ fontWeight:800, fontSize:"1.4rem", marginBottom:6 }}>StrainChain</div>
              <div className="pill" style={{ color:green, borderColor:greenBorder, background:greenDim, marginBottom:16, fontSize:10 }}>strainchain.io</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", marginBottom:20, flex:1 }}>
                AuthiChain for cannabis. METRC-integrated supply chain authentication for Michigan dispensaries. 1,001 products on-chain across 20 brands.
              </p>
              {["METRC provenance events","Michigan cannabis certified","Dispensary pilot pipeline","Anti-diversion compliance"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:7 }}>
                  <span style={{ color:green, flexShrink:0 }}>⬢</span>{f}
                </div>
              ))}
              <div style={{ marginTop:20, fontSize:12, color:green, letterSpacing:".06em" }}>View Pilot →</div>
            </div>
          </a>
        </div>
      </section>

      <div className="divider"/>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section">
        <div className="two-col">
          {/* Protocol steps */}
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>THE PROTOCOL</div>
            <h2 className="syne" style={{ fontWeight:800, fontSize:"2rem", marginBottom:12 }}>How AuthiChain <span className="gt-gold">works</span></h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", marginBottom:36, lineHeight:1.8 }}>
              Every authentication event runs through a weighted 5-agent AI consensus. No single agent has unilateral power.
            </p>
            {STEPS.map((s,i)=>(
              <div key={s.n} style={{ display:"flex", gap:16, marginBottom:28, position:"relative" }}>
                {i<4&&<div style={{ position:"absolute", left:17, top:38, bottom:-28, width:1, background:`linear-gradient(to bottom,${s.color}30,transparent)` }}/>}
                <div style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${s.color}30`, background:`${s.color}0d`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10, color:s.color }}>{s.n}</div>
                <div>
                  <div className="syne" style={{ fontWeight:700, fontSize:".95rem", marginBottom:3, color:s.color }}>{s.title}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.42)", lineHeight:1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Token economy */}
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>TOKEN ECONOMY</div>
            <h2 className="syne" style={{ fontWeight:800, fontSize:"2rem", marginBottom:12 }}><span className="gt-purple">$QRON</span> is the<br/>authenticity token</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", marginBottom:24, lineHeight:1.8 }}>
              Truth has tradeable value. $QRON powers the Authentic Economy — earned by validators, spent by brands.
            </p>
            <div className="card card-base" style={{ padding:20, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".08em" }}>$QRON · POLYGON MAINNET</span>
                <span style={{ fontSize:11, color:green }} className="blink">● LIVE</span>
              </div>
              {[["Total Supply","1,000,000,000"],["Contract","0xAebfA6b0...fE437"],["Standard","ERC-20 · Polygon"],["NFT Contract","0x4da4D267...72BE"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`0.5px solid ${border}`, fontSize:12 }}>
                  <span style={{ color:"rgba(255,255,255,.32)" }}>{k}</span>
                  <span style={{ color:"rgba(255,255,255,.72)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card card-base" style={{ padding:20, marginBottom:16 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".08em", marginBottom:12 }}>USE CASES</div>
              {[{i:"◆",t:"Brands pay $QRON to mint authentication NFTs",c:gold},{i:"⬡",t:"Artists earn $QRON for QR art commissions",c:purple},{i:"⬢",t:"Dispensaries stake $QRON for StrainChain access",c:green},{i:"✓",t:"Validators earn $QRON per consensus round",c:"#38bdf8"}].map(u=>(
                <div key={u.t} style={{ display:"flex", gap:10, padding:"7px 0", fontSize:12, color:"rgba(255,255,255,.48)", alignItems:"flex-start" }}>
                  <span style={{ color:u.c, marginTop:1, flexShrink:0 }}>{u.i}</span>{u.t}
                </div>
              ))}
            </div>
            <a href="https://opensea.io/assets/matic/0x4da4D2675e52374639C9c954f4f653887A9972BE" target="_blank" rel="noopener" className="cta-out" style={{ width:"100%", textAlign:"center", display:"block" }}>
              View AuthiChain NFTs on OpenSea →
            </a>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ── MARKETS ── */}
      <section className="section">
        <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>TARGET MARKETS</div>
        <h2 className="syne" style={{ fontWeight:800, fontSize:"2rem", marginBottom:40 }}>Built for <span className="gt-gold">every physical product</span></h2>
        <div className="eight-col">
          {MARKETS.map(m=>(
            <div key={m.label} className="card card-base" style={{ padding:"18px 16px" }}>
              <div style={{ fontSize:22, marginBottom:8 }}>{m.icon}</div>
              <div className="syne" style={{ fontWeight:700, fontSize:".85rem", marginBottom:4, color:m.color }}>{m.label}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ textAlign:"center" }}>
        <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:24, display:"inline-flex" }}>Open for Enterprise Pilots</div>
        <h2 className="syne final-h" style={{ fontWeight:800, fontSize:"2.6rem", marginBottom:16 }}>
          Ready to <span className="gt-gold">authenticate</span><br/>your products?
        </h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", maxWidth:440, margin:"0 auto 32px", lineHeight:1.8 }}>
          Deploy in 48 hours. $0.004 per seal. No hardware required.
        </p>
        <div className="final-ctas" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <a href="https://authichain.com/demo-video" className="cta-gold">Watch Full Demo</a>
          <a href="https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E" className="cta-out" target="_blank" rel="noopener">Try Live Verify</a>
          <button onClick={()=>{const e=['z','@','authichain','.','com'].join('');window.open('mailto:'+e);}} className="cta-out" style={{ cursor:"pointer", fontFamily:"inherit" }}>Talk to Founder</button>
        </div>
      </section>

      <div className="divider"/>

      {/* ── FOOTER ── */}
      <footer style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px" }}>
        <div className="footer-inner" style={{ display:"flex", gap:20, alignItems:"center", flexWrap:"wrap" }}>
          <span className="syne" style={{ color:gold, fontWeight:800, fontSize:".9rem", letterSpacing:".15em" }}>◆ AUTHICHAIN</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,.2)" }}>The Authentic Economy · Lansing, Michigan</span>
          <div style={{ flex:1 }}/>
          <div className="footer-links" style={{ display:"flex", gap:18 }}>
            {[["QRON","https://qron.space"],["StrainChain","https://strainchain.io"],["EU DPP","/compliance"],["Grants","/grants"]].map(([l,h])=>(
              <a key={l} href={h} style={{ color:"rgba(255,255,255,.22)", fontSize:12, textDecoration:"none" }}>{l}</a>
            ))}
          </div>
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.1)", marginTop:16, paddingTop:16, borderTop:`0.5px solid ${border}` }}>
          © 2026 AuthiChain · $QRON: 0xAebfA6b08fb25b59748c93273aB8880e20FfE437 · Built on Polygon · z@authichain.com
        </div>
      </footer>
    </main>
  );
}
