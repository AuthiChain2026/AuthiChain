"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const SCENES = [
  {
    id:"hook", duration:13, title:"The Problem",
    narration:"Counterfeiting costs the global economy over 500 billion dollars a year. Paper certificates and barcodes are trivially forged. There is no cryptographic way to verify a physical product is real — until now.",
    visual:"STAT",
  },
  {
    id:"solution", duration:16, title:"How AuthiChain Works",
    narration:"AuthiChain creates a blockchain certificate for every product batch. A manufacturer registers via API. An NFT is minted on the Polygon blockchain. An AI QR code is printed on the label. Any smartphone scans it — authentic or counterfeit in 2.1 seconds. No app. No hardware.",
    visual:"FLOW",
  },
  {
    id:"live", duration:20, title:"Live Blockchain Verification",
    url:"https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E",
    narration:"This is a real AuthiChain certificate on the live blockchain. Scan the QR code on any product label, and this page loads in 2.1 seconds. Green means authentic. The certificate ID, manufacturer, and timestamp are immutable on Polygon — no one can alter them.",
    visual:"IFRAME",
  },
  {
    id:"dpp", duration:13, title:"EU Digital Product Passport",
    url:"https://authichain.com/compliance",
    narration:"The EU Digital Product Passport mandate requires blockchain provenance for every product sold in Europe by 2026. That is 400 billion dollars in annual EU imports that will legally require this. AuthiChain delivers all seven requirements — live today.",
    visual:"IFRAME",
  },
  {
    id:"qron", duration:13, title:"QRON — AI QR Art",
    url:"https://qron.space/order",
    narration:"QRON is our AI QR art platform. Every AuthiChain certificate is delivered as a beautiful, scannable QR code — eleven styles, nine dollars per design. This is the product that makes blockchain authentication something brands actually want on their packaging.",
    visual:"IFRAME",
  },
  {
    id:"traction", duration:15, title:"Traction",
    narration:"Built solo in six months with zero dollars raised. Forty Cloudflare Workers, 99.9% uptime, over 1000 blockchain certificates issued. 47 million dollar pipeline — LVMH, Hermès, Moderna, BMW. DHS SVIP 800 thousand dollar grant application submitted. DoD APEX Accelerators enrolled.",
    visual:"METRICS",
  },
  {
    id:"close", duration:12, title:"The Ask",
    narration:"AuthiChain, QRON, and StrainChain — built by one founder, zero capital, six months. The EU DPP mandate creates forced adoption in 2026. We are built for this exact moment. We are applying to Y Combinator to move from pre-revenue to first enterprise contract.",
    visual:"CLOSE",
  },
];

const TOTAL = SCENES.reduce((s,x)=>s+x.duration,0);

function pad(n:number){return String(Math.floor(n)).padStart(2,"0")}
function fmt(s:number){return `${Math.floor(s/60)}:${pad(s%60)}`}

