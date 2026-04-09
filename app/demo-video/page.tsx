"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const gold = "#c9a227";
const green = "#22c55e";
const purple = "#a78bfa";
const bg = "#060608";
const border = "rgba(255,255,255,0.07)";

const AGENTS = [
  { name:"Guardian",  weight:35, color:green,     desc:"Validating cryptographic hash" },
  { name:"Archivist", weight:20, color:gold,      desc:"Cross-referencing provenance history" },
  { name:"Sentinel",  weight:25, color:purple,    desc:"Anomaly detection scan" },
  { name:"Scout",     weight:8,  color:"#38bdf8", desc:"Market listing verification" },
  { name:"Arbiter",   weight:12, color:"#fb923c", desc:"Final consensus adjudication" },
];

// Slide timings sum to 60,000ms to match the 60-second PiP presenter video
const STEPS = [
  { id:"landing",     title:"AuthiChain Portal",       duration:10800, clicks:[{x:62,y:78,label:"Scan Product"}] },
  { id:"scanning",    title:"QR Code Detected",         duration:7680,  clicks:[{x:50,y:50,label:"QR Captured"}] },
  { id:"consensus",   title:"5-Agent AI Consensus",     duration:10800, clicks:[] },
  { id:"certificate", title:"Certificate Issued",        duration:12000, clicks:[{x:50,y:86,label:"Download Certificate"}] },
  { id:"blockchain",  title:"On-Chain Proof",            duration:9120,  clicks:[{x:50,y:90,label:"View on PolygonScan"}] },
  { id:"dpp",         title:"EU Product Passport",       duration:9600,  clicks:[{x:50,y:88,label:"Export DPP PDF"}] },
];

const TOTAL = STEPS.reduce((s,t)=>s+t.duration, 0);

/* ── Click ripple ── */
function Ripple({ x, y, label, active }: { x:number; y:number; label:string; active:boolean }) {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    if(active){ setShow(false); const t=setTimeout(()=>setShow(true),150); return ()=>clearTimeout(t); }
    setShow(false);
  },[active]);
  if(!show) return null;
  return (
    <div style={{ position:"absolute", left:`${x}%`, top:`${y}%`, transform:"translate(-50%,-50%)", zIndex:30, pointerEvents:"none" }}>
      <div style={{ position:"relative", width:40, height:40 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:`2px solid ${gold}`, animation:`ripple 1.3s ${i*.3}s ease-out infinite`, opacity:0 }}/>
        ))}
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:12, height:12, borderRadius:"50%", background:gold, boxShadow:`0 0 12px ${gold}` }}/>
        </div>
      </div>
      <div style={{ position:"absolute", top:-24, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,.85)", border:`1px solid ${gold}50`, borderRadius:6, padding:"3px 8px", fontSize:10, color:gold, whiteSpace:"nowrap", fontFamily:"'DM Mono',monospace" }}>
        {label}
      </div>
    </div>
  );
}

