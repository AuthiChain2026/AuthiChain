"use client";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── SCENES ── durations match narration length + 5s buffer ─────── */
const SCENES = [
  {
    id: "problem",
    duration: 16,
    bg: "#080808",
    accent: "#ef4444",
    visual: "QR_BACKDROP",
    headline: "$500 Billion",
    sub: "in counterfeit goods every year",
    body: `Paper certificates are forged in minutes.
Barcodes are trivially cloned.
No one can prove what's real.`,
    narration: "Five hundred billion dollars in counterfeit goods — every year. Paper certificates forged in minutes. Barcodes cloned in seconds. There is no way to prove what's real. Until now.",
  },
  {
    id: "product",
    duration: 16,
    bg: "#0a1a0a",
    accent: "#22c55e",
    visual: "PRODUCT",
    headline: "Blue Dream",
    sub: "Emerald Peak Farms · Humboldt County, California",
    body: `Planted February 3rd.
Harvested March 15th.
THC 22.4% · CBD 0.8%`,
    narration: "This is Blue Dream. Emerald Peak Farms, Humboldt County, California. Harvested March 15th. THC twenty-two point four percent. This batch is real — and from this moment, the blockchain knows it.",
  },
  {
    id: "certificate",
    duration: 14,
    bg: "#0d1117",
    accent: "#c9a227",
    visual: "VERIFY",
    headline: "Minted on the blockchain",
    sub: "The moment it's harvested",
    body: `ERC-721 NFT · Polygon · $0.004
COA hash · METRC · Seed-to-sale chain
Immutable. Permanent. Unforgeable.`,
    narration: "The moment it's harvested, StrainChain mints a blockchain certificate. Every lab result, every transfer — hashed, signed, locked to Polygon forever. Permanent. Unforgeable. No one can alter it.",
  },
  {
    id: "scan",
    duration: 14,
    bg: "#0a0a0a",
    accent: "#84cc16",
    visual: "QR_TRANSFORM",
    headline: "2.1 seconds",
    sub: "Any smartphone. No app.",
    body: `Consumer scans the QR code.
Blockchain confirms: AUTHENTIC.
Instant. Certain. Free.`,
    narration: "Consumer picks up the package. Scans the QR code. Two seconds. Blockchain confirmed — authentic. No app. No reader. Just a phone camera and the truth.",
  },
  {
    id: "art",
    duration: 17,
    bg: "#0f0a1a",
    accent: "#ec4899",
    visual: "ART",
    headline: "The packaging is art",
    sub: "Verde Studio × Emerald Peak Farms",
    body: `ArtGuard score: 87/100
Edition: #23 of 50
Collectable — long after the product is gone`,
    narration: "Verde Studio designed the packaging. ArtGuard scored it eighty-seven. Edition twenty-three of fifty. The flower is gone — but the art lives on as an NFT. A collectible. A new asset class born from a plant.",
  },
  {
    id: "network",
    duration: 14,
    bg: "#080808",
    accent: "#38bdf8",
    visual: "NETWORK",
    headline: "Every scan matters",
    sub: "The Truth Network grows with every product",
    body: `Consumer votes: AUTHENTIC
Truth Network records the scan
The Authentic Economy self-enforces`,
    narration: "Every scan casts a vote. The Truth Network records it. Objects have authenticity. AI agents enforce it. The Authentic Economy — self-enforcing, growing stronger with every proof.",
  },
  {
    id: "close",
    duration: 13,
    bg: "#070707",
    accent: "#c9a227",
    visual: "CLOSE",
    headline: "The Authentic Economy",
    sub: "Three platforms. One protocol. One truth layer.",
    body: `StrainChain · AuthiChain · QRON
Built solo · Zero capital · Six months
Applying to Y Combinator S26`,
    narration: "StrainChain. AuthiChain. QRON. Three platforms, one founder, six months, zero dollars raised. The truth layer for the physical world. Y Combinator — we're ready.",
  },
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* ─── VOICE HOOK ─────────────────────────────────────────────────── */
// Voice quality tiers — scored so the best clear male voice always wins
const VOICE_SCORES: Record<string, number> = {
  // Tier 1: Microsoft Natural Neural (best quality, Edge/Windows)
  "Microsoft Guy Online (Natural) - English (United States)": 100,
  "Microsoft Christopher Online (Natural) - English (United States)": 99,
  "Microsoft Andrew Online (Natural) - English (United States)": 98,
  "Microsoft Ryan Online (Natural) - English (United Kingdom)": 97,
  "Microsoft Eric Online (Natural) - English (United States)": 96,
  "Microsoft Roger Online (Natural) - English (United States)": 95,
  "Microsoft Steffan Online (Natural) - English (United Kingdom)": 94,
  // Tier 2: Google (Chrome, clear male)
  "Google UK English Male": 80,
  "Google US English": 75,
  // Tier 3: macOS system voices (clear, consistent)
  "Daniel": 65,
  "Aaron": 60,
  "Alex": 55,
  // Tier 4: Microsoft offline (decent)
  "Microsoft David Desktop": 40,
  "Microsoft David": 35,
  // Tier 5: any other male-sounding English
};

function scoreVoice(v: SpeechSynthesisVoice): number {
  if (VOICE_SCORES[v.name]) return VOICE_SCORES[v.name];
  if (!v.lang.startsWith("en")) return -50;
  if (/natural|neural/i.test(v.name)) return 50;
  if (/male|guy|man|david|chris|james|oliver|aaron|daniel|alex|andrew|ryan|eric|roger/i.test(v.name)) return 20;
  return 0;
}

function useVoice(muted: boolean, onSpeechEnd: () => void) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const [voiceName, setVoiceName] = useState("Loading…");
  const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [ready, setReady] = useState(false);
  const [caption, setCaption] = useState<string[]>([]);
  const [wordIdx, setWordIdx] = useState(-1);
  const onEndRef = useRef(onSpeechEnd);
  useEffect(() => { onEndRef.current = onSpeechEnd; }, [onSpeechEnd]);

  const loadVoices = useCallback(() => {
    const s = window.speechSynthesis;
    synthRef.current = s;
    const vs = s.getVoices();
    if (!vs.length) return;
    // Sort all English voices by score descending
    const engVoices = vs.filter(v => v.lang.startsWith("en")).sort((a, b) => scoreVoice(b) - scoreVoice(a));
    setAllVoices(engVoices);
    // Auto-pick highest scoring
    const best = engVoices[0] ?? vs[0];
    voiceRef.current = best;
    setVoiceName(best?.name ?? "Default");
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = window.speechSynthesis;
    synthRef.current = s;
    if (s.getVoices().length) loadVoices();
    else s.addEventListener("voiceschanged", loadVoices, { once: true });
    return () => { s.cancel(); s.removeEventListener("voiceschanged", loadVoices); };
  }, [loadVoices]);

  const selectVoice = useCallback((name: string) => {
    const v = allVoices.find(v => v.name === name) ?? null;
    if (v) { voiceRef.current = v; setVoiceName(v.name); }
  }, [allVoices]);

  const testVoice = useCallback(() => {
    const s = synthRef.current;
    if (!s || !voiceRef.current) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance("AuthiChain. The truth layer for the physical world.");
    u.voice = voiceRef.current;
    u.rate = 0.92;
    u.pitch = 1.0;
    u.volume = 1;
    s.speak(u);
  }, []);

  const speak = useCallback((text: string) => {
    const s = synthRef.current;
    if (!s) return;
    s.cancel();
    if (muted) { onEndRef.current(); return; }
    const words = text.split(/\s+/);
    setCaption(words);
    setWordIdx(-1);
    const u = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) u.voice = voiceRef.current;
    // Natural male delivery: 0.92 pace, pitch at 1.0 (natural — no robotic lowering)
    u.rate   = 0.92;
    u.pitch  = 1.0;
    u.volume = 1;

    // Track when speech actually starts (guards against Chrome's immediate-onend bug)
    let speechStarted = false;
    let startTime = 0;
    u.onstart = () => { speechStarted = true; startTime = Date.now(); };

    u.onboundary = (e: SpeechSynthesisEvent) => {
      if (e.name === "word") {
        const spoken = text.slice(0, e.charIndex + e.charLength);
        setWordIdx(spoken.trim().split(/\s+/).length - 1);
      }
    };
    u.onend = () => {
      // Chrome bug: if onend fires before onstart or within 600ms, it's a false fire
      // (caused by synth.cancel() propagating to the new utterance)
      if (!speechStarted || (Date.now() - startTime) < 600) {
        // Retry: re-speak after a short pause
        setTimeout(() => { if (synthRef.current) synthRef.current.speak(u); }, 300);
        return;
      }
      setWordIdx(-1);
      onEndRef.current();
    };
    u.onerror = (e: SpeechSynthesisErrorEvent) => {
      // "interrupted" means cancel() was called — not a real error, don't advance
      if (e.error === "interrupted" || e.error === "canceled") return;
      onEndRef.current();
    };
    s.speak(u);
  }, [muted]);

  const stop   = useCallback(() => { synthRef.current?.cancel(); setCaption([]); setWordIdx(-1); }, []);
  const pause  = useCallback(() => synthRef.current?.pause(),  []);
  const resume = useCallback(() => synthRef.current?.resume(), []);

  return { voiceName, allVoices, selectVoice, testVoice, ready, caption, wordIdx, speak, stop, pause, resume, synth: synthRef };
}

