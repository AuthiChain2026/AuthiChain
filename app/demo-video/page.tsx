"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── PRODUCT + ART METADATA ─────────────────────────────────────────── */
const P = {
  name:"Blue Dream", type:"Premium Flower · Hybrid · 3.5g",
  thc:"22.4%", cbd:"0.8%", cultivator:"Emerald Peak Farms",
  location:"Humboldt County, CA", license:"CCL21-0003847",
  metrc:"1A4060300000022000005788", harvest:"March 15, 2026",
  batch:"SC-2026-0408-BD", cert:"SC-CA-2026-BD-9291",
  terpenes:[
    {name:"Myrcene",   pct:0.80, color:"#22c55e"},
    {name:"Caryophyl.",pct:0.40, color:"#84cc16"},
    {name:"Pinene",    pct:0.30, color:"#38bdf8"},
    {name:"Limonene",  pct:0.20, color:"#f59e0b"},
    {name:"Ocimene",   pct:0.15, color:"#a78bfa"},
    {name:"Linalool",  pct:0.10, color:"#ec4899"},
  ],
  /* ── PACKAGING ART PROVENANCE ── */
  art: {
    studio:     "Verde Studio",
    artist:     "Mx. Solano",          // lead illustrator
    collection: "Harvest Series 001",
    colorway:   "Humboldt Fog",        // dark teal / bone
    style:      "Botanical Hyperrealism",
    printRun:   50,                    // matches batch units — each numbered
    edition:    "Artist Proof / Limited",
    rarity:     "RARE",
    rarityPct:  8,                     // top 8% of licensed packaging
    artScore:   87,                    // /100 collectability index
    artValue:   160,                   // USD standalone packaging art value
    productVal: 420,                   // USD cannabis product value
    nftFloor:   580,                   // art premium + product
    sealed:     true,
    hologram:   "SC-HOLO-9291",
  },
};

