export const metadata = { title: 'AuthiChain for Automotive — OEM Parts Authentication', description: 'Stop counterfeit parts before they reach the assembly line. AuthiChain authenticates OEM components at manufacture, enabling dealers and consumers to verify instantly.' };
export default function AutomotivePage() {
  const stats = [
    { v: '$75B', l: 'Global counterfeit auto parts market annually' },
    { v: '26M', l: 'Fake auto parts installed in US vehicles each year' },
    { v: '500+', l: 'Deaths attributed to counterfeit airbags since 2009' },
    { v: '$299/mo', l: 'AuthiChain Starter — no $500K enterprise contract required' },
  ];
  const features = [
    { icon: '🏭', t: 'Manufacture-Point Registration', d: 'Each OEM part receives AUTHI-[BRAND]-AUT-* truemark at the production line. Batch API: 50 parts per call.' },
    { icon: '🔍', t: 'Dealer Verification', d: 'Service technicians scan the QR at the point of install. Guardian + Sentinel agents confirm authenticity in <200ms.' },
    { icon: '🤖', t: 'Scout Marketplace Monitor', d: 'Scout agent continuously scans eBay, Amazon, and aftermarket platforms for suspicious listings of your SKUs.' },
    { icon: '📊', t: 'Warranty Intelligence', d: 'Link part authentication to warranty claims. Sentinel detects grey-market parts, voiding fraudulent warranty submissions automatically.' },
    { icon: '🌍', t: 'Supply Chain Visibility', d: 'Archivist traces every part from tier-1 supplier → OEM → dealer → install event. Full chain of custody on Polygon.' },
    { icon: '⚡', t: 'Recall Intelligence', d: 'When a recall is issued, instantly identify all authenticated parts in the field. Reduce recall campaign cost by 40–60%.' },
  ];
  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:'60px 20px',background:'#0a0a0a',color:'#e5e5e5',fontFamily:'sans-serif',minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:60}}>
        <p style={{color:'#C9A227',fontWeight:700,letterSpacing:'.2em',fontSize:12,marginBottom:16}}>AUTHICHAIN · AUTOMOTIVE</p>
        <h1 style={{fontSize:48,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:16}}>Stop Counterfeit Parts<br/>Before They Cause Harm</h1>
        <p style={{fontSize:18,color:'#aaa',maxWidth:560,margin:'0 auto 32px'}}>Blockchain-anchored OEM part authentication from the production line to the dealer bay. Porsche, BMW, and Tier-1 suppliers use AuthiChain.</p>
        <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="https://authichain.com/pricing" style={{padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:8,fontSize:16}}>Start Free →</a>
          <a href="https://authichain.com/verify/AUTHI-BMW-DEF-BRAKES" style={{padding:'14px 28px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:8,fontSize:16}}>See Live Demo</a>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:60}}>
        {stats.map((s,i)=><div key={i} style={{background:'#111',border:'1px solid #C9A22740',borderRadius:12,padding:24,textAlign:'center'}}><div style={{fontSize:26,fontWeight:800,color:'#C9A227',marginBottom:8}}>{s.v}</div><p style={{color:'#888',fontSize:13,margin:0}}>{s.l}</p></div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
        {features.map((f,i)=><div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:12,padding:24}}><div style={{fontSize:28,marginBottom:12}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:'#888',fontSize:14,lineHeight:1.5}}>{f.d}</p></div>)}
      </div>
    </div>
  );
}
