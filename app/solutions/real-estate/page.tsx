export const metadata={title:'AuthiChain for Real Estate — Property Title & Deed Authentication',description:'Eliminate title fraud and wire fraud with blockchain-anchored property authentication. Each deed and title gets an AUTHI-PROP-* truemark.'};
export default function RealEstatePage(){
  const stats=[{v:'$3.2B',l:'Annual wire fraud losses in US real estate'},{v:'$447M',l:'Title fraud cases reported in 2023'},{v:'21 days',l:'Average time to detect real estate fraud without AuthiChain'},{v:'<2s',l:'AuthiChain property verification time'}];
  const features=[{icon:'🏠',t:'Deed & Title Authentication',d:'Every property deed registered as AUTHI-PROP-[STATE]-[PARCEL]. Guardian confirms title chain integrity. No more fraudulent deed transfers.'},{icon:'🔑',t:'Wire Transfer Verification',d:'Escrow agent scans AuthiChain QR before releasing funds. Sentinel confirms all parties are verified in the transaction chain.'},{icon:'📄',t:'Title Insurance Integration',d:'Archivist maintains full ownership history from original grant deed. Title insurers access verified chain via API. Underwriting time cut by 40%.'},{icon:'🌍',t:'International Property',d:'Cross-border property verification for UHNW clients. AuthiChain supports Cayman, Dubai, Singapore, Cyprus registration frameworks.'},{icon:'🤖',t:'Automated Closing',d:'Smart contract escrow on Polygon: funds release only when Guardian + Archivist reach 90%+ trust consensus on all documents.'},{icon:'⚡',t:'HOA & Commercial',d:'Commercial leases, HOA agreements, and easements all authenticated. Scout monitors public records for unauthorized modifications.'}];
  return(<div style={{maxWidth:900,margin:'0 auto',padding:'60px 20px',background:'#0a0a0a',color:'#e5e5e5',fontFamily:'sans-serif',minHeight:'100vh'}}>
    <div style={{textAlign:'center',marginBottom:60}}>
      <p style={{color:'#C9A227',fontWeight:700,letterSpacing:'.2em',fontSize:12,marginBottom:16}}>AUTHICHAIN · REAL ESTATE</p>
      <h1 style={{fontSize:48,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:16}}>Title Fraud Ends Here.<br/>Blockchain-Verified Property.</h1>
      <p style={{fontSize:18,color:'#aaa',maxWidth:560,margin:'0 auto 32px'}}>Every deed, title, and closing document gets a blockchain truemark. Agents, title companies, and investors verify in seconds.</p>
      <a href="https://authichain.com/pricing" style={{display:'inline-block',padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:8}}>Start Free →</a>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:60}}>
      {stats.map((s,i)=><div key={i} style={{background:'#111',border:'1px solid #C9A22740',borderRadius:12,padding:24,textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:'#C9A227',marginBottom:8}}>{s.v}</div><p style={{color:'#888',fontSize:13,margin:0}}>{s.l}</p></div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
      {features.map((f,i)=><div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:12,padding:24}}><div style={{fontSize:28,marginBottom:12}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:'#888',fontSize:14,lineHeight:1.5}}>{f.d}</p></div>)}
    </div>
  </div>);
}
