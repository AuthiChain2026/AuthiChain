import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is a Digital Product Passport (DPP)? EU 2026 Requirements Explained",
  description: "The EU Digital Product Passport (DPP) becomes mandatory in 2026. Learn what products are affected, what data is required, and how blockchain authentication (AuthiChain) provides compliant infrastructure.",
  keywords: ["digital product passport","EU DPP","DPP compliance 2026","blockchain product authentication","EU regulation supply chain"],
};

export default function BlogDPP() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
      <a href="/blog" style={{color:"#c9a227",textDecoration:"none",fontSize:13}}>← Blog</a>
      <div style={{marginTop:24,marginBottom:12,fontSize:11,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".1em"}}>April 8, 2026 · EU Regulation</div>
      <h1 style={{fontSize:"clamp(24px,5vw,44px)",fontWeight:900,color:"#c9a227",lineHeight:1.15,marginBottom:20}}>
        What is a Digital Product Passport? EU 2026 Requirements Explained
      </h1>
      <p style={{fontSize:18,color:"rgba(255,255,255,.6)",lineHeight:1.8,marginBottom:32}}>
        The EU Digital Product Passport (DPP) is a blockchain-verifiable record that every product sold in Europe will be required to carry starting in 2026. Here is everything manufacturers, importers, and brands need to know.
      </p>
      {[
        ["What is the EU Digital Product Passport?","The EU Digital Product Passport (DPP) is a data carrier — typically a QR code — that links to a blockchain-verifiable record of a product's full lifecycle: origin, materials, manufacturing process, certifications, repair history, and end-of-life options. The EU Ecodesign for Sustainable Products Regulation (ESPR, 2024/1781) mandates DPPs for all product categories sold in the EU market. The first categories affected include textiles, batteries, electronics, and construction products — with full rollout by 2030."],
        ["What data does a DPP require?","A compliant DPP must contain: manufacturer identity and location, product model and batch/serial identifier, material composition, carbon footprint data, certification records (CE marking, ISO standards), supply chain provenance, and a unique product identifier (typically an ERC-721 NFT or similar blockchain record). The data must be machine-readable, unforgeable, and verifiable by any smartphone without a proprietary app."],
        ["Why blockchain is the solution","Paper certificates and centralized databases fail the DPP's unforgeable requirement. Blockchain — specifically ERC-721 NFTs on public networks like Polygon — provides immutable, publicly verifiable provenance that no single party can alter. AuthiChain implements this: $0.004 per product batch, REST API integration, 2.1-second consumer verification."],
        ["How AuthiChain enables DPP compliance","AuthiChain mints an ERC-721 NFT at manufacture (on Polygon, $0.004). A QRON AI QR code is applied to the product. Any smartphone verifies the blockchain certificate — confirming manufacturer, batch, certifications, and supply chain events — in 2.1 seconds. No app. No hardware. Full DPP compliance."],
        ["Which products are affected first?","The EU DPP applies first to: batteries (from 2026), textiles and clothing (from 2026), electronics and ICT (from 2027), furniture (from 2028), and construction products (from 2029). All products sold in the EU are eventually covered. Companies selling into Europe now should begin DPP infrastructure development immediately."],
        ["Get started","AuthiChain provides production-ready DPP infrastructure. REST API, OpenAPI 3.0 spec, Polygon mainnet, $0.004/product. Visit authichain.com/compliance or contact z@authichain.com."],
      ].map(([h, p]) => (
        <div key={h} style={{marginBottom:32}}>
          <h2 style={{fontSize:22,fontWeight:800,color:"#e5e5e5",marginBottom:12}}>{h}</h2>
          <p style={{fontSize:16,color:"rgba(255,255,255,.55)",lineHeight:1.85}}>{p}</p>
        </div>
      ))}
      <div style={{marginTop:48,padding:24,background:"rgba(201,162,39,.06)",border:"1px solid rgba(201,162,39,.2)",borderRadius:12}}>
        <div style={{fontWeight:700,color:"#c9a227",marginBottom:8}}>Ready for EU DPP compliance?</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",marginBottom:16}}>AuthiChain provides blockchain DPP infrastructure at $0.004/product. REST API, OpenAPI 3.0, Polygon mainnet.</div>
        <a href="/compliance" style={{background:"#c9a227",color:"#000",padding:"10px 24px",borderRadius:8,textDecoration:"none",fontWeight:700,fontSize:13}}>View DPP Compliance →</a>
      </div>
    </main>
  );
}
