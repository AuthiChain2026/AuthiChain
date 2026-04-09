import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "StrainChain: Blockchain Cannabis Supply Chain Authentication | AuthiChain",
  description: "StrainChain provides blockchain authentication for cannabis — COA verification, METRC sync, seed-to-sale chain on Polygon. Every batch authenticated in 2.1 seconds by any smartphone.",
  keywords: ["cannabis blockchain","cannabis supply chain","METRC blockchain","cannabis COA verification","StrainChain","blockchain cannabis compliance","cannabis authentication"],
};
export default function BlogStrainChain() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
      <a href="/blog" style={{color:"#22c55e",textDecoration:"none",fontSize:13}}>← Blog</a>
      <div style={{marginTop:24,marginBottom:12,fontSize:11,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".1em"}}>April 8, 2026 · Cannabis Compliance</div>
      <h1 style={{fontSize:"clamp(24px,5vw,44px)",fontWeight:900,color:"#22c55e",lineHeight:1.15,marginBottom:20}}>
        StrainChain: Blockchain Cannabis Authentication From Seed to Sale
      </h1>
      <p style={{fontSize:18,color:"rgba(255,255,255,.6)",lineHeight:1.8,marginBottom:32}}>
        The illicit cannabis market is a $6B+ annual problem. StrainChain gives every legal cannabis batch a blockchain certificate — COA hash, METRC tag, seed-to-sale chain, and QRON AI QR art on the label — verified in 2.1 seconds by any smartphone.
      </p>
      {[
        ["What is StrainChain?","StrainChain is the cannabis vertical of the AuthiChain Protocol. It provides blockchain authentication for cannabis from cultivation through dispensary sale. Every batch gets an ERC-721 NFT on Polygon containing: COA (Certificate of Analysis) hash, METRC tracking tag, grower identity and location, harvest date, lab results (THC/CBD/terpenes), state-licensed transfer chain, and QRON AI QR art for the packaging."],
        ["The COA counterfeiting problem","Certificates of Analysis are the primary fraud vector in cannabis. A dispensary receives 100 units of 'Blue Dream' with a COA showing 24% THC. Without blockchain authentication, there is no way to confirm that COA is from an accredited lab and matches the actual product. StrainChain hashes the COA document and records it on-chain at lab certification. Any dispensary scan confirms the COA is unaltered."],
        ["METRC integration","METRC is the state tracking system used in California, Colorado, Nevada, and most other legal markets. StrainChain syncs with METRC to anchor blockchain records to state tracking tags. Every METRC transfer event is recorded on-chain — creating an immutable seed-to-sale history that no single party can alter."],
        ["How a StrainChain scan works","A consumer or dispensary employee scans the QRON AI QR code on the package. The blockchain confirms: (1) This is an authentic lot from the registered farm. (2) The COA hash matches the lab-certified document. (3) All METRC transfer events are intact. (4) No recall flags. (5) Art attribution is verified (Verde Studio, ArtGuard score). Total time: 2.1 seconds. Any smartphone. No app."],
        ["The packaging art becomes a collectible","The cannabis is consumed — but the QRON AI QR art on the packaging becomes a collectible NFT. The StrainChain Cannabis NFT Collection demonstrates this: five original pieces of cannabis-themed art, blockchain-authenticated, available for $480–$1,200. A new asset class born from a plant."],
        ["Get StrainChain for your dispensary","StrainChain is available at strainchain.io. COA verification, METRC sync, seed-to-sale blockchain, and QRON packaging art. Contact z@authichain.com for enterprise licensing."],
      ].map(([h,p])=>(<div key={h} style={{marginBottom:32}}><h2 style={{fontSize:22,fontWeight:800,color:"#e5e5e5",marginBottom:12}}>{h}</h2><p style={{fontSize:16,color:"rgba(255,255,255,.55)",lineHeight:1.85}}>{p}</p></div>))}
    </main>
  );
}
