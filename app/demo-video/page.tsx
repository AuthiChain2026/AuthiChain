"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ── PRODUCT CONTEXT ─────────────────────────────────────────────────
   Blue Dream 3.5g — Emerald Peak Farms, Humboldt CA
   Running through the full Authentic Economy stack via StrainChain
   ──────────────────────────────────────────────────────────────────── */

const PRODUCT = {
  name: "Blue Dream",
  sku: "SC-2026-0408-BD-001",
  type: "Premium Flower · Hybrid · 3.5g",
  thc: "22.4%", cbd: "0.8%",
  cultivator: "Emerald Peak Farms",
  location: "Humboldt County, CA",
  license: "CCL21-0003847",
  metrc: "1A4060300000022000005788",
  harvest: "March 15, 2026",
  batch: "SC-2026-0408-BD",
  cert: "SC-CA-2026-BD-9291",
};

const USE_CASES = [
  {
    id:"autoflow", phase:"AUTOFLOW", accent:"#7c3aed",
    title:"AutoFlow — Cannabis Product Classification",
    narration:"AutoFlow ingests this Blue Dream batch from Emerald Peak Farms and instantly classifies it across every regulatory dimension. Cannabis strain, METRC tag, California BCC license, cultivation address, lab terpene profile, state compliance requirements, and StrainChain protocol routing — all resolved in under 3 seconds. No manual entry. No paper forms.",
    duration:18,
    steps:[
      {t:300,  label:"INPUT",      text:'Product: "Blue Dream 3.5g Flower — Emerald Peak Farms, Humboldt CA"'},
      {t:1000, label:"AUTOFLOW",   text:"Cannabis classification engine engaged…"},
      {t:1800, label:"STRAIN",     text:"Cannabis sativa × indica hybrid — Blue Dream (Blueberry × Haze)"},
      {t:2700, label:"METRC",      text:"Tag: 1A4060300000022000005788  |  State: California (Prop 64)"},
      {t:3600, label:"LICENSE",    text:"BCC license CCL21-0003847  |  CDFA cert #CF-1982-P  ✓ VALID"},
      {t:4500, label:"TERPENES",   text:"Myrcene 0.8%  |  Caryophyllene 0.4%  |  Pinene 0.3%  |  Limonene 0.2%"},
      {t:5400, label:"PROTOCOL",   text:"StrainChain protocol selected  |  AuthiChain NFT layer: active"},
      {t:6300, label:"ROUTING",    text:"Seed-to-sale chain: Cultivator → Distributor → Dispensary"},
      {t:7200, label:"OUTPUT",     text:"Classification complete ✓  |  StrainChain ID: SC-2026-0408-BD"},
      {t:8100, label:"NEXT",       text:"Routing to 5-agent TRUmark authentication via StrainChain…"},
    ],
  },
  {
    id:"trumark", phase:"STRAINCHAIN / TRUMARK", accent:"#22c55e",
    title:"StrainChain — 5-Agent Seed-to-Sale Authentication",
    narration:"StrainChain runs the AuthiChain 5-agent TRUmark protocol, tuned for cannabis compliance. Guardian cross-references the Certificate of Analysis hash. Archivist verifies the unbroken seed-to-sale chain. Sentinel checks for diversion flags and recall alerts. Scout confirms METRC state sync. Arbiter adjudicates compliance. One unified verdict — compliant and authentic.",
    duration:22,
    agents:[
      {name:"Guardian",  role:"COA lab results verification",        weight:35, color:"#22c55e",  steps:["Loading COA hash from Confident Cannabis…","THC: 22.4% — within label tolerance","Pesticide screen: PASS (0 detections)","Heavy metals: PASS  |  COA: VERIFIED ✓"]},
      {name:"Archivist", role:"Seed-to-sale chain integrity",         weight:20, color:"#a78bfa",  steps:["Tracing from seed tag #1A406030…","Nursery → Cultivation: INTACT","Harvest → Distrib.: INTACT","Dispensary transfer: INTACT ✓"]},
      {name:"Sentinel",  role:"Diversion & recall detection",         weight:25, color:"#f59e0b",  steps:["Checking CA recall database…","METRC diversion flags: ZERO","Out-of-state movement: NONE","Batch status: CLEAR ✓"]},
      {name:"Scout",     role:"METRC state sync verification",        weight:8,  color:"#38bdf8",  steps:["Syncing with METRC CA API…","Tag 1A4060300000022000005788: ACTIVE","Inventory reconciled: 50/50 units","State sync: CONFIRMED ✓"]},
      {name:"Arbiter",   role:"StrainChain compliance adjudication",  weight:12, color:"#c9a227",  steps:["Collecting agent verdicts…","Weighted consensus: 99.1%","BCC compliance threshold: 95% ✓","Verdict: COMPLIANT + AUTHENTIC"]},
    ],
    verdict:"COMPLIANT + AUTHENTIC",
    confidence:99.1,
    trumark:"SC-TM-CA-2026-04-08-BD9291",
    duration:22,
  },
  {
    id:"mint", phase:"BLOCKCHAIN / STRAINCHAIN", accent:"#a78bfa",
    title:"NFT Mint — Cannabis Provenance Collectable",
    narration:"Every authenticated StrainChain batch is minted as an ERC-721 NFT on Polygon — creating a permanent, tradeable provenance record. For Blue Dream from Emerald Peak Farms, this NFT carries the full COA hash, METRC tag, terpene fingerprint, and harvest timestamp. Cannabis collectables are an emerging secondary market — verified provenance is the foundation.",
    duration:18,
    steps:[
      {t:400,  label:"TRIGGER",    text:"StrainChain verdict COMPLIANT → initiating Polygon mint"},
      {t:1200, label:"METADATA",   text:'{"strain":"Blue Dream","thc":"22.4%","cultivator":"Emerald Peak Farms","metrc":"1A4060300000022000005788"}'},
      {t:2200, label:"IPFS",       text:"Pinning COA + metadata to IPFS: ipfs://QmBD3c9R…k7pT2"},
      {t:3000, label:"CONTRACT",   text:"StrainChain ERC-721: 0x5db511706FB6317cd23A7655F67450c5AC6"},
      {t:3900, label:"MINT",       text:"Minting token #SC-9291… tx: 0xa4f8e3…c291"},
      {t:5000, label:"CONFIRMED",  text:"Block 54,892,341  |  Gas: $0.004  |  Polygon mainnet ✓"},
      {t:5800, label:"EDITION",    text:"Edition: 1 of 50 units  |  Category: Humboldt Reserve"},
      {t:6600, label:"COLLECTABLE",text:"Cannabis collectables marketplace: listing created"},
      {t:7400, label:"ROYALTY",    text:"Emerald Peak Farms: 7% royalty on all secondary sales"},
      {t:8200, label:"LIVE",       text:"Provenance collectable ACTIVE  |  NFT + COA permanently linked ✓"},
    ],
  },
  {
    id:"qron", phase:"QRON / STRAINCHAIN", accent:"#84cc16",
    title:"Dynamic QRON Code → StoryMode Strain Narrative",
    narration:"The Blue Dream packaging carries a QRON code — AI-generated QR art that resolves to StoryMode, a cinematic strain origin narrative. Every scan logs a Truth Network vote confirming authenticity. The code is dynamic: it knows when the batch changes hands, when inventory depletes, when a dispensary activates the product. The QR code is as alive as the plant it represents.",
    duration:18,
    qron:{
      style:"Forest Weave",
      shortUrl:"qron.space/s/BD9291CA",
      resolves:"StoryMode — Strain Origin Narrative",
      story:"From fog-kissed ridgelines above Garberville, Humboldt County. Planted February 3, 2026. Hand-watered from a spring-fed creek at 2,400 feet elevation. Harvested March 15 after 42 days of flower. Dried 14 days, hand-trimmed, third-party tested. This batch is lot 1 of 50 units. You are holding verified proof of that.",
      scans:0,
    },
    duration:18,
  },
  {
    id:"ledger", phase:"STRAINCHAIN LEDGER / BTC", accent:"#f59e0b",
    title:"Immutable Seed-to-Sale Ledger + BTC Ordinal",
    narration:"The StrainChain ledger is the append-only record of every event in Blue Dream's lifecycle — from clone tag to consumer scan. Every cultivation event, every state transfer, every lab test, every ownership change is written and signed. For the highest-integrity batches, this ledger is inscribed as a Bitcoin Ordinal — anchoring cannabis compliance permanently to the world's most audited blockchain. No regulator can question it. No court can dispute it.",
    duration:18,
    steps:[
      {t:400,  label:"LEDGER",     text:"StrainChain ledger entry: SC-LDG-20260408-BD9291"},
      {t:1300, label:"EVENTS",     text:"8 lifecycle events logged: seed→clone→veg→flower→harvest→dry→test→package"},
      {t:2200, label:"COA HASH",   text:"sha256(COA PDF): 7f3bc4d8e2a1f9c6b4d5e3a2f1c0b9a8  signed ✓"},
      {t:3100, label:"METRC SYNC", text:"METRC transfer manifest: TM-2026-0408-001  |  State: RECEIVED"},
      {t:3900, label:"CHAIN",      text:"Anchored Polygon block 54,892,341  |  StrainChain contract ✓"},
      {t:4700, label:"TAX",        text:"CA excise tax: $3.21/unit  |  Board of Equalization: SYNCED"},
      {t:5500, label:"BTC",        text:"Inscribing compliance record to Bitcoin Ordinal…"},
      {t:6300, label:"ORDINAL",    text:"Ordinal #84,291,003  |  Sat: 1,923,847,291  |  Block 841,923"},
      {t:7100, label:"URI",        text:"strainchain://SC-LDG-20260408-BD9291"},
      {t:7900, label:"STATUS",     text:"IMMUTABLE SEED-TO-SALE RECORD  |  Auditable forever ✓"},
    ],
  },
  {
    id:"dpp", phase:"STATE COMPLIANCE", accent:"#38bdf8",
    title:"Instant StrainChain Compliance Certificate",
    narration:"In the time it took to scan one QR code, StrainChain generated a complete cannabis compliance certificate for Blue Dream batch SC-2026-0408-BD. Every California BCC requirement satisfied automatically — as a byproduct of running through the Authentic Economy stack. No manual compliance reports. No paper COA binders. The regulator can query the blockchain.",
    duration:17,
    requirements:[
      {label:"METRC tag verified",            value:"1A4060300000022000005788 — ACTIVE in CA METRC",           done:false},
      {label:"BCC license current",           value:"CCL21-0003847 — expires Dec 31 2026 — VALID",            done:false},
      {label:"Certificate of Analysis",       value:"Confident Cannabis COA — hash on-chain — PASS",           done:false},
      {label:"Pesticide & heavy metal screen", value:"BCC panel: 0 detections — PASS",                         done:false},
      {label:"Seed-to-sale chain intact",     value:"8 events — Polygon + BTC Ordinal — UNBROKEN",            done:false},
      {label:"CA excise tax paid",            value:"$3.21/unit → CA Board of Equalization — SYNCED",         done:false},
      {label:"Consumer QR verification",      value:"QRON code active — StoryMode live — scans logged",       done:false},
    ],
    cert:"SC-CA-2026-BD-9291",
    duration:17,
  },
];

