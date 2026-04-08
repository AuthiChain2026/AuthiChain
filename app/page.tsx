import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      <style>{`
        .nav-link{color:rgba(255,255,255,.5);text-decoration:none;font-size:13px;transition:color .2s;}
        .nav-link:hover{color:#e5e5e5;}
        .platform-card{background:rgba(255,255,255,.03);border-radius:16px;padding:28px 24px;text-decoration:none;display:block;transition:all .2s;color:inherit;}
        .platform-card-green{border:1px solid rgba(34,197,94,.2);}
        .platform-card-green:hover{border-color:rgba(34,197,94,.6);background:rgba(34,197,94,.08);}
        .platform-card-gold{border:1px solid rgba(201,162,39,.2);}
        .platform-card-gold:hover{border-color:rgba(201,162,39,.6);background:rgba(201,162,39,.08);}
        .platform-card-lime{border:1px solid rgba(132,204,22,.2);}
        .platform-card-lime:hover{border-color:rgba(132,204,22,.6);background:rgba(132,204,22,.08);}
        .outline-btn{background:transparent;border:1px solid rgba(255,255,255,.2);color:#e5e5e5;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px;transition:all .2s;}
        .outline-btn:hover{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.06);}
        .green-btn{background:transparent;border:1px solid rgba(34,197,94,.3);color:#22c55e;padding:14px 24px;border-radius:12px;text-decoration:none;font-size:15px;transition:all .2s;}
        .green-btn:hover{border-color:#22c55e;background:rgba(34,197,94,.08);}
        .api-btn{border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);padding:14px 24px;border-radius:12px;text-decoration:none;font-size:15px;transition:all .2s;}
        .api-btn:hover{border-color:rgba(255,255,255,.4);}
        .footer-link{color:rgba(255,255,255,.3);text-decoration:none;font-size:12px;}
        .footer-link:hover{color:rgba(255,255,255,.6);}
      `}</style>

      {/* NAV */}
      <nav style={{padding:"16px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"0.5px solid rgba(255,255,255,.07)",position:"sticky",top:0,background:"rgba(8,8,8,.95)",backdropFilter:"blur(12px)",zIndex:50,flexWrap:"wrap"}}>
        <span style={{color:"#c9a227",fontWeight:900,fontSize:"1rem",letterSpacing:".12em"}}>◆ AUTHICHAIN</span>
        <div style={{flex:1}}/>
        {[["Collection","/collection"],["Demo","/demo-video"],["Verify","/verify/AC-1829577CED8F6BFBB0BC667CDE33DF0E"],["Portal","/portal"],["EU DPP","/compliance"],["Grants","/grants"]].map(([label,href])=>(
          <Link key={label} href={href} className="nav-link">{label}</Link>
        ))}
        <Link href="/portal" style={{background:"#c9a227",color:"#000",padding:"7px 18px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:13}}>Get Started</Link>
      </nav>

      {/* HERO */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"96px 24px 72px",textAlign:"center",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:700,height:400,background:"radial-gradient(ellipse,rgba(201,162,39,.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-block",background:"rgba(201,162,39,.1)",border:"1px solid rgba(201,162,39,.3)",color:"#c9a227",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",marginBottom:28}}>
          Y Combinator S26 Applicant · April 11 Deadline
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
          <Link href="/demo-video" className="outline-btn">Watch Demo Video</Link>
          <Link href="/collection" className="green-btn">🌿 NFT Collection</Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{borderTop:"0.5px solid rgba(255,255,255,.06)",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24}}>
          {[["2.1s","Verification time"],["$0.004","Per seal"],["1,023+","Certs issued"],["Polygon","Blockchain"]].map(([v,l])=>(
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
          <a href="https://strainchain.io" target="_blank" rel="noreferrer" className="platform-card platform-card-green">
            <div style={{fontSize:32,marginBottom:14}}>🌿</div>
            <div style={{fontSize:18,fontWeight:800,color:"#22c55e",marginBottom:8}}>StrainChain</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>Cannabis supply chain authentication — COA verification, METRC sync, seed-to-sale chain, packaging art NFTs</div>
          </a>
          <Link href="/portal" className="platform-card platform-card-gold">
            <div style={{fontSize:32,marginBottom:14}}>◆</div>
            <div style={{fontSize:18,fontWeight:800,color:"#c9a227",marginBottom:8}}>AuthiChain</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>Enterprise blockchain product authentication — any industry, any product, any scale</div>
          </Link>
          <a href="https://qron.space/order" target="_blank" rel="noreferrer" className="platform-card platform-card-lime">
            <div style={{fontSize:32,marginBottom:14}}>⬡</div>
            <div style={{fontSize:18,fontWeight:800,color:"#84cc16",marginBottom:8}}>QRON</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>AI-generated QR art that carries an AuthiChain blockchain certificate in every scan</div>
          </a>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:"rgba(255,255,255,.02)",borderTop:"0.5px solid rgba(255,255,255,.06)",borderBottom:"0.5px solid rgba(255,255,255,.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"72px 24px"}}>
          <h2 style={{fontSize:"clamp(20px,4vw,36px)",fontWeight:900,textAlign:"center",marginBottom:48}}>How it works</h2>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:0}}>
            {[
              ["01","Register via API","Manufacturer sends batch data"],
              ["02","NFT minted","ERC-721 on Polygon — $0.004"],
              ["03","QR on label","QRON AI art — scannable"],
              ["04","Smartphone scans","Any camera, no app"],
              ["05","AUTHENTIC ✓","2.1 seconds, blockchain-certain"],
            ].map(([step,title,sub],i,arr)=>(
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

      {/* CTA */}
      <section style={{maxWidth:900,margin:"0 auto",padding:"72px 24px",textAlign:"center"}}>
        <h2 style={{fontSize:"clamp(20px,4vw,36px)",fontWeight:900,marginBottom:16}}>Ready to verify?</h2>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:15,marginBottom:36}}>Live API · RapidAPI marketplace · OpenAPI 3.0 · $0.004/seal</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <Link href="/portal" style={{background:"#c9a227",color:"#000",padding:"14px 32px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:15}}>Start Free Trial</Link>
          <Link href="/api/v1/health" className="api-btn">API Status ↗</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:"0.5px solid rgba(255,255,255,.06)",padding:"28px 32px",display:"flex",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <span style={{color:"#c9a227",fontWeight:900,fontSize:".85rem",letterSpacing:".1em"}}>◆ AUTHICHAIN</span>
        <div style={{flex:1}}/>
        <a href="https://qron.space" className="footer-link">qron.space</a>
        <a href="https://strainchain.io" className="footer-link">strainchain.io</a>
        <a href="mailto:z@authichain.com" className="footer-link">z@authichain.com</a>
        <span style={{color:"rgba(255,255,255,.15)",fontSize:11}}>© 2026 AuthiChain, Inc.</span>
      </footer>
    </main>
  )
}
