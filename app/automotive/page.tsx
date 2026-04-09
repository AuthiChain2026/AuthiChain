"use client";
import { useEffect, useRef, useState } from "react";

const QR_CLEAN = "https://qron-images.undone-k.workers.dev/qr-clean.png";
const QR_EV    = "https://qron-images.undone-k.workers.dev/qr-ev.png";

const LOGS = [
  [600,  "QR SCAN",   "Decoded: AC-AUTO-2026-EV-0047"],
  [1100, "VIN",       "VIN: 1HGBH41JXMN109186 — 2026 Model Year EV"],
  [1700, "CHAIN",     "Querying Polygon block 54,892,341…"],
  [2300, "CONTRACT",  "0x5db511706FB…6AA2 → AuthiChain ERC-721"],
  [3000, "GUARDIAN",  "Battery batch hash 7f3bc4d8… ✓ COA verified"],
  [3600, "ARCHIVIST", "Assembly chain: 6 events — unbroken ✓"],
  [4200, "SENTINEL",  "No recall flags · NHTSA clear · UNECE R100 ✓"],
  [4800, "ARBITER",   "Consensus 99.1% — AUTHENTIC ⚡"],
];

export default function AutomotivePage() {
  const [phase, setPhase] = useState<0|1|2|3|4>(0);
  const [logs, setLogs] = useState<{label:string;text:string;ok:boolean}[]>([]);
  const [status, setStatus] = useState("Awaiting scan");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function reset() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase(0); setLogs([]); setStatus("Awaiting scan");
  }

  function run() {
    if(phase > 0 && phase < 4) { reset(); return; }
    reset();
    const T = (fn:()=>void, ms:number) => { const id = setTimeout(fn, ms); timers.current.push(id); };
    setPhase(1); setStatus("QR scan initiated…");
    LOGS.forEach(([ms,label,text]) => T(() => setLogs(p => [...p, {label:label as string,text:text as string,ok:label==="ARBITER"}]), ms as number));
    T(() => setStatus("Querying blockchain…"), 1500);
    T(() => { setPhase(2); setStatus("Verifying components…"); }, 2400);
    T(() => setPhase(3), 3700);
    T(() => { setPhase(4); setStatus("⚡ AUTHENTIC — AC-AUTO-2026-EV-0047"); }, 5200);
    T(() => reset(), 8200);
  }

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const blue = "#4fc3f7"; const bolt = "#e040fb";
  const glow = phase >= 3;

  return (
    <div style={{background:"#04060f",minHeight:"100vh",color:"#e5e5e5",fontFamily:"monospace",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",overflow:"hidden",position:"relative"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(rgba(79,195,247,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(79,195,247,.05) 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none"}} />
      <div style={{position:"fixed",top:"30%",left:"50%",transform:"translateX(-50%)",width:"60vw",height:"40vw",background:`radial-gradient(ellipse,${glow?"rgba(79,195,247,.18)":"rgba(79,195,247,.05)"} 0%,transparent 70%)`,transition:"background 1.2s",pointerEvents:"none"}} />

      <div style={{fontSize:9,letterSpacing:".45em",color:"rgba(79,195,247,.4)",textTransform:"uppercase",marginBottom:20,position:"relative",zIndex:10}}>AuthiChain · Automotive Vertical · EV & Parts Authentication</div>

      <div style={{display:"flex",alignItems:"center",gap:"clamp(24px,5vw,56px)",flexWrap:"wrap",justifyContent:"center",position:"relative",zIndex:10}}>
        {/* QR Stage */}
        <div onClick={run} style={{position:"relative",width:"min(65vw,320px)",aspectRatio:"1",cursor:"pointer",flexShrink:0}}>
          <div style={{position:"absolute",inset:-20,borderRadius:"50%",boxShadow:glow?`0 0 80px 28px rgba(79,195,247,.3)`:"none",transition:"box-shadow .8s",pointerEvents:"none"}}/>
          {/* Clean QR */}
          <img src={QR_CLEAN} alt="QR" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",borderRadius:12,opacity:phase>=2?0:1,filter:phase===2?"blur(8px) brightness(5) saturate(8) hue-rotate(250deg)":"none",transition:phase>=2?"opacity .9s,filter .9s":"opacity .3s",zIndex:2}}/>
          {/* EV Art */}
          <img src={QR_EV} alt="EV QR Art" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",borderRadius:12,opacity:phase>=3?1:0,transform:phase>=3?"scale(1)":"scale(1.06)",filter:phase===3?"blur(2px) brightness(1.6)":"none",transition:"opacity 1.2s,transform 1.2s,filter 1.2s",zIndex:3}}/>
          {/* Scan beam */}
          {phase===1&&<div style={{position:"absolute",left:"8%",right:"8%",height:2,background:`linear-gradient(90deg,transparent,${blue},transparent)`,boxShadow:`0 0 14px 5px rgba(79,195,247,.4)`,zIndex:10,animation:"scanAuto 2s ease-in-out 1 forwards",top:"8%"}}/>}
          {/* Brackets */}
          {(phase===1||phase===2)&&["tl","tr","bl","br"].map(pos=>(
            <div key={pos} style={{position:"absolute",width:26,height:26,zIndex:12,
              top:pos.startsWith("t")?8:"auto",bottom:pos.startsWith("b")?8:"auto",
              left:pos.endsWith("l")?8:"auto",right:pos.endsWith("r")?8:"auto",
              borderTop:pos.startsWith("t")?`2.5px solid ${blue}`:"none",
              borderBottom:pos.startsWith("b")?`2.5px solid ${blue}`:"none",
              borderLeft:pos.endsWith("l")?`2.5px solid ${blue}`:"none",
              borderRight:pos.endsWith("r")?`2.5px solid ${blue}`:"none",
              boxShadow:`0 0 8px rgba(79,195,247,.6)`}}/>
          ))}
          {/* Lightning flash overlay */}
          {phase===2&&<div style={{position:"absolute",inset:0,borderRadius:12,background:`linear-gradient(135deg,transparent 30%,${bolt}15,transparent 70%)`,zIndex:8,animation:"lightningFade 1.4s ease both"}}/>}
          {/* AUTHENTIC badge */}
          {phase>=4&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(4,6,15,.9)",border:`2px solid ${blue}`,borderRadius:12,padding:"14px 20px",textAlign:"center",zIndex:20,backdropFilter:"blur(14px)",boxShadow:`0 0 28px rgba(79,195,247,.4)`,animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both"}}>
            <div style={{fontSize:30,color:blue,lineHeight:1,marginBottom:6}}>⚡</div>
            <div style={{fontFamily:"monospace",fontSize:13,fontWeight:700,color:blue,letterSpacing:".12em"}}>AUTHENTIC</div>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,.35)",marginTop:5,letterSpacing:".05em"}}>AUTHICHAIN · POLYGON · AC-AUTO-2026-EV-0047</div>
          </div>}
          <div style={{position:"absolute",bottom:-36,left:"50%",transform:"translateX(-50%)",fontSize:9,color:phase>=4?"rgba(79,195,247,.6)":"rgba(255,255,255,.22)",letterSpacing:".1em",whiteSpace:"nowrap"}}>
            {phase===0||phase===4?"▶ CLICK TO AUTHENTICATE":phase===1?"● SCANNING…":phase===2?"⚡ TRANSFORMING…":"🔗 VERIFYING…"}
          </div>
        </div>

        {/* Terminal */}
        <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:290}}>
          <div style={{fontFamily:"monospace",fontSize:"clamp(16px,3vw,22px)",fontWeight:900,color:blue,letterSpacing:".06em",textShadow:`0 0 20px rgba(79,195,247,.35)`,lineHeight:1.2}}>Automotive<br/>Authentication</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",lineHeight:1.75}}>EV battery packs, drivetrains, and safety-critical components — cryptographically verified at every supply chain node.</div>
          <div style={{background:"rgba(4,6,15,.85)",border:`1px solid rgba(79,195,247,.15)`,borderRadius:10,padding:"10px 14px",fontSize:10.5,lineHeight:1.9,minHeight:80,maxHeight:180,overflowY:"auto" as const}}>
            <div style={{color:"rgba(79,195,247,.25)",fontSize:10,marginBottom:4}}>AUTHICHAIN VERIFICATION ENGINE</div>
            {logs.map((l,i)=>(
              <div key={i} style={{display:"flex",gap:8}}>
                <span style={{color:blue,fontWeight:700,minWidth:72,flexShrink:0}}>[{l.label}]</span>
                <span style={{color:l.ok?"#4fc3f7":"rgba(255,255,255,.55)"}}>{l.text}</span>
              </div>
            ))}
            {phase>0&&phase<4&&<div style={{display:"flex",gap:8}}>
              <span style={{color:blue,fontWeight:700,minWidth:72}}>[ ··· ]</span>
              <span style={{color:"rgba(255,255,255,.3)"}}>processing…</span>
            </div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,fontSize:11,color:"rgba(255,255,255,.35)"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:phase>=4?blue:phase>0?"#e040fb":"rgba(79,195,247,.2)",boxShadow:phase>0?`0 0 8px ${phase>=4?blue:"#e040fb"}`:"none",transition:"all .4s",flexShrink:0}}/>
            <span>{status}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{display:"flex",gap:0,marginTop:28,border:`1px solid rgba(79,195,247,.12)`,borderRadius:10,overflow:"hidden",position:"relative",zIndex:10}}>
        {[["$0.004","Per Component"],["2.1s","Verify Time"],["99.1%","AI Consensus"],["Polygon","Blockchain"]].map(([v,k],i,a)=>(
          <div key={k} style={{flex:1,textAlign:"center",padding:"14px clamp(8px,2vw,20px)",borderRight:i<a.length-1?`1px solid rgba(79,195,247,.1)`:"none"}}>
            <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:blue}}>{v}</div>
            <div style={{fontSize:8.5,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em",marginTop:4}}>{k}</div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap",justifyContent:"center",position:"relative",zIndex:10}}>
        <a href="/demo-video" style={{fontFamily:"monospace",fontSize:10,fontWeight:700,letterSpacing:".1em",textDecoration:"none",padding:"10px 20px",borderRadius:6,background:blue,color:"#000"}}>▶ Watch Demo</a>
        <a href="https://qron.space" target="_blank" rel="noreferrer" style={{fontFamily:"monospace",fontSize:10,fontWeight:700,letterSpacing:".1em",textDecoration:"none",padding:"10px 20px",borderRadius:6,border:`1.5px solid rgba(79,195,247,.3)`,color:blue}}>QRON Space ↗</a>
        <a href="https://authichain.com/verify?id=AC-1829577CED8F6BFBB0BC667CDE33DF0E" target="_blank" rel="noreferrer" style={{fontFamily:"monospace",fontSize:10,fontWeight:700,letterSpacing:".1em",textDecoration:"none",padding:"10px 20px",borderRadius:6,border:`1.5px solid rgba(79,195,247,.3)`,color:blue}}>Live Verify ↗</a>
      </div>

      <style>{`
        @keyframes scanAuto{0%{top:8%;opacity:1}100%{top:88%;opacity:0}}
        @keyframes popIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}60%{transform:translate(-50%,-50%) scale(1.1)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
        @keyframes lightningFade{0%,100%{opacity:0}30%,70%{opacity:1}}
      `}</style>
    </div>
  );
}