const TOTAL = USE_CASES.reduce((s,u)=>s+u.duration,0);
function pad(n:number){return String(Math.floor(n)).padStart(2,"0")}
function fmt(s:number){return `${Math.floor(s/60)}:${pad(s%60)}`}

/* ── TERMINAL ────────────────────────────────────────────────────────── */
function Terminal({steps, running, accent}:{steps:{t:number,label:string,text:string}[], running:boolean, accent:string}){
  const [shown,setShown]=useState<number[]>([]);
  useEffect(()=>{
    if(!running){setShown([]);return;}
    const ts=steps.map((s,i)=>setTimeout(()=>setShown(p=>[...p,i]),s.t));
    return()=>ts.forEach(clearTimeout);
  },[running,steps]);
  return(
    <div style={{background:"#060606",border:`1px solid ${accent}22`,borderRadius:12,padding:"16px 18px",fontFamily:"monospace",fontSize:12.5,lineHeight:1.85,minHeight:240,overflowY:"auto"}}>
      {steps.map((s,i)=>shown.includes(i)&&(
        <div key={i} style={{display:"flex",gap:12,marginBottom:1,opacity:shown[shown.length-1]===i?1:.65,transition:"opacity .3s"}}>
          <span style={{color:accent,fontWeight:700,minWidth:94,fontSize:10.5,paddingTop:1,flexShrink:0}}>[{s.label}]</span>
          <span style={{color:shown[shown.length-1]===i?"#e5e5e5":"#555",wordBreak:"break-all"}}>{s.text}</span>
        </div>
      ))}
      {running&&shown.length<steps.length&&(
        <div style={{display:"flex",gap:12}}>
          <span style={{color:accent,fontWeight:700,minWidth:94,fontSize:10.5,flexShrink:0}}>[···]</span>
          <span style={{color:"#333"}}>processing…</span>
        </div>
      )}
    </div>
  );
}

