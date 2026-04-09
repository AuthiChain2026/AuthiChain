"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const gold = "#c9a227";
const goldDim = "rgba(201,162,39,0.12)";
const goldBorder = "rgba(201,162,39,0.22)";
const green = "#22c55e";
const greenDim = "rgba(34,197,94,0.1)";
const greenBorder = "rgba(34,197,94,0.22)";
const purple = "#a78bfa";
const purpleDim = "rgba(167,139,250,0.1)";
const purpleBorder = "rgba(167,139,250,0.22)";
const bg = "#060608";
const surface = "rgba(255,255,255,0.03)";
const border = "rgba(255,255,255,0.07)";

const AGENTS = [
  { name: "Guardian",  weight: "35%", color: green },
  { name: "Archivist", weight: "20%", color: gold },
  { name: "Sentinel",  weight: "25%", color: purple },
  { name: "Scout",     weight: "8%",  color: "#38bdf8" },
  { name: "Arbiter",   weight: "12%", color: "#fb923c" },
];

const STEPS = [
  { n:"01", title:"Seal",      desc:"Brand submits product batch. AuthiChain mints ERC-721 NFT on Polygon with cryptographic hash of product data. Cost: $0.004.",               color: gold },
  { n:"02", title:"Embed",     desc:"QRON generates AI QR art encoding the NFT certificate. Each code is visually unique and mathematically scannable.",                       color: purple },
  { n:"03", title:"Scan",      desc:"Consumer scans QR. Five agents simultaneously query blockchain, verify hash, check provenance history.",                                  color: green },
  { n:"04", title:"Consensus", desc:"Guardian (35%) + Sentinel (25%) + Archivist (20%) + Arbiter (12%) + Scout (8%) reach weighted consensus.",                                color: "#38bdf8" },
  { n:"05", title:"Certify",   desc:"Result in 2.1 seconds: AUTHENTIC certificate with full provenance chain, visible to consumer.",                                           color: "#fb923c" },
];

