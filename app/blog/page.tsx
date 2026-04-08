import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "AuthiChain Blog — Blockchain Authentication, Anti-Counterfeiting & EU DPP",
  description: "Expert articles on blockchain product authentication, EU Digital Product Passport compliance, anti-counterfeiting technology, QRON AI QR art, and StrainChain cannabis blockchain.",
  keywords: ["blockchain authentication blog","EU DPP 2026","anti-counterfeiting","QRON QR art","cannabis blockchain","product authentication"],
};
const posts = [
  {slug:"eu-digital-product-passport",title:"What is the EU Digital Product Passport? 2026 Requirements Explained",date:"Apr 8, 2026",tag:"EU Regulation",color:"#c9a227",excerpt:"The EU Digital Product Passport (DPP) becomes mandatory in 2026. Learn what products are affected, what data is required, and how blockchain provides compliant infrastructure."},
  {slug:"blockchain-anti-counterfeiting",title:"How Blockchain Stops Product Counterfeiting — For $0.004 Per Item",date:"Apr 8, 2026",tag:"Supply Chain",color:"#ef4444",excerpt:"$500 billion in counterfeit goods circulate annually. Here is how blockchain authentication permanently solves this at a cost accessible to any manufacturer."},
  {slug:"qron-ai-qr-code-art",title:"QRON: AI QR Codes That Are Actually Art — And Prove They're Real",date:"Apr 8, 2026",tag:"QRON Technology",color:"#84cc16",excerpt:"Plain QR codes are ignored. QRON codes get scanned — because the artwork compels it. Every QRON code carries an AuthiChain blockchain certificate of authenticity."},
  {slug:"strainchain-cannabis-blockchain",title:"StrainChain: Blockchain Cannabis Authentication From Seed to Sale",date:"Apr 8, 2026",tag:"Cannabis",color:"#22c55e",excerpt:"The illicit cannabis market is a $6B+ problem. StrainChain gives every legal batch a blockchain certificate — COA hash, METRC tag, seed-to-sale chain."},
];
export default function Blog() {
  return (
    <main style={{background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",maxWidth:760,margin:"0 auto",padding:"48px 24px"}}>
      <a href="/" style={{color:"#c9a227",textDecoration:"none",fontSize:13}}>← AuthiChain</a>
      <h1 style={{fontSize:"clamp(24px,5vw,40px)",fontWeight:900,color:"#c9a227",margin:"24px 0 8px"}}>AuthiChain Blog</h1>
      <p style={{color:"rgba(255,255,255,.4)",marginBottom:40,fontSize:14}}>Blockchain authentication, EU DPP compliance, QRON QR art, and cannabis blockchain.</p>
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
        {posts.map(p=>(
          <Link key={p.slug} href={"/blog/"+p.slug} style={{textDecoration:"none",background:"rgba(255,255,255,.03)",border:`1px solid ${p.color}18`,borderRadius:12,padding:"24px",display:"block",transition:"all .2s"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
              <span style={{background:`${p.color}15`,border:`1px solid ${p.color}30`,color:p.color,fontSize:10,padding:"2px 10px",borderRadius:20,fontWeight:700}}>{p.tag}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,.25)"}}>{p.date}</span>
            </div>
            <div style={{fontSize:18,fontWeight:800,color:"#e5e5e5",marginBottom:8,lineHeight:1.3}}>{p.title}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.7}}>{p.excerpt}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
