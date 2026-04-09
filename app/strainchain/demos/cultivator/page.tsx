/**
 * Demo: StrainChain — Cultivator
 * Problem: Licensed cultivators have no clean way to prove that a specific batch — from clone to package — was grown, cured, and handled under their licence, leaving craft flower indistinguishable from diverted product on the shelf.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: Every batch gets a StrainChain identity bound to the cultivator&rsquo;s AuthiChain licence and packaged with a strain-specific QRON, turning craft provenance into a shelf-level marketing asset and a METRC-ready audit trail.
 */
import type { CSSProperties } from "react"

export const metadata = {
  title: "StrainChain Demo — Cultivator Flow",
  description:
    "Licensed growers mint a StrainChain batch, bind it to their AuthiChain identity, and ship it with a strain-specific QRON — all in one flow.",
}

const STEPS = [
  {
    icon: "🌱",
    title: "Clone → Veg → Flower",
    body: "The grow team logs each phase of the life cycle against a StrainChain batch ID. Facility, room, and operator are bound to the cultivator&rsquo;s AuthiChain identity at every step.",
  },
  {
    icon: "✂️",
    title: "Harvest + cure",
    body: "Dry weight, cure conditions, and trim events anchor to the same batch. The ledger is tamper-evident, so re-labelling diverted product becomes impossible.",
  },
  {
    icon: "🎨",
    title: "QRON art for the strain",
    body: "A QRON is generated in the cultivar&rsquo;s visual language — emerald, trichome frost, soil tones — and bound to the batch. It ships on the exit label and certificate.",
  },
  {
    icon: "📦",
    title: "Package + METRC sync",
    body: "At package, StrainChain writes the batch to AuthiChain on Polygon and reconciles it with METRC in the same transaction. No manual data entry.",
  },
]

const OUTCOMES = [
  "Craft batch provenance provable from clone to package",
  "Strain-specific QRON art on every exit bag and label",
  "METRC + AuthiChain reconciled automatically at package",
  "Dispensary buyers can verify your licence before they order",
]

const body: CSSProperties = { background: "#080808", color: "#e5e5e5", minHeight: "100vh", fontFamily: "system-ui,sans-serif" }
const nav: CSSProperties = { padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, borderBottom: "0.5px solid rgba(255,255,255,.07)" }
const stepCard: CSSProperties = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 14, padding: "22px 20px" }

export default function CultivatorDemoPage() {
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
          🌱 Persona · Cultivator
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
          Clone to exit bag, <span style={{ color: "#22c55e" }}>signed forever</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,.55)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.75, maxWidth: 640 }}>
          Licensed cultivators are losing shelf space to diverted product that looks identical on the label.
          StrainChain binds every StrainChain batch to your AuthiChain identity and packages it with a
          strain-specific QRON — so buyers, budtenders, and consumers can see that what you grew is what
          they&rsquo;re holding.
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
            <a href="mailto:z@authichain.com?subject=StrainChain%20Cultivator%20Onboarding" style={{ background: "#22c55e", color: "#000", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Onboard my cultivation facility
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
