
"use client";

export default function ProductHuntPage() {
  const tagline = "Blockchain product authentication — scan any QR code, verify authenticity in 2.1 seconds";
  
  const desc = `AuthiChain makes product counterfeiting impossible. Every product batch gets an ERC-721 NFT on Polygon blockchain. Scan the QR code on any label with any smartphone — you get AUTHENTIC or COUNTERFEIT in 2.1 seconds. No app. No hardware. $0.004 per seal.

The EU Digital Product Passport mandate (2026) requires exactly this for every product sold in Europe. AuthiChain is the compliance infrastructure layer.`;

  const features = [
    { icon: "⛓", title: "Blockchain provenance", desc: "ERC-721 NFT per product batch on Polygon. Immutable, tamper-proof, permanent." },
    { icon: "📱", title: "Instant verification", desc: "Any smartphone camera. No app. 2.1-second result. Green = authentic, red = counterfeit." },
    { icon: "◆", title: "AI QR art (QRON)", desc: "Beautiful, scannable QR codes in 11 styles. $9/design or white-label API." },
    { icon: "🇪🇺", title: "EU DPP compliant", desc: "Delivers all 7 EU Digital Product Passport requirements. 2026-ready today." },
    { icon: "💊", title: "Multi-sector", desc: "Luxury, pharma, cannabis (StrainChain), automotive, food safety, customs." },
    { icon: "🔗", title: "REST API", desc: "OpenAPI 3.0 spec, 11 endpoints, RapidAPI marketplace. Integrates in hours." },
  ];

  const makers = [{ name: "Zac Kietzman", role: "Solo founder — built all three platforms", url: "https://authichain.com" }];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#e5e5e5", fontFamily: "system-ui,sans-serif" }}>
      <nav style={{ padding: "14px 32px", borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/" style={{ color: "#c9a227", fontWeight: 900, letterSpacing: ".1em", textDecoration: "none", fontSize: "1rem" }}>◆ AUTHICHAIN</a>
        <div style={{ flex: 1 }} />
        <a href="https://www.producthunt.com/posts/authichain" target="_blank" rel="noreferrer"
          style={{ background: "#DA552F", color: "#fff", padding: "8px 18px", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
          ▲ Upvote on Product Hunt
        </a>
      </nav>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "64px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "#DA552F", color: "#fff", padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 24, letterSpacing: ".06em" }}>
          FEATURED ON PRODUCT HUNT
        </div>
        <h1 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 18 }}>
          AuthiChain — <span style={{ color: "#c9a227" }}>Verify any product</span><br />in 2.1 seconds
        </h1>
        <p style={{ color: "#888", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 600, margin: "0 auto 40px" }}>{tagline}</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E" style={{ background: "#c9a227", color: "#000", padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ▶ Try Live Demo
          </a>
          <a href="/portal" style={{ background: "transparent", border: "1px solid #444", color: "#e5e5e5", padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>
            Get Started Free
          </a>
          <a href="https://www.producthunt.com/posts/authichain" target="_blank" rel="noreferrer"
            style={{ background: "transparent", border: "1px solid #DA552F", color: "#DA552F", padding: "14px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>
            ▲ Upvote
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 56 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, padding: "20px 18px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#e5e5e5" }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(201,162,39,.06)", border: "1px solid rgba(201,162,39,.2)", borderRadius: 16, padding: "36px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>Try it now</div>
          <div style={{ fontFamily: "monospace", fontSize: 13, color: "#c9a227", marginBottom: 20 }}>
            authichain.com/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E
          </div>
          <a href="/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"
            style={{ display: "inline-block", background: "#c9a227", color: "#000", padding: "12px 28px", borderRadius: 8, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            Scan Live Certificate ◆
          </a>
        </div>
      </div>

      <footer style={{ textAlign: "center", padding: 24, color: "#333", fontSize: 12, borderTop: "1px solid #111" }}>
        © 2026 AuthiChain, Inc. ·{" "}
        <a href="https://qron.space" style={{ color: "#444" }}>QRON</a> ·{" "}
        <a href="https://strainchain.io" style={{ color: "#444" }}>StrainChain</a> ·{" "}
        <a href="mailto:z@authichain.com" style={{ color: "#444" }}>z@authichain.com</a>
      </footer>
    </div>
  );
}
