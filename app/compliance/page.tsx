import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EU Digital Product Passport Compliance — AuthiChain',
  description: 'AuthiChain enables EU Digital Product Passport (DPP) compliance. Blockchain-verified provenance, 2026-ready.',
  alternates: { canonical: 'https://authichain.com/compliance' },
};

export default function CompliancePage() {
  const requirements = [
    ['Unique product identifier', 'ERC-721 NFT per batch — globally unique, on Polygon blockchain'],
    ['Tamper-proof digital record', 'Immutable blockchain ledger — cannot be altered by any party'],
    ['Supply chain provenance', 'Full manufacturer to distributor to consumer chain on-ledger'],
    ['Lifecycle data', 'Timestamped scan events, transfer history, cert issuance log'],
    ['Consumer verification', 'QR scan to instant verify on any smartphone, no app required'],
    ['Machine-readable format', 'REST API (OpenAPI 3.0), JSON-LD metadata, W3C DID compatible'],
    ['Long-term auditability', 'Blockchain records are permanent — no expiration, no deletion'],
  ];

  const features = [
    { icon: '🔐', title: 'Cryptographic Immutability', body: 'Once written to Polygon, a product record cannot be altered, backdated, or deleted by anyone. Mathematically provable, not policy-based.' },
    { icon: '⚡', title: '2.1-Second Verification', body: 'EU inspectors and consumers verify product authenticity in under 2.1 seconds via standard smartphone. No hardware required.' },
    { icon: '🌍', title: 'Cross-Border Trust', body: 'Polygon blockchain is globally accessible. Any EU customs authority, retailer, or consumer can verify provenance independently.' },
    { icon: '💶', title: '$0.004 Per Product', body: 'AuthiChain seals cost a fraction of RFID or NFC alternatives. Enterprise pricing available for high-volume manufacturing runs.' },
    { icon: '🔗', title: 'W3C DID Standard', body: 'AuthiChain uses W3C Decentralized Identifiers — the global standard for verifiable credentials. Future-proof and interoperable.' },
    { icon: '📋', title: 'GDPR Compatible', body: 'Only cryptographic hashes are written to the blockchain. Sensitive product data stays in your systems.' },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(201,162,39,0.15)' }}>
        <a href="https://authichain.com" style={{ color: '#c9a227', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.1em', textDecoration: 'none' }}>
          ◆ AUTHICHAIN
        </a>
      </nav>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227', padding: '6px 18px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 28 }}>
          EU Compliance Ready
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          EU Digital Product Passport<br />
          <span style={{ color: '#c9a227' }}>Compliance — Solved.</span>
        </h1>
        <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 40px' }}>
          The EU DPP mandate requires brands to provide tamper-proof digital records for every product by 2026.
          AuthiChain delivers this via blockchain provenance — already built, already live.
        </p>
        <div style={{ background: 'rgba(163,45,45,0.1)', border: '1px solid rgba(163,45,45,0.4)', borderRadius: 12, padding: '20px 28px', maxWidth: 620, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          <strong style={{ color: '#e06060' }}>⚠️ 2026 Implementation Deadlines Approaching</strong>
          <p style={{ color: '#aaa', marginTop: 8 }}>
            EU DPP regulations under the Ecodesign for Sustainable Products Regulation (ESPR) require digital
            product records for textiles, electronics, batteries, and high-value goods. Non-compliance risks
            exclusion from EU markets.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a227', marginBottom: 8 }}>What EU DPP Requires</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 32 }}>Every product sold in the EU must carry a verifiable digital record</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#c9a227', fontSize: '0.75rem', textTransform: 'uppercase', padding: '12px 16px', borderBottom: '1px solid rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.08)' }}>Requirement</th>
              <th style={{ textAlign: 'left', color: '#c9a227', fontSize: '0.75rem', textTransform: 'uppercase', padding: '12px 16px', borderBottom: '1px solid rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.08)' }}>AuthiChain Solution</th>
              <th style={{ textAlign: 'left', color: '#c9a227', fontSize: '0.75rem', textTransform: 'uppercase', padding: '12px 16px', borderBottom: '1px solid rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.08)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map(([req, sol], i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ padding: '14px 16px', color: '#aaa', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{req}</td>
                <td style={{ padding: '14px 16px', color: '#ccc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{sol}</td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span style={{ color: '#22c55e', fontWeight: 700 }}>✓ Live</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 56px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a227', marginBottom: 8 }}>Why Blockchain Is the Right Architecture</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: 40 }}>Traditional databases cannot meet EU DPP tamper-proof requirements</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#111', border: '1px solid rgba(201,162,39,0.15)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(27,58,92,0.6), rgba(10,10,10,0.8))', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 20, padding: '52px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 14 }}>
            Be <span style={{ color: '#c9a227' }}>2026-Ready</span> Now
          </h2>
          <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.6 }}>
            Implementation takes days, not months. AuthiChain integrates with existing ERP and PLM systems.
            Start your EU DPP compliance program before your competitors.
          </p>
          <a href="/portal" style={{ display: 'inline-block', background: '#c9a227', color: '#000', fontWeight: 800, padding: '16px 36px', borderRadius: 10, textDecoration: 'none', marginRight: 8, marginBottom: 8, fontSize: '1rem' }}>
            Start Compliance Program
          </a>
          <a href="mailto:z@authichain.com?subject=EU DPP Compliance" style={{ display: 'inline-block', border: '2px solid #c9a227', color: '#c9a227', fontWeight: 800, padding: '16px 36px', borderRadius: 10, textDecoration: 'none', marginBottom: 8, fontSize: '1rem' }}>
            Talk to a Human
          </a>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: 16 }}>Live API: authichain.com/api/v1/health</p>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '32px', color: '#333', fontSize: '0.8rem', borderTop: '1px solid #1a1a1a' }}>
        {'© 2026 AuthiChain, Inc. '}
        <a href="https://authichain.com" style={{ color: '#444' }}>Home</a>
        {' · '}
        <a href="https://authichain.com/api/v1/verify" style={{ color: '#444' }}>Live Verify</a>
        {' · '}
        <a href="mailto:z@authichain.com" style={{ color: '#444' }}>z@authichain.com</a>
      </footer>
    </main>
  );
}