/* ── AGENT PANEL ─────────────────────────────────────────────────────── */
function AgentPanel({uc,running}:{uc:typeof USE_CASES[1],running:boolean}){
  const [astep,setAstep]=useState([0,0,0,0,0]);
  const [prog,setProg]=useState([0,0,0,0,0]);
  const [verdict,setVerdict]=useState(false);
  useEffect(()=>{
    if(!running){setAstep([0,0,0,0,0]);setProg([0,0,0,0,0]);setVerdict(false);return;}
    const ts:ReturnType<typeof setTimeout>[]=[];
    uc.agents.forEach((a,ai)=>{
      a.steps.forEach((_,si)=>{
        ts.push(setTimeout(()=>{
          setAstep(p=>{const n=[...p];n[ai]=si+1;return n;});
          setProg(p=>{const n=[...p];n[ai]=Math.round((si+1)/a.steps.length*100);return n;});
        },ai*700+si*1300));
      });
    });
    ts.push(setTimeout(()=>setVerdict(true),uc.agents.length*700+uc.agents[0].steps.length*1300));
    return()=>ts.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:9,width:"100%"}}>
      {uc.agents.map((a,i)=>(
        <div key={i} style={{background:"#080808",border:`1px solid ${a.color}1a`,borderRadius:10,padding:"9px 13px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:prog[i]===100?a.color:"#222",transition:"background .4s",flexShrink:0}}/>
            <div style={{fontWeight:700,fontSize:11.5,color:prog[i]===100?a.color:"rgba(255,255,255,.4)",flex:1,transition:"color .4s"}}>
              {a.name} <span style={{fontWeight:400,color:"rgba(255,255,255,.2)",fontSize:10}}>({a.weight}%)</span>
            </div>
            <div style={{fontFamily:"monospace",fontSize:11,color:a.color,flexShrink:0}}>{prog[i]}%</div>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,.04)",borderRadius:2,overflow:"hidden",marginBottom:5}}>
            <div style={{height:"100%",width:`${prog[i]}%`,background:a.color,transition:"width .5s",borderRadius:2,boxShadow:`0 0 6px ${a.color}60`}}/>
          </div>
          <div style={{fontSize:10.5,color:"rgba(255,255,255,.3)",fontFamily:"monospace"}}>
            {astep[i]>0?a.steps[astep[i]-1]:"awaiting prior agents…"}
          </div>
        </div>
      ))}
      {verdict&&(
        <div style={{background:"rgba(34,197,94,.07)",border:"2px solid #22c55e",borderRadius:12,padding:"14px 18px",textAlign:"center",marginTop:2}}>
          <div style={{fontSize:18,fontWeight:900,color:"#22c55e",letterSpacing:".05em"}}>✓ COMPLIANT + AUTHENTIC</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:4}}>StrainChain TRUmark: {uc.trumark}  ·  Confidence: {uc.confidence}%</div>
        </div>
      )}
    </div>
  );
}