/* ─── SCENES ─────────────────────────────────────────────────────────── */
const USE_CASES = [
  {
    id:"autoflow", phase:"AUTOFLOW", accent:"#7c3aed", duration:18,
    title:"AutoFlow — Cannabis Classification Engine",
    narration:"AutoFlow ingests the Blue Dream batch and resolves its complete regulatory identity in under three seconds. Strain genetics, METRC tag, BCC license, terpene fingerprint, state compliance requirements, and StrainChain protocol routing — all resolved automatically. It also detects packaging art metadata, flagging this as a limited-edition artist collaboration eligible for the collectables pipeline.",
    steps:[
      {t:300,  label:"INPUT",      text:'Product: "Blue Dream 3.5g — Emerald Peak Farms, Humboldt CA"'},
      {t:1000, label:"AUTOFLOW",   text:"Cannabis classification engine engaged…"},
      {t:1800, label:"STRAIN",     text:"Cannabis sativa × indica hybrid — Blue Dream (Blueberry × Haze)"},
      {t:2700, label:"METRC",      text:"Tag: 1A4060300000022000005788  |  California Prop 64"},
      {t:3600, label:"LICENSE",    text:"BCC CCL21-0003847  |  CDFA CF-1982-P  ✓ VALID"},
      {t:4500, label:"TERPENES",   text:"Myrcene 0.80%  Caryophyllene 0.40%  Pinene 0.30%  Limonene 0.20%"},
      {t:5400, label:"ART DETECT", text:"🎨 Packaging art metadata detected — Verde Studio × Emerald Peak Farms"},
      {t:6200, label:"EDITION",    text:"Artist Proof · Harvest Series 001 · Colorway: Humboldt Fog · Run: 50 units"},
      {t:7100, label:"PROTOCOL",   text:"→ StrainChain selected  |  AuthiChain NFT + ART COLLECTABLE pipeline: ACTIVE"},
      {t:8000, label:"COMPLETE",   text:"Classification ✓  |  StrainChain ID: SC-2026-0408-BD  |  Art eligible: YES"},
    ],
  },
  {
    id:"trumark", phase:"STRAINCHAIN / TRUMARK", accent:"#22c55e", duration:25,
    title:"StrainChain TRUmark — Authentication + Art Valuation",
    narration:"StrainChain TRUmark runs two parallel pipelines. The first is the 5-agent cannabis compliance consensus — Guardian verifying the COA, Archivist confirming the seed-to-sale chain, Sentinel checking recalls, Scout syncing METRC, and Arbiter adjudicating. The second is ArtGuard — a specialist art valuation sub-pipeline that authenticates the packaging artwork, grades its condition, establishes rarity, and outputs a collectability score that directly informs the NFT floor price.",
    agents:[
      {name:"Guardian",  role:"COA lab verification",          weight:35, color:"#22c55e",  steps:["Loading COA from Confident Cannabis…","THC 22.4%: within label tolerance ✓","Pesticide panel: 0 detections ✓","COA SHA-256 hash: VERIFIED ✓"]},
      {name:"Archivist", role:"Seed-to-sale chain",            weight:20, color:"#a78bfa",  steps:["Tracing 8 lifecycle events…","Cultivation → Harvest: INTACT","Packaging → Distrib: INTACT","Chain of custody: UNBROKEN ✓"]},
      {name:"Sentinel",  role:"Diversion & recall detection",  weight:25, color:"#f59e0b",  steps:["Querying CA recall database…","METRC diversion flags: ZERO","Out-of-state movement: NONE","Batch status: CLEAR ✓"]},
      {name:"Scout",     role:"METRC state sync",              weight:8,  color:"#38bdf8",  steps:["Syncing METRC CA API…","Tag 1A4060300000022000005788: ACTIVE","Inventory: 50/50 units reconciled","State sync: CONFIRMED ✓"]},
      {name:"Arbiter",   role:"StrainChain adjudication",      weight:12, color:"#c9a227",  steps:["Collecting weighted verdicts…","Consensus: 99.1%  (threshold: 95%)","BCC compliance: ✓","Verdict: COMPLIANT + AUTHENTIC"]},
    ],
    verdict:"COMPLIANT + AUTHENTIC", confidence:99.1,
    trumark:"SC-TM-CA-2026-04-08-BD9291",
    artGuard:[
      {label:"Artist attribution",   value:"Verde Studio · Mx. Solano",               score:95, color:"#ec4899"},
      {label:"Edition verification",  value:"Artist Proof · Harvest Series 001 · #23/50",score:100,"color":"#a78bfa"},
      {label:"Colorway rarity",       value:"Humboldt Fog — top 8% of licensed drops",  score:92, color:"#f59e0b"},
      {label:"Condition grade",       value:"Sealed · Hologram intact · SC-HOLO-9291",  score:100, color:"#22c55e"},
      {label:"Style classification",  value:"Botanical Hyperrealism · Collectability tier: RARE",score:85,"color":"#38bdf8"},
    ],
  },
  {
    id:"mint", phase:"BLOCKCHAIN", accent:"#a78bfa", duration:20,
    title:"NFT Mint — Dual-Layer Art + Provenance Collectable",
    narration:"The StrainChain NFT carries two distinct value layers. The first is cannabis provenance — batch authentication, COA hash, METRC tag, seed-to-sale chain. The second is art collectability — Verde Studio attribution, edition number, colorway, condition grade, and the ArtGuard score of 87 out of 100. These combine for an NFT floor price of $580: $420 for the verified product, $160 for the authenticated packaging art. Even after the cannabis is consumed, the art collectable retains and may appreciate in value.",
    steps:[
      {t:400,  label:"TRIGGER",    text:"TRUmark + ArtGuard COMPLETE → dual-layer mint initiated"},
      {t:1200, label:"LAYER 1",    text:"Cannabis provenance: COA hash + METRC + seed-to-sale → IPFS: ipfs://QmBD3c9…k7T"},
      {t:2100, label:"LAYER 2",    text:'Art metadata: {"artist":"Mx. Solano","studio":"Verde Studio","edition":"#23/50","colorway":"Humboldt Fog","artScore":87}'},
      {t:3000, label:"CONTRACT",   text:"StrainChain ERC-721: 0x5db511706FB6317cd23A7655F67450c5AC6e6AA2"},
      {t:3900, label:"MINTING",    text:"Token #SC-9291 — tx: 0xa4f8e3d1c7b2a9f4e8d3c6b1a7f2e9d4c8b3a6f1"},
      {t:5000, label:"CONFIRMED",  text:"Block 54,892,341  |  Gas: $0.004  |  Polygon mainnet ✓"},
      {t:5800, label:"ROYALTIES",  text:"Emerald Peak Farms: 7%  |  Verde Studio (art): 5%  |  encoded on-chain"},
      {t:6600, label:"FLOOR",      text:"NFT floor: $580  ($420 product + $160 art premium)"},
      {t:7400, label:"MARKET",     text:"Dual-layer collectable LIVE — art value persists post-consumption ✓"},
    ],
  },
  {
    id:"qron", phase:"QRON / STRAINCHAIN", accent:"#84cc16", duration:18,
    title:"Dynamic QRON Code → StoryMode",
    narration:"The Blue Dream packaging carries a QRON code — AI-generated QR art in Forest Weave style — that resolves to StoryMode, a cinematic strain origin narrative. Every scan logs a Truth Network vote. The code is dynamic: it knows when the batch changes hands, when inventory depletes, when a dispensary activates the product. The QR code is as alive as the plant it represents.",
    story:"From fog-kissed ridgelines above Garberville, Humboldt County. Planted February 3rd. Hand-watered from a spring-fed creek at 2,400 feet elevation. Harvested March 15th after 42 days of flower. Dried 14 days, hand-trimmed, third-party tested at Confident Cannabis. Packaging designed by Mx. Solano at Verde Studio — this is unit 23 of 50. You are holding verified proof of that.",
  },
  {
    id:"ledger", phase:"LEDGER / BTC", accent:"#f59e0b", duration:18,
    title:"Immutable Seed-to-Sale Ledger + BTC Ordinal",
    narration:"The StrainChain ledger records every event in this batch's lifecycle — from clone tag to consumer scan. For this batch, the ledger also captures the art provenance chain: Verde Studio commission, design file hash, print approval, hologram application, and numbered unit assignment. All of it inscribed as a Bitcoin Ordinal — cannabis compliance and packaging art history, permanently anchored to the world's most audited blockchain.",
    events:[
      {icon:"🌱",label:"Seed/Clone", date:"Feb 3"},
      {icon:"🌿",label:"Vegetative", date:"Feb 17"},
      {icon:"🌸",label:"Flowering",  date:"Feb 28"},
      {icon:"✂️",label:"Harvest",    date:"Mar 15"},
      {icon:"💨",label:"Drying",     date:"Mar 16"},
      {icon:"🔬",label:"Lab Test",   date:"Mar 28"},
      {icon:"🎨",label:"Art Applied",date:"Mar 30"},
      {icon:"📦",label:"Packaged",   date:"Apr 1"},
    ],
    steps:[
      {t:300,  label:"LEDGER",     text:"StrainChain ledger: SC-LDG-20260408-BD9291"},
      {t:1100, label:"COA HASH",   text:"sha256: 7f3bc4d8e2a1f9c6b4d5e3a2f1c0b9a8  signed ✓"},
      {t:1900, label:"ART HASH",   text:"sha256(design_file_v4.ai): 3a9be7c2f1d0e8a5b4c3d2e1f0a9b8c7  Verde Studio ✓"},
      {t:2700, label:"HOLO",       text:"Hologram SC-HOLO-9291 applied unit #23/50  |  tamper-evident ✓"},
      {t:3500, label:"METRC",      text:"Transfer TM-2026-0408-001  |  CA METRC: RECEIVED"},
      {t:4300, label:"POLYGON",    text:"Anchored block 54,892,341  |  StrainChain contract ✓"},
      {t:5100, label:"BTC",        text:"Inscribing to Bitcoin Ordinal…"},
      {t:5900, label:"ORDINAL",    text:"#84,291,003  |  Sat 1,923,847,291  |  Block 841,923"},
      {t:6700, label:"IMMUTABLE",  text:"Cannabis + art provenance  |  PERMANENT on Bitcoin ✓"},
    ],
  },
  {
    id:"compliance", phase:"CA BCC COMPLIANCE", accent:"#38bdf8", duration:17,
    title:"Instant StrainChain Compliance Certificate",
    narration:"In the time it took to scan one QR code, StrainChain generated a complete California BCC compliance certificate — and an art authenticity record — for this Blue Dream batch. Every requirement satisfied automatically as a byproduct of running through the Authentic Economy stack. The regulator queries the blockchain for cannabis compliance. The collector queries the blockchain for art provenance. Same record. Same truth layer.",
    requirements:[
      {label:"METRC tag verified",             value:"1A4060300000022000005788 — ACTIVE ✓"},
      {label:"BCC license current",            value:"CCL21-0003847 — valid through Dec 31 2026"},
      {label:"Certificate of Analysis",        value:"Confident Cannabis COA — hash on-chain — PASS"},
      {label:"Pesticide & heavy metals",        value:"Full BCC panel: 0 detections — PASS"},
      {label:"Seed-to-sale chain intact",      value:"8 events — Polygon + BTC Ordinal — UNBROKEN"},
      {label:"CA excise tax paid",             value:"$3.21/unit → Board of Equalization — SYNCED"},
      {label:"Art provenance verified",        value:"Verde Studio · ArtGuard 87/100 · hologram SC-HOLO-9291"},
    ],
    cert:"SC-CA-2026-BD-9291",
  },
];

const TOTAL = USE_CASES.reduce((s,u)=>s+u.duration,0);
const fmt=(s:number)=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