/* ─── VISUALS ────────────────────────────────────────────────────── */
function StatVisual({ active }: { active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) { setN(0); return; }
    const dur = 2000; const s = Date.now();
    const tick = () => { const p = Math.min(1, (Date.now() - s) / dur); setN(Math.round(500 * p)); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, [active]);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(72px,14vw,140px)", fontWeight: 900, color: "#ef4444", lineHeight: 1, textShadow: "0 0 80px rgba(239,68,68,.35)", fontVariantNumeric: "tabular-nums" }}>${n}B</div>
      <div style={{ fontSize: "clamp(14px,2.5vw,22px)", color: "rgba(255,255,255,.45)", marginTop: 16, letterSpacing: ".12em", textTransform: "uppercase" }}>in counterfeit goods every year</div>
      <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 52, flexWrap: "wrap" }}>
        {[["Paper certs", "forged in minutes"], ["Barcodes", "trivially cloned"], ["RFID", "$0.50+ per tag"]].map(([t, s], i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#e06060", marginBottom: 4 }}>{t}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (active) setTimeout(() => setShow(true), 500); else setShow(false); }, [active]);
  return (
    <div style={{ textAlign: "center", maxWidth: 560 }}>
      <div style={{ fontSize: 96, marginBottom: 24, filter: "drop-shadow(0 0 24px rgba(34,197,94,.4))" }}>🌿</div>
      <div style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 900, color: "#22c55e", marginBottom: 12, textShadow: "0 0 40px rgba(34,197,94,.3)" }}>Blue Dream</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,.5)", marginBottom: 28, letterSpacing: ".06em" }}>Emerald Peak Farms · Humboldt County, CA</div>
      {show && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, opacity: 1, transition: "opacity .6s" }}>
          {[["THC", "22.4%"], ["CBD", "0.8%"], ["Harvest", "Mar 15"]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#22c55e" }}>{v}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", marginTop: 4, textTransform: "uppercase", letterSpacing: ".08em" }}>{k}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScanVisual({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const ts = [
      setTimeout(() => setStep(1), 600),   // camera opens
      setTimeout(() => setStep(2), 2200),  // scanning animation
      setTimeout(() => setStep(3), 4200),  // AUTHENTIC flash
      setTimeout(() => setStep(4), 6000),  // big reveal
    ];
    return () => ts.forEach(clearTimeout);
  }, [active]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
      {/* Phone */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ width: 180, borderRadius: 28, border: "2.5px solid rgba(255,255,255,.15)", background: "#080808", overflow: "hidden", boxShadow: step >= 3 ? "0 0 60px rgba(132,204,22,.35), 0 20px 60px rgba(0,0,0,.8)" : "0 16px 48px rgba(0,0,0,.7)", transition: "box-shadow .6s" }}>
          {/* Notch */}
          <div style={{ height: 30, background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 36, height: 8, background: "#1c1c1c", borderRadius: 4 }} />
          </div>
          {/* Screen */}
          <div style={{
            height: 260, position: "relative", overflow: "hidden",
            background: step >= 3 ? "linear-gradient(160deg,#062210,#0d3d1c)" : "#080808",
            transition: "background .7s",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            {step === 0 && <div style={{ color: "rgba(255,255,255,.12)", fontSize: 12 }}>Camera</div>}

            {step === 1 && (
              <div style={{ width: "80%", aspectRatio: "1", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, border: "1.5px solid rgba(132,204,22,.3)", borderRadius: 8 }} />
                {/* Corner brackets */}
                {[["0,0","tl"],["auto,0","tr"],["0,auto","bl"],["auto,auto","br"]].map(([pos, name]) => {
                  const [r,b] = pos.split(",");
                  return <div key={name} style={{ position:"absolute", top: name.startsWith("t")?"0":"auto", bottom: name.startsWith("b")?"0":"auto", left: name.endsWith("l")?"0":"auto", right: name.endsWith("r")?"0":"auto", width:18, height:18, borderTop: name.startsWith("t")?"2px solid #84cc16":"none", borderBottom: name.startsWith("b")?"2px solid #84cc16":"none", borderLeft: name.endsWith("l")?"2px solid #84cc16":"none", borderRight: name.endsWith("r")?"2px solid #84cc16":"none" }} />;
                })}
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5, background: "linear-gradient(90deg,transparent,#84cc16,transparent)", animation: "scanline 1.2s ease-in-out infinite" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 10 10" width="60" height="60" style={{ opacity: .35 }}>
                    {Array.from({length:100},(_,k)=>{const x=k%10,y=Math.floor(k/10),c=(x<3&&y<3)||(x>6&&y<3)||(x<3&&y>6),d=c||(Math.sin(k*2.8+13)*Math.cos(k*1.4)*0.5+0.5>0.44);return d?<rect key={k} x={x} y={y} width={1} height={1} fill="#84cc16"/>:null;})}
                  </svg>
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 16px" }}>
                <div style={{ width: 36, height: 36, border: "3px solid #84cc16", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                <div style={{ fontSize: 11, color: "#84cc16", fontFamily: "monospace", textAlign: "center" }}>Querying<br/>blockchain…</div>
              </div>
            )}

            {step >= 3 && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "0 14px", width: "100%" }}>
                {/* Big checkmark */}
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(34,197,94,.6)", flexShrink: 0 }}>
                  <svg width="26" height="20" viewBox="0 0 26 20"><path d="M2 10L9 17L24 2" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#22c55e", letterSpacing: ".06em" }}>AUTHENTIC</div>
                <div style={{ width: "100%", height: 1, background: "rgba(34,197,94,.2)" }} />
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.55)", textAlign: "center", lineHeight: 1.7, fontFamily: "monospace" }}>
                  Blue Dream<br/>Emerald Peak Farms<br/>Humboldt County CA<br/>
                  <span style={{ color: "rgba(34,197,94,.6)" }}>Block 54,892,341 · 99.1%</span>
                </div>
              </div>
            )}
          </div>
          {/* Home bar */}
          <div style={{ height: 22, background: "#080808", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 38, height: 4, background: "rgba(255,255,255,.12)", borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Big reveal */}
      {step >= 4 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(48px,9vw,88px)", fontWeight: 900, color: "#84cc16", textShadow: "0 0 60px rgba(132,204,22,.5),0 0 120px rgba(132,204,22,.2)", lineHeight: 1, letterSpacing: "-.02em" }}>2.1s</div>
          <div style={{ fontSize: "clamp(13px,2vw,17px)", color: "rgba(255,255,255,.4)", marginTop: 10, letterSpacing: ".08em" }}>Any phone · No app · Free</div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["No hardware","$0.004/seal","2.1 seconds"].map(t => (
              <span key={t} style={{ background: "rgba(132,204,22,.08)", border: "1px solid rgba(132,204,22,.2)", color: "#84cc16", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanline{0%,100%{top:10%}50%{top:90%}}
      `}</style>
    </div>
  );
}

function ArtVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  const [glow, setGlow] = useState(false);
  useEffect(() => {
    if (!active) { setShow(false); setGlow(false); return; }
    setTimeout(() => setShow(true), 400);
    setTimeout(() => setGlow(true), 1500);
  }, [active]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: show ? 1 : 0, transition: "opacity .6s" }}>
      <div style={{ width: 200, borderRadius: 18, overflow: "hidden", background: "linear-gradient(135deg,#0d2e1a,#1a4d2e,#0a1f12)", border: `2px solid ${glow ? "#ec4899" : "rgba(236,72,153,.2)"}`, boxShadow: glow ? "0 0 40px rgba(236,72,153,.35),0 0 80px rgba(236,72,153,.1)" : "none", transition: "all .8s" }}>
        <div style={{ height: 120, position: "relative", overflow: "hidden", background: "linear-gradient(160deg,#0f3d1f,#1e6b37)" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%,rgba(34,197,94,.5),transparent 60%),radial-gradient(circle at 20% 70%,rgba(132,204,22,.3),transparent 50%)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🌿</div>
          <div style={{ position: "absolute", top: 7, left: 7, background: "rgba(236,72,153,.9)", borderRadius: 4, padding: "2px 8px", fontSize: 8, fontWeight: 700, color: "#fff" }}>🎨 RARE ART</div>
          <div style={{ position: "absolute", bottom: 6, right: 8, fontSize: 8.5, color: "rgba(255,255,255,.5)", fontFamily: "monospace" }}>#23/50</div>
        </div>
        <div style={{ padding: "10px 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#22c55e", marginBottom: 2 }}>Blue Dream</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", marginBottom: 8 }}>Verde Studio · Humboldt Fog</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#ec4899" }}>87</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>ArtGuard</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>RARE</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>Rarity</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, fontWeight: 700, color: "#c9a227" }}>$580</div><div style={{ fontSize: 7, color: "rgba(255,255,255,.3)" }}>Floor</div></div>
          </div>
        </div>
      </div>
      {glow && <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)", textAlign: "center", letterSpacing: ".04em" }}>Art lives on.<br />Long after the product is gone.</div>}
    </div>
  );
}

function NetworkVisual({ active }: { active: boolean }) {
  const [votes, setVotes] = useState(0);
  useEffect(() => {
    if (!active) { setVotes(0); return; }
    let i = 0;
    const id = setInterval(() => { setVotes(++i); if (i >= 6) clearInterval(id); }, 1000);
    return () => clearInterval(id);
  }, [active]);
  const nodes = [
    { x: 50, y: 20, label: "Humboldt Consumer" },
    { x: 80, y: 45, label: "LA Dispensary" },
    { x: 65, y: 75, label: "Vegas Collector" },
    { x: 30, y: 65, label: "Portland Shop" },
    { x: 15, y: 38, label: "SF Customer" },
    { x: 45, y: 50, label: "Truth Network", center: true },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 460, position: "relative" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "280px", overflow: "visible" }}>
        {nodes.slice(0, 5).map((n, i) => votes > i && (
          <line key={i} x1={n.x} y1={n.y} x2={45} y2={50} stroke="#38bdf8" strokeWidth=".8" strokeDasharray="2 2" opacity={.5} />
        ))}
        {nodes.map((n, i) => votes > (n.center ? -1 : i) && (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.center ? 9 : 5} fill={n.center ? "#38bdf8" : "rgba(56,189,248,.2)"} stroke={n.center ? "#38bdf8" : "rgba(56,189,248,.4)"} strokeWidth={n.center ? 0 : 1} style={{ filter: n.center ? "drop-shadow(0 0 6px #38bdf8)" : "none" }} />
            <text x={n.x} y={n.y + (n.center ? 4 : -8)} textAnchor="middle" fill={n.center ? "#fff" : "rgba(255,255,255,.5)"} fontSize={n.center ? 4 : 3.5}>{n.center ? "✓" : n.label}</text>
          </g>
        ))}
      </svg>
      <div style={{ textAlign: "center", marginTop: -20 }}>
        <div style={{ fontFamily: "monospace", fontSize: "clamp(32px,6vw,52px)", fontWeight: 900, color: "#38bdf8", textShadow: "0 0 30px rgba(56,189,248,.4)" }}>{votes}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.35)", marginTop: 4 }}>Truth Network votes recorded</div>
      </div>
    </div>
  );
}

function CloseVisual({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => { if (active) setTimeout(() => setShow(true), 400); else setShow(false); }, [active]);
  return (
    <div style={{ textAlign: "center", opacity: show ? 1 : 0, transition: "opacity .8s" }}>
      <div style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, color: "#c9a227", letterSpacing: ".06em", textShadow: "0 0 60px rgba(201,162,39,.4)", marginBottom: 28 }}>AUTHENTIC ECONOMY</div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
        {[{ l: "StrainChain", c: "#22c55e", d: "strainchain.io" }, { l: "AuthiChain", c: "#c9a227", d: "authichain.com" }, { l: "QRON", c: "#84cc16", d: "qron.space" }].map(({ l, c, d }) => (
          <div key={l} style={{ background: `${c}10`, border: `1.5px solid ${c}40`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: c, marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)", letterSpacing: ".06em" }}>Built solo · Zero capital · Six months · Applying to YC S26</div>
    </div>
  );
}


/* ─── VERIFY VISUAL — live blockchain auth simulation ───────────── */
function VerifyVisual({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  // steps: 0=idle 1=scanning 2=fetching 3=verifying 4=confirmed
  useEffect(() => {
    if (!active) { setStep(0); return; }
    const ts = [
      setTimeout(() => setStep(1), 500),   // QR scan
      setTimeout(() => setStep(2), 2200),  // fetching chain
      setTimeout(() => setStep(3), 4800),  // verifying
      setTimeout(() => setStep(4), 7500),  // AUTHENTIC 🎉
    ];
    return () => ts.forEach(clearTimeout);
  }, [active]);

  const LOGS = [
    { t: 1, label: "QR SCAN",   text: "qron.space/s/BD9291CA → decoded" },
    { t: 2, label: "CHAIN",     text: "Querying Polygon block 54,892,341…" },
    { t: 2, label: "CONTRACT",  text: "0x5db511706FB…6AA2 → StrainChain ERC-721" },
    { t: 3, label: "GUARDIAN",  text: "COA hash 7f3bc4d8… ✓ — THC 22.4% in range" },
    { t: 3, label: "ARCHIVIST", text: "8 lifecycle events — chain intact ✓" },
    { t: 3, label: "SENTINEL",  text: "METRC 1A4060…788 — no recalls, no diversion" },
    { t: 3, label: "ARBITER",   text: "Consensus 99.1% — threshold met ✓" },
    { t: 4, label: "VERDICT",   text: "AUTHENTIC — Blue Dream · Emerald Peak Farms" },
  ];
  const visibleLogs = LOGS.filter(l => l.t <= step);

  return (
    <div style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "12px 18px",
        background: step === 4 ? "rgba(34,197,94,.12)" : "rgba(201,162,39,.06)",
        border: `1.5px solid ${step === 4 ? "#22c55e" : "#c9a227"}40`,
        borderRadius: 12, transition: "all .6s",
        boxShadow: step === 4 ? "0 0 32px rgba(34,197,94,.2)" : "none",
      }}>
        {/* Spinner / checkmark */}
        {step > 0 && step < 4 && (
          <div style={{ width: 22, height: 22, border: "2.5px solid #c9a227", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
        )}
        {step === 4 && (
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 16px rgba(34,197,94,.5)" }}>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1.5 5L5.5 9L12.5 1" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          </div>
        )}
        {step === 0 && <div style={{ width: 22, height: 22, border: "2px solid rgba(201,162,39,.25)", borderRadius: "50%", flexShrink: 0 }} />}

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: step === 4 ? "#22c55e" : "#c9a227", transition: "color .4s" }}>
            {step === 0 && "Waiting…"}
            {step === 1 && "QR code scanned — querying blockchain…"}
            {step === 2 && "Fetching Polygon certificate…"}
            {step === 3 && "5-agent consensus running…"}
            {step === 4 && "✓  AUTHENTIC — StrainChain Verified"}
          </div>
          {step === 4 && <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 }}>Blue Dream · Emerald Peak Farms · Humboldt CA · Block 54,892,341</div>}
        </div>

        {step > 0 && step < 4 && (
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(201,162,39,.5)" }}>
            {step === 1 ? "0.3s" : step === 2 ? "1.1s" : "2.1s"}
          </div>
        )}
        {step === 4 && <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "#22c55e" }}>2.1s</div>}
      </div>

      {/* Terminal log */}
      <div style={{ background: "#050505", border: "1px solid rgba(201,162,39,.12)", borderRadius: 10, padding: "10px 14px", fontFamily: "monospace", fontSize: 11, lineHeight: 1.9, minHeight: 120 }}>
        {visibleLogs.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 10, opacity: i === visibleLogs.length - 1 ? 1 : 0.5 }}>
            <span style={{ color: l.t === 4 ? "#22c55e" : "#c9a227", fontWeight: 700, minWidth: 80, flexShrink: 0 }}>[{l.label}]</span>
            <span style={{ color: l.t === 4 ? "#22c55e" : "#aaa" }}>{l.text}</span>
          </div>
        ))}
        {step > 0 && step < 4 && (
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#c9a227", fontWeight: 700, minWidth: 80 }}>[ ··· ]</span>
            <span style={{ color: "#333" }}>processing…</span>
          </div>
        )}
      </div>

      {/* Certificate card — revealed on AUTHENTIC */}
      {step === 4 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, opacity: 1, transition: "opacity .5s" }}>
          {[
            { l: "Certificate", v: "SC-CA-2026-BD-9291", c: "#c9a227" },
            { l: "Blockchain", v: "Polygon · Block 54.8M", c: "#a78bfa" },
            { l: "Confidence", v: "99.1%", c: "#22c55e" },
            { l: "THC", v: "22.4% verified", c: "#22c55e" },
            { l: "Chain events", v: "8 of 8 intact", c: "#22c55e" },
            { l: "METRC", v: "1A4060…788 ✓", c: "#38bdf8" },
          ].map(({ l, v, c }) => (
            <div key={l} style={{ background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: c, marginBottom: 3 }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".06em" }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}


/* ─── QR BACKDROP — Scene 1: giant QR fades behind $500B stat ─────── */
function QRBackdropVisual({ active }: { active: boolean }) {
  const [glow, setGlow] = useState(false);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (!active) { setGlow(false); setPulse(0); return; }
    setTimeout(() => setGlow(true), 800);
    // Pulse energy arcs through QR every 3s
    let i = 0;
    const id = setInterval(() => { setPulse(p => p + 1); }, 3000);
    return () => clearInterval(id);
  }, [active]);
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* QR as ambient background — large, dim, electric */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: glow ? .18 : 0, transition: "opacity 1.8s ease",
        filter: `brightness(2) saturate(0) ${glow ? "drop-shadow(0 0 24px rgba(239,68,68,.6))" : ""}`,
      }}>
        <img src="https://qron-images.undone-k.workers.dev/qr-clean.png" alt="" style={{ width: "min(90%,440px)", height: "min(90%,440px)", objectFit: "contain" }} />
      </div>
      {/* Scan line sweeping across QR */}
      {glow && (
        <div style={{ position: "absolute", left: "5%", right: "5%", height: 2, background: "linear-gradient(90deg,transparent,rgba(239,68,68,.6),transparent)", animation: "scan-bg 2.4s ease-in-out infinite", top: "20%", pointerEvents: "none" }} />
      )}
      {/* Foreground stat — sits on top of the QR */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div style={{ fontSize: "clamp(72px,14vw,140px)", fontWeight: 900, color: "#ef4444", lineHeight: 1, textShadow: "0 0 80px rgba(239,68,68,.5)", fontVariantNumeric: "tabular-nums", letterSpacing: "-.02em" }}>
          $500B
        </div>
        <div style={{ fontSize: "clamp(14px,2.5vw,22px)", color: "rgba(255,255,255,.5)", marginTop: 18, letterSpacing: ".12em", textTransform: "uppercase" }}>
          in counterfeit goods every year
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 52, flexWrap: "wrap" }}>
          {[["Paper certs", "forged in minutes"], ["Barcodes", "trivially cloned"], ["RFID", "$0.50+ per tag"]].map(([t, s], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#e06060", marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.25)" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes scan-bg{0%{top:8%;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:88%;opacity:0}}`}</style>
    </div>
  );
}

/* ─── QR TRANSFORM — Scene 4: clean→cannabis transformation auto-plays */
function QRTransformVisual({ active }: { active: boolean }) {
  const [phase, setPhase] = useState<0|1|2|3|4>(0);
  // 0=idle 1=scanning 2=dissolving 3=cannabis 4=authentic
  useEffect(() => {
    if (!active) { setPhase(0); return; }
    const ts = [
      setTimeout(() => setPhase(1), 400),   // scan beam appears
      setTimeout(() => setPhase(2), 2800),  // QR dissolves
      setTimeout(() => setPhase(3), 4200),  // cannabis QR emerges
      setTimeout(() => setPhase(4), 6200),  // AUTHENTIC badge
    ];
    return () => ts.forEach(clearTimeout);
  }, [active]);

  const glow = phase >= 3;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
      {/* QR Stage */}
      <div style={{
        position: "relative",
        width: "min(56vw,300px)", aspectRatio: "1",
        flexShrink: 0,
      }}>
        {/* Glow ring */}
        <div style={{ position: "absolute", inset: -20, borderRadius: "50%", boxShadow: glow ? "0 0 80px 30px rgba(132,204,22,.4)" : phase >= 1 ? "0 0 30px 10px rgba(132,204,22,.15)" : "none", transition: "box-shadow 1s", pointerEvents: "none" }} />

        {/* Clean QR */}
        <img src="https://qron-images.undone-k.workers.dev/qr-clean.png" alt="AuthiChain QR" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
          borderRadius: 12,
          opacity: phase >= 2 ? 0 : 1,
          filter: phase === 2 ? "blur(8px) brightness(5) saturate(6) hue-rotate(120deg)" : "none",
          transition: phase >= 2 ? "opacity .8s ease-in, filter .8s" : "opacity .3s",
          zIndex: 2,
        }} />

        {/* Cannabis QR art */}
        <img src="https://qron-images.undone-k.workers.dev/qr-art.png" alt="QRON Cannabis Art" style={{
          position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain",
          borderRadius: 16,
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "scale(1)" : "scale(1.08)",
          filter: phase === 3 ? "blur(2px) brightness(1.6) saturate(2)" : "none",
          transition: "opacity 1.2s ease-out, transform 1.2s ease-out, filter 1.2s",
          zIndex: 3,
        }} />

        {/* Scan beam */}
        {phase === 1 && (
          <div style={{ position: "absolute", left: "8%", right: "8%", height: 2.5, background: "linear-gradient(90deg,transparent,#84cc16,transparent)", boxShadow: "0 0 14px 5px rgba(132,204,22,.5)", zIndex: 10, animation: "scan-line 2.4s ease-in-out 1 forwards", top: "8%" }} />
        )}

        {/* Corner brackets */}
        {(phase === 1 || phase === 2) && ["tl","tr","bl","br"].map(pos => (
          <div key={pos} style={{ position: "absolute", width: 26, height: 26, zIndex: 12,
            top: pos.startsWith("t") ? 8 : "auto", bottom: pos.startsWith("b") ? 8 : "auto",
            left: pos.endsWith("l") ? 8 : "auto", right: pos.endsWith("r") ? 8 : "auto",
            borderTop: pos.startsWith("t") ? "2.5px solid #84cc16" : "none",
            borderBottom: pos.startsWith("b") ? "2.5px solid #84cc16" : "none",
            borderLeft: pos.endsWith("l") ? "2.5px solid #84cc16" : "none",
            borderRight: pos.endsWith("r") ? "2.5px solid #84cc16" : "none",
            boxShadow: "0 0 8px rgba(132,204,22,.6)", animation: "fadeIn .3s ease both" }} />
        ))}

        {/* AUTHENTIC badge */}
        {phase >= 4 && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(0,0,0,.85)", border: "2px solid #22c55e", borderRadius: 12, padding: "14px 20px", textAlign: "center", zIndex: 20, backdropFilter: "blur(12px)", boxShadow: "0 0 28px rgba(34,197,94,.4)", animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }}>✓</div>
            <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "#22c55e", letterSpacing: ".1em" }}>AUTHENTIC</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,.4)", marginTop: 4, letterSpacing: ".05em" }}>STRAINCHAIN · POLYGON</div>
          </div>
        )}
      </div>

      {/* Right side stat */}
      {phase >= 4 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "clamp(48px,9vw,88px)", fontWeight: 900, color: "#84cc16", textShadow: "0 0 60px rgba(132,204,22,.5)", lineHeight: 1, letterSpacing: "-.02em" }}>2.1s</div>
          <div style={{ fontSize: "clamp(13px,2vw,17px)", color: "rgba(255,255,255,.4)", marginTop: 10, letterSpacing: ".08em" }}>Any phone · No app · Free</div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["No hardware","$0.004/seal","Blockchain proven"].map(t => (
              <span key={t} style={{ background: "rgba(132,204,22,.08)", border: "1px solid rgba(132,204,22,.2)", color: "#84cc16", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan-line{0%{top:8%;opacity:1}100%{top:88%;opacity:0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes popIn{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}60%{transform:translate(-50%,-50%) scale(1.08)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}
      `}</style>
    </div>
  );
}


/* ─── VOICE SELECTOR PANEL ──────────────────────────────────────── */
function VoiceSelector({ voiceName, allVoices, selectVoice, testVoice, accent }: {
  voiceName: string;
  allVoices: SpeechSynthesisVoice[];
  selectVoice: (name: string) => void;
  testVoice: () => void;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,.12)", borderRadius: 6, padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 9, color: "rgba(255,255,255,.4)" }}
        >
          🎙 <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{voiceName}</span> ▾
        </button>
        <button
          onClick={testVoice}
          title="Test voice"
          style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,.1)", borderRadius: 6, padding: "4px 7px", cursor: "pointer", fontSize: 10, color: "rgba(255,255,255,.3)" }}
        >▶</button>
      </div>
      {open && allVoices.length > 0 && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "#111", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, minWidth: 280, maxHeight: 240, overflowY: "auto", zIndex: 200, boxShadow: "0 8px 24px rgba(0,0,0,.8)" }}>
          {allVoices.map((v, i) => (
            <div
              key={v.name}
              onClick={() => { selectVoice(v.name); setOpen(false); }}
              style={{ padding: "7px 12px", cursor: "pointer", fontSize: 10, color: v.name === voiceName ? accent : i < 7 ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.35)", background: v.name === voiceName ? `${accent}15` : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderBottom: "0.5px solid rgba(255,255,255,.05)" }}
            >
              <span>{v.name}</span>
              {i === 0 && <span style={{ fontSize: 8, color: accent, fontWeight: 700 }}>BEST</span>}
              {i < 7 && i > 0 && <span style={{ fontSize: 8, color: "rgba(255,255,255,.25)" }}>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────────── */
export default function DemoPage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  // Keep a ref so speech callbacks can check running without stale closures
  const [muted, setMuted] = useState(false);
  const [fade, setFade] = useState(true);
  const [textPhase, setTextPhase] = useState(0);


  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // kept for pause/resume use
  const prevRef  = useRef(-1);

  // Called when narration finishes — advance scene directly (no intermediate state)
  // Using ref to avoid stale sceneIdx in callback
  const runningRef = useRef(false);
  const handleSpeechEnd = useCallback(() => {
    if (runningRef.current) advanceScene();
  }, [advanceScene]);

  const { voiceName, allVoices, selectVoice, testVoice, ready, caption, wordIdx, speak, stop, pause, resume, synth } = useVoice(muted, handleSpeechEnd);

  const sc = SCENES[sceneIdx];
  const totalElapsed = SCENES.slice(0, sceneIdx).reduce((s, x) => s + x.duration, 0) + elapsed;
  const pct  = Math.min(100, (totalElapsed / TOTAL) * 100);
  const sPct = sc.duration > 0 ? (elapsed / sc.duration) * 100 : 0;

  // Advance scene: triggered by speech onend (primary) or safety timer (fallback)
  const advanceScene = useCallback(() => {
    setElapsed(0);
    setSceneIdx(prev => {
      const next = prev + 1;
      if (next < SCENES.length) {
        // Transition to next scene
        setFade(false); setTextPhase(0);
        setTimeout(() => {
          setFade(true);
          setTimeout(() => setTextPhase(1), 300);
          setTimeout(() => setTextPhase(2), 800);
        }, 150);
        return next;
      }
      // Last scene done — stop cleanly
      setRunning(false);
      return prev; // stay on last scene, don't loop
    });
  }, []);

  // Keep runningRef in sync (used by speech callbacks to avoid stale state)
  useEffect(() => { runningRef.current = running; }, [running]);

  // Elapsed counter (for progress ring display only — NOT used to advance scenes)
  useEffect(() => {
    if (!running) return;
    const ticker = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(ticker);
  }, [running, sceneIdx]);

  // Safety timer: single setTimeout per scene — fires ONCE if onend never comes
  // Uses a ref so it doesn't create stale closures via sceneIdx in state
  useEffect(() => {
    if (!running) return;
    const safetyMs = (SCENES[sceneIdx].duration + 6) * 1000;
    const safetyTimer = setTimeout(() => {
      advanceScene();
    }, safetyMs);
    return () => clearTimeout(safetyTimer);
  }, [running, sceneIdx, advanceScene]);

  // Narrate on scene change
  useEffect(() => {
    if (running && sceneIdx !== prevRef.current) {
      prevRef.current = sceneIdx;
        setElapsed(0);
      setTimeout(() => speak(SCENES[sceneIdx].narration), 350);
    }
  }, [sceneIdx, running, speak]);

  function startDemo() {
    setSceneIdx(0); setElapsed(0); prevRef.current = -1; setSpeechDone(false);
    setFade(false); setTextPhase(0);
    setTimeout(() => { setFade(true); setTimeout(() => setTextPhase(1), 400); setTimeout(() => setTextPhase(2), 1000); }, 100);
    setRunning(true);
    setTimeout(() => speak(SCENES[0].narration), 500);
  }
  function pauseDemo()  { setRunning(false); pause(); }
  function resumeDemo() { setRunning(true);  resume(); if (!synth.current?.speaking) speak(sc.narration); }
  function resetDemo()  { setRunning(false); setSceneIdx(0); setElapsed(0); prevRef.current = -1; stop(); setFade(true); setTextPhase(0); setSpeechDone(false); }
  function jumpTo(i: number) {
    setSceneIdx(i); setElapsed(0); prevRef.current = -1; setSpeechDone(false);
    setFade(false); setTextPhase(0);
    setTimeout(() => { setFade(true); setTimeout(() => setTextPhase(1), 300); setTimeout(() => setTextPhase(2), 900); }, 150);
    stop(); setRunning(false);
  }
  function toggleMute() { setMuted(m => { if (!m) synth.current?.cancel(); return !m; }); }

  const accent = sc.accent;

  return (
    <div style={{ background: sc.bg, minHeight: "100vh", color: "#e5e5e5", fontFamily: "system-ui,sans-serif", display: "flex", flexDirection: "column", transition: "background 1.2s", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: "80vw", height: "50vh", background: `radial-gradient(ellipse,${accent}12 0%,transparent 70%)`, pointerEvents: "none", zIndex: 0, transition: "background 1.5s" }} />

      {/* TOP CHROME */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, background: "rgba(0,0,0,.35)", backdropFilter: "blur(14px)", borderBottom: "0.5px solid rgba(255,255,255,.06)", flexWrap: "wrap" }}>
        <a href="/" style={{ color: accent, fontWeight: 900, fontSize: ".85rem", letterSpacing: ".12em", textDecoration: "none", flexShrink: 0, transition: "color 1.2s" }}>◆ AUTHICHAIN</a>
        <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${accent}99,${accent})`, borderRadius: 2, transition: "width .9s linear,background 1.2s" }} />
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,.3)", flexShrink: 0 }}>{fmt(Math.round(totalElapsed))} / {fmt(TOTAL)}</div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {!running
            ? <button onClick={sceneIdx === 0 && elapsed === 0 ? startDemo : resumeDemo} disabled={!ready}
                style={{ background: accent, color: "#000", border: "none", borderRadius: 8, padding: "7px 20px", fontWeight: 700, cursor: ready ? "pointer" : "not-allowed", fontSize: 12, opacity: ready ? 1 : .4, transition: "background 1.2s", letterSpacing: ".03em" }}>
                {sceneIdx === 0 && elapsed === 0 ? "▶  Start" : "▶  Resume"}
              </button>
            : <button onClick={pauseDemo} style={{ background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.7)", border: "0.5px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>⏸</button>
          }
          <button onClick={toggleMute} style={{ background: "transparent", color: muted ? accent : "rgba(255,255,255,.3)", border: "0.5px solid rgba(255,255,255,.08)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 13, transition: "color 1.2s" }}>{muted ? "🔇" : "🔊"}</button>
          <button onClick={resetDemo} style={{ background: "transparent", color: "rgba(255,255,255,.2)", border: "0.5px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 12 }}>↺</button>
        </div>
        <VoiceSelector voiceName={voiceName} allVoices={allVoices} selectVoice={selectVoice} testVoice={testVoice} accent={accent} />
      </div>

      {/* MAIN SCENE */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "80px 24px 120px", position: "relative", zIndex: 10, opacity: fade ? 1 : 0, transition: "opacity .3s" }}>
        <div style={{ position: "absolute", top: 72, left: 24, fontSize: 9, color: "rgba(255,255,255,.2)", textTransform: "uppercase", letterSpacing: ".14em" }}>
          {String(sceneIdx + 1).padStart(2, "0")} / {String(SCENES.length).padStart(2, "0")}
        </div>
        {/* Countdown ring — shows elapsed vs duration */}
        <div style={{ position: "absolute", top: 68, right: 24 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="2" />
            <circle cx="20" cy="20" r="16" fill="none" stroke={accent} strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 16}`} strokeDashoffset={`${2 * Math.PI * 16 * (1 - sPct / 100)}`}
              strokeLinecap="round" transform="rotate(-90 20 20)"
              style={{ transition: "stroke-dashoffset 1s linear,stroke 1.2s", filter: `drop-shadow(0 0 4px ${accent}80)` }} />
            <text x="20" y="25" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="10" fontFamily="monospace">{Math.max(0, sc.duration - elapsed)}</text>
          </svg>
        </div>

        {/* Visual */}
        <div style={{ width: "100%", maxWidth: 720, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40, minHeight: sc.visual === "IFRAME" ? 380 : 280 }}>
          {sc.visual === "QR_BACKDROP" && <QRBackdropVisual active={running && sceneIdx === 0} />}
          {sc.visual === "PRODUCT" && <ProductVisual active={running && sceneIdx === 1} />}
          {sc.visual === "VERIFY"   && <VerifyVisual  active={running && sceneIdx === 2} />}
          {sc.visual === "QR_TRANSFORM" && <QRTransformVisual active={running && sceneIdx === 3} />}
          {sc.visual === "ART"     && <ArtVisual     active={running && sceneIdx === 4} />}
          {sc.visual === "NETWORK" && <NetworkVisual active={running && sceneIdx === 5} />}
          {sc.visual === "CLOSE"   && <CloseVisual   active={running && sceneIdx === 6} />}
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", maxWidth: 700, opacity: textPhase >= 1 ? 1 : 0, transform: textPhase >= 1 ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s, transform .6s" }}>
          <div style={{ fontSize: "clamp(22px,4.5vw,44px)", fontWeight: 900, color: accent, letterSpacing: ".03em", marginBottom: 10, textShadow: `0 0 40px ${accent}40`, transition: "color 1.2s,text-shadow 1.2s", lineHeight: 1.15 }}>{sc.headline}</div>
          <div style={{ fontSize: "clamp(13px,2vw,18px)", color: "rgba(255,255,255,.5)", marginBottom: 16, letterSpacing: ".04em" }}>{sc.sub}</div>
          {textPhase >= 2 && (
            <div style={{ fontSize: "clamp(12px,1.5vw,15px)", color: "rgba(255,255,255,.28)", lineHeight: 1.85, whiteSpace: "pre-line" }}>{sc.body}</div>
          )}
        </div>
      </div>

      {/* CAPTIONS */}
      <div style={{ position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 720, zIndex: 50, textAlign: "center", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {caption.length > 0 && (
          <div style={{ background: "rgba(0,0,0,.72)", backdropFilter: "blur(10px)", borderRadius: 10, padding: "8px 18px", fontSize: 14, lineHeight: 1.7 }}>
            {caption.map((w, i) => (
              <span key={i} style={{ color: i === wordIdx ? accent : i < wordIdx ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.82)", fontWeight: i === wordIdx ? 700 : 400, transition: "color .06s", marginRight: "0.3em" }}>{w}</span>
            ))}
          </div>
        )}
      </div>

      {/* SCENE DOTS */}
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 50, alignItems: "center" }}>
        {SCENES.map((s, i) => (
          <button key={i} onClick={() => jumpTo(i)}
            style={{ width: i === sceneIdx ? 28 : 8, height: 8, borderRadius: 4, background: i === sceneIdx ? accent : i < sceneIdx ? "rgba(34,197,94,.5)" : "rgba(255,255,255,.15)", border: "none", cursor: "pointer", transition: "all .3s,background 1.2s", padding: 0 }} />
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, padding: "6px 20px", background: "rgba(0,0,0,.4)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,.2)" }}>Loom → Screen + Camera → <strong style={{ color: "rgba(255,255,255,.35)" }}>▶ Start</strong> → narrates automatically</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
          {[{ l: "strainchain.io", c: "#22c55e" }, { l: "authichain.com", c: "#c9a227" }, { l: "qron.space", c: "#84cc16" }].map(({ l, c }) => (
            <a key={l} href={`https://${l}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: c, opacity: .35, textDecoration: "none" }}>{l} ↗</a>
          ))}
        </div>
      </div>
    </div>
  );
}