/* ── QRON PANEL ──────────────────────────────────────────────────────── */
function QRONPanel({uc,running,accent}:{uc:typeof USE_CASES[3],running:boolean,accent:string}){
  const [step,setStep]=useState(0);
  const [scans,setScans]=useState(0);
  useEffect(()=>{
    if(!running){setStep(0);setScans(0);return;}
    const ts=[
      setTimeout(()=>setStep(1),700),
      setTimeout(()=>setStep(2),2200),
      setTimeout(()=>setStep(3),4000),
      setTimeout(()=>setStep(4),5800),
      setTimeout(()=>setScans(s=>s+1),7200),
      setTimeout(()=>setScans(s=>s+1),8900),
    ];
    return()=>ts.forEach(clearTimeout);
  },[running]);
  const q=uc.qron;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,width:"100%"}}>
      <div style={{background:"#060606",border:`1px solid ${accent}20`,borderRadius:12,padding:"14px",textAlign:"center"}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>QRON Generator</div>
        {step===0&&<div style={{color:"rgba(255,255,255,.15)",fontSize:11,padding:"36px 0"}}>Awaiting StrainChain verdict…</div>}
        {step>=1&&(
          <>
            <div style={{width:110,height:110,margin:"0 auto 10px",background:`linear-gradient(135deg,${accent}15,transparent)`,border:`1.5px solid ${accent}35`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <svg viewBox="0 0 10 10" width="84" height="84">
                {Array.from({length:100},(_,k)=>{
                  const x=k%10,y=Math.floor(k/10);
                  const corner=(x<3&&y<3)||(x>6&&y<3)||(x<3&&y>6);
                  const dark=corner||(Math.sin(k*2.3+7)*Math.cos(k*1.7)*0.5+0.5>0.42);
                  return dark?<rect key={k} x={x} y={y} width={1} height={1} fill={accent}/>:null;
                })}
              </svg>
              {step>=2&&<div style={{position:"absolute",bottom:-7,right:-7,background:"#22c55e",borderRadius:4,padding:"2px 7px",fontSize:7.5,fontWeight:700,color:"#000"}}>SC LIVE</div>}
            </div>
            <div style={{fontSize:11,color:accent,fontFamily:"monospace"}}>{q.shortUrl}</div>
            <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)",marginTop:3}}>Style: {q.style}</div>
            {step>=2&&<div style={{fontSize:9,color:"rgba(255,255,255,.2)",marginTop:3}}>On packaging: Blue Dream 3.5g</div>}
          </>
        )}
      </div>
      <div style={{background:"#060606",border:`1px solid ${accent}20`,borderRadius:12,padding:"14px"}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>StoryMode Destination</div>
        {step<2&&<div style={{color:"rgba(255,255,255,.15)",fontSize:11,padding:"28px 0",textAlign:"center"}}>Resolving QR destination…</div>}
        {step>=2&&(
          <>
            <div style={{fontSize:10.5,fontWeight:700,color:accent,marginBottom:7}}>🌿 Strain Origin Story</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)",lineHeight:1.75,fontStyle:"italic"}}>"{q.story}"</div>
            {step>=3&&(
              <div style={{marginTop:9,fontSize:9.5,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:6,padding:"7px 10px"}}>
                <div style={{color:"rgba(255,255,255,.35)"}}>Dynamic: updates on dispensary activation</div>
                <div style={{color:"rgba(255,255,255,.25)",marginTop:2}}>→ THC/CBD · terpene profile · COA link</div>
              </div>
            )}
            {step>=4&&(
              <div style={{marginTop:9,background:"rgba(34,197,94,.07)",border:"1px solid rgba(34,197,94,.2)",borderRadius:7,padding:"7px 10px",fontSize:11}}>
                <span style={{color:"#22c55e",fontWeight:700}}>Truth Network: </span>
                <span style={{color:"rgba(255,255,255,.45)"}}>{scans} consumer scan{scans!==1?"s":""} verified ✓</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── COMPLIANCE PANEL ────────────────────────────────────────────────── */
function CompliancePanel({uc,running,accent}:{uc:typeof USE_CASES[5],running:boolean,accent:string}){
  const [done,setDone]=useState<boolean[]>(uc.requirements.map(()=>false));
  const [cert,setCert]=useState(false);
  useEffect(()=>{
    if(!running){setDone(uc.requirements.map(()=>false));setCert(false);return;}
    const ts=uc.requirements.map((_,i)=>setTimeout(()=>setDone(p=>{const n=[...p];n[i]=true;return n;}),700+i*1000));
    ts.push(setTimeout(()=>setCert(true),700+uc.requirements.length*1000+400));
    return()=>ts.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{width:"100%"}}>
      {uc.requirements.map((r,i)=>(
        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"7px 11px",borderRadius:8,marginBottom:4,
          background:done[i]?`${accent}09`:"rgba(255,255,255,.02)",transition:"background .4s"}}>
          <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${done[i]?accent:"rgba(255,255,255,.1)"}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:done[i]?accent:"transparent",
            flexShrink:0,marginTop:1,transition:"all .4s"}}>✓</div>
          <div>
            <div style={{fontSize:12,fontWeight:500,color:done[i]?"#e5e5e5":"rgba(255,255,255,.25)",transition:"color .3s"}}>{r.label}</div>
            {done[i]&&<div style={{fontSize:9.5,color:"rgba(255,255,255,.3)",marginTop:2,fontFamily:"monospace"}}>{r.value}</div>}
          </div>
        </div>
      ))}
      {cert&&(
        <div style={{marginTop:12,background:`${accent}0e`,border:`2px solid ${accent}`,borderRadius:12,padding:"14px 18px",textAlign:"center"}}>
          <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginBottom:4,textTransform:"uppercase",letterSpacing:".1em"}}>StrainChain Compliance Certificate</div>
          <div style={{fontSize:15,fontWeight:900,color:accent,fontFamily:"monospace"}}>{uc.cert}</div>
          <div style={{fontSize:9.5,color:"rgba(255,255,255,.3)",marginTop:5}}>California BCC · METRC · Polygon · BTC Ordinal — all satisfied automatically ✓</div>
        </div>
      )}
    </div>
  );
}

