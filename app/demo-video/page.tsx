"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const gold = "#c9a227";
const green = "#22c55e";
const purple = "#a78bfa";
const bg = "#060608";
const border = "rgba(255,255,255,0.07)";

const AGENTS = [
  { name:"Guardian",  weight:35, color:green,    desc:"Validating cryptographic hash" },
  { name:"Archivist", weight:20, color:gold,     desc:"Cross-referencing provenance history" },
  { name:"Sentinel",  weight:25, color:purple,   desc:"Anomaly detection scan" },
  { name:"Scout",     weight:8,  color:"#38bdf8",desc:"Market listing verification" },
  { name:"Arbiter",   weight:12, color:"#fb923c",desc:"Final consensus adjudication" },
];

const STEPS = [
  { id:"landing",     title:"AuthiChain Portal — Home",              duration:4500, clicks:[{x:62,y:78,label:"Scan Product"}] },
  { id:"scanning",    title:"QR Code Detected — Initiating Scan",    duration:3200, clicks:[{x:50,y:50,label:"QR Captured"}] },
  { id:"consensus",   title:"5-Agent AI Consensus Running",          duration:4500, clicks:[] },
  { id:"certificate", title:"Certificate Issued — Authenticated",    duration:5000, clicks:[{x:50,y:86,label:"Download Certificate"}] },
  { id:"blockchain",  title:"On-Chain Proof — Polygon Explorer",     duration:3800, clicks:[{x:50,y:90,label:"View on PolygonScan"}] },
  { id:"dpp",         title:"EU Digital Product Passport Generated", duration:4000, clicks:[{x:50,y:88,label:"Export DPP PDF"}] },
];

const TOTAL = STEPS.reduce((s,t)=>s+t.duration,0);

function Ripple({x,y,label,active}:{x:number,y:number,label:string,active:boolean}) {
  const [show,setShow]=useState(false);
  useEffect(()=>{
    if(active){setShow(false);const t=setTimeout(()=>setShow(true),150);return()=>clearTimeout(t);}
    setShow(false);
  },[active]);
  if(!show) return null;
  return (
    <div style={{position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",zIndex:30,pointerEvents:"none"}}>
      <div style={{position:"relative",width:44,height:44}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{position:"absolute",inset:0,borderRadius:"50%",border:`2px solid ${gold}`,animation:`ripple 1.3s ${i*0.3}s ease-out infinite`,opacity:0}}/>
        ))}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:14,height:14,borderRadius:"50%",background:gold,boxShadow:`0 0 14px ${gold}`}}/>
        </div>
      </div>
      <div style={{position:"absolute",top:-26,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.85)",border:`1px solid ${gold}50`,borderRadius:6,padding:"3px 8px",fontSize:10,color:gold,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace"}}>
        {label}
      </div>
    </div>
  );
}

