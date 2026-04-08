"use client";
import { useEffect, useRef, useState } from "react";

const QR_CLEAN = "https://qron-images.undone-k.workers.dev/qr-clean.png";
const QR_ART   = "https://qron-images.undone-k.workers.dev/qr-art.png";

export default function QRONRevealPage() {
  const [imgError, setImgError] = useState<{clean:boolean;art:boolean}>({clean:false,art:false});
  const [phase, setPhase] = useState<"idle"|"scanning"|"transforming"|"authentic"|"done">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() { timerRef.current.forEach(clearTimeout); timerRef.current = []; }

  function reset() { clearTimers(); setPhase("idle"); }

  function run() {
    if (phase !== "idle" && phase !== "done") { reset(); return; }
    clearTimers();
    const T = (fn: () => void, ms: number) => { const id = setTimeout(fn, ms); timerRef.current.push(id); };
    setPhase("scanning");
    T(() => setPhase("transforming"), 2200);
    T(() => setPhase("authentic"), 4000);
    T(() => setPhase("done"), 6500);
    T(() => reset(), 7200);
  }

  useEffect(() => () => clearTimers(), []);

  const glow = phase === "authentic" || phase === "done";
  const showArt = phase === "transforming" || phase === "authentic" || phase === "done";
  const showBadge = phase === "authentic" || phase === "done";

  return (
    <div style={{ background: "#030a06", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace", padding: "32px 24px", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "40vw", background: `radial-gradient(ellipse,${glow ? "rgba(0,255,136,.18)" : "rgba(0,255,136,.06)"} 0%,transparent 70%)`, pointerEvents: "none", transition: "background 1.2s" }} />

      {/* Label */}
      <div style={{ fontSize: 9, letterSpacing: ".4em", color: "rgba(0,255,136,.4)", textTransform: "uppercase", marginBottom: 20 }}>
        AuthiChain · QRON Protocol · Blockchain Verified
      </div>

      {/* Stage */}
      <div onClick={run} style={{ position: "relative", width: "min(70vw,400px)", aspectRatio: "1", cursor: "pointer" }}>
        {/* Glow ring */}
        <div style={{ position: "absolute", inset: -20, borderRadius: "50%", boxShadow: glow ? "0 0 80px 24px rgba(0,255,136,.3)" : "none", transition: "box-shadow .8s", pointerEvents: "none", zIndex: 0 }} />

        {/* Clean QR */}
        <img src={QR_CLEAN} alt="AuthiChain QR" onError={()=>setImgError(p=>({...p,clean:true}))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 12, opacity: showArt ? 0 : 1, transition: phase === "transforming" ? "opacity .7s ease-in, filter .7s" : "opacity .2s", filter: phase === "transforming" ? "blur(6px) brightness(3) saturate(5)" : "none", zIndex: 2 }} />

        {/* QRON cannabis art */}
        <img src={QR_ART} alt="QRON Cannabis Art" onError={()=>setImgError(p=>({...p,art:true}))} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 16, opacity: showArt ? 1 : 0, transform: showArt ? "scale(1)" : "scale(1.06)", filter: showArt ? (phase === "transforming" ? "blur(3px) brightness(1.8) saturate(2)" : "none") : "blur(12px) brightness(3)", transition: "opacity 1.2s ease-out, transform 1.2s ease-out, filter 1.2s", zIndex: 3 }} />

        {/* Scan beam */}
        {phase === "scanning" && (
          <div style={{ position: "absolute", left: "8%", right: "8%", height: 2, background: "linear-gradient(90deg,transparent,#00ff88,transparent)", boxShadow: "0 0 12px 4px rgba(0,255,136,.4)", zIndex: 10, animation: "scan 2s ease-in-out 1 forwards", top: "8%" }} />
        )}

        {/* Corner brackets */}
        {(phase === "scanning" || phase === "transforming") && ["tl","tr","bl","br"].map(pos => (
          <div key={pos} style={{ position: "absolute", width: 28, height: 28, zIndex: 12,
            top: pos.startsWith("t") ? 8 : "auto", bottom: pos.startsWith("b") ? 8 : "auto",
            left: pos.endsWith("l") ? 8 : "auto", right: pos.endsWith("r") ? 8 : "auto",
            borderTop: pos.startsWith("t") ? "2.5px solid #00ff88" : "none",
            borderBottom: pos.startsWith("b") ? "2.5px solid #00ff88" : "none",
            borderLeft: pos.endsWith("l") ? "2.5px solid #00ff88" : "none",
            borderRight: pos.endsWith("r") ? "2.5px solid #00ff88" : "none",
            boxShadow: "0 0 8px rgba(0,255,136,.6)", animation: "fadeIn .3s ease both" }} />
        ))}

        {/* AUTHENTIC badge */}
        {showBadge && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,.85)", border: "2px solid #00ff88", borderRadius: 12, padding: "16px 24px", textAlign: "center", zIndex: 20, backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(0,255,136,.3)", animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize: 36, lineHeight: 1, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: "#00ff88", letterSpacing: ".12em" }}>AUTHENTIC</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginTop: 6, letterSpacing: ".06em" }}>STRAINCHAIN · POLYGON · SC-CA-2026-BD-9291</div>
          </div>
        )}

        {/* Hint */}
        <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".1em", whiteSpace: "nowrap" }}>
          {phase === "idle" || phase === "done" ? "▶ CLICK TO ACTIVATE" : phase === "scanning" ? "● SCANNING BLOCKCHAIN…" : phase === "transforming" ? "⚡ QRON TRANSFORMING…" : "✓ VERIFIED · STRAINCHAIN"}
        </div>
      </div>

      {/* Title */}
      <div style={{ marginTop: 48, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(20px,4vw,36px)", fontWeight: 900, color: "#00ff88", letterSpacing: ".08em", textShadow: "0 0 30px rgba(0,255,136,.35)", marginBottom: 8 }}>QRON × STRAINCHAIN</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase" }}>Cannabis Provenance · Blockchain Verified · 2.1 Seconds</div>
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", gap: 32, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {[["$0.004","Per Seal"],["2.1s","Verify"],["99.1%","Consensus"],["Polygon","Chain"]].map(([v,k]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#00ff88" }}>{v}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".08em", marginTop: 4 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {[["Watch Demo","/demo-video","#00ff88","#000"],["StrainChain ↗","https://strainchain.io","transparent","#00ff88"],["NFT Collection ↗","/collection","transparent","#c9a227"]].map(([label,href,bg,color]) => (
          <a key={label} href={href} style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textDecoration: "none", padding: "10px 20px", borderRadius: 6, background: bg, color, border: bg === "transparent" ? `1.5px solid ${color}40` : "none" }}>{label}</a>
        ))}
      </div>

      <style>{`
        @keyframes scan { 0% { top:8%; opacity:1; } 100% { top:88%; opacity:0; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes popIn { 0% { transform:translate(-50%,-50%) scale(.3); opacity:0; } 60% { transform:translate(-50%,-50%) scale(1.08); opacity:1; } 100% { transform:translate(-50%,-50%) scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}
