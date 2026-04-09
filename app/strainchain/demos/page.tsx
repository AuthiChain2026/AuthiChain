/**
 * Demo: StrainChain — Persona Demo Index
 * Problem: Every cannabis actor (cultivator, lab, dispensary, consumer, regulator) has a different authentication workflow, and prospects need a single entry point to see how StrainChain — AuthiChain + QRON fused for cannabis — solves their specific piece of the seed-to-sale problem.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: A curated persona gallery that lets any cannabis operator self-qualify into the flow that matches their licence and pain — and convert into a pilot, partnership, or custom strain QRON in a single click.
 */
import type { CSSProperties } from "react"

export const metadata = {
  title: "StrainChain Demos — Cannabis Persona Flows",
  description:
    "Pick your cannabis persona — cultivator, lab, dispensary, consumer, or regulator — and walk the StrainChain authentication flow built on AuthiChain + QRON.",
}

const PERSONAS = [
  {
    href: "/strainchain/demos/cultivator",
    icon: "🌱",
    persona: "Cultivator",
    headline: "Seed to package, signed on-chain",
    pitch:
      "Licensed growers mint a StrainChain batch, bind it to facility identity, and package it with a strain-specific QRON.",
  },
  {
    href: "/strainchain/demos/lab",
    icon: "🧪",
    persona: "Lab",
    headline: "COA anchoring in one upload",
    pitch:
      "State-licensed labs upload a COA and the hash is anchored on-chain. Every terpene, potency, and pesticide screen is immutable.",
  },
  {
    href: "/strainchain/demos/dispensary",
    icon: "🏪",
    persona: "Dispensary",
    headline: "Scan to stock, scan to sell",
    pitch:
      "Budtenders scan on receipt to confirm licensed origin and lab compliance before the product hits the shelf — no EDI required.",
  },
  {
    href: "/strainchain/demos/consumer",
    icon: "📱",
    persona: "Consumer",
    headline: "Scan to verify, scan to earn",
    pitch:
      "Any phone, any browser. Customers scan the strain QRON and see lab results, grow story, and scan-to-earn rewards in 2.1 seconds.",
  },
  {
    href: "/strainchain/demos/regulator",
    icon: "⚖️",
    persona: "Regulator",
    headline: "Audit trail in one query",
    pitch:
      "State cannabis boards query a full METRC-reconciled, blockchain-anchored audit trail across every licensed SKU in the state.",
  },
]

const pageBody: CSSProperties = {
  background: "#080808",
  color: "#e5e5e5",
  minHeight: "100vh",
  fontFamily: "system-ui,sans-serif",
}

const nav: CSSProperties = {
  padding: "16px 32px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  borderBottom: "0.5px solid rgba(255,255,255,.07)",
}

const card: CSSProperties = {
  background: "rgba(255,255,255,.03)",
  border: "1px solid rgba(34,197,94,.15)",
  borderRadius: 16,
  padding: "24px 22px",
  textDecoration: "none",
  color: "inherit",
  display: "block",
}

export default function StrainChainDemosIndexPage() {
  return (
    <main style={pageBody}>
      <nav style={nav}>
        <a href="/strainchain" style={{ color: "#22c55e", fontWeight: 900, fontSize: "1rem", letterSpacing: ".1em", textDecoration: "none" }}>
          🌿 STRAINCHAIN
        </a>
        <div style={{ flex: 1 }} />
        <a href="https://authichain.com" style={{ color: "rgba(255,255,255,.4)", textDecoration: "none", fontSize: 12 }}>
          Powered by AuthiChain + QRON
        </a>
      </nav>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "88px 24px 48px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(34,197,94,.1)",
            border: "1px solid rgba(34,197,94,.3)",
            color: "#22c55e",
            padding: "5px 16px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: ".1em",
            marginBottom: 24,
          }}
        >
          Cannabis persona demos
        </div>
        <h1 style={{ fontSize: "clamp(28px,6vw,56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
          Pick your cannabis <span style={{ color: "#22c55e" }}>persona</span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,.5)",
            fontSize: "clamp(14px,1.8vw,18px)",
            lineHeight: 1.75,
            maxWidth: 620,
            margin: "0 auto",
          }}
        >
          StrainChain is AuthiChain + QRON fused into a single cannabis-native protocol. Every persona below
          walks through how the stack authenticates a batch in 2.1 seconds from a different seat in the supply
          chain. Pick the one closest to your licence — or book a briefing if you need a custom strain QRON.
        </p>
      </section>

      <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {PERSONAS.map((p) => (
            <a key={p.href} href={p.href} style={card}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontSize: 11, color: "rgba(34,197,94,.7)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>
                {p.persona}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: "#fff" }}>{p.headline}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.65 }}>{p.pitch}</div>
              <div style={{ marginTop: 18, color: "#22c55e", fontSize: 13, fontWeight: 700 }}>
                Walk the flow →
              </div>
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            background: "rgba(34,197,94,.06)",
            border: "1.5px solid rgba(34,197,94,.25)",
            borderRadius: 18,
            padding: "36px 28px",
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Need a custom strain QRON or MSO pilot?</h2>
          <p style={{ color: "rgba(255,255,255,.55)", marginBottom: 24 }}>
            Tell us your licence, state, and use case through the cannabis intake and we&rsquo;ll design a
            StrainChain flow that maps to your exact workflow.
          </p>
          <a
            href="mailto:z@authichain.com?subject=StrainChain%20Demo%20Request"
            style={{
              display: "inline-block",
              background: "#22c55e",
              color: "#000",
              padding: "13px 32px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            Request a StrainChain briefing
          </a>
        </div>
      </section>

      <footer style={{ borderTop: "0.5px solid rgba(255,255,255,.06)", padding: "24px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ color: "#22c55e", fontWeight: 900, fontSize: ".85rem" }}>🌿 STRAINCHAIN</span>
        <div style={{ flex: 1 }} />
        <a href="https://authichain.com" style={{ color: "rgba(255,255,255,.3)", textDecoration: "none", fontSize: 12 }}>
          authichain.com
        </a>
        <a href="mailto:z@authichain.com" style={{ color: "rgba(255,255,255,.3)", textDecoration: "none", fontSize: 12 }}>
          z@authichain.com
        </a>
      </footer>
    </main>
  )
}
