export const metadata = { title:"StrainChain — Cannabis Supply Chain Authentication", description:"Blockchain seed-to-sale compliance, COA verification, METRC sync, and packaging art NFTs for cannabis." }
export default function StrainChainPage() {
  const feats = [
    {icon:"🔬",t:"COA Verification",d:"Certificate of Analysis hash anchored on-chain. Pesticide screens, THC/CBD, terpene profiles — all immutable."},
    {icon:"📋",t:"METRC Sync",d:"Real-time California, Colorado, Michigan METRC sync. Transfer manifests, inventory reconciliation, compliance reporting."},
    {icon:"⛓",t:"Seed-to-Sale Chain",d:"8-event lifecycle ledger: seed → clone → veg → flower → harvest → dry → lab → package. On Polygon + BTC Ordinal."},
    {icon:"🎨",t:"Packaging Art NFTs",d:"ArtGuard authenticates cannabis packaging as collectible NFTs. Product value + art premium = dual-layer token."},
    {icon:"📱",t:"Consumer Verification",d:"QR scan → AUTHENTIC in 2.1 seconds. Any smartphone. Batch info, COA link, strain story."},
    {icon:"⚖",t:"Instant Compliance",d:"California BCC, Colorado MED, Michigan LARA. All 7 requirements satisfied automatically by the authentication flow."},
  ]
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      <nav style={{padding:"16px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"0.5px solid rgba(255,255,255,.07)"}}>
        <span style={{color:"#22c55e",fontWeight:900,fontSize:"1rem",letterSpacing:".1em"}}>🌿 STRAINCHAIN</span>
        <div style={{flex:1}}/>
        <a href="https://authichain.com" style={{color:"rgba(255,255,255,.4)",textDecoration:"none",fontSize:12}}>Powered by AuthiChain ◆</a>
      </nav>

      <section style={{maxWidth:860,margin:"0 auto",padding:"88px 24px 64px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:600,height:320,background:"radial-gradient(ellipse,rgba(34,197,94,.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-block",background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",marginBottom:24}}>
          Cannabis Compliance + Blockchain
        </div>
        <h1 style={{fontSize:"clamp(28px,6vw,60px)",fontWeight:900,lineHeight:1.1,marginBottom:18,letterSpacing:"-.01em"}}>
          Every batch.<br/><span style={{color:"#22c55e"}}>Verified. Forever.</span>
        </h1>
        <p style={{color:"rgba(255,255,255,.45)",fontSize:"clamp(14px,1.8vw,18px)",lineHeight:1.75,maxWidth:580,margin:"0 auto 44px"}}>
          StrainChain is blockchain-based cannabis supply chain authentication. COA verification, METRC sync, seed-to-sale chain, and packaging art NFTs — all in one protocol built on AuthiChain.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="https://authichain.com/demo-video" style={{background:"#22c55e",color:"#000",padding:"14px 32px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:15}}>▶ Watch Demo</a>
          <a href="mailto:z@authichain.com?subject=StrainChain Demo Request" style={{border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"14px 24px",borderRadius:12,textDecoration:"none",fontSize:15}}>Request Access</a>
          <a href="https://authichain.com/collection" style={{border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.6)",padding:"14px 20px",borderRadius:12,textDecoration:"none",fontSize:15}}>NFT Collection ↗</a>
        </div>
      </section>

      <section style={{background:"rgba(34,197,94,.03)",borderTop:"0.5px solid rgba(34,197,94,.1)",borderBottom:"0.5px solid rgba(34,197,94,.1)"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"64px 24px"}}>
          <h2 style={{fontSize:"clamp(20px,4vw,34px)",fontWeight:900,textAlign:"center",marginBottom:40}}>Full-stack compliance, on-chain</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
            {feats.map(({icon,t,d})=>(
              <div key={t} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(34,197,94,.12)",borderRadius:14,padding:"22px 20px"}}>
                <div style={{fontSize:28,marginBottom:12}}>{icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:"#22c55e",marginBottom:8}}>{t}</div>
                <div style={{fontSize:12.5,color:"rgba(255,255,255,.45)",lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{maxWidth:600,margin:"0 auto",padding:"72px 24px",textAlign:"center"}}>
        <div style={{background:"rgba(34,197,94,.06)",border:"1.5px solid rgba(34,197,94,.25)",borderRadius:18,padding:"44px 36px"}}>
          <div style={{fontSize:13,color:"rgba(34,197,94,.7)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Pricing</div>
          <div style={{fontSize:36,fontWeight:900,color:"#22c55e",marginBottom:6}}>$199 – $999</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,.4)",marginBottom:28}}>per month · includes METRC sync, COA anchoring, QR codes</div>
          <a href="mailto:z@authichain.com?subject=StrainChain Pricing" style={{display:"inline-block",background:"#22c55e",color:"#000",padding:"13px 32px",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14}}>Get Started</a>
        </div>
      </section>

      <footer style={{borderTop:"0.5px solid rgba(255,255,255,.06)",padding:"24px 32px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <span style={{color:"#22c55e",fontWeight:900,fontSize:".85rem"}}>🌿 STRAINCHAIN</span>
        <div style={{flex:1}}/>
        <a href="https://authichain.com" style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>authichain.com</a>
        <a href="https://qron.space" style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>qron.space</a>
        <a href="mailto:z@authichain.com" style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>z@authichain.com</a>
        <span style={{color:"rgba(255,255,255,.15)",fontSize:11}}>© 2026 AuthiChain, Inc.</span>
      </footer>
    </main>
  )
}
