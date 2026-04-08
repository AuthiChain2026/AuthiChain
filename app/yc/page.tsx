export const metadata = { title:"Y Combinator S26 — AuthiChain Application", description:"AuthiChain Y Combinator S26 application. Blockchain product authentication — the truth layer for every physical product." }
export default function YCPage() {
  const deadline = new Date("2026-04-11")
  const now = new Date()
  const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000*60*60*24))
  const qa = [
    ["Company tagline","Verifiable product authenticity in 2.1 seconds — blockchain provenance rails for every physical good."],
    ["What does it do","AuthiChain creates cryptographically unforgeable product provenance. Manufacturers register via REST API → ERC-721 NFT on Polygon → AI QR code on label → any smartphone confirms AUTHENTIC or COUNTERFEIT in 2.1 seconds. No app. No hardware. $0.004/seal vs $0.50+ RFID."],
    ["Why now","Three forces converge in 2026: (1) EU Digital Product Passport mandate — blockchain provenance legally required for all goods sold in Europe. (2) CBP de minimis overhaul — new import authentication requirements. (3) Polygon costs dropped to $0.001/tx — blockchain seals viable at consumer scale. All three hit simultaneously."],
    ["Traction","QRON: $127 first revenue Dec 2025. AuthiChain: 1,023 blockchain certs issued, live API on RapidAPI, $47M ACV pipeline (172 HubSpot deals — LVMH, Hermès, Moderna, BMW). 279+ enterprise emails, 25 batches, 17+ sectors. DHS SVIP $800K grant applied. DoD APEX Accelerators enrolled. Infrastructure cost $0/month."],
    ["Founders","Zachary Kietzman — Sole Founder, Gaylord MI. Full-stack: JS/TS, Python, Solidity, Cloudflare Workers, Supabase. Built all three platforms solo in 6 months. 40+ workers deployed, 60+ CI/CD commits. Ships infrastructure and closes enterprise deals simultaneously."],
  ]
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",padding:"48px 24px",maxWidth:780,margin:"0 auto"}}>
      <a href="/" style={{color:"#c9a227",textDecoration:"none",fontSize:13,fontWeight:600}}>← AuthiChain</a>
      <div style={{display:"flex",alignItems:"center",gap:14,margin:"24px 0 8px",flexWrap:"wrap"}}>
        <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:900,color:"#c9a227"}}>Y Combinator S26</h1>
        <div style={{background:"rgba(239,68,68,.12)",border:"1px solid rgba(239,68,68,.3)",color:"#ef4444",padding:"5px 14px",borderRadius:8,fontSize:12,fontWeight:700}}>
          {daysLeft} days left — April 11
        </div>
      </div>
      <p style={{color:"rgba(255,255,255,.4)",marginBottom:40}}>
        Submit at <a href="https://ycombinator.com/apply" target="_blank" rel="noreferrer" style={{color:"#c9a227"}}>ycombinator.com/apply ↗</a>
      </p>
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        {qa.map(([q,a])=>(
          <div key={q} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(201,162,39,.12)",borderLeft:"3px solid #c9a227",borderRadius:12,padding:"20px 24px"}}>
            <div style={{fontSize:11,color:"rgba(201,162,39,.6)",fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>{q}</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,.8)",lineHeight:1.75}}>{a}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:40,padding:"28px",background:"rgba(201,162,39,.06)",border:"1.5px solid rgba(201,162,39,.25)",borderRadius:14,textAlign:"center"}}>
        <div style={{fontSize:16,fontWeight:700,color:"#c9a227",marginBottom:16}}>⚠️ One thing still needed from you</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,.6)",marginBottom:20,lineHeight:1.7}}>
          Record a 2-minute founder video at <a href="/demo-video" style={{color:"#c9a227"}}>authichain.com/demo-video</a><br/>
          Open Loom → Screen + Camera → hit ▶ Start → voice narrates automatically
        </div>
        <a href="/demo-video" style={{display:"inline-block",background:"#c9a227",color:"#000",padding:"12px 28px",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14}}>Open Demo Video Page →</a>
      </div>
    </main>
  )
}
