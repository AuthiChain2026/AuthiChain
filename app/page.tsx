import Link from "next/link"

export const metadata = {
  title: "AuthiChain — Blockchain Product Authentication",
  description: "Cryptographic provenance for every physical product. ERC-721 NFT + QR code + 2.1 second verification. The truth layer for the physical world.",
}

const STATS = [
  {v:"2.1s",l:"Verification time"},
  {v:"$0.004",l:"Per seal"},
  {v:"1,023+",l:"Certs issued"},
  {v:"Polygon",l:"Blockchain"},
]

const PLATFORMS = [
  {name:"AuthiChain",sub:"Enterprise blockchain authentication",url:"https://authichain.com/portal",color:"#c9a227",icon:"◆"},
  {name:"QRON",sub:"AI-generated QR art",url:"https://qron.space/order",color:"#84cc16",icon:"⬡"},
  {name:"StrainChain",sub:"Cannabis supply chain compliance",url:"https://strainchain.io",color:"#22c55e",icon:"🌿"},
]

export default function HomePage() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>

      {/* NAV */}
      <nav style={{padding:"16px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"0.5px solid rgba(255,255,255,.07)",position:"sticky",top:0,background:"rgba(8,8,8,.95)",backdropFilter:"blur(12px)",zIndex:50}}>
        <span style={{color:"#c9a227",fontWeight:900,fontSize:"1rem",letterSpacing:".12em"}}>◆ AUTHICHAIN</span>
        <div style={{flex:1}}/>
        {[["Collection","/collection"],["Demo","/demo-video"],["Verify","/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"],["Portal","/portal"],["EU DPP","/compliance"]].map(([label,href])=>(
          <Link key={label} href={href} style={{color:"rgba(255,255,255,.5)",textDecoration:"none",fontSize:13,transition:"color .2s"}}
            onMouseEnter={e=>(e.currentTarget.style.color="#e5e5e5")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.5)")}>{label}</Link>
        ))}
        <Link href="/portal" style={{background:"#c9a227",color:"#000",padding:"7px 18px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:13}}>Get Started</Link>
      </nav>

      {/* HERO */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"96px 24px 72px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:700,height:400,background:"radial-gradient(ellipse,rgba(201,162,39,.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-block",background:"rgba(201,162,39,.1)",border:"1px solid rgba(201,162,39,.3)",color:"#c9a227",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",marginBottom:28}}>
          Y Combinator S26 Applicant
        </div>
        <h1 style={{fontSize:"clamp(32px,7vw,72px)",fontWeight:900,lineHeight:1.08,marginBottom:20,letterSpacing:"-.01em"}}>
          The truth layer for<br/><span style={{color:"#c9a227"}}>every physical product</span>
        </h1>
        <p style={{color:"rgba(255,255,255,.5)",fontSize:"clamp(15px,2vw,20px)",lineHeight:1.7,maxWidth:620,margin:"0 auto 44px"}}>
          Manufacturers register a product batch. A blockchain NFT is minted. An AI QR code goes on the label.
          Any smartphone verifies authenticity in 2.1 seconds — no app, no hardware.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"
            style={{background:"#c9a227",color:"#000",padding:"14px 32px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:15}}>
            ▶ See Live Demo
          </Link>
          <Link href="/demo-video"
            style={{background:"transparent",border:"1px solid rgba(255,255,255,.2)",color:"#e5e5e5",padding:"14px 28px",borderRadius:12,textDecoration:"none",fontSize:15}}>
            Watch Demo Video
          </Link>
          <Link href="/collection"
            style={{background:"transparent",border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"14px 24px",borderRadius:12,textDecoration:"none",fontSize:15}}>
            🌿 NFT Collection
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{borderTop:"0.5px solid rgba(255,255,255,.06)",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24}}>
          {STATS.map(({v,l})=>(
            <div key={l} style={{textAlign:"center"}}>
              <div style={{fontSize:32,fontWeight:900,color:"#c9a227"}}>{v}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)",marginTop:6,textTransform:"uppercase",letterSpacing:".08em"}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THREE PLATFORMS */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"72px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontSize:"clamp(22px,4vw,40px)",fontWeight:900,marginBottom:12}}>The Authentic Economy</h2>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:15}}>Three platforms. One protocol. One truth layer.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:18}}>
          {PLATFORMS.map(({name,sub,url,color,icon})=>(
            <a key={name} href={url} target={url.startsWith("http")?"_blank":undefined} rel="noreferrer"
              style={{background:"rgba(255,255,255,.03)",border:`1px solid ${color}20`,borderRadius:16,padding:"28px 24px",textDecoration:"none",display:"block",transition:"all .2s",color:"inherit"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}60`;e.currentTarget.style.background=`${color}08`;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=`${color}20`;e.currentTarget.style.background="rgba(255,255,255,.03)";}}>
              <div style={{fontSize:32,marginBottom:14}}>{icon}</div>
              <div style={{fontSize:18,fontWeight:800,color,marginBottom:8}}>{name}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>{sub}</div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:"rgba(255,255,255,.02)",borderTop:"0.5px solid rgba(255,255,255,.06)",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"72px 24px"}}>
          <h2 style={{fontSize:"clamp(20px,4vw,36px)",fontWeight:900,textAlign:"center",marginBottom:48}}>How it works</h2>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:0}}>
            {[
              {step:"01",title:"Register via API",sub:"Manufacturer sends batch data"},
              {step:"02",title:"NFT minted",sub:"ERC-721 on Polygon — $0.004"},
              {step:"03",title:"QR on label",sub:"QRON AI art — scannable"},
              {step:"04",title:"Smartphone scans",sub:"Any camera, no app"},
              {step:"05",title:"AUTHENTIC ✓",sub:"2.1 seconds, blockchain-certain"},
            ].map(({step,title,sub},i,arr)=>(
              <div key={step} style={{display:"flex",alignItems:"center"}}>
                <div style={{textAlign:"center",minWidth:120,padding:"0 8px"}}>
                  <div style={{fontSize:11,color:"rgba(201,162,39,.5)",fontWeight:700,letterSpacing:".1em",marginBottom:8}}>{step}</div>
                  <div style={{fontSize:14,fontWeight:700,color:i===arr.length-1?"#22c55e":"#e5e5e5",marginBottom:4}}>{title}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,.35)"}}>{sub}</div>
                </div>
                {i<arr.length-1&&<div style={{color:"rgba(201,162,39,.3)",padding:"0 4px",fontSize:20,marginBottom:20}}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"72px 24px",textAlign:"center"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,36px)",fontWeight:900,marginBottom:16}}>Ready to verify?</h2>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:15,marginBottom:36}}>Live API · RapidAPI marketplace · OpenAPI 3.0 · $0.004/seal</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/portal" style={{background:"#c9a227",color:"#000",padding:"14px 32px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:15}}>Start Free Trial</Link>
          <Link href="/api/v1/health" style={{border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.6)",padding:"14px 24px",borderRadius:12,textDecoration:"none",fontSize:15}}>API Status ↗</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"0.5px solid rgba(255,255,255,.06)",padding:"28px 32px",display:"flex",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <span style={{color:"#c9a227",fontWeight:900,fontSize:".85rem",letterSpacing:".1em"}}>◆ AUTHICHAIN</span>
        <div style={{flex:1}}/>
        {[["qron.space","https://qron.space"],["strainchain.io","https://strainchain.io"],["z@authichain.com","mailto:z@authichain.com"]].map(([label,href])=>(
          <a key={label} href={href} style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>{label}</a>
        ))}
        <span style={{color:"rgba(255,255,255,.15)",fontSize:11}}>© 2026 AuthiChain, Inc.</span>
      </footer>
    </main>
  )
}