/* ── Mock screen contents ── */
function Screen({ id, tick, agentStep }: { id:string; tick:number; agentStep:number }) {
  const scanY = ((tick%80)/80)*80+8;

  if(id==="landing") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"10px 14px", borderBottom:`0.5px solid ${border}`, display:"flex", gap:10, alignItems:"center" }}>
        <span className="syne" style={{ color:gold, fontSize:11, fontWeight:700 }}>◆ AUTHICHAIN</span>
        <div style={{ flex:1 }}/>
        <span style={{ width:6, height:6, borderRadius:"50%", background:green, boxShadow:`0 0 6px ${green}` }}/>
        <span style={{ fontSize:10, color:green }}>LIVE</span>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14, padding:20, textAlign:"center" }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".15em" }}>BLOCKCHAIN PRODUCT AUTHENTICATION</div>
        <div className="syne" style={{ fontWeight:800, fontSize:"clamp(1.4rem,5vw,2.2rem)", lineHeight:1.1 }}>
          <span style={{ color:gold }}>Truth</span> as<br/>infrastructure
        </div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.45)", maxWidth:260, lineHeight:1.7 }}>Scan your QRON QR code to instantly verify blockchain authenticity</div>
        <div style={{ background:gold, color:"#000", padding:"10px 24px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>Scan Product →</div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap", justifyContent:"center" }}>
          {[["$0.004","per seal"],["2.1s","verify"],["EU DPP","compliant"]].map(([v,l])=>(
            <div key={l}><div style={{ color:gold, fontWeight:700, fontSize:13 }}>{v}</div><div style={{ fontSize:10, color:"rgba(255,255,255,.3)" }}>{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );

  if(id==="scanning") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, padding:20 }}>
      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".15em" }}>QR CODE DETECTED</div>
      <div style={{ position:"relative", width:140, height:140, border:`1.5px solid ${gold}40`, borderRadius:10, overflow:"hidden" }}>
        {[[false,false],[false,true],[true,false],[true,true]].map(([b,r],i)=>(
          <div key={i} style={{ position:"absolute", width:16, height:16, top:b?undefined:7, bottom:b?7:undefined, left:r?undefined:7, right:r?7:undefined,
            borderTop:b?"none":`2px solid ${gold}`, borderBottom:b?`2px solid ${gold}`:"none",
            borderLeft:r?"none":`2px solid ${gold}`, borderRight:r?`2px solid ${gold}`:"none" }}/>
        ))}
        <div style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(to right,transparent,${gold},transparent)`, top:`${scanY}%`, boxShadow:`0 0 10px ${gold}` }}/>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:3, padding:14 }}>
          {Array.from({length:36}).map((_,i)=>(
            <div key={i} style={{ aspectRatio:"1", borderRadius:2, background:Math.sin(i*1.9+tick*.06)>0?gold:"rgba(201,162,39,.08)", transition:"background .7s" }}/>
          ))}
        </div>
      </div>
      <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", textAlign:"center", lineHeight:1.7 }}>
        AC-1829577CED8F6BFBB0BC667CDE33DF0E<br/>
        <span style={{ color:"rgba(255,255,255,.25)", fontSize:10 }}>Querying Polygon blockchain...</span>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {[0,1,2].map(i=><div key={i} style={{ width:6, height:6, borderRadius:"50%", background:gold, opacity:(tick%9===i*3)?1:.2, transition:"opacity .2s" }}/>)}
      </div>
    </div>
  );

  if(id==="consensus") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", padding:16, gap:8, overflowY:"auto" }}>
      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".15em", marginBottom:4 }}>5-AGENT CONSENSUS ENGINE</div>
      {AGENTS.map((a,i)=>(
        <div key={a.name} style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(255,255,255,.06)`, borderRadius:10, padding:"10px 12px", flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:agentStep>i?a.color:"rgba(255,255,255,.12)", boxShadow:agentStep>i?`0 0 8px ${a.color}`:"none", transition:"all .5s", flexShrink:0 }}/>
            <span className="syne" style={{ fontSize:12, fontWeight:600, color:agentStep>i?a.color:"rgba(255,255,255,.45)" }}>{a.name}</span>
            <span style={{ fontSize:10, color:"rgba(255,255,255,.25)", marginLeft:"auto" }}>{a.weight}%</span>
          </div>
          <div style={{ height:3, background:"rgba(255,255,255,.06)", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", background:a.color, width:agentStep>i?`${a.weight*2.5}%`:"0%", transition:"width 1.2s ease", borderRadius:2 }}/>
          </div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.28)", marginTop:4 }}>{a.desc}</div>
        </div>
      ))}
      {agentStep>=5&&<div style={{ textAlign:"center", fontSize:13, color:green, fontWeight:600, paddingTop:4 }} className="syne">✓ CONSENSUS REACHED — 2.1s</div>}
    </div>
  );

  if(id==="certificate") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, gap:12 }}>
      <div style={{ width:52, height:52, borderRadius:"50%", border:`2px solid ${green}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 24px ${green}40` }}>
        <span style={{ fontSize:22, color:green }}>✓</span>
      </div>
      <div className="syne" style={{ fontWeight:800, fontSize:"1.3rem", color:green }}>AUTHENTIC</div>
      <div style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(255,255,255,.1)`, borderRadius:12, padding:14, width:"100%", fontSize:11 }}>
        {[["Product","Heritage Sneaker Drop #0042"],["Brand","Verified Manufacturer"],["Batch","AC-1829577..."],["NFT","#16 · Polygon"],["Verified",new Date().toLocaleDateString()],["Time","2.1 seconds"]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`0.5px solid ${border}` }}>
            <span style={{ color:"rgba(255,255,255,.3)" }}>{k}</span>
            <span style={{ color:"rgba(255,255,255,.72)", textAlign:"right", maxWidth:"60%" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background:gold, color:"#000", padding:"9px 22px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>Download Certificate →</div>
    </div>
  );

  if(id==="blockchain") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", padding:16, gap:10 }}>
      <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".15em" }}>POLYGON MAINNET · CHAIN ID: 137</div>
      {[{title:"TRANSACTION",color:purple,rows:[["Hash","0x4d8f...9a2c"],["Block","#58,234,441"],["Status","✓ Success"],["Gas","0.000021 MATIC"]]},{title:"NFT TRANSFER",color:gold,rows:[["Token","#16"],["Contract","0x4da4...72BE"],["Standard","ERC-721"],["To","0xAebf...E437"]]}].map(box=>(
        <div key={box.title} style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(255,255,255,.08)`, borderRadius:10, padding:12 }}>
          <div style={{ fontSize:10, color:box.color, marginBottom:7 }}>{box.title}</div>
          {box.rows.map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"4px 0", borderBottom:`0.5px solid ${border}` }}>
              <span style={{ color:"rgba(255,255,255,.3)" }}>{k}</span><span style={{ color:"rgba(255,255,255,.7)" }}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ textAlign:"center", fontSize:12, color:purple, cursor:"pointer" }}>View on PolygonScan →</div>
    </div>
  );

  if(id==="dpp") return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", padding:16, gap:10 }}>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}><span style={{ fontSize:18 }}>🇪🇺</span><div style={{ fontSize:10, color:"rgba(255,255,255,.35)", letterSpacing:".15em" }}>EU DIGITAL PRODUCT PASSPORT</div></div>
      <div style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(34,197,94,.2)`, borderRadius:10, padding:12, flex:1, overflow:"auto" }}>
        <div style={{ fontSize:10, color:green, marginBottom:8 }}>REGULATION (EU) 2024/1781</div>
        {[["Product Type","Footwear"],["Batch ID","AC-182957"],["Manufacturer","Verified Entity"],["Country","United States"],["Carbon Score","A+ (94/100)"],["Recyclable","Yes — 78%"],["Compliance","EU DPP ✓"],["Valid Until","2029-12-31"]].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"4px 0", borderBottom:`0.5px solid ${border}` }}>
            <span style={{ color:"rgba(255,255,255,.3)" }}>{k}</span><span style={{ color:"rgba(255,255,255,.7)" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ background:green, color:"#000", padding:"9px 22px", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", textAlign:"center" }}>Export DPP PDF →</div>
    </div>
  );

  return null;
}

/* ── MAIN PAGE ── */
export default function DemoVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stepIdx,  setStepIdx]  = useState(0);
  const [elapsed,  setElapsed]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [tick,     setTick]     = useState(0);
  const [agentStep,setAgentStep]= useState(0);
  const [pipX,     setPipX]     = useState<number|null>(null); // null = default right side
  const [pipSide,  setPipSide]  = useState<"left"|"right">("right");
  const [dragging, setDragging] = useState(false);
  const [dragStart,setDragStart]= useState({mx:0, bx:0});
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);

  // Detect mobile
  useEffect(()=>{
    const check = ()=>setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return ()=>window.removeEventListener("resize", check);
  },[]);

  // Sync step from elapsed
  useEffect(()=>{
    let acc=0;
    for(let i=0;i<STEPS.length;i++){
      acc+=STEPS[i].duration;
      if(elapsed<acc){setStepIdx(i);return;}
    }
    setStepIdx(STEPS.length-1);
  },[elapsed]);

  // Agent animation
  useEffect(()=>{
    if(STEPS[stepIdx]?.id==="consensus"){
      setAgentStep(0);
      [0,1,2,3,4].forEach(i=>setTimeout(()=>setAgentStep(i+1),i*650));
    }
  },[stepIdx]);

  // Tick
  useEffect(()=>{
    const t = setInterval(()=>setTick(n=>n+1), 80);
    return ()=>clearInterval(t);
  },[]);

  const startTimer = useCallback(()=>{
    if(intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(()=>{
      setElapsed(e=>{
        if(e>=TOTAL-100){ clearInterval(intervalRef.current!); setPlaying(false); return TOTAL; }
        return e+100;
      });
    },100);
  },[]);

  const handlePlay = ()=>{
    if(elapsed>=TOTAL) setElapsed(0);
    setPlaying(true);
    startTimer();
    videoRef.current?.play().catch(()=>{});
  };
  const handlePause = ()=>{
    setPlaying(false);
    if(intervalRef.current) clearInterval(intervalRef.current);
    videoRef.current?.pause();
  };
  const handleSeek = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const v=Number(e.target.value);
    setElapsed(v);
    if(videoRef.current){const d=videoRef.current.duration||0;if(d>0)videoRef.current.currentTime=(v/TOTAL)*d;}
  };
  const jumpToStep = (i:number)=>{
    let acc=0;
    for(let j=0;j<i;j++) acc+=STEPS[j].duration;
    setElapsed(acc+50);
    if(videoRef.current){const d=videoRef.current.duration||0;if(d>0)videoRef.current.currentTime=(acc/TOTAL)*d;}
  };

  // Step progress
  let stepElapsed = elapsed;
  for(let i=0;i<stepIdx;i++) stepElapsed-=STEPS[i].duration;
  const stepPct = Math.min(stepElapsed/STEPS[stepIdx].duration, 1);
  const clickActive = stepPct>0.28 && stepPct<0.72;

  // Desktop PiP drag
  const startDrag = (e:React.MouseEvent)=>{
    if(isMobile) return;
    setDragging(true);
    setDragStart({mx:e.clientX, bx:pipX??0});
  };
  useEffect(()=>{
    if(!dragging) return;
    const move=(e:MouseEvent)=>setPipX(x=>Math.max(0,Math.min(window.innerWidth-270,(x??0)+e.clientX-dragStart.mx)));
    const up=()=>setDragging(false);
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
  },[dragging,dragStart]);

  // Mobile PiP tap to toggle side
  const togglePipSide = ()=>{ if(isMobile) setPipSide(s=>s==="right"?"left":"right"); };

  // PiP position styles
  const pipStyle: React.CSSProperties = isMobile
    ? { position:"fixed", bottom:74, [pipSide]:12, width:140, height:96, borderRadius:10 }
    : pipX!==null
      ? { position:"fixed", bottom:24, left:pipX, width:240, height:162, borderRadius:14 }
      : { position:"fixed", bottom:24, right:20, width:240, height:162, borderRadius:14 };

  return (
    <main style={{ background:bg, color:"#e5e5e5", minHeight:"100vh", fontFamily:"'DM Mono','Courier New',monospace", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;}
        @keyframes ripple{0%{transform:scale(.4);opacity:.8;}100%{transform:scale(2.6);opacity:0;}}
        @keyframes pr{0%,100%{opacity:.4;transform:scale(1);}50%{opacity:.9;transform:scale(1.1);}}
        .syne{font-family:'Syne',sans-serif;}
        .step-btn{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.45);
          padding:6px 10px;border-radius:8px;cursor:pointer;font-size:11px;transition:all .2s;
          font-family:'DM Mono',monospace;text-align:left;width:100%;}
        .step-btn:hover{border-color:rgba(255,255,255,.18);color:#fff;}
        .step-btn.active{border-color:${gold}55;color:${gold};background:rgba(201,162,39,.08);}
        /* Horizontal mobile step pills */
        .step-pill{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.45);
          padding:7px 12px;border-radius:20px;cursor:pointer;font-size:11px;transition:all .2s;
          font-family:'DM Mono',monospace;white-space:nowrap;flex-shrink:0;}
        .step-pill.active{border-color:${gold}55;color:${gold};background:rgba(201,162,39,.08);}
        input[type=range]{-webkit-appearance:none;width:100%;height:3px;border-radius:2px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${gold};cursor:pointer;box-shadow:0 0 8px ${gold}80;}
        .pip-wrap{overflow:hidden;border:1.5px solid rgba(201,162,39,.3);box-shadow:0 6px 36px rgba(0,0,0,.7);z-index:100;background:#000;user-select:none;}

        /* Desktop: draggable */
        @media(min-width:641px){
          .pip-wrap{cursor:grab;}
          .pip-wrap:active{cursor:grabbing;}
          .demo-sidebar{display:flex!important;}
          .demo-step-strip{display:none!important;}
        }

        /* Mobile layout */
        @media(max-width:640px){
          .demo-sidebar{display:none!important;}
          .demo-step-strip{display:flex!important;}
          .demo-body{flex-direction:column!important;padding:12px!important;}
          .demo-main{gap:10px!important;}
          .demo-title h2{font-size:.9rem!important;}
          .pip-wrap{cursor:pointer!important;}
          .cta-bar{flex-wrap:wrap!important;gap:10px!important;padding:10px 16px!important;}
          .cta-bar-text{display:none!important;}
          nav{padding:0 14px!important;}
          .nav-verify-btn{font-size:11px!important;padding:5px 10px!important;}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ padding:"0 20px", height:52, display:"flex", alignItems:"center", gap:14, borderBottom:`0.5px solid ${border}`, background:"rgba(6,6,8,.97)", backdropFilter:"blur(16px)", flexShrink:0 }}>
        <Link href="/" style={{ textDecoration:"none" }}>
          <span className="syne" style={{ color:gold, fontWeight:800, fontSize:".9rem", letterSpacing:".15em" }}>◆ AUTHICHAIN</span>
        </Link>
        <span style={{ color:"rgba(255,255,255,.2)", fontSize:12 }}>/</span>
        <span style={{ fontSize:11, color:"rgba(255,255,255,.38)" }}>Demo</span>
        <div style={{ flex:1 }}/>
        <a
          href="https://authichain.com/verify?id=AC-1829577CED8F6BFBB0BC667CDE33DF0E"
          target="_blank" rel="noopener noreferrer"
          className="nav-verify-btn"
          style={{ fontSize:12, color:gold, textDecoration:"none", padding:"6px 12px", border:`1px solid rgba(201,162,39,.35)`, borderRadius:8, display:"inline-flex", alignItems:"center", gap:4 }}
        >Try Live Verify →</a>
      </nav>

      {/* ── MOBILE STEP STRIP (horizontal scroll) ── */}
      <div className="demo-step-strip" style={{ display:"none", overflowX:"auto", gap:8, padding:"10px 12px 6px", flexShrink:0, scrollbarWidth:"none", borderBottom:`0.5px solid ${border}` }}>
        {STEPS.map((s,i)=>(
          <button key={s.id} className={`step-pill${i===stepIdx?" active":""}`} onClick={()=>jumpToStep(i)}>
            {i+1}. {s.title}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div className="demo-body" style={{ flex:1, display:"flex", gap:0, padding:20, maxWidth:1400, margin:"0 auto", width:"100%" }}>

        {/* ── SIDEBAR (desktop only) ── */}
        <div className="demo-sidebar" style={{ display:"flex", width:200, flexShrink:0, marginRight:18, flexDirection:"column", gap:0 }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".15em", marginBottom:10 }}>WALKTHROUGH</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {STEPS.map((s,i)=>(
              <button key={s.id} className={`step-btn${i===stepIdx?" active":""}`} onClick={()=>jumpToStep(i)}>
                <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                  <div style={{ width:17, height:17, borderRadius:"50%", border:`1px solid ${i===stepIdx?gold:"rgba(255,255,255,.12)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:i===stepIdx?gold:"rgba(255,255,255,.28)", flexShrink:0 }}>{i+1}</div>
                  <span style={{ fontSize:10, lineHeight:1.4 }}>{s.title}</span>
                </div>
              </button>
            ))}
          </div>
          <div style={{ marginTop:20, padding:14, background:"rgba(255,255,255,.03)", border:`1px solid ${border}`, borderRadius:12 }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.3)", letterSpacing:".1em", marginBottom:10 }}>DEMO SPECS</div>
            {[["Total","~60s"],["AI Agents","5"],["Blockchain","Polygon"],["Per Seal","$0.004"],["Verify","2.1 seconds"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:11, padding:"4px 0", borderBottom:`0.5px solid ${border}` }}>
                <span style={{ color:"rgba(255,255,255,.3)" }}>{k}</span>
                <span style={{ color:"rgba(255,255,255,.62)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="demo-main" style={{ flex:1, display:"flex", flexDirection:"column", gap:14 }}>

          {/* Step title */}
          <div className="demo-title" style={{ display:"flex", gap:9, alignItems:"center" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:playing?green:gold, animation:playing?"pr 1.5s infinite":"none", flexShrink:0 }}/>
            <h2 className="syne" style={{ fontWeight:700, fontSize:"1rem", margin:0, color:"rgba(255,255,255,.88)" }}>
              Step {stepIdx+1} — {STEPS[stepIdx].title}
            </h2>
          </div>

          {/* Browser mock */}
          <div style={{ flex:1, background:"#0c0c10", border:`1px solid ${border}`, borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", minHeight: isMobile ? 320 : 380 }}>
            {/* Chrome bar */}
            <div style={{ padding:"8px 14px", borderBottom:`0.5px solid ${border}`, display:"flex", gap:8, alignItems:"center", background:"rgba(255,255,255,.02)", flexShrink:0 }}>
              <div style={{ display:"flex", gap:5 }}>
                {["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }}/>)}
              </div>
              <div style={{ flex:1, background:"rgba(255,255,255,.04)", border:`0.5px solid ${border}`, borderRadius:6, padding:"3px 10px", fontSize:10, color:"rgba(255,255,255,.28)", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ color:green, fontSize:8 }}>🔒</span>
                authichain.com/{STEPS[stepIdx].id==="landing"?"":STEPS[stepIdx].id}
              </div>
            </div>
            {/* Content area */}
            <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
              <Screen id={STEPS[stepIdx].id} tick={tick} agentStep={agentStep}/>
              {STEPS[stepIdx].clicks.map((cl,i)=>(
                <Ripple key={`${stepIdx}-${i}`} x={cl.x} y={cl.y} label={cl.label} active={clickActive}/>
              ))}
              {/* Step progress line */}
              <div style={{ position:"absolute", bottom:0, left:0, height:2, background:gold, width:`${stepPct*100}%`, transition:"width .1s linear", boxShadow:`0 0 8px ${gold}` }}/>
            </div>
          </div>

          {/* Playback controls */}
          <div style={{ background:"rgba(255,255,255,.03)", border:`1px solid ${border}`, borderRadius:12, padding:"12px 16px" }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <button
                onClick={playing?handlePause:handlePlay}
                style={{ width:40, height:40, borderRadius:"50%", border:`1px solid ${gold}40`, background:`${gold}12`, color:gold, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                aria-label={playing?"Pause":"Play"}
              >{playing?"⏸":"▶"}</button>
              <div style={{ flex:1 }}>
                <input type="range" min={0} max={TOTAL} value={elapsed} onChange={handleSeek}
                  style={{ background:`linear-gradient(to right,${gold} ${(elapsed/TOTAL)*100}%,rgba(255,255,255,.1) 0%)` }}/>
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.32)", minWidth:52, textAlign:"right", flexShrink:0 }}>
                {Math.floor(elapsed/1000)}s/{TOTAL/1000}s
              </div>
            </div>
            {/* Segment bar */}
            <div style={{ display:"flex", gap:3 }}>
              {STEPS.map((s,i)=>(
                <div key={s.id} style={{ flex:s.duration/TOTAL, height:3, borderRadius:2, cursor:"pointer",
                  background:i<stepIdx?gold:i===stepIdx?`${gold}50`:"rgba(255,255,255,.06)", transition:"background .3s" }}
                  onClick={()=>jumpToStep(i)}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PiP PRESENTER VIDEO ── */}
      <div
        className="pip-wrap"
        style={{ ...pipStyle, position:"fixed" }}
        onMouseDown={startDrag}
        onClick={togglePipSide}
      >
        {/* Header bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:24, zIndex:5, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 8px", background:"linear-gradient(to bottom,rgba(0,0,0,.55),transparent)", flexShrink:0 }}>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:playing?green:"rgba(255,255,255,.2)", animation:playing?"pr 1.5s infinite":"none" }}/>
            <span style={{ fontSize:8, color:"rgba(255,255,255,.5)", fontFamily:"'DM Mono',monospace", letterSpacing:".08em" }}>PRESENTER</span>
          </div>
          {!isMobile&&<div style={{ width:24, height:3, borderRadius:2, background:"rgba(255,255,255,.15)" }}/>}
          {isMobile&&<span style={{ fontSize:8, color:"rgba(255,255,255,.3)" }}>tap to flip</span>}
        </div>
        <video
          ref={videoRef}
          src="/avatar-video.mp4"
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", pointerEvents:"none" }}
          playsInline
          loop
        />
        <div style={{ position:"absolute", inset:0, border:`1.5px solid rgba(201,162,39,.22)`, borderRadius:"inherit", pointerEvents:"none" }}/>
      </div>

      {/* ── BOTTOM CTA BAR ── */}
      <div className="cta-bar" style={{ padding:"12px 24px", borderTop:`0.5px solid ${border}`, background:"rgba(6,6,8,.96)", display:"flex", alignItems:"center", gap:16, flexShrink:0 }}>
        <div className="cta-bar-text">
          <div className="syne" style={{ fontWeight:700, fontSize:"1rem", color:gold }}>Seen enough?</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.35)" }}>Deploy AuthiChain in 48 hours. $0.004 per seal.</div>
        </div>
        <div style={{ flex:1 }}/>
        <a
          href="https://authichain.com/portal"
          style={{ background:gold, color:"#000", padding:"10px 22px", borderRadius:10, textDecoration:"none", fontWeight:700, fontSize:13, flexShrink:0 }}
        >Get Started →</a>
        <button
          onClick={()=>{const e=['z','@','authichain','.','com'].join('');window.open('mailto:'+e);}}
          style={{ border:`1px solid rgba(255,255,255,.18)`, color:"#e5e5e5", padding:"10px 18px", borderRadius:10, fontSize:13, background:"transparent", cursor:"pointer", fontFamily:"'DM Mono','Courier New',monospace", flexShrink:0 }}
        >Talk to Founder</button>
      </div>
    </main>
  );
}
