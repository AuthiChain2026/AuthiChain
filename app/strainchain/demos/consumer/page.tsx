/**
 * Demo: StrainChain — Consumer
 * Problem: Cannabis consumers have almost no way to verify what they paid for — potency, terpenes, origin, and licence status all live on fragile labels and PDFs that are routinely swapped, faked, or out of date.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: Any consumer, on any phone, scans the strain QRON and sees the full lab panel, cultivator story, and licensed chain of custody — and can earn QRON rewards for every authenticated scan, turning verification into a loyalty and community layer for the brand.
 */
import type { CSSProperties } from "react"

export const metadata = {
  title: "StrainChain Demo — Consumer Flow",
  description:
    "Any phone, any browser. Consumers scan the strain QRON and see lab results, grow story, and scan-to-earn rewards in 2.1 seconds.",
}

const STEPS = [
  {
    icon: "📱",
    title: "Scan the strain QRON",
    body: "Any phone camera works — no app to download. The strain QRON resolves to an AuthiChain record in 2.1 seconds.",
  },
  {
    icon: "🧪",
    title: "See the full panel",
    body: "Potency, terpenes, pesticide and heavy-metal screens, lab signature, and batch date — exactly as the licensed lab submitted them.",
  },
  {
    icon: "🌱",
    title: "See the grow story",
    body: "Cultivator facility, cultivar lineage, cure notes, and the branded QRON art. The story that belongs to the product travels with it.",
  },
  {
    icon: "🎁",
    title: "Scan to earn",
    body: "Every authenticated scan earns QRON rewards the consumer can redeem on their next dispensary visit. Verification becomes a loyalty loop.",
  },
]

const OUTCOMES = [
  "2.1-second verification on any phone, no app",
  "Full signed lab panel on every scan",
  "Grow story + branded QRON art travels with the product",
  "Scan-to-earn loyalty rewards in QRON",
]

const body: CSSProperties = { background: "#080808", color: "#e5e5e5", minHeight: "100vh", fontFamily: "system-ui,sans-serif" }
const nav: CSSProperties = { padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, borderBottom: "0.5px solid rgba(255,255,255,.07)" }
const stepCard: CSSProperties = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 14, padding: "22px 20px" }

export default function ConsumerDemoPage() {
  return (
    <main style={body}>
      <nav style={nav}>
        <a href="/strainchain" style={{ color: "#22c55e", fontWeight: 900, fontSize: "1rem", letterSpacing: ".1em", textDecoration: "none" }}>
          🌿 STRAINCHAIN
        </a>
        <div style={{ flex: 1 }} />
        <a href="/strainchain/demos" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none", fontSize: 12 }}>
          ← all persona demos
        </a>
      </nav>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "72px 24px 32px" }}>
        <div style={{ display: "inline-block", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", color: "#22c55e", padding: "5px 16px", borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 24 }}>
          📱 Persona · Consumer
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
          Scan it. <span style={{ color: "#22c55e" }}>Trust it. Earn on it.</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,.55)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.75, maxWidth: 640 }}>
          Consumers shouldn&rsquo;t have to take a label&rsquo;s word for it. StrainChain lets any phone scan
          the strain QRON and see the signed lab panel, grow story, and licensed chain of custody — and rewards
          the consumer with QRON every time they verify.
        </p>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "16px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={stepCard}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: "rgba(34,197,94,.7)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Step {i + 1}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.6 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px 72px" }}>
        <div style={{ background: "rgba(34,197,94,.06)", border: "1.5px solid rgba(34,197,94,.25)", borderRadius: 18, padding: "32px 28px" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>What you get</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {OUTCOMES.map((o, i) => (
              <li key={i} style={{ padding: "8px 0", borderBottom: i === OUTCOMES.length - 1 ? "none" : "1px solid rgba(255,255,255,.05)", color: "rgba(255,255,255,.7)" }}>
                <span style={{ color: "#22c55e", marginRight: 10 }}>✓</span>
                {o}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/verify/STRAIN-SC-OG-KUSH-2026" style={{ background: "#22c55e", color: "#000", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Try a live consumer scan
            </a>
            <a href="/strainchain/demos" style={{ border: "1px solid rgba(34,197,94,.3)", color: "#22c55e", padding: "13px 24px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>
              Other personas
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
