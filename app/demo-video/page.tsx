"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ── USE CASES ─────────────────────────────────────────────────────── */
const USE_CASES = [
  {
    id:"autoflow", phase:"AUTOFLOW", accent:"#7c3aed",
    title:"AutoFlow — AI Product Classification",
    narration:"AutoFlow is the intelligent intake engine of the Authentic Economy. It ingests a product description and returns a fully classified, standardized identity — category, brand, HS tariff code, EUPC, counterfeit risk score, and EU DPP mandate status. In under three seconds, any product in the world becomes machine-readable and authentication-ready.",
    duration:17,
    steps:[
      {t:300,  label:"INPUT",     text:'Product: "Hermès Birkin 30, Togo leather, Noir"'},
      {t:900,  label:"AUTOFLOW",  text:"Routing to classification engine…"},
      {t:1500, label:"AI",        text:"Embedding product vector → 1,536 dimensions"},
      {t:2300, label:"CATEGORY",  text:"Luxury Goods › Leather Goods › Handbags › Hermès"},
      {t:3100, label:"HS CODE",   text:"4202.21.90  (leather handbag, outer surface)"},
      {t:3900, label:"EUPC",      text:"3700294892341  (Global Trade Item Number)"},
      {t:4700, label:"RISK",      text:"Counterfeit prevalence: 67% of market  ⚠ HIGH"},
      {t:5500, label:"DPP",       text:"EU DPP: MANDATORY  (leather goods >€400, ESPR Art.4)"},
      {t:6300, label:"OUTPUT",    text:"Classification complete ✓  |  Confidence: 99.1%"},
      {t:7000, label:"NEXT",      text:"Routing to TRUmark authentication…"},
    ],
  },
  {
    id:"trumark", phase:"TRUMARK", accent:"#c9a227",
    title:"TRUmark — 5-Agent Authentication Consensus",
    narration:"TRUmark is AuthiChain's multi-agent authentication layer. Five specialized AI agents simultaneously analyze the product — Guardian validates brand signatures, Archivist cross-references provenance records, Sentinel runs anomaly detection, Scout scans live market listings, and Arbiter adjudicates the consensus. The result is a cryptographically-anchored authenticity verdict with a quantified confidence score.",
    duration:20,
    agents:[
      {name:"Guardian",  role:"Brand signature validation",    weight:35, color:"#c9a227", steps:["Loading brand DNA…","Stitching pattern: MATCH","Hardware hallmarks: MATCH","Authenticity signal: 94%"]},
      {name:"Archivist", role:"Provenance records",            weight:20, color:"#a78bfa", steps:["Querying ledger…","Batch AC-2024-H-7291: FOUND","Chain of custody: INTACT","Provenance: VERIFIED"]},
      {name:"Sentinel",  role:"Anomaly detection",             weight:25, color:"#ef4444", steps:["Scanning for anomalies…","Price deviation: +2.1%","Listing age: normal","Flags detected: ZERO"]},
      {name:"Scout",     role:"Market listing scan",           weight:8,  color:"#22c55e", steps:["Scanning 14 platforms…","1 active listing: MATCH","Seller reputation: 98/100","Listing: LEGITIMATE"]},
      {name:"Arbiter",   role:"Consensus adjudication",        weight:12, color:"#378ADD", steps:["Collecting agent claims…","Weighted consensus: 97.3%","Threshold: 85% ✓","Verdict: AUTHENTIC"]},
    ],
    verdict:"AUTHENTIC",
    confidence:97.3,
    trumark:"TM-HERMES-2026-04-08-9291",
    duration:20,
  },
  {
    id:"mint", phase:"BLOCKCHAIN", accent:"#a78bfa",
    title:"NFT Mint — Collectable + Secondary Market",
    narration:"Every authenticated product can be minted as an ERC-721 NFT on Polygon, creating a tradeable, verifiable collectable. The NFT carries the full provenance history, brand certificate, and authenticity proof. It can be listed on secondary markets immediately — and each subsequent scan or ownership transfer is recorded immutably on-chain, making provenance self-perpetuating.",
    duration:18,
    steps:[
      {t:400,  label:"TRIGGER",   text:"TRUmark verdict AUTHENTIC → initiating mint"},
      {t:1200, label:"POLYGON",   text:"Connecting to Polygon mainnet (chain ID: 137)"},
      {t:2000, label:"CONTRACT",  text:"ERC-721 contract: 0x7a45f8cE9b3D2a4891Fc"},
      {t:2800, label:"METADATA",  text:"Pinning to IPFS: ipfs://QmX9k3R…7pT2"},
      {t:3600, label:"MINT",      text:"Minting token #8291… tx: 0xf3c9d8…a214"},
      {t:4800, label:"CONFIRMED", text:"Block 54,892,341  |  Gas: $0.004  |  Time: 2.1s"},
      {t:5600, label:"COLLECTABLE",text:"Edition: 1 of 1  |  Category: Luxury Heritage"},
      {t:6400, label:"OPENSEA",   text:"Listing created → OpenSea: $47,500 USD"},
      {t:7200, label:"ROYALTY",   text:"Creator royalty: 5% on all secondary sales"},
      {t:8000, label:"LIVE",      text:"Secondary market: ACTIVE  |  NFT tradeable ✓"},
    ],
  },
  {
    id:"qron", phase:"QRON", accent:"#ec4899",
    title:"Dynamic QRON → StoryMode",
    narration:"QRON transforms every blockchain certificate into a living, scannable QR code that resolves to StoryMode — a cinematic, brand-narrated origin story. Unlike static QR codes, QRON codes are dynamic: they update their destination based on scan context, location, and ownership state. Each scan logs a Truth Network vote. The QR art is beautiful enough that brands want it on their packaging.",
    duration:17,
    qron:{
      style:"Nebula Silk",
      shortUrl:"qron.space/s/H8K2J9QA",
      resolves:"StoryMode — Origin Narrative",
      story:"Born in the Faubourg Saint-Honoré atelier, 1984. Hand-stitched by a single artisan over 48 hours. Togo leather sourced from a single tannery in the Loire Valley. This Birkin has passed through three owners — each verified, each recorded.",
      scans:1,
    },
    duration:17,
  },
  {
    id:"ledger", phase:"LEDGER", accent:"#f59e0b",
    title:"Immutable Ledger + BTC Ordinal",
    narration:"The AuthiChain SaaS ledger is an append-only record of every authentication event, ownership transfer, and scan verdict. For the highest-value assets, this ledger entry can be inscribed as a Bitcoin Ordinal — anchoring the provenance proof permanently to the world's most secure blockchain. No server, no cloud, no authority can alter or delete it.",
    duration:17,
    steps:[
      {t:500,  label:"LEDGER",    text:"Creating immutable ledger entry…"},
      {t:1300, label:"ENTRY",     text:"ID: LDG-20260408-7829"},
      {t:2100, label:"HASH",      text:"sha256: 9f3bc4d8e2a1f7c6b5d4e3a2f1c0b9a8"},
      {t:2900, label:"TIMESTAMP", text:"2026-04-08T03:45:22.841Z  |  signed ✓"},
      {t:3700, label:"CHAIN",     text:"Anchored on Polygon block 54,892,341"},
      {t:4500, label:"BTC",       text:"Inscribing Bitcoin Ordinal…"},
      {t:5300, label:"ORDINAL",   text:"Ordinal #84,291,003  |  Sat: 1,923,847,291"},
      {t:6100, label:"BLOCK",     text:"Bitcoin block 841,923  |  Inscribed forever"},
      {t:6900, label:"URI",       text:"authichain://LDG-20260408-7829"},
      {t:7700, label:"STATUS",    text:"IMMUTABLE  |  Cannot be altered by any party ✓"},
    ],
  },
  {
    id:"dpp", phase:"EU DPP", accent:"#3b82f6",
    title:"Instant EU DPP Compliance",
    narration:"The European Union Digital Product Passport mandate requires seven specific data fields for every product sold in Europe. AuthiChain generates full compliance instantly — because every field is a byproduct of the authentication flow. No additional work. No new systems. The product is registered, authenticated, minted, QRONed, and ledgered — and all seven EU DPP requirements are satisfied automatically.",
    duration:16,
    requirements:[
      {label:"Unique product identifier",       value:"ERC-721 token #8291 on Polygon",                 done:false},
      {label:"Tamper-proof digital record",     value:"Immutable blockchain — Polygon + BTC Ordinal",   done:false},
      {label:"Supply chain provenance",         value:"Manufacturer → Distributor → Owner (on-chain)",  done:false},
      {label:"Consumer-accessible verification",value:"QR scan → QRON → 2.1 second result",            done:false},
      {label:"Machine-readable format",         value:"REST API, OpenAPI 3.0, JSON-LD, W3C DID",       done:false},
      {label:"Long-term auditability",          value:"Blockchain: permanent, no expiration",           done:false},
      {label:"GDPR compatibility",              value:"Hashes only on-chain — zero personal data",      done:false},
    ],
    cert:"DPP-EU-2026-HERMES-8291",
    duration:16,
  },
];