function Screen({id,tick,agentStep}:{id:string,tick:number,agentStep:number}) {
  const scanY=((tick%80)/80)*80+8;
  if(id==="landing") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"12px 16px",borderBottom:`0.5px solid ${border}`,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{color:gold,fontSize:11,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>◆ AUTHICHAIN</span>
        <div style={{flex:1}}/>
        <span style={{width:6,height:6,borderRadius:"50%",background:green,boxShadow:`0 0 6px ${green}`}}/>
        <span style={{fontSize:10,color:green}}>LIVE</span>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:24,textAlign:"center"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:".15em"}}>BLOCKCHAIN PRODUCT AUTHENTICATION</div>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"2.2rem",lineHeight:1.1}}>
          <span style={{color:gold}}>Truth</span> as<br/>infrastructure
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.45)",maxWidth:260,lineHeight:1.7}}>Scan your product's QRON QR code to instantly verify blockchain authenticity</div>
        <div style={{background:gold,color:"#000",padding:"10px 28px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Scan Product →</div>
        <div style={{display:"flex",gap:28}}>
          {[["$0.004","per seal"],["2.1s","verify"],["EU DPP","compliant"]].map(([v,l])=>(
            <div key={l}><div style={{color:gold,fontWeight:700,fontSize:14}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );

  if(id==="scanning") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:24}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:".15em"}}>QR CODE DETECTED</div>
      <div style={{position:"relative",width:160,height:160,border:`1.5px solid ${gold}40`,borderRadius:12,overflow:"hidden"}}>
        {[[0,0],[0,1],[1,0],[1,1]].map(([r,c],i)=>(
          <div key={i} style={{position:"absolute",width:18,height:18,top:r?undefined:8,bottom:r?8:undefined,left:c?undefined:8,right:c?8:undefined,borderTop:r?"none":`2px solid ${gold}`,borderBottom:r?`2px solid ${gold}`:"none",borderLeft:c?"none":`2px solid ${gold}`,borderRight:c?`2px solid ${gold}`:"none"}}/>
        ))}
        <div style={{position:"absolute",left:0,right:0,height:2,background:`linear-gradient(to right,transparent,${gold},transparent)`,top:`${scanY}%`,boxShadow:`0 0 10px ${gold}`}}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,padding:16}}>
          {Array.from({length:36}).map((_,i)=>(
            <div key={i} style={{aspectRatio:"1",borderRadius:2,background:Math.sin(i*1.9+tick*0.06)>0?gold:"rgba(201,162,39,.08)",transition:"background .7s"}}/>
          ))}
        </div>
      </div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.5)",textAlign:"center",lineHeight:1.7}}>
        AC-1829577CED8F6BFBB0BC667CDE33DF0E<br/>
        <span style={{color:"rgba(255,255,255,.25)",fontSize:10}}>Querying Polygon blockchain...</span>
      </div>
      <div style={{display:"flex",gap:5}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:gold,opacity:(tick%9===i*3)?1:0.2,transition:"opacity .2s"}}/>)}</div>
    </div>
  );

  if(id==="consensus") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:20,gap:10}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:".15em",marginBottom:4}}>5-AGENT CONSENSUS ENGINE</div>
      {AGENTS.map((a,i)=>(
        <div key={a.name} style={{background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.06)`,borderRadius:10,padding:"10px 14px"}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:agentStep>i?a.color:"rgba(255,255,255,.12)",boxShadow:agentStep>i?`0 0 8px ${a.color}`:"none",transition:"all .5s"}}/>
            <span style={{fontSize:12,fontWeight:600,color:agentStep>i?a.color:"rgba(255,255,255,.45)",fontFamily:"'Syne',sans-serif"}}>{a.name}</span>
            <span style={{fontSize:10,color:"rgba(255,255,255,.25)",marginLeft:"auto"}}>{a.weight}%</span>
          </div>
          <div style={{height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",background:a.color,width:agentStep>i?`${a.weight*2.5}%`:"0%",transition:"width 1.2s ease",borderRadius:2}}/>
          </div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.28)",marginTop:5}}>{a.desc}</div>
        </div>
      ))}
      {agentStep>=5&&<div style={{textAlign:"center",fontSize:13,color:green,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>✓ CONSENSUS REACHED — 2.1s</div>}
    </div>
  );

  if(id==="certificate") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,gap:14}}>
      <div style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${green}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 28px ${green}40`}}>
        <span style={{fontSize:24,color:green}}>✓</span>
      </div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.4rem",color:green}}>AUTHENTIC</div>
      <div style={{background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.1)`,borderRadius:12,padding:16,width:"100%",fontSize:11}}>
        {[["Product","Heritage Sneaker Drop #0042"],["Brand","Verified Manufacturer"],["Batch","AC-1829577CED8F6BFBB0BC667CDE33DF0E"],["NFT","#16 · Polygon · 0x4da4...72BE"],["Verified",new Date().toLocaleDateString()],["Time","2.1 seconds"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`0.5px solid ${border}`}}>
            <span style={{color:"rgba(255,255,255,.3)"}}>{k}</span><span style={{color:"rgba(255,255,255,.75)",textAlign:"right",maxWidth:"58%"}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{background:gold,color:"#000",padding:"9px 24px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>Download Certificate →</div>
    </div>
  );

  if(id==="blockchain") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:20,gap:12}}>
      <div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:".15em"}}>POLYGON MAINNET · CHAIN ID: 137</div>
      {[{title:"TRANSACTION",color:purple,rows:[["Hash","0x4d8f...9a2c"],["Block","#58,234,441"],["Status","✓ Success"],["Gas","0.000021 MATIC"]]},{title:"NFT TRANSFER",color:gold,rows:[["Token","#16"],["Contract","0x4da4...72BE"],["Standard","ERC-721"],["To","0xAebf...E437"]]}].map(box=>(
        <div key={box.title} style={{background:"rgba(255,255,255,.03)",border:`1px solid rgba(255,255,255,.08)`,borderRadius:10,padding:14}}>
          <div style={{fontSize:10,color:box.color,marginBottom:8}}>{box.title}</div>
          {box.rows.map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${border}`}}>
              <span style={{color:"rgba(255,255,255,.3)"}}>{k}</span><span style={{color:"rgba(255,255,255,.7)"}}>{v}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{textAlign:"center",fontSize:12,color:purple,cursor:"pointer"}}>View on PolygonScan →</div>
    </div>
  );

  if(id==="dpp") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",padding:20,gap:12}}>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:18}}>🇪🇺</span><div style={{fontSize:10,color:"rgba(255,255,255,.35)",letterSpacing:".15em"}}>EU DIGITAL PRODUCT PASSPORT</div></div>
      <div style={{background:"rgba(255,255,255,.03)",border:`1px solid rgba(34,197,94,.2)`,borderRadius:10,padding:14,flex:1}}>
        <div style={{fontSize:10,color:green,marginBottom:10}}>REGULATION (EU) 2024/1781 — ECODESIGN</div>
        {[["Product Type","Footwear"],["Batch ID","AC-182957"],["Manufacturer","Verified Entity"],["Country","United States"],["Carbon Score","A+ (94/100)"],["Recyclable","Yes — 78%"],["Compliance","EU DPP ✓"],["Valid Until","2029-12-31"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${border}`}}>
            <span style={{color:"rgba(255,255,255,.3)"}}>{k}</span><span style={{color:"rgba(255,255,255,.7)"}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{background:green,color:"#000",padding:"9px 24px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",textAlign:"center"}}>Export DPP PDF →</div>
    </div>
  );

  return null;
}

export default function DemoVideoPage() {
  const videoRef=useRef<HTMLVideoElement>(null);
  const [stepIdx,setStepIdx]=useState(0);
  const [elapsed,setElapsed]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [tick,setTick]=useState(0);
  const [agentStep,setAgentStep]=useState(0);
  const [pipX,setPipX]=useState(16);
  const [dragging,setDragging]=useState(false);
  const [dragStart,setDragStart]=useState({mx:0,bx:0});
  const intervalRef=useRef<any>(null);

  useEffect(()=>{
    let acc=0;
    for(let i=0;i<STEPS.length;i++){
      acc+=STEPS[i].duration;
      if(elapsed<acc){setStepIdx(i);return;}
    }
    setStepIdx(STEPS.length-1);
  },[elapsed]);

  useEffect(()=>{
    if(STEPS[stepIdx]?.id==="consensus"){
      setAgentStep(0);
      [0,1,2,3,4].forEach((i)=>setTimeout(()=>setAgentStep(i+1),i*650));
    }
  },[stepIdx]);

  useEffect(()=>{
    const t=setInterval(()=>setTick(n=>n+1),80);
    return()=>clearInterval(t);
  },[]);

  const startTimer=useCallback(()=>{
    clearInterval(intervalRef.current);
    intervalRef.current=setInterval(()=>{
      setElapsed(e=>{
        if(e>=TOTAL-100){clearInterval(intervalRef.current);setPlaying(false);return TOTAL;}
        return e+100;
      });
    },100);
  },[]);

  const handlePlay=()=>{
    if(elapsed>=TOTAL)setElapsed(0);
    setPlaying(true);
    startTimer();
    videoRef.current?.play().catch(()=>{});
  };
  const handlePause=()=>{
    setPlaying(false);
    clearInterval(intervalRef.current);
    videoRef.current?.pause();
  };
  const handleSeek=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const v=Number(e.target.value);
    setElapsed(v);
    if(videoRef.current){
      const dur=videoRef.current.duration||0;
      if(dur>0)videoRef.current.currentTime=(v/TOTAL)*dur;
    }
  };

  let stepElapsed=elapsed;
  for(let i=0;i<stepIdx;i++)stepElapsed-=STEPS[i].duration;
  const stepPct=Math.min(stepElapsed/STEPS[stepIdx].duration,1);
  const clickActive=stepPct>0.28&&stepPct<0.72;

  const startDrag=(e:React.MouseEvent)=>{setDragging(true);setDragStart({mx:e.clientX,bx:pipX});};
  useEffect(()=>{
    if(!dragging)return;
    const move=(e:MouseEvent)=>setPipX(x=>Math.max(0,Math.min(window.innerWidth-270,dragStart.bx+e.clientX-dragStart.mx)));
    const up=()=>setDragging(false);
    window.addEventListener("mousemove",move);
    window.addEventListener("mouseup",up);
    return()=>{window.removeEventListener("mousemove",move);window.removeEventListener("mouseup",up);};
  },[dragging,dragStart]);

  return (
    <main style={{background:bg,color:"#e5e5e5",minHeight:"100vh",fontFamily:"'DM Mono','Courier New',monospace",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap');
        @keyframes ripple{0%{transform:scale(.4);opacity:.8;}100%{transform:scale(2.6);opacity:0;}}
        @keyframes pr{0%,100%{opacity:.4;transform:scale(1);}50%{opacity:.9;transform:scale(1.1);}}
        .syne{font-family:'Syne',sans-serif;}
        .step-btn{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);color:rgba(255,255,255,.45);padding:7px 12px;border-radius:8px;cursor:pointer;font-size:11px;transition:all .2s;font-family:'DM Mono',monospace;text-align:left;width:100%;}
        .step-btn:hover{border-color:rgba(255,255,255,.18);color:#fff;}
        .step-btn.active{border-color:${gold}50;color:${gold};background:rgba(201,162,39,.07);}
        input[type=range]{-webkit-appearance:none;width:100%;height:3px;border-radius:2px;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${gold};cursor:pointer;box-shadow:0 0 8px ${gold}80;}
        .pip{position:fixed;bottom:24px;border-radius:16px;overflow:hidden;border:1.5px solid rgba(201,162,39,.3);box-shadow:0 8px 48px rgba(0,0,0,.75);cursor:grab;z-index:100;background:#000;user-select:none;}
        .pip:active{cursor:grabbing;}
      `}</style>

      {/* NAV */}
      <nav style={{padding:"0 24px",height:52,display:"flex",alignItems:"center",gap:16,borderBottom:`0.5px solid ${border}`,background:"rgba(6,6,8,.97)",backdropFilter:"blur(16px)",flexShrink:0}}>
        <Link href="/" style={{textDecoration:"none"}}>
          <span className="syne" style={{color:gold,fontWeight:800,fontSize:".9rem",letterSpacing:".15em"}}>◆ AUTHICHAIN</span>
        </Link>
        <span style={{color:"rgba(255,255,255,.2)",fontSize:12}}>/</span>
        <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Product Demo</span>
        <div style={{flex:1}}/>
        <a
          href="https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"
          target="_blank"
          rel="noopener noreferrer"
          style={{fontSize:12,color:gold,textDecoration:"none",padding:"6px 14px",border:`1px solid rgba(201,162,39,.35)`,borderRadius:8,transition:"all .2s",display:"inline-flex",alignItems:"center",gap:4}}
        >
          Try Live Verify →
        </a>
      </nav>

      {/* BODY */}
      <div style={{flex:1,display:"flex",gap:0,padding:24,maxWidth:1400,margin:"0 auto",width:"100%"}}>

        {/* SIDEBAR */}
        <div style={{width:210,flexShrink:0,marginRight:20}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:".15em",marginBottom:12}}>WALKTHROUGH</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {STEPS.map((s,i)=>{
              let acc=0;
              for(let j=0;j<i;j++)acc+=STEPS[j].duration;
              return (
                <button key={s.id} className={`step-btn${i===stepIdx?" active":""}`} onClick={()=>{
                  setElapsed(acc+100);
                  if(videoRef.current){const d=videoRef.current.duration||0;if(d>0)videoRef.current.currentTime=(acc/TOTAL)*d;}
                }}>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{width:18,height:18,borderRadius:"50%",border:`1px solid ${i===stepIdx?gold:"rgba(255,255,255,.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:i===stepIdx?gold:"rgba(255,255,255,.28)",flexShrink:0}}>{i+1}</div>
                    <span style={{fontSize:10,lineHeight:1.4}}>{s.title.split("—")[0].trim()}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{marginTop:24,padding:16,background:"rgba(255,255,255,.03)",border:`1px solid ${border}`,borderRadius:12}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:".1em",marginBottom:10}}>DEMO SPECS</div>
            {[["Total","~24s"],["AI Agents","5"],["Blockchain","Polygon"],["Per Seal","$0.004"],["Verify","2.1 seconds"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 0",borderBottom:`0.5px solid ${border}`}}>
                <span style={{color:"rgba(255,255,255,.3)"}}>{k}</span>
                <span style={{color:"rgba(255,255,255,.65)"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:16}}>
          {/* Title */}
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:playing?green:gold,animation:playing?"pr 1.5s infinite":"none"}}/>
            <h2 className="syne" style={{fontWeight:700,fontSize:"1.1rem",margin:0,color:"rgba(255,255,255,.9)"}}>
              Step {stepIdx+1} — {STEPS[stepIdx].title}
            </h2>
          </div>

          {/* Browser mock */}
          <div style={{flex:1,background:"#0c0c10",border:`1px solid ${border}`,borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column",minHeight:400}}>
            {/* Chrome bar */}
            <div style={{padding:"10px 16px",borderBottom:`0.5px solid ${border}`,display:"flex",gap:10,alignItems:"center",background:"rgba(255,255,255,.02)"}}>
              <div style={{display:"flex",gap:6}}>{["#ff5f57","#ffbd2e","#28ca41"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
              <div style={{flex:1,background:"rgba(255,255,255,.04)",border:`0.5px solid ${border}`,borderRadius:6,padding:"4px 12px",fontSize:11,color:"rgba(255,255,255,.3)",display:"flex",alignItems:"center",gap:6}}>
                <span style={{color:green,fontSize:9}}>🔒</span>
                authichain.com/{STEPS[stepIdx].id==="landing"?"":STEPS[stepIdx].id}
              </div>
            </div>
            {/* Content */}
            <div style={{flex:1,position:"relative",overflow:"auto"}}>
              <Screen id={STEPS[stepIdx].id} tick={tick} agentStep={agentStep}/>
              {STEPS[stepIdx].clicks.map((cl,i)=>(
                <Ripple key={`${stepIdx}-${i}`} x={cl.x} y={cl.y} label={cl.label} active={clickActive}/>
              ))}
              {/* Step progress bar */}
              <div style={{position:"absolute",bottom:0,left:0,height:2,background:gold,width:`${stepPct*100}%`,transition:"width .1s linear",boxShadow:`0 0 8px ${gold}`}}/>
            </div>
          </div>

          {/* CONTROLS */}
          <div style={{background:"rgba(255,255,255,.03)",border:`1px solid ${border}`,borderRadius:14,padding:"14px 20px"}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
              <button onClick={playing?handlePause:handlePlay} style={{width:40,height:40,borderRadius:"50%",border:`1px solid ${gold}40`,background:`${gold}12`,color:gold,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {playing?"⏸":"▶"}
              </button>
              <div style={{flex:1}}>
                <input type="range" min={0} max={TOTAL} value={elapsed} onChange={handleSeek}
                  style={{background:`linear-gradient(to right,${gold} ${(elapsed/TOTAL)*100}%,rgba(255,255,255,.1) 0%)`}}/>
              </div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)",minWidth:60,textAlign:"right"}}>
                {Math.floor(elapsed/1000)}s / {TOTAL/1000}s
              </div>
            </div>
            <div style={{display:"flex",gap:4}}>
              {STEPS.map((s,i)=>(
                <div key={s.id} style={{flex:s.duration/TOTAL,height:4,borderRadius:2,background:i<stepIdx?gold:i===stepIdx?`${gold}55`:"rgba(255,255,255,.06)",transition:"background .3s"}}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PiP VIDEO */}
      <div className="pip" style={{left:pipX,width:256,height:176}} onMouseDown={startDrag}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:28,zIndex:5,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 10px",background:"linear-gradient(to bottom,rgba(0,0,0,.5),transparent)"}}>
          <div style={{display:"flex",gap:5,alignItems:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:playing?green:"rgba(255,255,255,.25)",animation:playing?"pr 1.5s infinite":"none"}}/>
            <span style={{fontSize:9,color:"rgba(255,255,255,.55)",fontFamily:"'DM Mono',monospace",letterSpacing:".08em"}}>PRESENTER</span>
          </div>
          <div style={{width:28,height:3,borderRadius:2,background:"rgba(255,255,255,.15)"}}/>
        </div>
        <video ref={videoRef} src="/avatar-video.mp4" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",pointerEvents:"none"}} playsInline loop/>
        <div style={{position:"absolute",inset:0,border:`1.5px solid rgba(201,162,39,.25)`,borderRadius:16,pointerEvents:"none"}}/>
      </div>

      {/* BOTTOM CTA */}
      <div style={{padding:"14px 32px",borderTop:`0.5px solid ${border}`,background:"rgba(6,6,8,.96)",display:"flex",alignItems:"center",gap:20,flexShrink:0}}>
        <div>
          <div className="syne" style={{fontWeight:700,fontSize:"1rem",color:gold}}>Seen enough?</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>Deploy AuthiChain in 48 hours. $0.004 per product seal. No hardware required.</div>
        </div>
        <div style={{flex:1}}/>
        <a href="https://authichain.com/portal" style={{background:gold,color:"#000",padding:"10px 24px",borderRadius:10,textDecoration:"none",fontWeight:700,fontSize:13}}>Get Started →</a>
        <button
          onClick={()=>{const e=['z','@','authichain','.','com'].join('');window.open('mailto:'+e);}}
          style={{border:`1px solid rgba(255,255,255,.18)`,color:"#e5e5e5",padding:"10px 20px",borderRadius:10,fontSize:13,background:"transparent",cursor:"pointer",fontFamily:"'DM Mono','Courier New',monospace"}}
        >Talk to Founder</button>
      </div>
    </main>
  );
}
