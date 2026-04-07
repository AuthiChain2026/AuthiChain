export default function LaunchPage() {
  return (
    <div style={{maxWidth:'900px',margin:'0 auto',padding:'60px 20px',fontFamily:'sans-serif',background:'#0a0a0a',color:'#e5e5e5',minHeight:'100vh'}}>
      <div style={{textAlign:'center',marginBottom:'60px'}}>
        <p style={{color:'#C9A227',fontWeight:'700',letterSpacing:'.2em',fontSize:'12px',marginBottom:'16px'}}>AUTHICHAIN · PRODUCT HUNT LAUNCH</p>
        <h1 style={{fontSize:'48px',fontWeight:'800',color:'#fff',lineHeight:'1.1',marginBottom:'16px'}}>
          The Truth Layer<br/>for the Physical World
        </h1>
        <p style={{fontSize:'20px',color:'#aaa',maxWidth:'600px',margin:'0 auto 32px'}}>
          Blockchain authentication + AI provenance stories + $QRON scan-to-earn rewards. 
          Beat VeChain at $299/mo with no sales call.
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
          <a href="https://authichain.com/verify/AUTHI-HERM-LUX-MVLN4NH023" style={{padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:'700',textDecoration:'none',borderRadius:'8px',fontSize:'16px'}}>
            See Live Demo →
          </a>
          <a href="https://authichain.com/pricing" style={{padding:'14px 28px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:'8px',fontSize:'16px'}}>
            Start Free
          </a>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'24px',marginBottom:'60px'}}>
        {[
          {icon:'🛡️',title:'5-Agent AI Consensus',desc:'Guardian · Archivist · Sentinel · Scout · Arbiter — weighted consensus on every scan'},
          {icon:'🎨',title:'QRON Art QR Codes',desc:'AI-generated scannable art tied to blockchain certificates. Not your grandma\'s QR code.'},
          {icon:'⚡',title:'$QRON Scan-to-Earn',desc:'Consumers earn $QRON tokens for authenticating products. VeChain has no token rewards.'},
          {icon:'📖',title:'Storymode Narratives',desc:'Groq LLM writes premium provenance stories for every product. 6 narrative types.'},
          {icon:'🌍',title:'Multi-Vertical OS',desc:'Luxury, pharma, cannabis, automotive, fashion, spirits — one API for all industries.'},
          {icon:'💰',title:'$299/mo Self-Serve',desc:'VeChain charges $50K-$500K/yr. We charge $299/mo with no sales call required.'},
        ].map((f,i) => (
          <div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:'12px',padding:'24px'}}>
            <div style={{fontSize:'32px',marginBottom:'12px'}}>{f.icon}</div>
            <h3 style={{color:'#fff',marginBottom:'8px',fontSize:'16px'}}>{f.title}</h3>
            <p style={{color:'#888',fontSize:'14px',lineHeight:'1.5'}}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center',background:'#111',border:'1px solid #C9A22740',borderRadius:'12px',padding:'40px'}}>
        <h2 style={{color:'#C9A227',marginBottom:'8px'}}>Live right now</h2>
        <p style={{color:'#aaa',marginBottom:'24px'}}>Hermès Birkin 35 · Patagonia Duffel · Rolex Submariner · Gucci Dionysus · Lume Cannabis OG Kush</p>
        <p style={{color:'#888',fontSize:'14px'}}>54 edge functions · 96 tables · $27M enterprise pipeline · 100% authenticity rate</p>
      </div>
    </div>
  );
}