/* ── PRODUCT BANNER ──────────────────────────────────────────────────── */
function ProductBanner(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:16,padding:"8px 12px",background:"rgba(34,197,94,.06)",border:"1px solid rgba(34,197,94,.15)",borderRadius:9,marginBottom:14,flexShrink:0}}>
      <div style={{fontSize:22,flexShrink:0}}>🌿</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#22c55e"}}>{PRODUCT.name}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.35)"}}>{PRODUCT.type}</div>
        </div>
        <div style={{display:"flex",gap:14,marginTop:3,flexWrap:"wrap"}}>
          {[[`THC ${PRODUCT.thc}`,""],[PRODUCT.cultivator,""],[PRODUCT.location,""],[`Batch: ${PRODUCT.batch}`,""]].map(([v],i)=>(
            <div key={i} style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>{v}</div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
        <div style={{fontSize:8.5,fontFamily:"monospace",color:"rgba(34,197,94,.6)"}}>METRC</div>
        <div style={{fontSize:9,fontFamily:"monospace",color:"rgba(255,255,255,.3)"}}>{PRODUCT.metrc.slice(-8)}</div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────────────────── */
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
  const [counters,setCounters]=useState([0,0,0,0,0,0]);
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
    const p=["Google UK English Male","Microsoft David","Microsoft Guy","Microsoft Christopher","Daniel","Aaron","Alex","Fred"];
    let c:SpeechSynthesisVoice|null=null;
    for(const n of p){c=vs.find(v=>v.name.toLowerCase().includes(n.toLowerCase()))??null;if(c)break;}
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
    u.onboundary=(e:SpeechSynthesisEvent)=>{
      if(e.name==="word"){const sp=text.slice(0,e.charIndex+e.charLength);setWordIdx(sp.trim().split(/\s+/).length-1);}
    };
    u.onend=()=>setWordIdx(-1);
    s.speak(u);
  },[muted]);

  useEffect(()=>{
    if(running){
      timerRef.current=setInterval(()=>{
        setUcE(p=>{
          const n=p+1;
          if(n>=USE_CASES[uc].duration){
            setUc(u=>{
              if(u<USE_CASES.length-1){setFade(false);setTimeout(()=>setFade(true),100);setUcE(0);return u+1;}
              setRunning(false);return u;
            });return 0;
          }return n;
        });
      },1000);
    }else{if(timerRef.current)clearInterval(timerRef.current);}
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[running,uc]);

  useEffect(()=>{
    if(running&&uc!==prevRef.current){
      prevRef.current=uc;setCaption([]);setWordIdx(-1);
      setTimeout(()=>narrate(USE_CASES[uc].narration),300);
    }
  },[uc,running,narrate]);

  function start(){setUc(0);setUcE(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);setRunning(true);setTimeout(()=>narrate(USE_CASES[0].narration),300);}
  function pause(){setRunning(false);synthRef.current?.pause();}
  function resume(){setRunning(true);if(!synthRef.current?.speaking)narrate(scene.narration);else synthRef.current?.resume();}
  function reset(){setRunning(false);setUc(0);setUcE(0);prevRef.current=-1;synthRef.current?.cancel();setCaption([]);setWordIdx(-1);}
  function jumpTo(i:number){setUc(i);setUcE(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);synthRef.current?.cancel();setCaption([]);setWordIdx(-1);setRunning(false);}

  return(
    <div style={{background:"#070707",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Ambient glow */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:800,height:240,
        background:`radial-gradient(ellipse,${accent}0c 0%,transparent 70%)`,
        pointerEvents:"none",zIndex:0,transition:"background 1.2s"}}/>

      {/* ── TOP BAR ── */}
      <div style={{position:"relative",zIndex:20,padding:"9px 18px",display:"flex",alignItems:"center",gap:12,borderBottom:"0.5px solid rgba(255,255,255,.07)",background:"rgba(7,7,7,.96)",flexWrap:"wrap"}}>
        <a href="/" style={{color:accent,fontWeight:900,fontSize:".9rem",letterSpacing:".1em",textDecoration:"none",flexShrink:0,transition:"color 1.2s"}}>◆ STRAINCHAIN × AUTHENTIC ECONOMY</a>
        <div style={{flex:1,minWidth:100,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${accent},${accent}bb)`,borderRadius:2,transition:"width .9s linear,background 1.2s"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,.25)"}}>{fmt(Math.round(totalE))} / {fmt(TOTAL)}</div>
        <div style={{display:"flex",gap:7,flexShrink:0}}>
          {!running
            ?<button onClick={uc===0&&ucE===0?start:resume} disabled={!voiceReady}
                style={{background:accent,color:"#000",border:"none",borderRadius:8,padding:"7px 18px",fontWeight:700,cursor:voiceReady?"pointer":"not-allowed",fontSize:12,opacity:voiceReady?1:.5,transition:"background 1.2s"}}>
                {uc===0&&ucE===0?"▶  Start":"▶  Resume"}
              </button>
            :<button onClick={pause} style={{background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.6)",border:"0.5px solid rgba(255,255,255,.1)",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12}}>⏸</button>
          }
          <button onClick={()=>setMuted(m=>{if(!m)synthRef.current?.cancel();return!m;})}
            style={{background:"transparent",color:muted?accent:"rgba(255,255,255,.28)",border:"0.5px solid rgba(255,255,255,.07)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:13}}>{muted?"🔇":"🔊"}</button>
          <button onClick={reset} style={{background:"transparent",color:"rgba(255,255,255,.18)",border:"0.5px solid rgba(255,255,255,.06)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:12}}>↺</button>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.15)",flexShrink:0}}>🎙 {voiceName}</div>
      </div>

      {/* ── TABS ── */}
      <div style={{position:"relative",zIndex:20,display:"flex",borderBottom:"0.5px solid rgba(255,255,255,.05)",background:"rgba(7,7,7,.93)",overflowX:"auto",flexShrink:0}}>
        {USE_CASES.map((u,i)=>(
          <button key={i} onClick={()=>jumpTo(i)}
            style={{padding:"8px 13px",background:"transparent",border:"none",
              borderBottom:i===uc?`2px solid ${u.accent}`:"2px solid transparent",
              color:i===uc?u.accent:i<uc?"rgba(34,197,94,.5)":"rgba(255,255,255,.2)",
              cursor:"pointer",fontSize:10.5,whiteSpace:"nowrap",fontWeight:i===uc?700:400,transition:"color .2s"}}>
            {i<uc?"✓ ":""}{i+1}. {u.title.split(" — ")[0]}
          </button>
        ))}
        <div style={{position:"absolute",bottom:0,left:0,height:"2px",
          width:`${(uc/USE_CASES.length+sPct/100/USE_CASES.length)*100}%`,
          background:`${accent}28`,transition:"width 1s linear,background 1.2s"}}/>
      </div>

      {/* ── SPLIT ── */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 320px",minHeight:0}}>

        {/* Demo panel */}
        <div style={{position:"relative",background:"#060606",display:"flex",flexDirection:"column",padding:"16px 18px 12px",gap:10,overflow:"hidden"}}>

          {/* Phase badge + title */}
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{background:`${accent}18`,border:`1px solid ${accent}38`,borderRadius:6,padding:"3px 9px",fontSize:8.5,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:".1em",whiteSpace:"nowrap"}}>{scene.phase}</div>
            <div style={{fontSize:14,fontWeight:700,color:"#e5e5e5",opacity:fade?1:0,transition:"opacity .25s"}}>{scene.title}</div>
            <div style={{marginLeft:"auto",flexShrink:0}}>
              <svg width="36" height="36" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="2"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke={accent} strokeWidth="2"
                  strokeDasharray={`${2*Math.PI*14}`}
                  strokeDashoffset={`${2*Math.PI*14*(1-sPct/100)}`}
                  strokeLinecap="round" transform="rotate(-90 18 18)"
                  style={{transition:"stroke-dashoffset 1s linear,stroke 1.2s",filter:`drop-shadow(0 0 3px ${accent}55)`}}/>
                <text x="18" y="23" textAnchor="middle" fill="rgba(255,255,255,.38)" fontSize="10" fontFamily="monospace">{Math.max(0,scene.duration-ucE)}</text>
              </svg>
            </div>
          </div>

          {/* Product banner */}
          <ProductBanner/>

          {/* Interaction */}
          <div style={{flex:1,opacity:fade?1:0,transition:"opacity .25s",overflowY:"auto"}}>
            {scene.id==="autoflow"&&<Terminal steps={(scene as typeof USE_CASES[0]).steps} running={running} accent={accent}/>}
            {scene.id==="trumark"&&<AgentPanel uc={scene as typeof USE_CASES[1]} running={running}/>}
            {scene.id==="mint"&&<Terminal steps={(scene as typeof USE_CASES[2]).steps} running={running} accent={accent}/>}
            {scene.id==="qron"&&<QRONPanel uc={scene as typeof USE_CASES[3]} running={running} accent={accent}/>}
            {scene.id==="ledger"&&<Terminal steps={(scene as typeof USE_CASES[4]).steps} running={running} accent={accent}/>}
            {scene.id==="dpp"&&<CompliancePanel uc={scene as typeof USE_CASES[5]} running={running} accent={accent}/>}
          </div>

          {/* Caption */}
          {caption.length>0&&(
            <div style={{flexShrink:0,padding:"5px 10px 4px",background:"rgba(0,0,0,.72)",borderRadius:7,borderTop:`1px solid ${accent}18`}}>
              <div style={{fontSize:11.5,lineHeight:1.7,textAlign:"center"}}>
                {caption.map((w,i)=>(
                  <span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.32)":"rgba(255,255,255,.72)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.27em"}}>{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Script panel */}
        <div style={{background:"rgba(9,9,9,.98)",borderLeft:"0.5px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"12px 16px",borderBottom:"0.5px solid rgba(255,255,255,.05)"}}>
            <div style={{fontSize:8.5,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.17)",marginBottom:4}}>{scene.phase} · {uc+1}/{USE_CASES.length} · {scene.duration}s</div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:12.5,lineHeight:1.3}}>{scene.title}</div>
            <div style={{display:"flex",gap:4,marginTop:9}}>
              {USE_CASES.map((_,i)=>(
                <div key={i} onClick={()=>jumpTo(i)} style={{height:3,flex:1,borderRadius:2,cursor:"pointer",
                  background:i<uc?"#22c55e":i===uc?accent:"rgba(255,255,255,.06)",transition:"background .3s"}}/>
              ))}
            </div>
          </div>

          <div style={{flex:1,padding:"12px 16px",overflowY:"auto"}}>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,.17)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:7}}>Narration</div>
            <div style={{fontSize:12,lineHeight:1.95,background:`${accent}07`,border:`1px solid ${accent}10`,borderRadius:8,padding:"10px 12px"}}>
              {caption.length>0
                ?caption.map((w,i)=>(<span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.28)":"rgba(255,255,255,.62)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.3em"}}>{w}</span>))
                :<span style={{color:"rgba(255,255,255,.42)"}}>{scene.narration}</span>}
            </div>

            {/* Platform tags */}
            <div style={{marginTop:12,display:"flex",gap:7,flexWrap:"wrap"}}>
              <div style={{background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#22c55e",fontWeight:600}}>🌿 StrainChain</div>
              {["autoflow","trumark","mint","ledger"].includes(scene.id)&&(
                <div style={{background:"rgba(201,162,39,.08)",border:"1px solid rgba(201,162,39,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#c9a227",fontWeight:600}}>◆ AuthiChain</div>
              )}
              {scene.id==="qron"&&(
                <div style={{background:"rgba(132,204,22,.08)",border:"1px solid rgba(132,204,22,.2)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#84cc16",fontWeight:600}}>⬡ QRON</div>
              )}
              {scene.id==="ledger"&&(
                <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#f59e0b",fontWeight:600}}>₿ BTC Ordinal</div>
              )}
              {scene.id==="dpp"&&(
                <div style={{background:"rgba(56,189,248,.08)",border:"1px solid rgba(56,189,248,.18)",borderRadius:6,padding:"3px 9px",fontSize:8.5,color:"#38bdf8",fontWeight:600}}>⚖ CA BCC Compliance</div>
              )}
            </div>
          </div>

          <div style={{padding:"10px 16px",borderTop:"0.5px solid rgba(255,255,255,.05)",display:"flex",gap:7}}>
            <button onClick={()=>jumpTo(Math.max(0,uc-1))} disabled={uc===0}
              style={{flex:1,padding:"7px",background:"rgba(255,255,255,.03)",border:"0.5px solid rgba(255,255,255,.06)",borderRadius:7,color:uc===0?"rgba(255,255,255,.09)":"rgba(255,255,255,.4)",cursor:uc===0?"default":"pointer",fontSize:11}}>← Prev</button>
            <button onClick={()=>jumpTo(Math.min(USE_CASES.length-1,uc+1))} disabled={uc===USE_CASES.length-1}
              style={{flex:1,padding:"7px",background:accent,border:"none",borderRadius:7,color:"#000",cursor:"pointer",fontWeight:700,fontSize:11,opacity:uc===USE_CASES.length-1?.3:1,transition:"background 1.2s"}}>Next →</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{position:"relative",zIndex:20,padding:"6px 18px",background:"rgba(7,7,7,.95)",borderTop:"0.5px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",flexShrink:0}}>
        <div style={{fontSize:9.5,color:"rgba(255,255,255,.14)"}}>Loom → Screen + Camera → <strong style={{color:"rgba(255,255,255,.28)"}}>▶ Start</strong> → voice narrates automatically</div>
        <div style={{marginLeft:"auto",display:"flex",gap:12}}>
          {[{l:"strainchain.io",c:"#22c55e"},{l:"authichain.com",c:"#c9a227"},{l:"qron.space",c:"#84cc16"}].map(({l,c})=>(
            <a key={l} href={`https://${l}`} target="_blank" rel="noreferrer" style={{fontSize:9.5,color:c,opacity:.35,textDecoration:"none"}}>{l} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