const TOTAL = USE_CASES.reduce((s,u)=>s+u.duration,0);
function pad(n:number){return String(Math.floor(n)).padStart(2,"0")}
function fmt(s:number){return `${Math.floor(s/60)}:${pad(s%60)}`}

/* ── TERMINAL STEP VISUALIZER ─────────────────────────────────────── */
function Terminal({steps, running, accent}:{steps:{t:number,label:string,text:string}[], running:boolean, accent:string}){
  const [shown,setShown]=useState<number[]>([]);
  const startRef=useRef<number|null>(null);
  useEffect(()=>{
    if(!running){setShown([]);startRef.current=null;return;}
    startRef.current=Date.now();
    const timers=steps.map((s,i)=>setTimeout(()=>setShown(p=>[...p,i]),s.t));
    return()=>timers.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{background:"#0a0a0a",border:`1px solid ${accent}20`,borderRadius:12,padding:"18px 20px",fontFamily:"monospace",fontSize:13,lineHeight:1.8,minHeight:260,overflowY:"auto"}}>
      {steps.map((s,i)=>shown.includes(i)&&(
        <div key={i} style={{display:"flex",gap:12,marginBottom:2,opacity:shown[shown.length-1]===i?1:.7,transition:"opacity .3s"}}>
          <span style={{color:accent,fontWeight:700,minWidth:90,fontSize:11,paddingTop:1}}>[{s.label}]</span>
          <span style={{color:shown[shown.length-1]===i?"#e5e5e5":"#666"}}>{s.text}</span>
        </div>
      ))}
      {running&&shown.length<steps.length&&(
        <div style={{display:"flex",gap:12,marginBottom:2}}>
          <span style={{color:accent,fontWeight:700,minWidth:90,fontSize:11,paddingTop:1}}>[···]</span>
          <span style={{color:"#444"}}>processing<span style={{animation:"none"}}>{"▌"}</span></span>
        </div>
      )}
    </div>
  );
}

