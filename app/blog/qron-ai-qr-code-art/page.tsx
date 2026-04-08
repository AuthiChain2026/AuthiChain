import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "QRON: AI-Generated QR Codes That Are Actually Art | AuthiChain",
  description: "QRON uses AI to transform plain QR codes into scannable artwork — cannabis art, automotive design, luxury patterns — with AuthiChain blockchain certificates embedded in every scan.",
  keywords: ["AI QR code generator","custom QR code art","QRON QR art","blockchain QR code","AI generated QR","branded QR code","artistic QR code scanner"],
};
export default function BlogQRON() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
      <a href="/blog" style={{color:"#84cc16",textDecoration:"none",fontSize:13}}>← Blog</a>
      <div style={{marginTop:24,marginBottom:12,fontSize:11,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".1em"}}>April 8, 2026 · QRON Technology</div>
      <h1 style={{fontSize:"clamp(24px,5vw,44px)",fontWeight:900,color:"#84cc16",lineHeight:1.15,marginBottom:20}}>
        QRON: AI QR Codes That Are Actually Art — And Prove They're Real
      </h1>
      <p style={{fontSize:18,color:"rgba(255,255,255,.6)",lineHeight:1.8,marginBottom:32}}>
        Plain black-and-white QR codes are ignored. QRON codes are scanned — because the artwork compels it. Every QRON code carries an AuthiChain blockchain certificate, so every scan is a proof of authenticity.
      </p>
      {[
        ["What is QRON?","QRON (pronounced 'kron') is an AI-powered QR code art platform built by AuthiChain. It uses FLUX.1-dev and ControlNet to generate scannable artwork from plain QR codes — cannabis bud formations, electric vehicle lightning, luxury geometric patterns, nebula watercolor — while preserving the QR code's scannability through pixel clamping (dark modules ≤55 RGB, light ≥200 RGB). Every QRON code is scannable by any smartphone camera, and every QRON code carries an AuthiChain blockchain certificate of authenticity."],
        ["Why plain QR codes get ignored","Scan rate data consistently shows that plain QR codes generate less than 2% scan rates on packaging. Consumers have learned to ignore them — they look like mandatory compliance marks, not engaging content. QRON solves this by making the QR code itself the artwork. A cannabis bud formation that forms the QR matrix. A sports car with lightning that becomes the code. These get scanned because they're interesting."],
        ["The blockchain layer","Every QRON code is more than art — it's a blockchain certificate. AuthiChain mints an ERC-721 NFT on Polygon ($0.004) when the QRON code is created. The QR code encodes a short URL (qron.space/s/{id}) that links to the blockchain certificate. When a consumer scans the code, they see AUTHENTIC confirmed in 2.1 seconds with the full provenance record: manufacturer, batch, certifications, and the art's authentication. Art that proves it's real."],
        ["Industries using QRON","Cannabis (StrainChain vertical): cannabis bud formations woven into the QR matrix — every scan confirms COA, METRC tag, and seed-to-sale chain. Automotive: EV lightning sports car — every scan confirms VIN, assembly events, NHTSA status. Luxury goods: geometric patterns, holographic textures — every scan confirms brand authenticity and batch provenance. Spirits: vineyard and barrel imagery — every scan confirms origin and authentication against counterfeiting."],
        ["The NFT dual-value model","When the cannabis flower is consumed, the packaging art lives on as a collectible NFT on OpenSea. When the bottle of spirits is empty, the label becomes a provenance-authenticated piece of art. QRON creates a dual revenue model: (1) the physical product sale, and (2) the NFT collection value. Brands can create limited-edition QRON series that appreciate in value — creating ongoing engagement long after the product is gone."],
        ["Get QRON codes","QRON is available at qron.space. Three plans: Starter ($9, 1 design), Pro ($29, 5 designs), Brand Kit ($49, unlimited). Every plan includes an AuthiChain blockchain certificate. Commercial license included."],
      ].map(([h,p])=>(<div key={h} style={{marginBottom:32}}><h2 style={{fontSize:22,fontWeight:800,color:"#e5e5e5",marginBottom:12}}>{h}</h2><p style={{fontSize:16,color:"rgba(255,255,255,.55)",lineHeight:1.85}}>{p}</p></div>))}
      <div style={{marginTop:48,padding:24,background:"rgba(132,204,22,.06)",border:"1px solid rgba(132,204,22,.2)",borderRadius:12}}>
        <div style={{fontWeight:700,color:"#84cc16",marginBottom:8}}>Try QRON</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:16}}>From $9 per design. Every code includes an AuthiChain blockchain certificate. Commercial license included.</div>
        <a href="https://qron.space" style={{background:"#84cc16",color:"#000",padding:"10px 24px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:13}}>Visit QRON.space →</a>
      </div>
    </main>
  );
}
