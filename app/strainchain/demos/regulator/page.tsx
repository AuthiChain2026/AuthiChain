/**
 * Demo: StrainChain — Regulator
 * Problem: State cannabis control boards (California BCC, Colorado MED, Michigan LARA, and 20+ others) depend on METRC data that is manually entered, easy to falsify, and disconnected from the physical packages on dispensary shelves.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: Regulators get a read-only audit dashboard that reconciles METRC with the AuthiChain-anchored StrainChain ledger, exposes every unlicensed or tampered SKU in the state, and lets field inspectors scan any package to confirm provenance in under 3 seconds.
 */
import type { CSSProperties } from "react"

export const metadata = {
  title: "StrainChain Demo — Regulator Flow",
  description:
    "State cannabis boards get a read-only audit dashboard reconciling METRC with the AuthiChain-anchored StrainChain ledger across every licensed SKU in the state.",
}

const STEPS = [
  {
    icon: "🗂️",
    title: "Connect the state seat",
    body: "Each state regulator is granted a read-only StrainChain seat bound to their agency identity. METRC API keys are passed through, nothing is copied.",
  },
  {
    icon: "🔎",
    title: "Reconcile against AuthiChain",
    body: "StrainChain joins METRC manifests against the on-chain ledger. Unlicensed cultivators, missing COAs, and tamper events bubble to the top of the dashboard.",
  },
  {
    icon: "📡",
    title: "Field inspectors scan",
    body: "Inspectors scan any strain QRON in the field. In under 3 seconds they see licence, COA signature, and full custody chain — no laptop required.",
  },
  {
    icon: "📝",
    title: "Export audit trail",
    body: "A complete, signed, EPCIS-style audit trail is exported on demand — ready for court filings, enforcement actions, and FOIA responses.",
  },
]

const OUTCOMES = [
  "Read-only AuthiChain + METRC reconciliation dashboard",
  "Field-ready QRON scan for any inspector in under 3 seconds",
  "Unlicensed / tampered SKUs surfaced automatically",
  "Court-ready audit trails exported in a single click",
]

const body: CSSProperties = { background: "#080808", color: "#e5e5e5", minHeight: "100vh", fontFamily: "system-ui,sans-serif" }
const nav: CSSProperties = { padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, borderBottom: "0.5px solid rgba(255,255,255,.07)" }
const stepCard: CSSProperties = { background: "rgba(255,255,255,.03)", border: "1px solid rgba(34,197,94,.15)", borderRadius: 14, padding: "22px 20px" }

export default function RegulatorDemoPage() {
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
          ⚖️ Persona · Regulator
        </div>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
          Audit the whole state <span style={{ color: "#22c55e" }}>in one query</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,.55)", fontSize: "clamp(14px,1.8vw,17px)", lineHeight: 1.75, maxWidth: 640 }}>
          State cannabis control boards can&rsquo;t see what&rsquo;s actually on the shelf. StrainChain gives
          regulators a read-only dashboard that reconciles METRC against the on-chain ledger — so unlicensed
          SKUs, missing COAs, and tamper events surface automatically, and field inspectors can verify any
          package in under 3 seconds.
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
            <a href="mailto:z@authichain.com?subject=StrainChain%20Regulator%20Briefing" style={{ background: "#22c55e", color: "#000", padding: "13px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 14 }}>
              Book a regulator briefing
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
