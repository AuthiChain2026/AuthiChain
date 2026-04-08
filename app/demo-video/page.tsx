
"use client";
import { useState, useEffect, useRef } from "react";

const SCENES = [
  {
    id: "hook",
    duration: 12,
    title: "The Problem",
    url: null,
    script: "Counterfeiting costs the global economy over half a trillion dollars a year. Paper certificates and barcodes are trivially forged. There is no cryptographic way to verify a physical product is real — until now.",
    bg: "#0a0a0a",
    visual: "STAT",
    stat: "$500B+",
    statLabel: "counterfeit goods annually",
  },
  {
    id: "solution",
    duration: 14,
    title: "AuthiChain — What It Does",
    url: null,
    script: "AuthiChain creates a blockchain certificate for every product batch. Manufacturer registers via API → ERC-721 NFT minted on Polygon → AI QR code printed on the label → any smartphone scans → AUTHENTIC or COUNTERFEIT in 2.1 seconds. No app. No hardware.",
    bg: "#0a0a0a",
    visual: "FLOW",
  },
  {
    id: "live-cert",
    duration: 18,
    title: "Live Demo — Blockchain Verification",
    url: "https://authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E",
    script: "This is a real AuthiChain certificate on the live blockchain. Scan the QR on any product label — this page loads in 2.1 seconds. Green means authentic. The certificate ID, manufacturer, and timestamp are immutable on Polygon.",
    bg: "#0d1117",
    visual: "IFRAME",
  },
  {
    id: "eu-dpp",
    duration: 12,
    title: "EU Digital Product Passport — 2026 Mandate",
    url: "https://authichain.com/compliance",
    script: "The EU's ESPR regulation mandates blockchain provenance for every product sold in Europe by 2026. Four hundred billion dollars in annual EU imports will need this. AuthiChain delivers all seven requirements — live today.",
    bg: "#0d1117",
    visual: "IFRAME",
  },
  {
    id: "qron",
    duration: 12,
    title: "QRON — The Delivery Vehicle",
    url: "https://qron.space/order",
    script: "QRON is our AI QR art platform. Every AuthiChain certificate is delivered as a beautiful, scannable QR code — eleven styles, nine dollars. This is the product that makes blockchain authentication something people actually want on their packaging.",
    bg: "#0d1117",
    visual: "IFRAME",
  },
  {
    id: "traction",
    duration: 14,
    title: "Traction",
    url: null,
    script: "Built solo in six months, zero dollars raised. Forty Cloudflare Workers, ninety-nine-point-nine percent uptime, over a thousand blockchain certificates issued. Forty-seven million dollar pipeline — LVMH, Hermès, Moderna, BMW. DHS SVIP grant application submitted. DoD APEX Accelerators enrolled.",
    bg: "#0a0a0a",
    visual: "METRICS",
  },
  {
    id: "ask",
    duration: 10,
    title: "The Ask",
    url: null,
    script: "I'm Zac — I built AuthiChain, QRON, and StrainChain alone. The EU DPP mandate creates a forced adoption event in 2026. We're built for this exact moment. We're applying to YC to move from pre-revenue to first enterprise contract.",
    bg: "#0a0a0a",
    visual: "CLOSE",
  },
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function FlowVisual() {
  const steps = ["API register", "NFT minted", "QR on label", "Smartphone scan", "AUTHENTIC ✓"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "0 12px", flexWrap: "wrap", rowGap: 12 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            background: i === steps.length - 1 ? "rgba(34,197,94,.15)" : "rgba(201,162,39,.1)",
            border: `1px solid ${i === steps.length - 1 ? "#22c55e" : "#c9a227"}`,
            borderRadius: 8, padding: "8px 14px",
            color: i === steps.length - 1 ? "#22c55e" : "#c9a227",
            fontSize: 13, fontWeight: 600, whiteSpace: "nowrap"
          }}>{s}</div>
          {i < steps.length - 1 && <div style={{ color: "#555", margin: "0 6px", fontSize: 16 }}>→</div>}
        </div>
      ))}
    </div>
  );
}

