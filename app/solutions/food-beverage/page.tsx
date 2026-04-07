export const metadata={title:'AuthiChain for Food & Beverage — Farm-to-Table Authentication',description:'Blockchain-anchored food provenance. Verify origin claims, allergen data, and sustainability certifications. EU DPP food mandate ready.'};
export default function FoodPage(){
  const features=[{icon:'🌾',t:'Farm-to-Table Chain',d:'Each batch: farm origin, harvest date, processing facility, packaging line. AUTHI-FOOD-ORG-* truemark on every SKU.'},{icon:'🌿',t:'Organic & Fair Trade Proof',d:'Certification claims anchored on-chain. Scout monitors competitor claims. Archivist traces supply chain back to origin farm.'},{icon:'🧪',t:'Lab Result Anchoring',d:'Pesticide, heavy metal, and allergen test results stored on Polygon. Consumer scans to verify food safety claims are unaltered.'},{icon:'🔄',t:'Recall Intelligence',d:'Batch-level authentication enables instant recall. AUTHI-* scan at retail = immediate safe/unsafe classification.'},{icon:'🌍',t:'EU DPP Food Mandate',d:'EU food sector DPP mandate approaching. AuthiChain generates compliant digital product passports automatically per SKU.'},{icon:'⚡',t:'Restaurant & Hospitality',d:'Premium restaurant menus: Wagyu beef, truffles, single-origin coffee — each ingredient authenticated for luxury dining experiences.'}];
  return(<div style={{maxWidth:900,margin:'0 auto',padding:'60px 20px',background:'#0a0a0a',color:'#e5e5e5',fontFamily:'sans-serif',minHeight:'100vh'}}>
    <div style={{textAlign:'center',marginBottom:60}}>
      <p style={{color:'#C9A227',fontWeight:700,letterSpacing:'.2em',fontSize:12,marginBottom:16}}>AUTHICHAIN · FOOD & BEVERAGE</p>
      <h1 style={{fontSize:48,fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:16}}>Prove What's In<br/>Every Bite and Sip.</h1>
      <p style={{fontSize:18,color:'#aaa',maxWidth:560,margin:'0 auto 32px'}}>Farm-to-table blockchain traceability. Organic claims, allergen safety, and sustainability certifications — all verifiable on-chain.</p>
      <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
        <a href="https://authichain.com/pricing" style={{padding:'14px 28px',background:'#C9A227',color:'#000',fontWeight:700,textDecoration:'none',borderRadius:8}}>Start Free →</a>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
      {features.map((f,i)=><div key={i} style={{background:'#111',border:'1px solid #ffffff10',borderRadius:12,padding:24}}><div style={{fontSize:28,marginBottom:12}}>{f.icon}</div><h3 style={{color:'#fff',marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:'#888',fontSize:14,lineHeight:1.5}}>{f.d}</p></div>)}
    </div>
  </div>);
}