export default function DemoVideoPage(){
  const [scene,setScene]=useState(0);
  const [sElapsed,setSElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const [voiceName,setVoiceName]=useState("Loading…");
  const [voiceReady,setVoiceReady]=useState(false);
  const [muted,setMuted]=useState(false);
  const [caption,setCaption]=useState("");
  const [captionWord,setCaptionWord]=useState(-1);
  const [fade,setFade]=useState(true);
  const [counters,setCounters]=useState<number[]>([0,0,0,0,0,0]);

  const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
  const synthRef=useRef<SpeechSynthesis|null>(null);
  const voiceRef=useRef<SpeechSynthesisVoice|null>(null);
  const uttRef=useRef<SpeechSynthesisUtterance|null>(null);
  const prevSceneRef=useRef(-1);
  const captionWordsRef=useRef<string[]>([]);

  const sc=SCENES[scene];
  const totalElapsed=SCENES.slice(0,scene).reduce((s,x)=>s+x.duration,0)+sElapsed;
  const pct=Math.min(100,(totalElapsed/TOTAL)*100);

  // ── Voice init ────────────────────────────────────────────────────
  const pickVoice=useCallback(()=>{
    const synth=window.speechSynthesis;
    synthRef.current=synth;
    const voices=synth.getVoices();
    if(!voices.length)return;
    const preferred=["Google UK English Male","Microsoft David","Microsoft Guy","Microsoft Christopher","Daniel","Aaron","Alex","Fred"];
    let chosen:SpeechSynthesisVoice|null=null;
    for(const n of preferred){chosen=voices.find(v=>v.name.toLowerCase().includes(n.toLowerCase()))??null;if(chosen)break;}
    if(!chosen)chosen=voices.find(v=>v.lang.startsWith("en")&&/male|david|guy|aaron|alex|daniel|fred|chris/i.test(v.name))??null;
    if(!chosen)chosen=voices.find(v=>v.lang.startsWith("en"))??voices[0]??null;
    voiceRef.current=chosen;
    setVoiceName(chosen?.name??"Default");
    setVoiceReady(true);
  },[]);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    const synth=window.speechSynthesis;
    synthRef.current=synth;
    if(synth.getVoices().length){pickVoice();}
    else{synth.addEventListener("voiceschanged",pickVoice,{once:true});}
    return()=>{synth.cancel();synth.removeEventListener("voiceschanged",pickVoice);};
  },[pickVoice]);

  // ── Narrate with captions ─────────────────────────────────────────
  const narrate=useCallback((text:string)=>{
    const synth=synthRef.current;
    if(!synth||muted)return;
    synth.cancel();
    const words=text.split(/\s+/);
    captionWordsRef.current=words;
    setCaption(text);
    setCaptionWord(-1);

    const utt=new SpeechSynthesisUtterance(text);
    if(voiceRef.current)utt.voice=voiceRef.current;
    utt.rate=0.9; utt.pitch=0.82; utt.volume=1.0;

    // Word boundary → highlight current word
    utt.onboundary=(e:SpeechSynthesisEvent)=>{
      if(e.name==="word"){
        const spoken=text.slice(0,e.charIndex+e.charLength);
        const idx=spoken.trim().split(/\s+/).length-1;
        setCaptionWord(idx);
      }
    };
    utt.onend=()=>setCaptionWord(-1);
    uttRef.current=utt;
    synth.speak(utt);
  },[muted]);

  // ── Timer ─────────────────────────────────────────────────────────
  useEffect(()=>{
    if(running){
      timerRef.current=setInterval(()=>{
        setSElapsed(prev=>{
          const next=prev+1;
          if(next>=SCENES[scene].duration){
            setScene(s=>{
              if(s<SCENES.length-1){
                setFade(false);
                setTimeout(()=>setFade(true),120);
                setSElapsed(0);
                return s+1;
              }
              setRunning(false);return s;
            });
            return 0;
          }
          return next;
        });
      },1000);
    }else{if(timerRef.current)clearInterval(timerRef.current);}
    return()=>{if(timerRef.current)clearInterval(timerRef.current);};
  },[running,scene]);

  // ── Narrate on scene change ───────────────────────────────────────
  useEffect(()=>{
    if(running&&scene!==prevSceneRef.current){
      prevSceneRef.current=scene;
      setCaption("");setCaptionWord(-1);
      setTimeout(()=>narrate(SCENES[scene].narration),300);
    }
  },[scene,running,narrate]);

  // ── Counter animation for METRICS scene ──────────────────────────
  const TARGETS=[47,172,1023,0,40,6];
  useEffect(()=>{
    if(sc.visual==="METRICS"&&running){
      const start=Date.now();
      const dur=2200;
      const tick=()=>{
        const t=Math.min(1,(Date.now()-start)/dur);
        const ease=1-Math.pow(1-t,3);
        setCounters(TARGETS.map(v=>Math.round(v*ease)));
        if(t<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  },[sc.visual,running]);

  function start(){
    setScene(0);setSElapsed(0);prevSceneRef.current=-1;
    setFade(false);setTimeout(()=>setFade(true),80);
    setRunning(true);
    setTimeout(()=>narrate(SCENES[0].narration),300);
  }
  function pause(){setRunning(false);synthRef.current?.pause();}
  function resume(){
    setRunning(true);
    if(!synthRef.current?.speaking)narrate(sc.narration);
    else synthRef.current?.resume();
  }
  function reset(){setRunning(false);setScene(0);setSElapsed(0);prevSceneRef.current=-1;synthRef.current?.cancel();setCaption("");setCaptionWord(-1);}
  function jumpTo(i:number){
    setScene(i);setSElapsed(0);prevSceneRef.current=-1;
    setFade(false);setTimeout(()=>setFade(true),80);
    synthRef.current?.cancel();setCaption("");setCaptionWord(-1);setRunning(false);
  }
  function toggleMute(){setMuted(m=>{if(!m)synthRef.current?.cancel();return !m;});}

  // ── Caption render ────────────────────────────────────────────────
  function Caption(){
    const words=captionWordsRef.current;
    if(!words.length||!caption)return null;
    return(
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 20px 14px",background:"linear-gradient(transparent,rgba(0,0,0,.85))",textAlign:"center",pointerEvents:"none"}}>
        <div style={{fontSize:15,lineHeight:1.7,fontWeight:500,letterSpacing:".01em",textShadow:"0 1px 4px rgba(0,0,0,.8)"}}>
          {words.map((w,i)=>(
            <span key={i} style={{
              color:i===captionWord?"#c9a227":"rgba(255,255,255,.85)",
              fontWeight:i===captionWord?700:400,
              transition:"color .12s, font-weight .12s",
              marginRight:"0.28em",
              display:"inline-block",
            }}>{w}</span>
          ))}
        </div>
      </div>
    );
  }

  // ── Scene visuals ─────────────────────────────────────────────────
  function StatVisual(){
    const [n,setN]=useState(0);
    useEffect(()=>{
      const dur=1800,start=Date.now();
      const tick=()=>{const t=Math.min(1,(Date.now()-start)/dur);setN(Math.round(500*t));if(t<1)requestAnimationFrame(tick);};
      if(running)requestAnimationFrame(tick);
      else setN(500);
    },[]);
    return(
      <div style={{textAlign:"center",width:"100%"}}>
        <div style={{fontSize:"clamp(64px,11vw,108px)",fontWeight:900,color:"#c9a227",lineHeight:1,fontVariantNumeric:"tabular-nums",letterSpacing:"-.02em",textShadow:"0 0 60px rgba(201,162,39,.3)"}}>
          ${n}B+
        </div>
        <div style={{fontSize:18,color:"rgba(255,255,255,.55)",marginTop:14,letterSpacing:".04em",textTransform:"uppercase",fontSize:13}}>counterfeit goods cross borders annually</div>
        <div style={{display:"flex",gap:32,justifyContent:"center",marginTop:52,flexWrap:"wrap"}}>
          {[["Paper certs","forged in minutes"],["Barcodes","trivially cloned"],["RFID","$0.50+ per tag"]].map(([t,s],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:10,padding:"14px 22px",textAlign:"center",minWidth:130}}>
              <div style={{fontSize:13,fontWeight:600,color:"#e06060",marginBottom:5}}>{t}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function FlowVisual(){
    const steps=[
      {icon:"⚙",label:"API register",sub:"REST call"},
      {icon:"◆",label:"NFT minted",sub:"Polygon ERC-721"},
      {icon:"⬡",label:"QR on label",sub:"AI-generated"},
      {icon:"📱",label:"Smartphone scan",sub:"any camera"},
      {icon:"✓",label:"AUTHENTIC",sub:"2.1 seconds"},
    ];
    return(
      <div style={{width:"100%",maxWidth:680,display:"flex",flexDirection:"column",gap:36}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:0}}>
          {steps.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              <div style={{
                background:i===steps.length-1?"rgba(34,197,94,.12)":"rgba(201,162,39,.08)",
                border:`1.5px solid ${i===steps.length-1?"#22c55e":"rgba(201,162,39,.4)"}`,
                borderRadius:10,padding:"12px 16px",textAlign:"center",minWidth:108,
                boxShadow:i===steps.length-1?"0 0 20px rgba(34,197,94,.15)":"none",
              }}>
                <div style={{fontSize:20,marginBottom:5}}>{s.icon}</div>
                <div style={{fontSize:11,fontWeight:700,color:i===steps.length-1?"#22c55e":"#c9a227",textTransform:"uppercase",letterSpacing:".06em"}}>{s.label}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)",marginTop:2}}>{s.sub}</div>
              </div>
              {i<steps.length-1&&<div style={{color:"rgba(201,162,39,.4)",padding:"0 8px",fontSize:20,flexShrink:0}}>→</div>}
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
          {[["$0.004","per seal","vs $0.50+ RFID"],["2.1s","verify time","any smartphone"],["Zero","hardware","camera only"]].map(([v,l,s],i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"18px 12px",textAlign:"center"}}>
              <div style={{fontSize:30,fontWeight:900,color:"#e5e5e5",lineHeight:1}}>{v}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#888",marginTop:6,textTransform:"uppercase",letterSpacing:".06em"}}>{l}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.2)",marginTop:3}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function MetricsVisual(){
    const items=[
      {val:counters[0]+"M",label:"ACV Pipeline",suffix:"$"},
      {val:counters[1]+"",label:"Enterprise Deals"},
      {val:counters[2].toLocaleString(),label:"Certs Issued"},
      {val:"$"+counters[3],label:"Capital Raised"},
      {val:counters[4]+"+",label:"CF Workers"},
      {val:counters[5]+" mo",label:"Solo Build"},
    ];
    return(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,width:"100%",maxWidth:600}}>
        {items.map((m,i)=>(
          <div key={i} style={{background:"rgba(201,162,39,.07)",border:"1px solid rgba(201,162,39,.18)",borderRadius:12,padding:"20px 12px",textAlign:"center",transition:"transform .2s"}}>
            <div style={{fontSize:"clamp(24px,4vw,32px)",fontWeight:900,color:"#c9a227",lineHeight:1,fontVariantNumeric:"tabular-nums"}}>
              {i===3?"$0":m.val}
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:8,textTransform:"uppercase",letterSpacing:".07em"}}>{m.label}</div>
          </div>
        ))}
      </div>
    );
  }

  function CloseVisual(){
    return(
      <div style={{textAlign:"center",width:"100%"}}>
        <div style={{fontSize:"clamp(40px,8vw,70px)",fontWeight:900,color:"#c9a227",letterSpacing:".05em",marginBottom:18,textShadow:"0 0 80px rgba(201,162,39,.4)"}}>
          AUTHICHAIN
        </div>
        <div style={{color:"rgba(255,255,255,.4)",fontSize:15,marginBottom:48,letterSpacing:".04em"}}>Blockchain provenance for every physical good.</div>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          {["authichain.com","qron.space","strainchain.io"].map(d=>(
            <div key={d} style={{background:"rgba(201,162,39,.07)",border:"1px solid rgba(201,162,39,.25)",borderRadius:10,padding:"12px 22px",color:"#c9a227",fontSize:14,letterSpacing:".03em"}}>{d}</div>
          ))}
        </div>
      </div>
    );
  }

  const scenePct=sc.duration>0?(sElapsed/sc.duration)*100:0;

  return(
    <div style={{background:"#080808",minHeight:"100vh",color:"#e5e5e5",fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      {/* Ambient glow */}
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:600,height:200,background:"radial-gradient(ellipse,rgba(201,162,39,.08) 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div style={{position:"relative",zIndex:10,padding:"10px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:"0.5px solid rgba(255,255,255,.07)",background:"rgba(8,8,8,.95)",backdropFilter:"blur(10px)",flexWrap:"wrap"}}>
        <a href="/" style={{color:"#c9a227",fontWeight:900,fontSize:"1rem",letterSpacing:".12em",textDecoration:"none",flexShrink:0,textShadow:"0 0 20px rgba(201,162,39,.4)"}}>◆ AUTHICHAIN</a>

        {/* Master progress */}
        <div style={{flex:1,minWidth:120,position:"relative",height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,height:"100%",width:`${pct}%`,background:"linear-gradient(90deg,#c9a227,#e8c547)",borderRadius:2,transition:"width .9s linear",boxShadow:"0 0 8px rgba(201,162,39,.5)"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,.3)",flexShrink:0}}>{fmt(Math.round(totalElapsed))} / {fmt(TOTAL)}</div>

        <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
          {!running
            ?<button onClick={scene===0&&sElapsed===0?start:resume} disabled={!voiceReady}
                style={{background:"#c9a227",color:"#000",border:"none",borderRadius:8,padding:"8px 20px",fontWeight:700,cursor:voiceReady?"pointer":"not-allowed",fontSize:13,opacity:voiceReady?1:.5,letterSpacing:".03em",boxShadow:"0 0 16px rgba(201,162,39,.3)"}}>
                {scene===0&&sElapsed===0?"▶  Start":"▶  Resume"}
              </button>
            :<button onClick={pause} style={{background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.7)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:13}}>⏸  Pause</button>
          }
          <button onClick={toggleMute} style={{background:"transparent",color:muted?"#c9a227":"rgba(255,255,255,.3)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:14}} title={muted?"Unmute":"Mute"}>
            {muted?"🔇":"🔊"}
          </button>
          <button onClick={reset} style={{background:"transparent",color:"rgba(255,255,255,.25)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px",cursor:"pointer",fontSize:13}}>↺</button>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,.2)",flexShrink:0,letterSpacing:".04em"}}>🎙 {voiceName}</div>
      </div>

      {/* ── SCENE TABS ──────────────────────────────────────── */}
      <div style={{position:"relative",zIndex:10,display:"flex",padding:"0 20px",borderBottom:"0.5px solid rgba(255,255,255,.06)",background:"rgba(8,8,8,.9)",overflowX:"auto"}}>
        {SCENES.map((s,i)=>(
          <button key={i} onClick={()=>jumpTo(i)}
            style={{padding:"9px 14px",background:"transparent",border:"none",
              borderBottom:i===scene?"1.5px solid #c9a227":"1.5px solid transparent",
              color:i===scene?"#c9a227":i<scene?"rgba(34,197,94,.7)":"rgba(255,255,255,.25)",
              cursor:"pointer",fontSize:11.5,whiteSpace:"nowrap",fontWeight:i===scene?700:400,
              letterSpacing:i===scene?".04em":"0",transition:"color .15s"
            }}>
            {i<scene?"✓ ":""}{i+1}. {s.title}
          </button>
        ))}
        {/* Scene sub-progress */}
        <div style={{position:"absolute",bottom:0,left:0,height:"1.5px",width:`${(scene/SCENES.length+scenePct/100/SCENES.length)*100}%`,background:"rgba(201,162,39,.25)",transition:"width 1s linear"}}/>
      </div>

      {/* ── MAIN SPLIT ──────────────────────────────────────── */}
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 340px",minHeight:0}}>

        {/* Visual panel */}
        <div style={{position:"relative",background:sc.visual==="IFRAME"?"#0d1117":"#080808",display:"flex",alignItems:"center",justifyContent:"center",padding:sc.visual==="IFRAME"?0:28,overflow:"hidden",transition:"background .4s"}}>

          {/* Animated noise texture overlay */}
          <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")",pointerEvents:"none"}}/>

          {/* Scene content with fade */}
          <div style={{opacity:fade?1:0,transition:"opacity .25s ease",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:sc.visual==="IFRAME"?0:0}}>
            {sc.visual==="IFRAME"&&sc.url&&(
              <iframe src={sc.url} style={{width:"100%",height:"100%",minHeight:420,border:"none"}} title={sc.title}/>
            )}
            {sc.visual==="STAT"&&<StatVisual/>}
            {sc.visual==="FLOW"&&<FlowVisual/>}
            {sc.visual==="METRICS"&&<MetricsVisual/>}
            {sc.visual==="CLOSE"&&<CloseVisual/>}
          </div>

          {/* Caption bar */}
          <Caption/>

          {/* Scene countdown ring */}
          <div style={{position:"absolute",top:14,right:14,zIndex:5}}>
            <svg width="44" height="44" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="2.5"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="#c9a227" strokeWidth="2.5"
                strokeDasharray={`${2*Math.PI*18}`}
                strokeDashoffset={`${2*Math.PI*18*(1-scenePct/100)}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{transition:"stroke-dashoffset 1s linear",filter:"drop-shadow(0 0 4px rgba(201,162,39,.5))"}}
              />
              <text x="22" y="27" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="11" fontFamily="monospace">{Math.max(0,sc.duration-sElapsed)}</text>
            </svg>
          </div>
        </div>

        {/* Script panel */}
        <div style={{background:"rgba(12,12,12,.98)",borderLeft:"0.5px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column",position:"relative",zIndex:10}}>
          {/* Scene header */}
          <div style={{padding:"14px 18px",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.2)",marginBottom:5}}>
              Scene {scene+1} of {SCENES.length} · {sc.duration}s
            </div>
            <div style={{fontWeight:600,color:"#e5e5e5",fontSize:14,letterSpacing:".01em"}}>{sc.title}</div>
            {/* Scene dots */}
            <div style={{display:"flex",gap:5,marginTop:10}}>
              {SCENES.map((_,i)=>(
                <div key={i} onClick={()=>jumpTo(i)} style={{height:3,flex:1,borderRadius:2,background:i<scene?"#3B6D11":i===scene?"#c9a227":"rgba(255,255,255,.08)",cursor:"pointer",transition:"background .3s"}}/>
              ))}
            </div>
          </div>

          {/* Narration with live word highlight */}
          <div style={{flex:1,padding:"16px 18px",overflowY:"auto"}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,.2)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Narration</div>
            <div style={{fontSize:13.5,lineHeight:1.9,background:"rgba(201,162,39,.04)",border:"1px solid rgba(201,162,39,.08)",borderRadius:8,padding:"14px 16px"}}>
              {captionWordsRef.current.length>0&&caption
                ? captionWordsRef.current.map((w,i)=>(
                    <span key={i} style={{
                      color:i===captionWord?"#c9a227":i<captionWord?"rgba(255,255,255,.4)":"rgba(255,255,255,.75)",
                      fontWeight:i===captionWord?700:400,
                      transition:"color .1s",
                      marginRight:"0.3em",
                    }}>{w}</span>
                  ))
                : <span style={{color:"rgba(255,255,255,.55)"}}>{sc.narration}</span>
              }
            </div>
            {sc.url&&(
              <div style={{marginTop:14,padding:"10px 12px",background:"rgba(55,138,221,.05)",border:"1px solid rgba(55,138,221,.12)",borderRadius:8}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.25)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>Live URL</div>
                <a href={sc.url} target="_blank" rel="noreferrer" style={{color:"#378ADD",fontSize:11,fontFamily:"monospace",wordBreak:"break-all",opacity:.8}}>{sc.url}</a>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={{padding:"12px 18px",borderTop:"0.5px solid rgba(255,255,255,.06)",display:"flex",gap:8}}>
            <button onClick={()=>jumpTo(Math.max(0,scene-1))} disabled={scene===0}
              style={{flex:1,padding:"8px",background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:8,color:scene===0?"rgba(255,255,255,.15)":"rgba(255,255,255,.5)",cursor:scene===0?"default":"pointer",fontSize:12}}>
              ← Prev
            </button>
            <button onClick={()=>jumpTo(Math.min(SCENES.length-1,scene+1))} disabled={scene===SCENES.length-1}
              style={{flex:1,padding:"8px",background:"#c9a227",border:"none",borderRadius:8,color:"#000",cursor:scene===SCENES.length-1?"default":"pointer",fontWeight:700,fontSize:12,opacity:scene===SCENES.length-1?.4:1}}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER BAR ──────────────────────────────────────── */}
      <div style={{position:"relative",zIndex:10,padding:"8px 20px",background:"rgba(8,8,8,.95)",borderTop:"0.5px solid rgba(255,255,255,.05)",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>
          Open Loom → Screen + Camera → hit <strong style={{color:"rgba(255,255,255,.4)"}}>▶ Start</strong> → voice narrates automatically
        </div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.15)"}}>Runtime: {fmt(TOTAL)}</div>
        <a href="https://chrome.google.com/webstore/detail/loom/liecbddmkiiihnedobmlmillhodjkdmb" target="_blank" rel="noreferrer"
          style={{fontSize:11,color:"rgba(201,162,39,.5)",marginLeft:"auto",textDecoration:"none"}}>Get Loom ↗</a>
      </div>
    </div>
  );
}
