/**
 * Demo: AuthiChain × StrainChain — Cannabis Solution
 * Problem: A $7.9B illicit cannabis market is undermining 23 states of licensed operators, and MSOs have no single authentication OS that covers seed-to-sale, lab anchoring, METRC reconciliation, and consumer-facing verification across every state they ship to.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: The AuthiChain × StrainChain cannabis solution gives MSOs and licensed cultivators a single API for every state — Polygon-anchored seed-to-sale chain, lab COA hash anchoring, METRC bridge, scan-to-earn consumer rewards, and brand-protection monitoring across every SKU in the licensed market.
 */
export const metadata = { title: 'AuthiChain for Cannabis — StrainChain Supply Chain Authentication', description: 'The only blockchain authentication platform built for cannabis. Seed-to-sale transparency, lab result anchoring, and consumer-facing authenticity verification.' };
export default function CannabisPage() {
  const stats = [
    { v: '$7.9B', l: 'Illicit market undermining licensed operators' },
    { v: '23', l: 'States with legal cannabis markets needing traceability' },
    { v: '100%', l: 'StrainChain authenticity rate across registered SKUs' },
    { v: '$QRON', l: 'Consumer scan-to-earn rewards per authenticated scan' },
  ];
  const features = [
    { icon: '🌱', t: 'Seed-to-Sale Chain', d: 'Every cultivation event, lab test, and dispensary transfer anchored on Polygon. METRC events auto-sync via StrainChain bridge.' },
    { icon: '🧪', t: 'Lab Result Anchoring', d: 'COA (Certificate of Analysis) hash stored on-chain. Consumers scan STRAIN-* code to verify potency, pesticides, and terpenes are unaltered.' },
    { icon: '🔗', t: 'METRC Integration', d: 'StrainChain-AuthiChain bridge maps METRC package IDs to blockchain truemark IDs. No manual entry required.' },
    { icon: '📱', t: 'Dispensary Verify Page', d: 'White-label QR scannable at point of purchase. Displays full provenance: grower → lab → packager → dispensary.' },
    { icon: '🏆', t: 'Brand Protection', d: 'Scout agent monitors platforms for unlicensed listings. Sentinel detects batch counterfeiting patterns. Auto-alert to brand + enforcement.' },
    { icon: '⚡', t: 'Multi-State MSO Ready', d: 'One API for all licenses. Support for CA, CO, MI, OR, NV, AZ, IL, and 16 more states. EU-GMP exports on roadmap.' },
  ];
  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'60px 20px',background:'#0a0a0a',color:'#e5e5e5',fontFamily:'sans-serif',minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:60}}>
        <p style={{color:'#C9A227',fontWeight:700,letterSpacing:'.2em',fontSize:12,marginBottom:16}}>AUTHICHAIN × STRAINCHAIN · CANNABIS</p>
        <h1 style={{fontSize:48,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:16}}>Authenticity for<br/>the Cannabis Supply Chain</h1>
        <p style={{fontSize:18,color:'#aaa',maxWidth:560,margin:'0 auto 32px'}}>Seed-to-sale blockchain transparency. Lab result anchoring. Consumer scan-to-earn. The only authentication OS built for cannabis.</p>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="https://authichain.com/pricing" style={{padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:8,fontSize:16}}>Start Free →</a>
          <a href="https://authichain.com/verify/STRAIN-SC-OG-KUSH-2026" style={{padding:'14px 28px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:8,fontSize:16}}>See Live Demo</a>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:60}}>
        {stats.map((s,i)=><div key={i} style={{background:'#111',border:'1px solid #C9A22740',borderRadius:12,padding:24,textAlign:'center'}}><div style={{fontSize:28,fontWeight:800,color:'#C9A227',marginBottom:8}}>{s.v}</div><p style={{color:'#888',fontSize:13,margin:0}}>{s.l}</p></div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24,marginBottom:60}}>
        {features.map((f,i)=><div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:12,padding:24}}><div style={{fontSize:28,marginBottom:12}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:'#888',fontSize:14,lineHeight:1.5}}>{f.d}</p></div>)}
      </div>
      <div style={{background:'#111',border:'1px solid #C9A22740',borderRadius:12,padding:40,textAlign:'center'}}>
        <h2 style={{color:'#C9A227',marginBottom:8}}>Live demo: Lume Cannabis OG Kush</h2>
        <p style={{color:'#aaa',marginBottom:24}}>STRAIN-SC-OG-KUSH-2026 · Cultivation → Lab → Packaging → Dispensary · 100% authentic</p>
        <a href="https://authichain.com/verify/STRAIN-SC-OG-KUSH-2026" style={{padding:'12px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:6}}>Scan Now →</a>
      </div>
    </div>
  );
}