function MetricsVisual() {
  const metrics = [
    { v: "40+", l: "CF Workers" }, { v: "1,023", l: "Certs issued" },
    { v: "172", l: "HubSpot deals" }, { v: "$47M", l: "ACV pipeline" },
    { v: "$0", l: "Capital raised" }, { v: "6 mo", l: "Time to build" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, padding: "0 12px" }}>
      {metrics.map((m, i) => (
        <div key={i} style={{ background: "rgba(201,162,39,.08)", border: "1px solid rgba(201,162,39,.2)", borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#c9a227" }}>{m.v}</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>{m.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function DemoVideoPage() {
  const [scene, setScene] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [sceneElapsed, setSceneElapsed] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sc = SCENES[scene];
  const totalElapsed = SCENES.slice(0, scene).reduce((s, x) => s + x.duration, 0) + sceneElapsed;
  const pct = (totalElapsed / TOTAL) * 100;

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSceneElapsed((prev) => {
          const next = prev + 1;
          if (next >= sc.duration) {
            setScene((s) => {
              if (s < SCENES.length - 1) { setSceneElapsed(0); return s + 1; }
              setRunning(false); return s;
            });
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, scene, sc.duration]);

  function start() { setScene(0); setSceneElapsed(0); setRunning(true); }
  function reset() { setRunning(false); setScene(0); setSceneElapsed(0); }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
        <a href="/" style={{ color: "#c9a227", fontWeight: 900, fontSize: "1rem", letterSpacing: ".1em", textDecoration: "none" }}>◆ AUTHICHAIN</a>
        <div style={{ flex: 1, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: 4, width: `${pct}%`, background: "#c9a227", borderRadius: 2, transition: "width .5s" }} />
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: "#555" }}>{formatTime(Math.round(totalElapsed))} / {formatTime(TOTAL)}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {!running
            ? <button onClick={start} style={{ background: "#c9a227", color: "#000", border: "none", borderRadius: 8, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                {scene === 0 && sceneElapsed === 0 ? "▶ Start" : "▶ Resume"}
              </button>
            : <button onClick={() => setRunning(false)} style={{ background: "#222", color: "#aaa", border: "1px solid #333", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>⏸ Pause</button>
          }
          <button onClick={reset} style={{ background: "transparent", color: "#555", border: "1px solid #222", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontSize: 13 }}>↺</button>
        </div>
      </div>

      {/* Scene tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #1a1a1a", overflowX: "auto" }}>
        {SCENES.map((s, i) => (
          <button key={i} onClick={() => { setScene(i); setSceneElapsed(0); setRunning(false); }}
            style={{ padding: "10px 14px", background: "transparent", border: "none", borderBottom: i === scene ? "2px solid #c9a227" : "2px solid transparent",
              color: i === scene ? "#c9a227" : i < scene ? "#3B6D11" : "#555",
              cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", fontWeight: i === scene ? 600 : 400 }}>
            {i < scene ? "✓ " : ""}{i + 1}. {s.title}
          </button>
        ))}
      </div>

      {/* Main content — split layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 380px", gap: 0, overflow: "hidden" }}>

        {/* Left — visual/iframe */}
        <div style={{ background: sc.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, minHeight: 400, position: "relative", overflow: "hidden" }}>

          {sc.visual === "IFRAME" && sc.url && (
            <iframe ref={iframeRef} src={sc.url} style={{ width: "100%", height: "100%", border: "none", borderRadius: 8, minHeight: 400 }} title={sc.title} />
          )}

          {sc.visual === "STAT" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(48px,8vw,80px)", fontWeight: 900, color: "#c9a227", lineHeight: 1 }}>{sc.stat}</div>
              <div style={{ fontSize: 16, color: "#888", marginTop: 12 }}>{sc.statLabel}</div>
              <div style={{ marginTop: 40, color: "#444", fontSize: 13 }}>counterfeit goods cross borders every year</div>
            </div>
          )}

          {sc.visual === "FLOW" && (
            <div style={{ width: "100%", maxWidth: 700 }}>
              <div style={{ textAlign: "center", marginBottom: 32, color: "#c9a227", fontSize: 18, fontWeight: 700 }}>Proof-of-Origin in 6 steps</div>
              <FlowVisual />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 40, textAlign: "center" }}>
                {[["$0.004", "per seal (vs $0.50+ RFID)"], ["2.1s", "verification time"], ["No app", "smartphone camera only"]].map(([v, l], i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "16px 10px" }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#e5e5e5" }}>{v}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sc.visual === "METRICS" && <div style={{ width: "100%", maxWidth: 600 }}><MetricsVisual /></div>}

          {sc.visual === "CLOSE" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#c9a227", letterSpacing: ".05em", marginBottom: 16 }}>AUTHICHAIN</div>
              <div style={{ color: "#666", fontSize: 15, marginBottom: 32 }}>Blockchain provenance for every physical good.</div>
              <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                {["authichain.com", "qron.space", "strainchain.io"].map(d => (
                  <div key={d} style={{ background: "rgba(201,162,39,.08)", border: "1px solid rgba(201,162,39,.2)", borderRadius: 8, padding: "10px 20px", color: "#c9a227", fontSize: 14 }}>{d}</div>
                ))}
              </div>
            </div>
          )}

          {/* Scene timer badge */}
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,.7)", border: "1px solid #333", borderRadius: 6, padding: "4px 10px", fontFamily: "monospace", fontSize: 12, color: "#555" }}>
            {sc.duration - sceneElapsed}s
          </div>
        </div>

        {/* Right — teleprompter */}
        <div style={{ background: "#0d0d0d", borderLeft: "1px solid #1a1a1a", display: "flex", flexDirection: "column", padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "#444", marginBottom: 6 }}>Scene {scene + 1} of {SCENES.length}</div>
            <div style={{ fontWeight: 700, color: "#e5e5e5", fontSize: 15 }}>{sc.title}</div>
          </div>
          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <div style={{ fontSize: 15.5, lineHeight: 1.85, color: "#d0d0d0" }}>{sc.script}</div>
            {sc.url && (
              <div style={{ marginTop: 20, padding: "10px 14px", background: "rgba(201,162,39,.06)", border: "1px solid rgba(201,162,39,.15)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 4 }}>Showing URL</div>
                <a href={sc.url} target="_blank" rel="noreferrer" style={{ color: "#c9a227", fontSize: 12, fontFamily: "monospace", wordBreak: "break-all" }}>{sc.url}</a>
              </div>
            )}
          </div>
          <div style={{ padding: "14px 20px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
            <button onClick={() => { setScene(Math.max(0, scene - 1)); setSceneElapsed(0); }}
              disabled={scene === 0} style={{ flex: 1, padding: "9px", background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#777", cursor: "pointer", fontSize: 13 }}>← Prev</button>
            <button onClick={() => { setScene(Math.min(SCENES.length - 1, scene + 1)); setSceneElapsed(0); }}
              disabled={scene === SCENES.length - 1} style={{ flex: 1, padding: "9px", background: "#c9a227", border: "none", borderRadius: 8, color: "#000", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Bottom instructions */}
      <div style={{ padding: "10px 20px", background: "#0d0d0d", borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ fontSize: 12, color: "#444" }}>
          🎬 <strong style={{ color: "#666" }}>To record:</strong> Open Loom extension → Screen + Camera → hit ▶ Start → talk through the script → Stop
        </div>
        <div style={{ fontSize: 12, color: "#444" }}>Total runtime: <strong style={{ color: "#666" }}>{formatTime(TOTAL)} ({TOTAL}s)</strong></div>
        <a href="https://loom.com/download" target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#c9a227", marginLeft: "auto" }}>Get Loom extension ↗</a>
      </div>
    </div>
  );
}
