export default function OpenSeaPage(){
  const nfts=[
    {name:"Cosmic Cookie Collector #042",rarity:"LEGENDARY",score:94,floor:1200,emoji:"🛸",stripe:"https://buy.stripe.com/14A4gzfzPf7MfWO8rq1Nu1u"},
    {name:"Jared #001",rarity:"EPIC",score:91,floor:840,emoji:"🫙",stripe:"https://buy.stripe.com/8x2bJ173j7FkfWOazy1Nu1v"},
    {name:"Bling Blaow",rarity:"EPIC",score:89,floor:720,emoji:"💎",stripe:"https://buy.stripe.com/28E28rdrHcZEeSK9vu1Nu1w"},
    {name:"Watermelon Zmartini #000665",rarity:"RARE",score:87,floor:580,emoji:"🍉",stripe:"https://buy.stripe.com/00w5kDevL6Bgh0SdLK1Nu1x"},
    {name:"Myles High #001",rarity:"RARE",score:85,floor:480,emoji:"🎈",stripe:"https://buy.stripe.com/dRmcN53R7e3I4e67nm1Nu1y"},
  ]
  const rc: Record<string,string> = {"LEGENDARY":"#FFD700","EPIC":"#a78bfa","RARE":"#22c55e"}
  const CONTRACT = "0x5db511706FB6317cd23A7655F67450c5AC6e6AA2"
  return(
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",padding:"48px 24px",maxWidth:900,margin:"0 auto"}}>
      <style>{".os-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,.5)!important;}"}</style>
      <a href="/collection" style={{color:"#22c55e",textDecoration:"none",fontSize:13,fontWeight:600}}>{"← Full Collection"}</a>
      <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:900,margin:"24px 0 8px",color:"#22c55e"}}>Marketplace Listings</h1>
      <p style={{color:"rgba(255,255,255,.4)",marginBottom:36}}>StrainChain Cannabis NFT Collection · StrainChain Verified · Polygon Mainnet</p>

      <div style={{background:"rgba(34,197,94,.06)",border:"1px solid rgba(34,197,94,.25)",borderRadius:14,padding:"20px 24px",marginBottom:40}}>
        <div style={{fontWeight:700,color:"#22c55e",marginBottom:8,fontSize:15}}>Contract on Polygon</div>
        <div style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,.6)",wordBreak:"break-all",marginBottom:14}}>{CONTRACT}</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <a href={`https://rarible.com/collection/polygon/${CONTRACT}`} target="_blank" rel="noreferrer"
            style={{background:"#feda03",color:"#000",padding:"9px 18px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:13}}>{"Rarible \u2197"}</a>
          <a href={`https://polygonscan.com/address/${CONTRACT}`} target="_blank" rel="noreferrer"
            style={{background:"rgba(255,255,255,.08)",color:"#e5e5e5",padding:"9px 18px",borderRadius:8,textDecoration:"none",fontSize:13}}>{"PolygonScan \u2197"}</a>
          <a href="https://opensea-integration.undone-k.workers.dev/collection" target="_blank" rel="noreferrer"
            style={{background:"rgba(255,255,255,.05)",color:"rgba(255,255,255,.5)",padding:"9px 18px",borderRadius:8,textDecoration:"none",fontSize:13}}>{"API \u2197"}</a>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16,marginBottom:48}}>
        {nfts.map((n,i)=>{
          const color = rc[n.rarity] || "#333"
          return(
            <div key={i} className="os-card" style={{background:"#0d0d0d",border:`1px solid ${color}20`,borderRadius:14,padding:"20px",transition:"all .2s"}}>
              <div style={{fontSize:40,marginBottom:12}}>{n.emoji}</div>
              <div style={{fontSize:13,fontWeight:800,color:"#e5e5e5",marginBottom:8}}>{n.name}</div>
              <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                <span style={{background:`${color}15`,border:`1px solid ${color}40`,color:color,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4}}>{n.rarity}</span>
                <span style={{background:"rgba(236,72,153,.1)",border:"1px solid rgba(236,72,153,.2)",color:"#ec4899",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:4}}>ArtGuard {n.score}/100</span>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:"#22c55e",marginBottom:14}}>${n.floor.toLocaleString()}</div>
              <a href={n.stripe} target="_blank" rel="noreferrer"
                style={{display:"block",background:"#22c55e",color:"#000",padding:"9px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:12,textAlign:"center"}}>
                Buy Now
              </a>
            </div>
          )
        })}
      </div>

      <div style={{padding:"24px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14}}>
        <div style={{fontWeight:700,color:"#e5e5e5",marginBottom:10}}>About this collection</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.8}}>
          The first cannabis-native NFT series with on-chain provenance. Each piece carries a StrainChain TRUmark certificate
          — COA hash, METRC tag, seed-to-sale chain, and Verde Studio art attribution — verified on Polygon and anchored to Bitcoin via BTC Ordinal.
        </div>
        <div style={{marginTop:14,display:"flex",gap:10,flexWrap:"wrap"}}>
          {["StrainChain Verified","AuthiChain Protocol","QRON Art","BTC Ordinal"].map(t=>(
            <span key={t} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.09)",color:"rgba(255,255,255,.45)",padding:"4px 12px",borderRadius:6,fontSize:11}}>{t}</span>
          ))}
        </div>
      </div>
    </main>
  )
}
