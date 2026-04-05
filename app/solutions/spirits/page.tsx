export const metadata={title:'AuthiChain for Spirits — Whiskey & Spirits Authentication',description:'Protect premium spirits from counterfeiting and grey-market diversion. Blockchain-anchored authentication from distillery to consumer.'};
export default function SpiritsPage(){
  const stats=[{v:'$4.4B',l:'Global counterfeit spirits market'},{v:'13%',l:'Premium spirits sold through grey market channels'},{v:'100%',l:'AuthiChain authenticity rate on registered bottles'},{v:'6',l:'Provenance events tracked per bottle (distill→age→bottle→ship→retail→consumer)'}];
  const features=[{icon:'🥃',t:'Distillery-to-Consumer Chain',d:'Every lot number: distillation date, barrel ID, aging duration, bottling line. Archivist anchors each event on Polygon. Consumer scans label QR for full story.'},{icon:'🔒',t:'Anti-Refill Detection',d:'Sentinel tracks velocity patterns. Same bottle scanned 10x in 30 days flags for refilling/reuse investigation. Automatic brand alert.'},{icon:'🌍',t:'Grey Market Scout',d:'Scout monitors eBay, Total Wine listings, and secondary auction platforms for suspicious price patterns on your SKUs.'},{icon:'📱',t:'QRON Art Label QR',d:'Replace generic QR squares with AI-generated nebula art, aged parchment, or barrel grain textures. Scan rate 3x higher than standard QR.'},{icon:'🏆',t:'Age Verification Proof',d:'12-year scotch claims verified via blockchain timestamp on barrel registration. No more fraudulent vintage claims.'},{icon:'⚡',t:'EU DPP Ready',d:'Spirits included in EU Digital Product Passport mandate. AuthiChain generates DPP-compliant records automatically.'}];
  return(<div style={{maxWidth:900,margin:'0 auto',padding:'60px 20px',background:'#0a0a0a',color:'#e5e5e5',fontFamily:'sans-serif',minHeight:'100vh'}}>
    <div style={{textAlign:'center',marginBottom:60}}>
      <p style={{color:'#C9A227',fontWeight:700,letterSpacing:'.2em',fontSize:12,marginBottom:16}}>AUTHICHAIN · SPIRITS & WHISKEY</p>
      <h1 style={{fontSize:48,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:16}}>Authenticate Every<br/>Drop. From Distillery to Glass.</h1>
      <p style={{fontSize:18,color:'#aaa',maxWidth:560,margin:'0 auto 32px'}}>Blockchain provenance for Scotch, Bourbon, Tequila, and Gin. Diageo, Pernod Ricard, and craft distilleries use AuthiChain.</p>
      <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
        <a href="https://authichain.com/pricing" style={{padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:8}}>Start Free →</a>
        <a href="https://authichain.com/verify/AUTHI-HERM-LUX-MVLN4NH023" style={{padding:'14px 28px',border:'1px solid #C9A22760',color:'#C9A227',textDecoration:'none',borderRadius:8}}>See Live Demo</a>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:60}}>
      {stats.map((s,i)=><div key={i} style={{background:'#111',border:'1px solid #C9A22740',borderRadius:12,padding:24,textAlign:'center'}}><div style={{fontSize:24,fontWeight:800,color:'#C9A227',marginBottom:8}}>{s.v}</div><p style={{color:'#888',fontSize:13,margin:0}}>{s.l}</p></div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
      {features.map((f,i)=><div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:12,padding:24}}><div style={{fontSize:28,marginBottom:12}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:'#888',fontSize:14,lineHeight:1.5}}>{f.d}</p></div>)}
    </div>
  </div>);
}