/* ── AGENT PANEL ──────────────────────────────────────────────────── */
function AgentPanel({uc, running}:{uc:typeof USE_CASES[1], running:boolean}){
  const [agentStep,setAgentStep]=useState<number[]>([0,0,0,0,0]);
  const [progress,setProgress]=useState<number[]>([0,0,0,0,0]);
  const [verdict,setVerdict]=useState(false);
  useEffect(()=>{
    if(!running){setAgentStep([0,0,0,0,0]);setProgress([0,0,0,0,0]);setVerdict(false);return;}
    const timers:ReturnType<typeof setTimeout>[]=[];
    uc.agents.forEach((agent,ai)=>{
      agent.steps.forEach((_,si)=>{
        timers.push(setTimeout(()=>{
          setAgentStep(p=>{const n=[...p];n[ai]=si+1;return n;});
          setProgress(p=>{const n=[...p];n[ai]=Math.round((si+1)/agent.steps.length*100);return n;});
        }, ai*800+si*1200));
      });
    });
    timers.push(setTimeout(()=>setVerdict(true), uc.agents.length*800+uc.agents[0].steps.length*1200));
    return()=>timers.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%"}}>
      {uc.agents.map((a,i)=>(
        <div key={i} style={{background:"#0d0d0d",border:`1px solid ${a.color}20`,borderRadius:10,padding:"10px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:progress[i]===100?a.color:"#333",transition:"background .3s"}}/>
            <div style={{fontWeight:700,fontSize:12,color:progress[i]===100?a.color:"rgba(255,255,255,.5)",flex:1,transition:"color .3s"}}>{a.name} <span style={{fontWeight:400,color:"rgba(255,255,255,.25)",fontSize:10}}>({a.weight}%)</span></div>
            <div style={{fontFamily:"monospace",fontSize:11,color:a.color}}>{progress[i]}%</div>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden",marginBottom:6}}>
            <div style={{height:"100%",width:`${progress[i]}%`,background:a.color,transition:"width .4s",borderRadius:2}}/>
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",fontFamily:"monospace"}}>
            {agentStep[i]>0?a.steps[agentStep[i]-1]:"waiting…"}
          </div>
        </div>
      ))}
      {verdict&&(
        <div style={{background:"rgba(34,197,94,.08)",border:"2px solid #22c55e",borderRadius:12,padding:"14px 18px",textAlign:"center",marginTop:4}}>
          <div style={{fontSize:22,fontWeight:900,color:"#22c55e",letterSpacing:".06em"}}>✓ AUTHENTIC</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.5)",marginTop:4}}>TRUmark {uc.trumark} · Confidence {uc.confidence}%</div>
        </div>
      )}
    </div>
  );
}

/* ── QRON VISUAL ──────────────────────────────────────────────────── */
function QRONPanel({uc, running, accent}:{uc:typeof USE_CASES[3], running:boolean, accent:string}){
  const [step,setStep]=useState(0);
  const [scans,setScans]=useState(0);
  useEffect(()=>{
    if(!running){setStep(0);setScans(0);return;}
    const t1=setTimeout(()=>setStep(1),800);
    const t2=setTimeout(()=>setStep(2),2400);
    const t3=setTimeout(()=>setStep(3),4200);
    const t4=setTimeout(()=>setStep(4),6000);
    const t5=setTimeout(()=>{setScans(s=>s+1);},7500);
    return()=>[t1,t2,t3,t4,t5].forEach(clearTimeout);
  },[running]);
  const q=uc.qron;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,width:"100%"}}>
      {/* QR panel */}
      <div style={{background:"#0d0d0d",border:`1px solid ${accent}20`,borderRadius:12,padding:"16px",textAlign:"center"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>QRON Generator</div>
        {step===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,padding:"40px 0"}}>Awaiting TRUmark verdict…</div>}
        {step>=1&&(
          <>
            <div style={{width:120,height:120,margin:"0 auto 12px",background:`linear-gradient(135deg,${accent}20,transparent)`,border:`2px solid ${accent}40`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              {/* Simulated QR grid */}
              <svg viewBox="0 0 10 10" width="90" height="90">
                {Array.from({length:100},(_,k)=>{
                  const x=k%10, y=Math.floor(k/10);
                  const corner=(x<3&&y<3)||(x>6&&y<3)||(x<3&&y>6);
                  const dark=corner||Math.random()>.5;
                  return dark?<rect key={k} x={x} y={y} width={1} height={1} fill={accent}/> : null;
                })}
              </svg>
              {step>=2&&<div style={{position:"absolute",bottom:-8,right:-8,background:"#22c55e",borderRadius:4,padding:"2px 6px",fontSize:8,fontWeight:700,color:"#000"}}>LIVE</div>}
            </div>
            <div style={{fontSize:11,color:accent,fontFamily:"monospace"}}>{q.shortUrl}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:4}}>Style: {q.style}</div>
          </>
        )}
      </div>
      {/* StoryMode panel */}
      <div style={{background:"#0d0d0d",border:`1px solid ${accent}20`,borderRadius:12,padding:"16px"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>StoryMode Destination</div>
        {step<2&&<div style={{color:"rgba(255,255,255,.2)",fontSize:12,padding:"32px 0 0",textAlign:"center"}}>Resolving…</div>}
        {step>=2&&(
          <>
            <div style={{fontSize:11,fontWeight:700,color:accent,marginBottom:8}}>◆ Origin Story</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.55)",lineHeight:1.7,fontStyle:"italic"}}>"{q.story}"</div>
            {step>=3&&<div style={{marginTop:10,fontSize:10,color:"rgba(255,255,255,.3)"}}>→ Dynamic: updates on ownership transfer</div>}
            {step>=4&&(
              <div style={{marginTop:10,background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.2)",borderRadius:8,padding:"8px 10px",fontSize:11}}>
                <span style={{color:"#22c55e",fontWeight:700}}>Truth Network: </span>
                <span style={{color:"rgba(255,255,255,.5)"}}>{scans+1} scan vote recorded</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── DPP CHECKLIST ────────────────────────────────────────────────── */
function DPPPanel({uc, running, accent}:{uc:typeof USE_CASES[5], running:boolean, accent:string}){
  const [done,setDone]=useState<boolean[]>(uc.requirements.map(()=>false));
  const [cert,setCert]=useState(false);
  useEffect(()=>{
    if(!running){setDone(uc.requirements.map(()=>false));setCert(false);return;}
    const timers=uc.requirements.map((_,i)=>setTimeout(()=>setDone(p=>{const n=[...p];n[i]=true;return n;}), 800+i*900));
    timers.push(setTimeout(()=>setCert(true), 800+uc.requirements.length*900+400));
    return()=>timers.forEach(clearTimeout);
  },[running]);
  return(
    <div style={{width:"100%"}}>
      {uc.requirements.map((r,i)=>(
        <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 12px",borderRadius:8,marginBottom:4,
          background:done[i]?"rgba(59,130,246,.06)":"rgba(255,255,255,.02)",transition:"background .4s"}}>
          <div style={{width:20,height:20,borderRadius:"50%",border:`1.5px solid ${done[i]?accent:"rgba(255,255,255,.15)"}`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:done[i]?accent:"transparent",
            flexShrink:0,marginTop:1,transition:"all .3s"}}>✓</div>
          <div>
            <div style={{fontSize:12,fontWeight:500,color:done[i]?"#e5e5e5":"rgba(255,255,255,.3)",transition:"color .3s"}}>{r.label}</div>
            {done[i]&&<div style={{fontSize:10,color:"rgba(255,255,255,.35)",marginTop:2,fontFamily:"monospace"}}>{r.value}</div>}
          </div>
        </div>
      ))}
      {cert&&(
        <div style={{marginTop:12,background:`${accent}10`,border:`2px solid ${accent}`,borderRadius:12,padding:"14px 18px",textAlign:"center"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4,textTransform:"uppercase",letterSpacing:".08em"}}>EU DPP Certificate Issued</div>
          <div style={{fontSize:14,fontWeight:900,color:accent,fontFamily:"monospace"}}>{uc.cert}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:4}}>All 7 requirements satisfied automatically ✓</div>
        </div>
      )}
    </div>
  );
}

/* ── MAIN PAGE ────────────────────────────────────────────────────── */
export default function DemoPage(){
  const [uc,setUc]=useState(0);
  const [ucElapsed,setUcElapsed]=useState(0);
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
  const totalElapsed=USE_CASES.slice(0,uc).reduce((s,u)=>s+u.duration,0)+ucElapsed;
  const pct=Math.min(100,(totalElapsed/TOTAL)*100);
  const scenePct=scene.duration>0?(ucElapsed/scene.duration)*100:0;
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
        setUcElapsed(p=>{
          const n=p+1;
          if(n>=USE_CASES[uc].duration){
            setUc(u=>{
              if(u<USE_CASES.length-1){setFade(false);setTimeout(()=>setFade(true),100);setUcElapsed(0);return u+1;}
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

  function start(){setUc(0);setUcElapsed(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);setRunning(true);setTimeout(()=>narrate(USE_CASES[0].narration),300);}
  function pause(){setRunning(false);synthRef.current?.pause();}
  function resume(){setRunning(true);if(!synthRef.current?.speaking)narrate(scene.narration);else synthRef.current?.resume();}
  function reset(){setRunning(false);setUc(0);setUcElapsed(0);prevRef.current=-1;synthRef.current?.cancel();setCaption([]);setWordIdx(-1);}
  function jumpTo(i:number){setUc(i);setUcElapsed(0);prevRef.current=-1;setFade(false);setTimeout(()=>setFade(true),80);synthRef.current?.cancel();setCaption([]);setWordIdx(-1);setRunning(false);}

  return(
    <div style={{background:"#070707",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Ambient */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:800,height:250,
        background:`radial-gradient(ellipse,${accent}0d 0%,transparent 70%)`,pointerEvents:"none",zIndex:0,transition:"background 1.2s"}}/>

      {/* ── TOPBAR ── */}
      <div style={{position:"relative",zIndex:20,padding:"10px 18px",display:"flex",alignItems:"center",gap:12,borderBottom:"0.5px solid rgba(255,255,255,.07)",background:"rgba(7,7,7,.96)",flexWrap:"wrap"}}>
        <a href="/" style={{color:accent,fontWeight:900,fontSize:".95rem",letterSpacing:".12em",textDecoration:"none",flexShrink:0,transition:"color .8s"}}>◆ AUTHENTIC ECONOMY</a>
        <div style={{flex:1,minWidth:100,height:4,background:"rgba(255,255,255,.05)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${accent},${accent}bb)`,borderRadius:2,transition:"width .9s linear,background 1.2s"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,.28)"}}>{fmt(Math.round(totalElapsed))} / {fmt(TOTAL)}</div>
        <div style={{display:"flex",gap:7,flexShrink:0}}>
          {!running
            ?<button onClick={uc===0&&ucElapsed===0?start:resume} disabled={!voiceReady}
                style={{background:accent,color:"#000",border:"none",borderRadius:8,padding:"7px 18px",fontWeight:700,cursor:voiceReady?"pointer":"not-allowed",fontSize:12,opacity:voiceReady?1:.5,transition:"background .8s"}}>
                {uc===0&&ucElapsed===0?"▶  Start":"▶  Resume"}
              </button>
            :<button onClick={pause} style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.6)",border:"0.5px solid rgba(255,255,255,.1)",borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:12}}>⏸</button>
          }
          <button onClick={()=>setMuted(m=>{if(!m)synthRef.current?.cancel();return!m;})}
            style={{background:"transparent",color:muted?accent:"rgba(255,255,255,.3)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:13}}>{muted?"🔇":"🔊"}</button>
          <button onClick={reset} style={{background:"transparent",color:"rgba(255,255,255,.2)",border:"0.5px solid rgba(255,255,255,.06)",borderRadius:8,padding:"7px 9px",cursor:"pointer",fontSize:12}}>↺</button>
        </div>
        <div style={{fontSize:9,color:"rgba(255,255,255,.17)",flexShrink:0}}>🎙 {voiceName}</div>
      </div>

      {/* ── USE CASE TABS ── */}
      <div style={{position:"relative",zIndex:20,display:"flex",borderBottom:"0.5px solid rgba(255,255,255,.05)",background:"rgba(7,7,7,.93)",overflowX:"auto",flexShrink:0}}>
        {USE_CASES.map((u,i)=>(
          <button key={i} onClick={()=>jumpTo(i)}
            style={{padding:"8px 14px",background:"transparent",border:"none",
              borderBottom:i===uc?`2px solid ${u.accent}`:"2px solid transparent",
              color:i===uc?u.accent:i<uc?"rgba(34,197,94,.5)":"rgba(255,255,255,.22)",
              cursor:"pointer",fontSize:11,whiteSpace:"nowrap",fontWeight:i===uc?700:400,transition:"color .2s"}}>
            {i<uc?"✓ ":""}{i+1}. {u.title.split(" — ")[0]}
          </button>
        ))}
        <div style={{position:"absolute",bottom:0,left:0,height:"2px",width:`${(uc/USE_CASES.length+scenePct/100/USE_CASES.length)*100}%`,background:`${accent}30`,transition:"width 1s linear,background 1.2s"}}/>
      </div>

      {/* ── MAIN SPLIT ── */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 320px",minHeight:0}}>

        {/* ── DEMO PANEL ── */}
        <div style={{position:"relative",background:"#070707",display:"flex",flexDirection:"column",padding:"18px 20px 14px",gap:14,overflow:"hidden"}}>

          {/* Scene header */}
          <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
            <div style={{background:`${accent}18`,border:`1px solid ${accent}40`,borderRadius:6,padding:"3px 10px",fontSize:9,fontWeight:700,color:accent,textTransform:"uppercase",letterSpacing:".1em"}}>{scene.phase}</div>
            <div style={{fontSize:15,fontWeight:700,color:"#e5e5e5",opacity:fade?1:0,transition:"opacity .25s"}}>{scene.title}</div>
            {/* Countdown ring */}
            <div style={{marginLeft:"auto",flexShrink:0}}>
              <svg width="38" height="38" viewBox="0 0 38 38">
                <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="2"/>
                <circle cx="19" cy="19" r="15" fill="none" stroke={accent} strokeWidth="2"
                  strokeDasharray={`${2*Math.PI*15}`} strokeDashoffset={`${2*Math.PI*15*(1-scenePct/100)}`}
                  strokeLinecap="round" transform="rotate(-90 19 19)"
                  style={{transition:"stroke-dashoffset 1s linear,stroke 1.2s",filter:`drop-shadow(0 0 3px ${accent}60)`}}/>
                <text x="19" y="24" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="10" fontFamily="monospace">{Math.max(0,scene.duration-ucElapsed)}</text>
              </svg>
            </div>
          </div>

          {/* Visual area */}
          <div style={{flex:1,opacity:fade?1:0,transition:"opacity .25s",overflowY:"auto"}}>
            {scene.id==="autoflow"&&<Terminal steps={(scene as typeof USE_CASES[0]).steps} running={running} accent={accent}/>}
            {scene.id==="trumark"&&<AgentPanel uc={scene as typeof USE_CASES[1]} running={running}/>}
            {scene.id==="mint"&&<Terminal steps={(scene as typeof USE_CASES[2]).steps} running={running} accent={accent}/>}
            {scene.id==="qron"&&<QRONPanel uc={scene as typeof USE_CASES[3]} running={running} accent={accent}/>}
            {scene.id==="ledger"&&<Terminal steps={(scene as typeof USE_CASES[4]).steps} running={running} accent={accent}/>}
            {scene.id==="dpp"&&<DPPPanel uc={scene as typeof USE_CASES[5]} running={running} accent={accent}/>}
          </div>

          {/* Caption bar */}
          {caption.length>0&&(
            <div style={{flexShrink:0,padding:"6px 10px 4px",background:"rgba(0,0,0,.7)",borderRadius:8,borderTop:`1px solid ${accent}20`}}>
              <div style={{fontSize:12,lineHeight:1.7,textAlign:"center"}}>
                {caption.map((w,i)=>(
                  <span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.35)":"rgba(255,255,255,.75)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.28em"}}>{w}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── SCRIPT PANEL ── */}
        <div style={{background:"rgba(10,10,10,.98)",borderLeft:"0.5px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"13px 16px",borderBottom:"0.5px solid rgba(255,255,255,.05)"}}>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.18)",marginBottom:5}}>{scene.phase} · {uc+1}/{USE_CASES.length} · {scene.duration}s</div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:13,lineHeight:1.3}}>{scene.title}</div>
            <div style={{display:"flex",gap:4,marginTop:9}}>
              {USE_CASES.map((_,i)=>(
                <div key={i} onClick={()=>jumpTo(i)} style={{height:3,flex:1,borderRadius:2,cursor:"pointer",
                  background:i<uc?"#22c55e":i===uc?accent:"rgba(255,255,255,.07)",transition:"background .3s"}}/>
              ))}
            </div>
          </div>

          <div style={{flex:1,padding:"13px 16px",overflowY:"auto"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.18)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Narration</div>
            <div style={{fontSize:12.5,lineHeight:1.95,background:`${accent}07`,border:`1px solid ${accent}10`,borderRadius:8,padding:"11px 13px"}}>
              {caption.length>0
                ?caption.map((w,i)=>(<span key={i} style={{color:i===wordIdx?accent:i<wordIdx?"rgba(255,255,255,.3)":"rgba(255,255,255,.65)",fontWeight:i===wordIdx?700:400,transition:"color .08s",marginRight:"0.3em"}}>{w}</span>))
                :<span style={{color:"rgba(255,255,255,.45)"}}>{scene.narration}</span>}
            </div>

            {/* Platform indicator */}
            <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
              {["autoflow","trumark","mint","ledger"].includes(scene.id)&&(
                <div style={{background:"rgba(201,162,39,.08)",border:"1px solid rgba(201,162,39,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,color:"#c9a227",fontWeight:600}}>⚙ AuthiChain</div>
              )}
              {["qron"].includes(scene.id)&&(
                <div style={{background:"rgba(236,72,153,.08)",border:"1px solid rgba(236,72,153,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,color:"#ec4899",fontWeight:600}}>⬡ QRON</div>
              )}
              {["dpp"].includes(scene.id)&&(
                <div style={{background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,color:"#3b82f6",fontWeight:600}}>🇪🇺 EU DPP</div>
              )}
              {["ledger"].includes(scene.id)&&(
                <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:6,padding:"4px 10px",fontSize:9,color:"#f59e0b",fontWeight:600}}>₿ Bitcoin</div>
              )}
            </div>
          </div>

          <div style={{padding:"11px 16px",borderTop:"0.5px solid rgba(255,255,255,.05)",display:"flex",gap:7}}>
            <button onClick={()=>jumpTo(Math.max(0,uc-1))} disabled={uc===0}
              style={{flex:1,padding:"7px",background:"rgba(255,255,255,.03)",border:"0.5px solid rgba(255,255,255,.07)",borderRadius:8,color:uc===0?"rgba(255,255,255,.1)":"rgba(255,255,255,.45)",cursor:uc===0?"default":"pointer",fontSize:11}}>← Prev</button>
            <button onClick={()=>jumpTo(Math.min(USE_CASES.length-1,uc+1))} disabled={uc===USE_CASES.length-1}
              style={{flex:1,padding:"7px",background:accent,border:"none",borderRadius:8,color:"#000",cursor:"pointer",fontWeight:700,fontSize:11,opacity:uc===USE_CASES.length-1?.35:1,transition:"background .8s"}}>Next →</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{position:"relative",zIndex:20,padding:"6px 18px",background:"rgba(7,7,7,.95)",borderTop:"0.5px solid rgba(255,255,255,.04)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap",flexShrink:0}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>Loom → Screen + Camera → <strong style={{color:"rgba(255,255,255,.3)"}}>▶ Start</strong> → voice narrates, interactions simulate automatically</div>
        <div style={{marginLeft:"auto",display:"flex",gap:10}}>
          {[{l:"authichain.com",c:"#c9a227"},{l:"qron.space",c:"#ec4899"},{l:"strainchain.io",c:"#22c55e"}].map(({l,c})=>(
            <a key={l} href={`https://${l}`} target="_blank" rel="noreferrer" style={{fontSize:10,color:c,opacity:.4,textDecoration:"none"}}>{l} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
