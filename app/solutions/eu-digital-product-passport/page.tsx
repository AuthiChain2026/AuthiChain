import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, CheckCircle, Globe, Clock, FileText, Zap, ArrowRight, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'EU Digital Product Passport Compliance — AuthiChain',
  description: 'AuthiChain makes EU Digital Product Passport (DPP) compliance instant. QR-verified, blockchain-anchored DPPs for batteries, textiles, and consumer goods. Mandatory from Feb 2027.',
  openGraph: {
    title: 'EU Digital Product Passport Compliance — AuthiChain',
    description: 'Meet the EU ESPR mandate with AuthiChain. QR + NFT + Bitcoin-secured DPPs. Batteries Feb 2027, textiles following. Get compliant now.',
    url: 'https://authichain.com/solutions/eu-digital-product-passport',
  }
}

const timeline = [
  { date: 'Jul 2024', label: 'ESPR in force', desc: 'EU Ecodesign for Sustainable Products Regulation entered into force', status: 'done' },
  { date: 'Jul 19 2026', label: 'EU DPP registry live', desc: 'Central EU Digital Product Passport registry launches', status: 'urgent' },
  { date: 'Feb 2027', label: 'Batteries mandatory', desc: 'All batteries sold in EU must have a machine-readable DPP', status: 'upcoming' },
  { date: '2027–2030', label: 'Textiles, furniture, tyres', desc: 'Phased rollout across all major product categories', status: 'future' },
]

const features = [
  {
    icon: '₿',
    title: 'Dual-chain DPP',
    desc: 'Every DPP anchored on both Polygon and Bitcoin. The most immutable product record available — exceeds EU permanence requirements.',
  },
  {
    icon: '⬡',
    title: 'QR code native',
    desc: 'AuthiChain QR codes are already the format EU regulation expects. Scan to reveal full provenance, sustainability data, repairability score.',
  },
  {
    icon: '⚡',
    title: 'Instant issuance',
    desc: 'API-first. Issue a DPP in under 2 seconds via REST or our dashboard. No enterprise contract, no 6-month implementation.',
  },
  {
    icon: '🔗',
    title: 'Interoperable',
    desc: 'DPP data structured to EU ESPR schema. Works alongside VeChain, Arianee, or any existing ERP — not a rip-and-replace.',
  },
  {
    icon: '📋',
    title: 'Full data fields',
    desc: 'Composition, origin, environmental impact, repairability, and end-of-life — all stored on-chain and retrievable via QR scan.',
  },
  {
    icon: '🌍',
    title: 'SMB-accessible',
    desc: 'Enterprise DPP platforms charge six figures. AuthiChain starts at $49/product. Every EU seller can comply, not just Fortune 500 brands.',
  },
]

const tiers = [
  {
    name: 'DPP Starter',
    price: '$49',
    desc: 'per product',
    features: [
      'Single product DPP',
      'Polygon NFT anchor',
      'EU ESPR data fields',
      'QR code generation',
      'authichain.com/verify page',
    ],
    cta: 'Get compliant',
    link: 'https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e',
    featured: false,
  },
  {
    name: 'DPP Bitcoin',
    price: '$299',
    desc: 'per product',
    features: [
      'Everything in Starter',
      'Bitcoin Ordinal inscription',
      'Dual-chain permanence',
      'ordinals.com verification',
      'Priority support',
    ],
    cta: 'Bitcoin-grade DPP',
    link: 'https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e',
    featured: true,
  },
  {
    name: 'DPP Enterprise',
    price: 'Custom',
    desc: 'volume pricing',
    features: [
      'Bulk DPP issuance via API',
      'White-label verify page',
      'EU registry integration',
      'SLA + dedicated support',
      'Compliance reporting',
    ],
    cta: 'Contact sales',
    link: 'mailto:authichain@gmail.com',
    featured: false,
  },
]