/* ─── TERPENE RADAR ──────────────────────────────────────────────────── */
function TerpeneRadar({active}:{active:boolean}){
  const [reveal,setReveal]=useState(0);
  useEffect(()=>{
    if(!active){setReveal(0);return;}
    const t=setTimeout(()=>{let i=0;const id=setInterval(()=>{setReveal(++i);if(i>=P.terpenes.length)clearInterval(id);},350);return()=>clearInterval(id);},3200);
    return()=>clearTimeout(t);
  },[active]);
  const N=P.terpenes.length,R=72,cx=88,cy=88;
  const pt=(i:number,r:number)=>{const a=(2*Math.PI*i/N)-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)};};
  const gridPts=(r:number)=>Array.from({length:N},(_,i)=>pt(i,r));
  const terpPts=P.terpenes.map((t,i)=>pt(i,R*(t.pct/0.80)*0.9));
  return(
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6}}>Terpene Profile</div>
      <svg width="176" height="176" viewBox="0 0 176 176" style={{overflow:"visible"}}>
        {[0.25,0.5,0.75,1].map(r=>(<polygon key={r} points={gridPts(R*r).map(p=>`${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth=".5"/>))}
        {Array.from({length:N},(_,i)=>{const p=pt(i,R);return(<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,.06)" strokeWidth=".5"/>);})}
        <polygon points={terpPts.slice(0,reveal).concat(terpPts.slice(0,1)).map(p=>`${p.x},${p.y}`).join(" ")} fill="rgba(132,204,22,.15)" stroke="#84cc16" strokeWidth="1.5" strokeLinejoin="round"/>
        {P.terpenes.map((t,i)=>reveal>i&&(<circle key={i} cx={terpPts[i].x} cy={terpPts[i].y} r="3.5" fill={t.color} style={{filter:`drop-shadow(0 0 4px ${t.color})`}}/>))}
        {P.terpenes.map((t,i)=>{const p=pt(i,R+16);const isLeft=p.x<cx;return(<text key={i} x={p.x} y={p.y} textAnchor={isLeft?"end":"start"} fill={reveal>i?t.color:"rgba(255,255,255,.2)"} fontSize="8.5" fontFamily="monospace">{t.name} {t.pct}%</text>);})}
      </svg>
    </div>
  );
}

/* ─── ART GUARD PANEL ────────────────────────────────────────────────── */
function ArtGuardPanel({checks,active}:{checks:{label:string,value:string,score:number,color:string}[],active:boolean}){
  const [shown,setShown]=useState(0);
  const [artScore,setArtScore]=useState(0);
  const [showBadge,setShowBadge]=useState(false);
  useEffect(()=>{
    if(!active){setShown(0);setArtScore(0);setShowBadge(false);return;}
    // ArtGuard runs after the 5 agents finish — starts at ~14s
    const t0=setTimeout(()=>{
      let i=0;const id=setInterval(()=>{setShown(++i);if(i>=checks.length)clearInterval(id);},700);
    },14000);
    const t1=setTimeout(()=>{
      const dur=1200;const s=Date.now();
      const tick=()=>{const p=Math.min(1,(Date.now()-s)/dur);setArtScore(Math.round(P.art.artScore*p));if(p<1)requestAnimationFrame(tick);};
      requestAnimationFrame(tick);
    },14000+checks.length*700+200);
    const t2=setTimeout(()=>setShowBadge(true),14000+checks.length*700+1400);
    return()=>{clearTimeout(t0);clearTimeout(t1);clearTimeout(t2);};
  },[active,checks.length]);

  if(shown===0&&!active)return null;

  return(
    <div style={{marginTop:8,background:"rgba(236,72,153,.04)",border:"1px solid rgba(236,72,153,.18)",borderRadius:12,padding:"10px 12px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <div style={{fontSize:9,fontWeight:700,color:"#ec4899",textTransform:"uppercase",letterSpacing:".1em"}}>🎨 ArtGuard — Packaging Art Valuation</div>
        {shown>=checks.length&&<div style={{marginLeft:"auto",fontFamily:"monospace",fontSize:11,color:"#ec4899",fontWeight:700}}>{artScore}/100</div>}
      </div>
      {checks.map((c,i)=>shown>i&&(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,opacity:shown-1===i?1:.7,transition:"opacity .3s"}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:c.color,flexShrink:0}}/>
          <div style={{flex:1,fontSize:10.5,color:"rgba(255,255,255,.6)"}}>{c.label}</div>
          <div style={{fontSize:9.5,color:"rgba(255,255,255,.35)",fontFamily:"monospace"}}>{c.score}%</div>
        </div>
      ))}
      {shown>0&&shown<checks.length&&(
        <div style={{height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden",marginTop:4}}>
          <div style={{height:"100%",width:`${(shown/checks.length)*100}%`,background:"linear-gradient(90deg,#ec4899,#a78bfa)",borderRadius:2,transition:"width .5s"}}/>
        </div>
      )}
      {showBadge&&(
        <div style={{marginTop:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{background:"rgba(236,72,153,.12)",border:"1px solid rgba(236,72,153,.4)",borderRadius:6,padding:"3px 10px",fontSize:9,fontWeight:700,color:"#ec4899"}}>
            🎨 RARE · Top {P.art.rarityPct}%
          </div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.35)"}}>
            {P.art.studio} × {P.art.cultivator} · {P.art.colorway} · #{P.art.printRun} run
          </div>
          <div style={{marginLeft:"auto",fontSize:10,fontWeight:700,color:"#f59e0b"}}>Art value: ${P.art.artValue}</div>
        </div>
      )}
    </div>
  );
}

/* ─── NFT CARD (DUAL LAYER) ──────────────────────────────────────────── */
function NFTCard({active}:{active:boolean}){
  const [show,setShow]=useState(false);
  const [showArt,setShowArt]=useState(false);
  const [glow,setGlow]=useState(false);
  useEffect(()=>{
    if(!active){setShow(false);setShowArt(false);setGlow(false);return;}
    const t1=setTimeout(()=>setShow(true),3600);
    const t2=setTimeout(()=>setGlow(true),4200);
    const t3=setTimeout(()=>setShowArt(true),5800);
    return()=>{[t1,t2,t3].forEach(clearTimeout);};
  },[active]);
  if(!show)return(<div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.15)",fontSize:11}}>Awaiting mint confirmation…</div>);
  return(
    <div style={{opacity:show?1:0,transition:"opacity .6s",display:"flex",justifyContent:"center"}}>
      <div style={{
        width:172,borderRadius:16,overflow:"hidden",
        background:"linear-gradient(135deg,#0d2e1a 0%,#1a4d2e 40%,#0a1f12 100%)",
        border:`1.5px solid ${glow?"#22c55e":"rgba(34,197,94,.3)"}`,
        boxShadow:glow?"0 0 24px rgba(34,197,94,.3),0 0 48px rgba(34,197,94,.12)":"none",
        transition:"all .6s",
      }}>
        {/* Art canvas */}
        <div style={{height:96,position:"relative",overflow:"hidden",background:"linear-gradient(160deg,#0f3d1f,#1e6b37,#0a2810)"}}>
          <div style={{position:"absolute",inset:0,opacity:.5,background:"radial-gradient(circle at 75% 25%,rgba(34,197,94,.5) 0%,transparent 50%),radial-gradient(circle at 20% 75%,rgba(132,204,22,.35) 0%,transparent 50%)"}}/>
          {/* Simulated botanical illustration lines */}
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.35}} viewBox="0 0 172 96">
            <path d="M20,80 Q50,20 86,48 Q120,75 152,30" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M86,48 Q70,30 55,35 M86,48 Q100,28 115,32" fill="none" stroke="#84cc16" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="86" cy="48" r="4" fill="#22c55e" opacity=".6"/>
          </svg>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontSize:34,filter:"drop-shadow(0 2px 8px rgba(0,0,0,.5))"}}>🌿</div>
          {/* Art badges */}
          <div style={{position:"absolute",top:6,left:6,background:"rgba(236,72,153,.9)",borderRadius:4,padding:"2px 7px",fontSize:7,fontWeight:700,color:"#fff"}}>🎨 RARE ART</div>
          <div style={{position:"absolute",top:6,right:6,background:"rgba(34,197,94,.9)",borderRadius:4,padding:"2px 7px",fontSize:7,fontWeight:700,color:"#000"}}>SC VERIFIED</div>
          <div style={{position:"absolute",bottom:5,left:7,fontSize:7.5,color:"rgba(255,255,255,.55)",fontFamily:"monospace"}}>#{P.art.printRun} · {P.art.colorway}</div>
          <div style={{position:"absolute",bottom:5,right:7,fontSize:7.5,color:"rgba(236,72,153,.7)",fontFamily:"monospace"}}>#23/{P.art.printRun}</div>
        </div>

        {/* Product layer */}
        <div style={{padding:"8px 10px",borderBottom:"0.5px solid rgba(255,255,255,.08)"}}>
          <div style={{fontWeight:800,fontSize:12.5,color:"#22c55e",marginBottom:1}}>{P.name}</div>
          <div style={{fontSize:8.5,color:"rgba(255,255,255,.4)",marginBottom:5}}>{P.type}</div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,color:"#e5e5e5"}}>{P.thc}</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)"}}>THC</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,color:"#e5e5e5"}}>{P.cbd}</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)"}}>CBD</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,color:"#a78bfa"}}>1/50</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)"}}>Edition</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:700,color:"#f59e0b"}}>87</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)"}}>Art Score</div></div>
          </div>
        </div>

        {/* Art provenance layer */}
        {showArt&&(
          <div style={{padding:"7px 10px",background:"rgba(236,72,153,.05)",borderBottom:"0.5px solid rgba(236,72,153,.12)"}}>
            <div style={{fontSize:8,fontWeight:700,color:"#ec4899",marginBottom:4,textTransform:"uppercase",letterSpacing:".07em"}}>🎨 Art Provenance</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 8px"}}>
              {[["Artist","Mx. Solano"],["Studio","Verde Studio"],["Style","Bot. Hyperrealism"],["Hologram","SC-HOLO-9291"]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:7,color:"rgba(255,255,255,.25)"}}>{k}</div><div style={{fontSize:8,color:"rgba(255,255,255,.6)"}}>{v}</div></div>
              ))}
            </div>
          </div>
        )}

        {/* Dual value footer */}
        <div style={{padding:"7px 10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,.3)"}}>Product value</div>
            <div style={{fontSize:9,color:"#22c55e",fontWeight:600}}>${P.art.productVal}</div>
          </div>
          {showArt&&(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
              <div style={{fontSize:7.5,color:"rgba(255,255,255,.3)"}}>Art premium</div>
              <div style={{fontSize:9,color:"#ec4899",fontWeight:600}}>+${P.art.artValue}</div>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"0.5px solid rgba(255,255,255,.08)",paddingTop:4}}>
            <div style={{fontSize:7.5,color:"rgba(255,255,255,.3)",fontFamily:"monospace"}}>Token #SC-9291</div>
            <div style={{fontSize:11,fontWeight:800,color:"#c9a227"}}>${showArt?P.art.nftFloor:P.art.productVal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LIFECYCLE TIMELINE ─────────────────────────────────────────────── */
function LifecycleTimeline({events,active}:{events:{icon:string,label:string,date:string}[],active:boolean}){
  const [lit,setLit]=useState(0);
  useEffect(()=>{
    if(!active){setLit(0);return;}
    let i=0;const id=setInterval(()=>{if(i<events.length)setLit(++i);else clearInterval(id);},700);
    return()=>clearInterval(id);
  },[active,events.length]);
  return(
    <div style={{padding:"4px 0"}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Lifecycle Chain · 8 Events</div>
      <div style={{display:"flex",alignItems:"center",gap:0,overflowX:"auto"}}>
        {events.map((e,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{
                width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,
                background:i<lit?(i===6?"rgba(236,72,153,.15)":"rgba(34,197,94,.12)"):"rgba(255,255,255,.03)",
                border:`1px solid ${i<lit?(i===6?"#ec4899":"#22c55e"):"rgba(255,255,255,.07)"}`,
                transition:"all .4s",boxShadow:i<lit?(i===6?"0 0 10px rgba(236,72,153,.25)":"0 0 10px rgba(34,197,94,.25)"):"none",
              }}>{e.icon}</div>
              <div style={{fontSize:8,fontWeight:600,color:i<lit?(i===6?"#ec4899":"#22c55e"):"rgba(255,255,255,.2)",transition:"color .4s",textAlign:"center",lineHeight:1.2}}>{e.label}</div>
              <div style={{fontSize:7,color:i<lit?"rgba(255,255,255,.3)":"rgba(255,255,255,.1)",fontFamily:"monospace"}}>{e.date}</div>
            </div>
            {i<events.length-1&&(<div style={{width:14,height:1.5,background:i<lit-1?(i===5?"#ec4899":"#22c55e"):"rgba(255,255,255,.06)",margin:"0 2px",marginBottom:24,transition:"background .4s",flexShrink:0}}/>)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── COMPLIANCE GAUGE ───────────────────────────────────────────────── */
function ComplianceGauge({active,accent}:{active:boolean,accent:string}){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!active){setVal(0);return;}
    const t=setTimeout(()=>{const dur=6000;const s=Date.now();const tick=()=>{const p=Math.min(1,(Date.now()-s)/dur);const e=1-Math.pow(1-p,2);setVal(Math.round(100*e));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);},800);
    return()=>clearTimeout(t);
  },[active]);
  const R=52,cx=64,cy=68;
  const full=2*Math.PI*R*0.5;
  return(
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Compliance Score</div>
      <svg width="128" height="80" viewBox="0 0 128 80">
        <path d={`M${cx-R},${cy} A${R},${R} 0 0 1 ${cx+R},${cy}`} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" strokeLinecap="round"/>
        <path d={`M${cx-R},${cy} A${R},${R} 0 0 1 ${cx+R},${cy}`} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${full*val/100} ${full}`} style={{transition:"stroke-dasharray .4s",filter:`drop-shadow(0 0 6px ${accent}80)`}}/>
        <text x={cx} y={cy-4} textAnchor="middle" fill={accent} fontSize="20" fontWeight="700" fontFamily="monospace">{val}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="8">BCC Compliance</text>
        <text x={cx-R+2} y={cy+16} textAnchor="start" fill="rgba(255,255,255,.2)" fontSize="7">0%</text>
        <text x={cx+R-2} y={cy+16} textAnchor="end"   fill="rgba(255,255,255,.2)" fontSize="7">100%</text>
      </svg>
    </div>
  );
}

/* ─── TRUST GAUGE ────────────────────────────────────────────────────── */
function TrustGauge({confidence,active,accent}:{confidence:number,active:boolean,accent:string}){
  const [val,setVal]=useState(0);
  useEffect(()=>{
    if(!active){setVal(0);return;}
    const t=setTimeout(()=>{const dur=2000;const s=Date.now();const tick=()=>{const p=Math.min(1,(Date.now()-s)/dur);setVal(Math.round(confidence*p));if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);},4000);
    return()=>clearTimeout(t);
  },[active,confidence]);
  return(
    <div style={{textAlign:"center",padding:"4px 0"}}>
      <div style={{fontSize:9,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>Compliance Trust Score</div>
      <div style={{position:"relative",height:10,background:"rgba(255,255,255,.05)",borderRadius:5,overflow:"hidden",margin:"0 auto",maxWidth:200}}>
        <div style={{height:"100%",width:`${val}%`,background:`linear-gradient(90deg,${accent}80,${accent})`,borderRadius:5,transition:"width .3s",boxShadow:`0 0 8px ${accent}60`}}/>
      </div>
      <div style={{fontFamily:"monospace",fontSize:18,fontWeight:900,color:val>=95?accent:"rgba(255,255,255,.5)",marginTop:5,transition:"color .5s"}}>{val}%</div>
    </div>
  );
}

/* ─── TERMINAL ───────────────────────────────────────────────────────── */
function Terminal({steps,running,accent}:{steps:{t:number,label:string,text:string}[],running:boolean,accent:string}){
  const [shown,setShown]=useState<number[]>([]);
  useEffect(()=>{
    if(!running){setShown([]);return;}
    const ts=steps.map((s,i)=>setTimeout(()=>setShown(p=>[...p,i]),s.t));
    return()=>ts.forEach(clearTimeout);
  },[running,steps]);
  return(
    <div style={{background:"#050505",border:`1px solid ${accent}1a`,borderRadius:10,padding:"12px 14px",fontFamily:"monospace",fontSize:11.5,lineHeight:1.85,overflowY:"auto",flex:1}}>
      {steps.map((s,i)=>shown.includes(i)&&(
        <div key={i} style={{display:"flex",gap:10,marginBottom:1,opacity:shown[shown.length-1]===i?1:.6,transition:"opacity .3s"}}>
          <span style={{color:accent,fontWeight:700,minWidth:82,fontSize:10,flexShrink:0}}>[{s.label}]</span>
          <span style={{color:shown[shown.length-1]===i?"#e5e5e5":"#555",wordBreak:"break-all"}}>{s.text}</span>
        </div>
      ))}
      {running&&shown.length<steps.length&&<div style={{display:"flex",gap:10}}><span style={{color:accent,fontWeight:700,minWidth:82,fontSize:10}}>[ ··· ]</span><span style={{color:"#2a2a2a"}}>processing…</span></div>}
    </div>
  );
}

/* ─── AGENTS ─────────────────────────────────────────────────────────── */
function AgentPanel({uc,running}:{uc:typeof USE_CASES[1],running:boolean}){
  const [prog,setProg]=useState([0,0,0,0,0]);
  const [astep,setAstep]=useState([0,0,0,0,0]);
  const [verdict,setVerdict]=useState(false);
  useEffect(()=>{
    if(!running){setProg([0,0,0,0,0]);setAstep([0,0,0,0,0]);setVerdict(false);return;}
    const ts:ReturnType<typeof setTimeout>[]=[];
    uc.agents.forEach((a,ai)=>{a.steps.forEach((_,si)=>{ts.push(setTimeout(()=>{setAstep(p=>{const n=[...p];n[ai]=si+1;return n;});setProg(p=>{const n=[...p];n[ai]=Math.round((si+1)/a.steps.length*100);return n;});},ai*700+si*1300));});});
    ts.push(setTimeout(()=>setVerdict(true),uc.agents.length*700+uc.agents[0].steps.length*1300));
    return()=>ts.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {uc.agents.slice(0,4).map((a,i)=>(
          <div key={i} style={{background:"#080808",border:`1px solid ${a.color}18`,borderRadius:9,padding:"8px 11px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:prog[i]===100?a.color:"#1a1a1a",transition:"background .4s",flexShrink:0}}/>
              <div style={{fontSize:11,fontWeight:700,color:prog[i]===100?a.color:"rgba(255,255,255,.35)",flex:1,transition:"color .4s"}}>{a.name}</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:a.color}}>{prog[i]}%</div>
            </div>
            <div style={{height:2.5,background:"rgba(255,255,255,.04)",borderRadius:2,overflow:"hidden",marginBottom:4}}>
              <div style={{height:"100%",width:`${prog[i]}%`,background:a.color,transition:"width .5s",boxShadow:`0 0 5px ${a.color}50`}}/>
            </div>
            <div style={{fontSize:9.5,color:"rgba(255,255,255,.28)",fontFamily:"monospace"}}>{astep[i]>0?a.steps[astep[i]-1]:"waiting…"}</div>
          </div>
        ))}
      </div>
      <div style={{background:"#080808",border:`1px solid ${uc.agents[4].color}18`,borderRadius:9,padding:"8px 11px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:prog[4]===100?uc.agents[4].color:"#1a1a1a",transition:"background .4s"}}/>
          <div style={{fontSize:11,fontWeight:700,color:prog[4]===100?uc.agents[4].color:"rgba(255,255,255,.35)",flex:1,transition:"color .4s"}}>{uc.agents[4].name}</div>
          <div style={{fontFamily:"monospace",fontSize:10,color:uc.agents[4].color}}>{prog[4]}%</div>
        </div>
        <div style={{height:2.5,background:"rgba(255,255,255,.04)",borderRadius:2,overflow:"hidden",marginBottom:4}}>
          <div style={{height:"100%",width:`${prog[4]}%`,background:uc.agents[4].color,transition:"width .5s"}}/>
        </div>
        <div style={{fontSize:9.5,color:"rgba(255,255,255,.28)",fontFamily:"monospace"}}>{astep[4]>0?uc.agents[4].steps[astep[4]-1]:"waiting…"}</div>
      </div>
      {verdict&&(
        <div style={{background:"rgba(34,197,94,.06)",border:"2px solid #22c55e",borderRadius:10,padding:"8px 14px",textAlign:"center",boxShadow:"0 0 16px rgba(34,197,94,.12)"}}>
          <div style={{fontSize:15,fontWeight:900,color:"#22c55e",letterSpacing:".04em"}}>✓ COMPLIANT + AUTHENTIC</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:3,fontFamily:"monospace"}}>{uc.trumark} · {uc.confidence}% confidence</div>
        </div>
      )}
      {/* ArtGuard fires after compliance verdict */}
      <ArtGuardPanel checks={uc.artGuard} active={running}/>
      <TrustGauge confidence={uc.confidence} active={running} accent={uc.accent}/>
    </div>
  );
}

/* ─── QRON PHONE ─────────────────────────────────────────────────────── */
function QRONPhone({active,accent,story}:{active:boolean,accent:string,story:string}){
  const [step,setStep]=useState(0);const [scans,setScans]=useState(0);
  useEffect(()=>{
    if(!active){setStep(0);setScans(0);return;}
    const ts=[setTimeout(()=>setStep(1),700),setTimeout(()=>setStep(2),2200),setTimeout(()=>setStep(3),4000),setTimeout(()=>setStep(4),5800),setTimeout(()=>setScans(1),7200),setTimeout(()=>setScans(2),9000)];
    return()=>ts.forEach(clearTimeout);
  },[active]);
  return(
    <div style={{display:"flex",gap:16,alignItems:"flex-start",justifyContent:"center"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em"}}>QRON Forest Weave</div>
        <div style={{width:100,height:100,background:"rgba(132,204,22,.06)",border:`1.5px solid ${step>=1?accent:"rgba(255,255,255,.06)"}`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"border-color .4s",boxShadow:step>=1?`0 0 16px ${accent}30`:"none"}}>
          {step>=1?(<svg viewBox="0 0 10 10" width="76" height="76">{Array.from({length:100},(_,k)=>{const x=k%10,y=Math.floor(k/10),corner=(x<3&&y<3)||(x>6&&y<3)||(x<3&&y>6),dark=corner||(Math.sin(k*2.8+13)*Math.cos(k*1.4)*0.5+0.5>0.44);return dark?<rect key={k} x={x} y={y} width={1} height={1} fill={accent}/>:null;})}</svg>):<div style={{color:"rgba(255,255,255,.1)",fontSize:11}}>…</div>}
          {step>=2&&<div style={{position:"absolute",bottom:-8,right:-8,background:"#22c55e",borderRadius:4,padding:"2px 7px",fontSize:7,fontWeight:700,color:"#000"}}>SC LIVE</div>}
        </div>
        <div style={{fontSize:9,color:accent,fontFamily:"monospace",opacity:step>=1?1:0}}>qron.space/s/BD9291CA</div>
        {scans>0&&(<div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:6,padding:"3px 10px",fontSize:9}}><span style={{color:"#22c55e",fontWeight:700}}>{scans}</span><span style={{color:"rgba(255,255,255,.4)"}}> scan{scans>1?"s":""} verified</span></div>)}
      </div>
      <div style={{flexShrink:0}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:6,textAlign:"center"}}>StoryMode</div>
        <div style={{width:130,borderRadius:18,border:"2px solid rgba(255,255,255,.1)",background:"#0a0a0a",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          <div style={{height:20,background:"#111",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:28,height:6,background:"#222",borderRadius:3}}/></div>
          <div style={{height:180,background:"linear-gradient(160deg,#0f2d15,#0a1f0d)",padding:"10px",position:"relative",overflow:"hidden"}}>
            {step<2?(<div style={{color:"rgba(255,255,255,.1)",fontSize:9,textAlign:"center",paddingTop:60}}>Scan to activate…</div>):(
              <>
                <div style={{fontSize:8,fontWeight:700,color:accent,marginBottom:5}}>🌿 Origin Story</div>
                <div style={{fontSize:8,color:"rgba(255,255,255,.6)",lineHeight:1.7,fontStyle:"italic"}}>{story}</div>
                {step>=3&&(<div style={{marginTop:8,padding:"4px 7px",background:"rgba(236,72,153,.1)",border:"1px solid rgba(236,72,153,.2)",borderRadius:5}}><div style={{fontSize:7,color:"#ec4899",fontWeight:600}}>🎨 Verde Studio · Mx. Solano</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)"}}>Art Score: 87/100 · #{P.art.printRun} run</div></div>)}
              </>
            )}
          </div>
          <div style={{height:16,background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:30,height:3,background:"rgba(255,255,255,.12)",borderRadius:2}}/></div>
        </div>
      </div>
    </div>
  );
}

/* ─── COMPLIANCE PANEL ───────────────────────────────────────────────── */
function CompliancePanel({uc,running,accent}:{uc:typeof USE_CASES[5],running:boolean,accent:string}){
  const [done,setDone]=useState<boolean[]>(uc.requirements.map(()=>false));
  const [cert,setCert]=useState(false);
  useEffect(()=>{
    if(!running){setDone(uc.requirements.map(()=>false));setCert(false);return;}
    const ts=uc.requirements.map((_,i)=>setTimeout(()=>setDone(p=>{const n=[...p];n[i]=true;return n;}),600+i*950));
    ts.push(setTimeout(()=>setCert(true),600+uc.requirements.length*950+400));
    return()=>ts.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"start",width:"100%"}}>
      <div>
        {uc.requirements.map((r,i)=>(
          <div key={i} style={{display:"flex",gap:9,padding:"6px 10px",borderRadius:7,marginBottom:3,background:done[i]?(i===6?"rgba(236,72,153,.06)":`${accent}08`):"rgba(255,255,255,.02)",transition:"background .4s"}}>
            <div style={{width:16,height:16,borderRadius:"50%",border:`1.5px solid ${done[i]?(i===6?"#ec4899":accent):"rgba(255,255,255,.1)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:done[i]?(i===6?"#ec4899":accent):"transparent",flexShrink:0,marginTop:1,transition:"all .4s"}}>✓</div>
            <div>
              <div style={{fontSize:11.5,fontWeight:500,color:done[i]?"#e5e5e5":"rgba(255,255,255,.22)",transition:"color .3s"}}>{r.label}</div>
              {done[i]&&<div style={{fontSize:9,color:"rgba(255,255,255,.28)",marginTop:1,fontFamily:"monospace"}}>{r.value}</div>}
            </div>
          </div>
        ))}
        {cert&&(<div style={{marginTop:10,background:`${accent}0e`,border:`2px solid ${accent}`,borderRadius:10,padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:8,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:3}}>StrainChain Compliance Certificate</div><div style={{fontSize:14,fontWeight:900,color:accent,fontFamily:"monospace"}}>{uc.cert}</div><div style={{fontSize:8.5,color:"rgba(255,255,255,.25)",marginTop:4}}>Cannabis compliance + art provenance — both immutable on-chain ✓</div></div>)}
      </div>
      <ComplianceGauge active={running} accent={accent}/>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────────── */
export default function DemoPage(){
  const [uc,setUc]=useState(0);
  const [ucE,setUcE]=useState(0);
  const [running,setRunning]=useState(false);
  const [voiceName,setVoiceName]=useState("Loading…");
  const [voiceReady,setVoiceReady]=useState(false);
  const [muted,setMuted]=useState(false);
  const [caption,setCaption]=useState<string[]>([]);
  const [wordIdx,setWordIdx]=useState(-1);
  const [fade,setFade]=useState(true);
  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const synthRef=useRef<SpeechSynthesis|null>(null);
  const voiceRef=useRef<SpeechSynthesisVoice|null>(null);
  const prevRef=useRef(-1);
  const scene=USE_CASES[uc];
  const totalE=USE_CASES.slice(0,uc).reduce((s,u)=>s+u.duration,0)+ucE;
  const pct=Math.min(100,(totalE/TOTAL)*100);
  const sPct=scene.duration>0?(ucE/scene.duration)*100:0;
  const accent=scene.accent;

  const pickVoice=useCallback(()=>{
    const s=window.speechSynthesis;synthRef.current=s;
    const vs=s.getVoices();if(!vs.length)return;
    const pr=["Google UK English Male","Microsoft David","Microsoft Guy","Microsoft Christopher","Daniel","Aaron","Alex","Fred"];
    let c:SpeechSynthesisVoice|null=null;
    for(const n of pr){c=vs.find(v=>v.name.toLowerCase().includes(n.toLowerCase()))??null;if(c)break;}
    if(!c)c=vs.find(v=>v.lang.startsWith("en")&&/male|david|guy|aaron|alex|daniel|fred|chris/i.test(v.name))??null;
    if(!c)c=vs.find(v=>v.lang.startsWith("en"))??vs[0]??null;
    voiceRef.current=c;setVoiceName(c?.name??"Default");setVoiceReady(true);
  },[]);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    const s=window.speechSynthesis;synthRef.current=s;
    if(s.getVoices().length)pickVoice();
    else s.addEventListener("voiceschanged",pickVoice,{once:true});
    return()=>{s.cancel();s.removeEventListener("voiceschanged",pickVoice);};
  },[pickVoice]);

  const narrate=useCallback((text:string)=>{
    const s=synthRef.current;if(!s||muted)return;
    s.cancel();
    const words=text.split(/\s+/);setCaption(words);setWordIdx(-1);
    const u=new SpeechSynthesisUtterance(text);
    if(voiceRef.current)u.voice=voiceRef.current;
    u.rate=0.88;u.pitch=0.8;u.volume=1;
    u.onboundary=(e:SpeechSynthesisEvent)=>{if(e.name==="word"){const sp=text.slice(0,e.charIndex+e.charLength);setWordIdx(sp.trim().split(/\s+/).length-1);}};
    u.onend=()=>setWordIdx(-1);
    s.speak(u);
  },[muted]);

  useEffect(()=>{
    if(running){
      timerRef.current=setInterval(()=>{
        setUcE(p=>{const n=p+1;if(n>=USE_CASES[uc].duration){setUc(u=>{if(u<USE_CASES.length-1){setFade(false);setTimeout(()=>setFade(true),100);setUcE(0);return u+1;}setRunning(false);return u;});return 0;}return n;});
      },1000);
    }else{if(timerRef.current)clearInterval(timerRef.current);}
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[running,uc]);

  useEffect(()=>{
    if(running&&uc!==prevRef.current){prevRef.current=uc;setCaption([]);setWordIdx(-1);setTimeout(()=>narrate(USE_CASES[uc].narration),300);}
  },[uc,running,narrate]);

  function start(){setUc(0);setUcE(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);setRunning(true);setTimeout(()=>narrate(USE_CASES[0].narration),300);}
  function pause(){setRunning(false);synthRef.current?.pause();}
  function resume(){setRunning(true);if(!synthRef.current?.speaking)narrate(scene.narration);else synthRef.current?.resume();}
  function reset(){setRunning(false);setUc(0);setUcE(0);prevRef.current=-1;synthRef.current?.cancel();setCaption([]);setWordIdx(-1);}
  function jumpTo(i:number){setUc(i);setUcE(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);synthRef.current?.cancel();setCaption([]);setWordIdx(-1);setRunning(false);}

  return(
    <div style={{background:"#070707",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:900,height:260,background:`radial-gradient(ellipse,${accent}0a 0%,transparent 68%)`,pointerEvents:"none",zIndex:0,transition:"background 1.2s"}}/>

      {/* TOP BAR */}
      <div style={{position:"relative",zIndex:20,padding:"9px 18px",display:"flex",alignItems:"center",gap:12,borderBottom:"0.5px solid rgba(255,255,255,.07)",background:"rgba(7,7,7,.96)",flexWrap:"wrap"}}>
        <a href="/" style={{color:"#22c55e",fontWeight:900,fontSize:".88rem",letterSpacing:".1em",textDecoration:"none",flexShrink:0}}>🌿 STRAINCHAIN <span style={{color:"rgba(255,255,255,.25)"}}>×</span> <span style={{color:accent,transition:"color 1.2s"}}>{scene.phase}</span></a>
        <div style={{flex:1,minWidth:100,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,#22c55e,${accent})`,borderRadius:2,transition:"width .9s linear,background 1.2s"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,.25)"}}>{fmt(Math.round(totalE))} / {fmt(TOTAL)}</div>
        <div style={{display:"flex",gap:7,flexShrink:0}}>
          {!running
            ?<button onClick={uc===0&&ucE===0?start:resume} disabled={!voiceReady} style={{background:accent,color:"#000",border:"none",borderRadius:8,padding:"7px 18px",fontWeight:700,cursor:voiceReady?"pointer":"not-allowed",fontSize:12,opacity:voiceReady?1:.4,transition:"background 1.2s"}}>{uc===0&&ucE===0?"▶  Start":"▶  Resume"}</button>
            :<button onClick={pause} style={{background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.6)",border:"0.5px solid rgba(255,255,255,.1)",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12}}>⏸</button>
          }
          <button onClick={()=>setMuted(m=>{if(!m)synthRef.current?.cancel();return!m;})} style={{background:"transparent",color:muted?accent:"rgba(255,255,255,.28)",border:"0.5px solid rgba(255,255,255,.07)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:13}}>{muted?"🔇":"🔊"}</button>
          <button onClick={reset} style={{background:"transparent",color:"rgba(255,255,255,.18)",border:"0.5px solid rgba(255,255,255,.06)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:12}}>↺</button>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.15)",flexShrink:0}}>🎙 {voiceName}</div>
      </div>

      {/* TABS */}
      <div style={{position:"relative",zIndex:20,display:"flex",borderBottom:"0.5px solid rgba(255,255,255,.05)",background:"rgba(7,7,7,.93)",overflowX:"auto",flexShrink:0}}>
        {USE_CASES.map((u,i)=>(<button key={i} onClick={()=>jumpTo(i)} style={{padding:"8px 13px",background:"transparent",border:"none",borderBottom:i===uc?`2px solid ${u.accent}`:"2px solid transparent",color:i===uc?u.accent:i<uc?"rgba(34,197,94,.5)":"rgba(255,255,255,.2)",cursor:"pointer",fontSize:10.5,whiteSpace:"nowrap",fontWeight:i===uc?700:400,transition:"color .2s"}}>{i<uc?"✓ ":""}{i+1}. {u.title.split(" — ")[0]}</button>))}
        <div style={{position:"absolute",bottom:0,left:0,height:"2px",width:`${(uc/USE_CASES.length+sPct/100/USE_CASES.length)*100}%`,background:`${accent}28`,transition:"width 1s linear,background 1.2s"}}/>
      </div>

      {/* SPLIT */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 310px",minHeight:0}}>
        <div style={{position:"relative",background:"#060606",display:"flex",flexDirection:"column",padding:"14px 16px 10px",gap:10,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{background:`${accent}18`,border:`1px solid ${accent}38`,borderRadius:6,padding:"3px 9px",fontSize:8.5,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:".1em",whiteSpace:"nowrap"}}>{scene.phase}</div>
            <div style={{fontSize:13.5,fontWeight:700,color:"#e5e5e5",opacity:fade?1:0,transition:"opacity .25s"}}>{scene.title}</div>
            <div style={{marginLeft:"auto",flexShrink:0}}>
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="2"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="2" strokeDasharray={`${2*Math.PI*14}`} strokeDashoffset={`${2*Math.PI*14*(1-sPct/100)}`} strokeLinecap="round" transform="rotate(-90 18 18)" style={{transition:"stroke-dashoffset 1s linear,stroke 1.2s",filter:`drop-shadow(0 0 3px ${accent}55)`}}/>
                <text x="18" y="23" textAnchor="middle" fill="rgba(255,255,255,.38)" fontSize="10" fontFamily="monospace">{Math.max(0,scene.duration-ucE)}</text>
              </svg>
            </div>
          </div>

          {/* Product banner */}
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"7px 11px",background:"rgba(34,197,94,.05)",border:"1px solid rgba(34,197,94,.12)",borderRadius:8,flexShrink:0}}>
            <div style={{fontSize:18}}>🌿</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
                <div style={{fontSize:12.5,fontWeight:700,color:"#22c55e"}}>{P.name}</div>
                <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)"}}>{P.type}</div>
              </div>
              <div style={{display:"flex",gap:12,marginTop:2,flexWrap:"wrap"}}>
                {[`THC ${P.thc}`,P.cultivator,`🎨 ${P.art.studio} × ${P.art.colorway}`].map((v,i)=>(<div key={i} style={{fontSize:9,color:i===2?"rgba(236,72,153,.6)":"rgba(255,255,255,.35)"}}>{v}</div>))}
              </div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:8,fontFamily:"monospace",color:"rgba(34,197,94,.5)"}}>{P.metrc.slice(-8)}</div>
              <div style={{fontSize:7.5,color:"rgba(236,72,153,.5)",marginTop:1}}>ArtScore: {P.art.artScore}/100</div>
            </div>
          </div>

          {/* Main interaction */}
          <div style={{flex:1,opacity:fade?1:0,transition:"opacity .25s",display:"flex",flexDirection:"column",gap:12,overflow:"hidden",minHeight:0}}>
            {scene.id==="autoflow"&&(<div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,flex:1,minHeight:0}}><Terminal steps={(scene as typeof USE_CASES[0]).steps} running={running} accent={accent}/><TerpeneRadar active={running}/></div>)}
            {scene.id==="trumark"&&(<div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minHeight:0,overflow:"auto"}}><AgentPanel uc={scene as typeof USE_CASES[1]} running={running}/></div>)}
            {scene.id==="mint"&&(<div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,flex:1,minHeight:0}}><Terminal steps={(scene as typeof USE_CASES[2]).steps} running={running} accent={accent}/><NFTCard active={running}/></div>)}
            {scene.id==="qron"&&(<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><QRONPhone active={running} accent={accent} story={(scene as typeof USE_CASES[3]).story}/></div>)}
            {scene.id==="ledger"&&(<div style={{flex:1,display:"flex",flexDirection:"column",gap:12,minHeight:0}}><LifecycleTimeline events={(scene as typeof USE_CASES[4]).events} active={running}/><Terminal steps={(scene as typeof USE_CASES[4]).steps} running={running} accent={accent}/></div>)}
            {scene.id==="compliance"&&(<div style={{flex:1,overflow:"auto"}}><CompliancePanel uc={scene as typeof USE_CASES[5]} running={running} accent={accent}/></div>)}
          </div>

          {/* Captions */}
          {caption.length>0&&(<div style={{flexShrink:0,padding:"5px 10px 4px",background:"rgba(0,0,0,.75)",borderRadius:7,borderTop:`1px solid ${accent}18`}}><div style={{fontSize:11,lineHeight:1.7,textAlign:"center"}}>{caption.map((w,i)=>(<span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.3)":"rgba(255,255,255,.72)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.27em"}}>{w}</span>))}</div></div>)}
        </div>

        {/* Script panel */}
        <div style={{background:"rgba(9,9,9,.98)",borderLeft:"0.5px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 15px",borderBottom:"0.5px solid rgba(255,255,255,.05)"}}>
            <div style={{fontSize:8.5,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.17)",marginBottom:4}}>{scene.phase} · {uc+1}/{USE_CASES.length} · {scene.duration}s</div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:12.5,lineHeight:1.3}}>{scene.title}</div>
            <div style={{display:"flex",gap:4,marginTop:9}}>
              {USE_CASES.map((_,i)=>(<div key={i} onClick={()=>jumpTo(i)} style={{height:3,flex:1,borderRadius:2,cursor:"pointer",background:i<uc?"#22c55e":i===uc?accent:"rgba(255,255,255,.06)",transition:"background .3s"}}/>))}
            </div>
          </div>
          <div style={{flex:1,padding:"12px 15px",overflowY:"auto"}}>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,.17)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:7}}>Narration</div>
            <div style={{fontSize:12,lineHeight:1.95,background:`${accent}07`,border:`1px solid ${accent}10`,borderRadius:8,padding:"10px 12px"}}>
              {caption.length>0?caption.map((w,i)=>(<span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.28)":"rgba(255,255,255,.62)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.3em"}}>{w}</span>)):<span style={{color:"rgba(255,255,255,.42)"}}>{scene.narration}</span>}
            </div>
            <div style={{marginTop:12,display:"flex",gap:7,flexWrap:"wrap"}}>
              <div style={{background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#22c55e",fontWeight:600}}>🌿 StrainChain</div>
              {["autoflow","trumark","mint","ledger"].includes(scene.id)&&<div style={{background:"rgba(201,162,39,.07)",border:"1px solid rgba(201,162,39,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#c9a227",fontWeight:600}}>◆ AuthiChain</div>}
              {["trumark","mint","qron"].includes(scene.id)&&<div style={{background:"rgba(236,72,153,.07)",border:"1px solid rgba(236,72,153,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#ec4899",fontWeight:600}}>🎨 ArtGuard</div>}
              {scene.id==="qron"&&<div style={{background:"rgba(132,204,22,.07)",border:"1px solid rgba(132,204,22,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#84cc16",fontWeight:600}}>⬡ QRON</div>}
              {scene.id==="ledger"&&<div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#f59e0b",fontWeight:600}}>₿ BTC Ordinal</div>}
              {scene.id==="compliance"&&<div style={{background:"rgba(56,189,248,.07)",border:"1px solid rgba(56,189,248,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#38bdf8",fontWeight:600}}>⚖ CA BCC</div>}
            </div>
          </div>
          <div style={{padding:"10px 15px",borderTop:"0.5px solid rgba(255,255,255,.05)",display:"flex",gap:7}}>
            <button onClick={()=>jumpTo(Math.max(0,uc-1))} disabled={uc===0} style={{flex:1,padding:"7px",background:"rgba(255,255,255,.03)",border:"0.5px solid rgba(255,255,255,.06)",borderRadius:7,color:uc===0?"rgba(255,255,255,.09)":"rgba(255,255,255,.4)",cursor:uc===0?"default":"pointer",fontSize:11}}>← Prev</button>
            <button onClick={()=>jumpTo(Math.min(USE_CASES.length-1,uc+1))} disabled={uc===USE_CASES.length-1} style={{flex:1,padding:"7px",background:accent,border:"none",borderRadius:7,color:"#000",cursor:"pointer",fontWeight:700,fontSize:11,opacity:uc===USE_CASES.length-1?.3:1,transition:"background 1.2s"}}>Next →</button>
          </div>
        </div>
      </div>

      <div style={{position:"relative",zIndex:20,padding:"6px 18px",background:"rgba(7,7,7,.95)",borderTop:"0.5px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",flexShrink:0}}>
        <div style={{fontSize:9.5,color:"rgba(255,255,255,.14)"}}>Loom → Screen + Camera → <strong style={{color:"rgba(255,255,255,.28)"}}>▶ Start</strong> → narrates automatically</div>
        <div style={{marginLeft:"auto",display:"flex",gap:12}}>
          {[{l:"strainchain.io",c:"#22c55e"},{l:"authichain.com",c:"#c9a227"},{l:"qron.space",c:"#84cc16"}].map(({l,c})=>(<a key={l} href={`https://${l}`} target="_blank" rel="noreferrer" style={{fontSize:9.5,color:c,opacity:.35,textDecoration:"none"}}>{l} ↗</a>))}
        </div>
      </div>
    </div>
  );
}