const MARKETS = [
  { icon:"💎", label:"Luxury Goods",   desc:"LVMH, Hermès — certificate every piece",           color: gold },
  { icon:"💊", label:"Pharma",         desc:"Serialized drug batch authentication + DPP",        color: "#38bdf8" },
  { icon:"🌿", label:"Cannabis",       desc:"Lume, JARS, Gage — METRC + blockchain",             color: green },
  { icon:"🚗", label:"Automotive",     desc:"Parts provenance, recall verification",             color: purple },
  { icon:"👟", label:"Streetwear",     desc:"Sneaker drops, limited collab auth",                color: "#fb923c" },
  { icon:"🍷", label:"Fine Wine",      desc:"Vintage provenance, cellar-to-glass chain",         color: gold },
  { icon:"⚗️", label:"Chemicals",     desc:"Industrial batch certification + DPP",              color: "#38bdf8" },
  { icon:"🎨", label:"Art / Collectibles", desc:"Physical artwork + NFT digital twin",           color: purple },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [scanActive, setScanActive] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 50);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const cycle = () => {
      setScanActive(true);
      setVerifyStep(0);
      [500, 900, 1300, 1700, 2100].forEach((ms, i) =>
        setTimeout(() => setVerifyStep(i + 1), ms)
      );
      setTimeout(() => { setScanActive(false); setVerifyStep(0); }, 5200);
    };
    cycle();
    const t = setInterval(cycle, 6800);
    return () => clearInterval(t);
  }, []);

  const scanY = ((tick % 100) / 100) * 88 + 4;

  return (
    <main style={{ background: bg, color: "#e5e5e5", minHeight: "100vh", fontFamily: "'DM Mono','Courier New',monospace", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;}
        .syne{font-family:'Syne',sans-serif;}
        .mono{font-family:'DM Mono','Courier New',monospace;}
        .nav-a{color:rgba(255,255,255,.4);text-decoration:none;font-size:12px;letter-spacing:.08em;transition:color .2s;}
        .nav-a:hover{color:#e5e5e5;}
        .card{background:${surface};border-radius:20px;transition:all .3s;}
        .card-gold{border:1px solid ${goldBorder};}
        .card-gold:hover{border-color:${gold};background:${goldDim};}
        .card-green{border:1px solid ${greenBorder};}
        .card-green:hover{border-color:${green};background:${greenDim};}
        .card-purple{border:1px solid ${purpleBorder};}
        .card-purple:hover{border-color:${purple};background:${purpleDim};}
        .card-base{border:1px solid ${border};}
        .card-base:hover{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.05);}
        .pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;font-size:11px;letter-spacing:.1em;border:1px solid;}
        .gt-gold{background:linear-gradient(135deg,${gold},#ffe082);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .gt-green{background:linear-gradient(135deg,${green},#86efac);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .gt-purple{background:linear-gradient(135deg,${purple},#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .cta-gold{background:${gold};color:#000;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.06em;transition:all .2s;display:inline-block;}
        .cta-gold:hover{background:#ffe082;transform:translateY(-1px);box-shadow:0 8px 32px rgba(201,162,39,.35);}
        .cta-out{background:transparent;border:1px solid rgba(255,255,255,.18);color:#e5e5e5;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:13px;transition:all .2s;display:inline-block;}
        .cta-out:hover{border-color:rgba(255,255,255,.45);background:rgba(255,255,255,.05);}
        .divider{height:1px;background:linear-gradient(to right,transparent,${border},transparent);}
        .plink{text-decoration:none;color:inherit;display:block;}
        @keyframes pr{0%,100%{opacity:.4;transform:scale(1);}50%{opacity:.9;transform:scale(1.1);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        .blink{animation:blink 1.8s ease infinite;}
        @media(max-width:768px){
          .two-col{grid-template-columns:1fr!important;}
          .three-col{grid-template-columns:1fr!important;}
          .four-col{grid-template-columns:1fr 1fr!important;}
          .hero-h{font-size:2.4rem!important;}
          .hide-m{display:none!important;}
        }
      `}</style>

      {/* NAV */}
      <nav style={{ padding:"0 32px", height:56, display:"flex", alignItems:"center", gap:20, borderBottom:`0.5px solid ${border}`, position:"sticky", top:0, background:"rgba(6,6,8,.97)", backdropFilter:"blur(16px)", zIndex:50 }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <span className="syne" style={{ color:gold, fontWeight:800, fontSize:"1rem", letterSpacing:".15em" }}>◆ AUTHICHAIN</span>
        </Link>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", gap:22, alignItems:"center" }} className="hide-m">
          {[["Products","#products"],["How It Works","#how-it-works"],["Demo","/demo-video"],["Verify","/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"],["EU DPP","/compliance"],["Grants","/grants"]].map(([l,h])=>(
            <a key={l} href={h} className="nav-a">{l}</a>
          ))}
        </div>
        <Link href="/portal" className="cta-gold" style={{ padding:"7px 16px", fontSize:12 }}>Get Started →</Link>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px 64px", display:"grid", gridTemplateColumns:"1fr 420px", gap:64, alignItems:"center" }} className="two-col">
        <div>
          <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:28 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:gold, animation:"pr 2s infinite" }}/>
            THE AUTHENTIC ECONOMY
          </div>
          <h1 className="syne hero-h" style={{ fontSize:"3.8rem", fontWeight:800, margin:"0 0 24px", lineHeight:1.05 }}>
            <span className="gt-gold">Truth</span> as<br/>
            infrastructure<br/>
            <span style={{ color:"rgba(255,255,255,.22)" }}>for physical things</span>
          </h1>
          <p style={{ fontSize:15, lineHeight:1.8, color:"rgba(255,255,255,.5)", maxWidth:500, margin:"0 0 36px" }}>
            Every physical product has a story. AuthiChain makes it verifiable — blockchain-sealed, AI-enforced, scan-in-2.1-seconds authentic. Three platforms. One truth layer.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link href="/demo-video" className="cta-gold">Watch Demo</Link>
            <Link href="/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E" className="cta-out">Live Verify →</Link>
          </div>
          <div style={{ marginTop:44, display:"flex", gap:36, flexWrap:"wrap" }}>
            {[["$0.004","per seal"],["2.1s","verify time"],["1B","$QRON supply"],["EU DPP","compliant"]].map(([v,l])=>(
              <div key={l}>
                <div className="syne" style={{ fontWeight:800, fontSize:"1.5rem", color:gold }}>{v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".1em" }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE SCANNER WIDGET */}
        <div className="float-slow">
          <div style={{ background:"rgba(201,162,39,.05)", border:`1px solid ${goldBorder}`, borderRadius:24, padding:28, position:"relative", overflow:"hidden" }}>
            {/* Corner marks */}
            {[[0,0],[0,1],[1,0],[1,1]].map(([r,c],i)=>(
              <div key={i} style={{ position:"absolute", width:18, height:18, top:r?undefined:12, bottom:r?12:undefined, left:c?undefined:12, right:c?12:undefined, borderTop:r?"none":`1px solid ${gold}`, borderBottom:r?`1px solid ${gold}`:"none", borderLeft:c?"none":`1px solid ${gold}`, borderRight:c?`1px solid ${gold}`:"none", opacity:.6 }}/>
            ))}
            {/* Scan beam */}
            <div style={{ position:"absolute", left:28, right:28, height:2, background:`linear-gradient(to right,transparent,${gold},transparent)`, top:`${scanY}%`, opacity: scanActive ? 0.85 : 0.25, transition:"opacity .5s", boxShadow:`0 0 14px ${gold}` }}/>

            {/* QR pattern */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:20 }}>
              {Array.from({length:49}).map((_,i)=>{
                const pat=[1,1,1,1,1,1,0,1,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,0,0,1,0,1,1,1,1,1,1,0,0,0,1,0,0,0,1,1,0,1,1,0,0,0];
                const on=pat[i]===1||Math.sin(i*2.1+tick*0.04)>.2;
                return <div key={i} style={{ aspectRatio:"1", borderRadius:3, background: on ? gold : "rgba(201,162,39,.07)", transition:"background .9s", opacity: on ? (scanActive?.9:.55) : .12 }}/>;
              })}
            </div>

            {/* Agent bars */}
            <div style={{ background:"rgba(0,0,0,.45)", borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".15em", marginBottom:10 }}>5-AGENT CONSENSUS</div>
              {AGENTS.map((a,i)=>(
                <div key={a.name} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid rgba(255,255,255,.04)`, fontSize:11 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background: verifyStep>i ? a.color : "rgba(255,255,255,.1)", transition:"all .4s", boxShadow: verifyStep>i ? `0 0 6px ${a.color}` : "none" }}/>
                  <span style={{ flex:1, color:"rgba(255,255,255,.55)" }}>{a.name}</span>
                  <span style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>{a.weight}</span>
                  <div style={{ width:56, height:3, background:"rgba(255,255,255,.08)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, background:a.color, width: verifyStep>i ? a.weight : "0%", transition:"width 1.1s ease" }}/>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:14, textAlign:"center", fontSize:12, color: verifyStep>=4 ? green : "rgba(255,255,255,.3)", transition:"color .5s" }}>
              {verifyStep<3 ? "⟳ Verifying..." : verifyStep<5 ? "✓ CONSENSUS REACHED" : "✓ AUTHENTIC — 2.1s"}
            </div>
            <div style={{ position:"absolute", top:12, right:12 }}>
              <div className="pill" style={{ color:green, borderColor:greenBorder, background:greenDim, fontSize:10 }}>
                <span style={{ width:5, height:5, borderRadius:"50%", background:green, animation:"pr 1.5s infinite" }}/>
                LIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* METRICS */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderLeft:`0.5px solid ${border}` }} className="four-col">
          {[["$500B","Global counterfeiting loss/yr"],["1,001","Michigan products on-chain"],["16","AuthiChain NFTs minted"],["EU DPP","Digital Product Passport ready"]].map(([n,l])=>(
            <div key={n} style={{ textAlign:"center", padding:"36px 20px", borderRight:`0.5px solid ${border}` }}>
              <div className="syne gt-gold" style={{ fontWeight:800, fontSize:"2.2rem", lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", marginTop:6, letterSpacing:".1em" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* PLATFORMS */}
      <section id="products" style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px" }}>
        <div style={{ marginBottom:12 }} className="pill" style={{ color:"rgba(255,255,255,.3)", borderColor:border, fontSize:11, letterSpacing:".18em" }}>THE AUTHENTIC ECONOMY</div>
        <h2 className="syne" style={{ fontWeight:800, fontSize:"2.2rem", margin:"0 0 12px" }}>Three platforms. <span className="gt-gold">One truth layer.</span></h2>
        <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", maxWidth:540, margin:"0 0 52px", lineHeight:1.8 }}>
          Objects have authenticity. People have authenticity reputation. AI agents enforce authenticity. This is the architecture of the Authentic Economy.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }} className="three-col">
          {/* AuthiChain */}
          <Link href="/portal" className="plink">
            <div className="card card-gold" style={{ padding:"36px 28px", height:"100%" }}>
              <div style={{ fontSize:28, marginBottom:16 }}>◆</div>
              <div className="syne gt-gold" style={{ fontWeight:800, fontSize:"1.5rem", marginBottom:8 }}>AuthiChain</div>
              <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:20, fontSize:10 }}>authichain.com</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", margin:"0 0 28px" }}>
                Blockchain product authentication infrastructure. ERC-721 NFTs seal every batch. Five AI agents reach consensus in 2.1 seconds. $0.004 per product seal.
              </p>
              {["ERC-721 NFT per product batch","5-agent AI consensus engine","QR scan → blockchain proof","EU Digital Product Passport"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ color:gold }}>◆</span>{f}
                </div>
              ))}
              <div style={{ marginTop:28, fontSize:12, color:gold, letterSpacing:".06em" }}>Launch Portal →</div>
            </div>
          </Link>

          {/* QRON */}
          <a href="https://qron.space" className="plink" target="_blank" rel="noopener">
            <div className="card card-purple" style={{ padding:"36px 28px", height:"100%" }}>
              <div style={{ fontSize:28, marginBottom:16 }}>⬡</div>
              <div className="syne gt-purple" style={{ fontWeight:800, fontSize:"1.5rem", marginBottom:8 }}>QRON</div>
              <div className="pill" style={{ color:purple, borderColor:purpleBorder, background:purpleDim, marginBottom:20, fontSize:10 }}>qron.space</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", margin:"0 0 28px" }}>
                AI-generated QR art that encodes authenticity. Every QR code is a living artwork — generative, beautiful, scannable, and tied to $QRON on Polygon.
              </p>
              {["AI-generated QR artwork","$QRON ecosystem token","Three-tier checkout ($9/$29/$49)","Fiverr referral integration"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ color:purple }}>⬡</span>{f}
                </div>
              ))}
              <div style={{ marginTop:28, fontSize:12, color:purple, letterSpacing:".06em" }}>Order QR Art →</div>
            </div>
          </a>

          {/* StrainChain */}
          <a href="https://strainchain.io" className="plink" target="_blank" rel="noopener">
            <div className="card card-green" style={{ padding:"36px 28px", height:"100%" }}>
              <div style={{ fontSize:28, marginBottom:16 }}>⬢</div>
              <div className="syne gt-green" style={{ fontWeight:800, fontSize:"1.5rem", marginBottom:8 }}>StrainChain</div>
              <div className="pill" style={{ color:green, borderColor:greenBorder, background:greenDim, marginBottom:20, fontSize:10 }}>strainchain.io</div>
              <p style={{ fontSize:13, lineHeight:1.8, color:"rgba(255,255,255,.5)", margin:"0 0 28px" }}>
                AuthiChain for cannabis. METRC-integrated supply chain authentication for Michigan dispensaries. 1,001 products already on-chain across 20 brands.
              </p>
              {["METRC provenance events","Michigan cannabis certified","Dispensary pilot pipeline","Anti-diversion compliance"].map(f=>(
                <div key={f} style={{ fontSize:12, color:"rgba(255,255,255,.45)", display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
                  <span style={{ color:green }}>⬢</span>{f}
                </div>
              ))}
              <div style={{ marginTop:28, fontSize:12, color:green, letterSpacing:".06em" }}>View Pilot →</div>
            </div>
          </a>
        </div>
      </section>

      <div className="divider"/>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }} className="two-col">
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>THE PROTOCOL</div>
            <h2 className="syne" style={{ fontWeight:800, fontSize:"2.2rem", margin:"0 0 12px" }}>How AuthiChain <span className="gt-gold">works</span></h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", margin:"0 0 44px", lineHeight:1.8 }}>
              Every authentication event runs through a weighted 5-agent AI consensus. No single agent has unilateral power. Truth emerges from agreement.
            </p>
            {STEPS.map((s,i)=>(
              <div key={s.n} style={{ display:"flex", gap:20, marginBottom:32, position:"relative" }}>
                {i<4 && <div style={{ position:"absolute", left:19, top:40, bottom:-32, width:1, background:`linear-gradient(to bottom,${s.color}35,transparent)` }}/>}
                <div style={{ width:40, height:40, borderRadius:"50%", border:`1px solid ${s.color}35`, background:`${s.color}0d`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:11, color:s.color }}>{s.n}</div>
                <div>
                  <div className="syne" style={{ fontWeight:700, fontSize:"1rem", marginBottom:4, color:s.color }}>{s.title}</div>
                  <div style={{ fontSize:13, color:"rgba(255,255,255,.45)", lineHeight:1.7 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>TOKEN ECONOMY</div>
            <h2 className="syne" style={{ fontWeight:800, fontSize:"2.2rem", margin:"0 0 12px" }}><span className="gt-purple">$QRON</span> is the<br/>authenticity token</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,.4)", margin:"0 0 28px", lineHeight:1.8 }}>
              Truth has tradeable value. $QRON powers the Authentic Economy — earned by validators, spent by brands, held by believers.
            </p>
            <div className="card card-base" style={{ padding:24, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".1em" }}>$QRON · POLYGON MAINNET</span>
                <span style={{ fontSize:11, color:green }} className="blink">● LIVE</span>
              </div>
              {[["Total Supply","1,000,000,000"],["Contract","0xAebfA6b0...fE437"],["Standard","ERC-20 · Polygon"],["NFT Contract","0x4da4D267...72BE"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`0.5px solid ${border}`, fontSize:12 }}>
                  <span style={{ color:"rgba(255,255,255,.35)" }}>{k}</span>
                  <span style={{ color:"rgba(255,255,255,.75)" }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="card card-base" style={{ padding:24, marginBottom:20 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".1em", marginBottom:14 }}>USE CASES</div>
              {[{i:"◆",t:"Brands pay $QRON to mint authentication NFTs",c:gold},{i:"⬡",t:"Artists earn $QRON for QR art commissions",c:purple},{i:"⬢",t:"Dispensaries stake $QRON for StrainChain access",c:green},{i:"✓",t:"Validators earn $QRON per consensus round",c:"#38bdf8"}].map(u=>(
                <div key={u.t} style={{ display:"flex", gap:12, padding:"8px 0", fontSize:12, color:"rgba(255,255,255,.5)", alignItems:"flex-start" }}>
                  <span style={{ color:u.c, marginTop:1 }}>{u.i}</span>{u.t}
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

      {/* MARKETS */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px" }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", letterSpacing:".18em", marginBottom:12 }}>TARGET MARKETS</div>
        <h2 className="syne" style={{ fontWeight:800, fontSize:"2.2rem", margin:"0 0 48px" }}>Built for <span className="gt-gold">every physical product</span></h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }} className="four-col">
          {MARKETS.map(m=>(
            <div key={m.label} className="card card-base" style={{ padding:"20px 18px" }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{m.icon}</div>
              <div className="syne" style={{ fontWeight:700, fontSize:".9rem", marginBottom:6, color:m.color }}>{m.label}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.38)", lineHeight:1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"/>

      {/* FINAL CTA */}
      <section style={{ maxWidth:1200, margin:"0 auto", padding:"80px 32px", textAlign:"center" }}>
        <div className="pill" style={{ color:gold, borderColor:goldBorder, background:goldDim, marginBottom:28, display:"inline-flex" }}>Open for Enterprise Pilots</div>
        <h2 className="syne" style={{ fontWeight:800, fontSize:"2.8rem", margin:"0 0 20px" }}>
          Ready to <span className="gt-gold">authenticate</span><br/>your products?
        </h2>
        <p style={{ fontSize:15, color:"rgba(255,255,255,.4)", maxWidth:460, margin:"0 auto 40px", lineHeight:1.8 }}>
          Deploy in 48 hours. $0.004 per seal. No hardware, no contracts required.
        </p>
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/demo-video" className="cta-gold">Watch Full Demo</Link>
          <Link href="/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E" className="cta-out">Try Live Verify</Link>
          <a href="mailto:z@authichain.com" className="cta-out">Talk to Founder</a>
        </div>
      </section>

      <div className="divider"/>

      {/* FOOTER */}
      <footer style={{ maxWidth:1200, margin:"0 auto", padding:"36px 32px", display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
        <span className="syne" style={{ color:gold, fontWeight:800, fontSize:".9rem", letterSpacing:".15em" }}>◆ AUTHICHAIN</span>
        <span style={{ fontSize:12, color:"rgba(255,255,255,.2)" }}>The Authentic Economy · Lansing, Michigan</span>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", gap:20 }}>
          {[["QRON","https://qron.space"],["StrainChain","https://strainchain.io"],["EU DPP","/compliance"],["Grants","/grants"]].map(([l,h])=>(
            <a key={l} href={h} style={{ color:"rgba(255,255,255,.22)", fontSize:12, textDecoration:"none" }}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.12)", width:"100%", paddingTop:16, borderTop:`0.5px solid ${border}` }}>
          © 2026 AuthiChain · $QRON: 0xAebfA6b08fb25b59748c93273aB8880e20FfE437 · Built on Polygon · z@authichain.com
        </div>
      </footer>
    </main>
  );
}