export default function EUDPPPage() {
  return (
    <div style={{ background: '#0a0a0a', color: '#e5e5e5', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100, margin: '0 auto' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Shield size={24} color="#C9A227" />
          <span style={{ color: '#C9A227', fontWeight: 700, fontSize: 18 }}>AuthiChain</span>
        </Link>
        <a href="https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e" style={{ background: '#C9A227', color: '#000', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
          Get EU DPP compliant →
        </a>
      </nav>

      {/* Urgency Banner */}
      <div style={{ background: 'rgba(201,162,39,0.08)', borderBottom: '1px solid rgba(201,162,39,0.2)', padding: '10px 24px', textAlign: 'center' }}>
        <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 500 }}>
          ⚡ EU DPP central registry launches July 19, 2026 · Battery mandate: February 2027 · Textiles, furniture to follow
        </span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '80px 0 60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
            <Globe size={14} color="#C9A227" />
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 600 }}>EU Ecodesign for Sustainable Products Regulation</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#fff' }}>
            EU Digital Product<br />
            <span style={{ color: '#C9A227' }}>Passport Compliance</span><br />
            in 2 seconds.
          </h1>
          <p style={{ fontSize: 18, color: '#888', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Every product sold in the EU will need a machine-readable DPP. AuthiChain issues blockchain-anchored DPPs via QR code — from $49 per product. No enterprise contract. No six-month implementation.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e" style={{ background: '#C9A227', color: '#000', padding: '14px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              Issue your first DPP — $49 →
            </a>
            <a href="mailto:authichain@gmail.com" style={{ border: '1px solid rgba(201,162,39,0.4)', color: '#C9A227', padding: '14px 28px', borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              Enterprise pricing
            </a>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: '1.4rem', marginBottom: 32 }}>EU DPP mandatory timeline</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {timeline.map((t) => (
              <div key={t.date} style={{
                background: t.status === 'urgent' ? 'rgba(201,162,39,0.08)' : '#111',
                border: `1px solid ${t.status === 'done' ? '#1D9E75' : t.status === 'urgent' ? '#C9A227' : '#222'}`,
                borderRadius: 12, padding: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  {t.status === 'done' && <CheckCircle size={14} color="#1D9E75" />}
                  {t.status === 'urgent' && <AlertTriangle size={14} color="#C9A227" />}
                  {(t.status === 'upcoming' || t.status === 'future') && <Clock size={14} color="#555" />}
                  <span style={{ color: t.status === 'done' ? '#1D9E75' : t.status === 'urgent' ? '#C9A227' : '#888', fontSize: 12, fontWeight: 700 }}>{t.date}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#e5e5e5' }}>{t.label}</div>
                <div style={{ color: '#666', fontSize: 13, lineHeight: 1.5 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What is a DPP */}
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 40, marginBottom: 80 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 style={{ color: '#C9A227', fontWeight: 700, fontSize: '1.4rem', marginBottom: 16 }}>What the EU requires</h2>
              <p style={{ color: '#888', lineHeight: 1.7, marginBottom: 16 }}>
                A Digital Product Passport is a machine-readable record covering a product's composition, origin, environmental impact, repairability, and end-of-life handling — accessible via QR code or NFC.
              </p>
              <p style={{ color: '#888', lineHeight: 1.7 }}>
                The EU mandates these records be <strong style={{ color: '#e5e5e5' }}>permanently stored and tamper-proof</strong>. Blockchain is the only technology that satisfies this requirement by design.
              </p>
            </div>
            <div>
              {['Composition & materials', 'Country of origin', 'Carbon footprint', 'Repairability score', 'End-of-life instructions', 'Certifications & compliance'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <CheckCircle size={14} color="#C9A227" />
                  <span style={{ color: '#aaa', fontSize: 14 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: '1.4rem', marginBottom: 32 }}>Why AuthiChain for DPP compliance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#e5e5e5' }}>{f.title}</div>
                <div style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 80 }}>
          <h2 style={{ textAlign: 'center', color: '#C9A227', fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>DPP compliance pricing</h2>
          <p style={{ textAlign: 'center', color: '#666', fontSize: 15, marginBottom: 32 }}>Enterprise DPP platforms charge $50K–$500K/year. AuthiChain starts at $49.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {tiers.map(t => (
              <div key={t.name} style={{
                background: '#111',
                border: `${t.featured ? '2px' : '1px'} solid ${t.featured ? '#C9A227' : 'rgba(201,162,39,0.15)'}`,
                borderRadius: 16, padding: 28, position: 'relative'
              }}>
                {t.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#C9A227', color: '#000', padding: '4px 16px', borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    BITCOIN-GRADE
                  </div>
                )}
                <div style={{ color: '#888', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{t.name}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#C9A227' }}>{t.price}</div>
                <div style={{ color: '#555', fontSize: 13, marginBottom: 20 }}>{t.desc}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {t.features.map(f => (
                    <li key={f} style={{ color: '#aaa', fontSize: 14, padding: '6px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={12} color="#C9A227" />{f}
                    </li>
                  ))}
                </ul>
                <a href={t.link} style={{ display: 'block', textAlign: 'center', background: t.featured ? '#C9A227' : 'transparent', color: t.featured ? '#000' : '#C9A227', border: `1px solid ${t.featured ? '#C9A227' : 'rgba(201,162,39,0.4)'}`, padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  {t.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 48, textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ color: '#C9A227', fontWeight: 700, fontSize: '1.6rem', marginBottom: 12 }}>EU DPP registry launches July 19, 2026</h2>
          <p style={{ color: '#888', fontSize: 16, maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Every day you wait is a day your competitors get ahead. Issue your first DPP today — 2 minutes setup, no enterprise contract.
          </p>
          <a href="https://buy.stripe.com/dRm3cv0EV6BgeSKdLK1Nu1e" style={{ background: '#C9A227', color: '#000', padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-block' }}>
            Get EU DPP compliant — $49 →
          </a>
        </div>

        <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #1a1a1a', color: '#444', fontSize: 13 }}>
          <Link href="/" style={{ color: '#C9A227', textDecoration: 'none' }}>AuthiChain</Link> · Blockchain product authentication · <a href="mailto:authichain@gmail.com" style={{ color: '#555' }}>authichain@gmail.com</a>
        </div>
      </div>
    </div>
  )
}
