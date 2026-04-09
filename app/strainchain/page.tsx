/**
 * Demo: StrainChain — Cannabis Vertical Landing
 * Problem: The legal cannabis industry has no unified authentication layer — cultivators, labs, dispensaries, consumers, and regulators each rely on paper COAs, easily altered METRC manifests, and disconnected compliance tools that leave the whole seed-to-sale chain open to diversion and fraud.
 * Solution: AuthiChain + QRON verifies authenticity in 2.1 seconds through the StrainChain protocol.
 * Business Value: StrainChain is the AuthiChain + QRON stack packaged as a cannabis-native vertical at strainchain.io — COA anchoring, METRC sync, seed-to-sale chain, and strain-specific QRON art that gives every licensed operator a dispensary-ready, regulator-ready, consumer-ready authentication layer in one protocol.
 */
import type { CSSProperties } from "react"
import Image from "next/image"

export const metadata = {
  title: "StrainChain — Cannabis Supply Chain Authentication",
  description: "Blockchain seed-to-sale compliance for cannabis.",
}

type Feat = { icon: string; t: string; d: string }
const feats: Feat[] = [
  {icon:"\uD83D\uDD2C",t:"COA Verification",d:"Certificate of Analysis hash anchored on-chain. Pesticide screens, THC/CBD, terpene profiles — all immutable."},
  {icon:"\uD83D\uDCCB",t:"METRC Sync",d:"Real-time California, Colorado, Michigan METRC sync. Transfer manifests, inventory reconciliation, compliance reporting."},
  {icon:"\u26D3",t:"Seed-to-Sale Chain",d:"8-event lifecycle ledger: seed to clone to veg to flower to harvest to dry to lab to package. On Polygon + BTC Ordinal."},
  {icon:"\uD83C\uDFA8",t:"Packaging Art NFTs",d:"ArtGuard authenticates cannabis packaging as collectible NFTs. Product value plus art premium equals dual-layer token."},
  {icon:"\uD83D\uDCF1",t:"Consumer Verification",d:"QR scan to AUTHENTIC in 2.1 seconds. Any smartphone. Batch info, COA link, strain story."},
  {icon:"\u2696",t:"Instant Compliance",d:"California BCC, Colorado MED, Michigan LARA. All 7 requirements satisfied automatically by the authentication flow."},
]

type NFTCard = {
  id: string
  name: string
  rarity: "LEGENDARY" | "EPIC" | "RARE"
  origin: string
  floor: number
  svg: string
}
const nftCards: NFTCard[] = [
  { id: "nft-design",          name: "COSMIC COOKIE",       rarity: "LEGENDARY", origin: "Exotic Genetix",        floor: 1200, svg: "/nft/nft-design.svg" },
  { id: "jared-nft",           name: "JARED #001",          rarity: "EPIC",      origin: "Humboldt Seed Company", floor: 840,  svg: "/nft/jared-nft.svg" },
  { id: "diamond-nft",         name: "BLING BLAOW",         rarity: "EPIC",      origin: "Compound Genetics",     floor: 720,  svg: "/nft/diamond-nft.svg" },
  { id: "watermelon-zmartini", name: "WATERMELON ZMARTINI", rarity: "RARE",      origin: "Dr. Dankenstein",       floor: 580,  svg: "/nft/watermelon-zmartini.svg" },
  { id: "myles-high-nft",      name: "MYLES HIGH",          rarity: "RARE",      origin: "Fiya Farmer",           floor: 480,  svg: "/nft/myles-high-nft.svg" },
]
const rarityColor: Record<NFTCard["rarity"], string> = {
  LEGENDARY: "#FFD700",
  EPIC: "#a78bfa",
  RARE: "#22c55e",
}

const nav: CSSProperties = {padding:"16px 32px",display:"flex",alignItems:"center",gap:16,borderBottom:"0.5px solid rgba(255,255,255,.07)"}
const body: CSSProperties = {background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif"}

export default function StrainChainPage() {
  return (
    <main style={body}>
      <nav style={nav}>
        <span style={{color:"#22c55e",fontWeight:900,fontSize:"1rem",letterSpacing:".1em"}}>{"\uD83C\uDF3F STRAINCHAIN"}</span>
        <div style={{flex:1}}/>
        <a href="#nft" style={{color:"rgba(255,255,255,.55)",textDecoration:"none",fontSize:12,marginRight:16}}>NFT Collection</a>
        <a href="https://authichain.com" style={{color:"rgba(255,255,255,.4)",textDecoration:"none",fontSize:12}}>{"Powered by AuthiChain"}</a>
      </nav>

      <section style={{maxWidth:860,margin:"0 auto",padding:"88px 24px 64px",textAlign:"center"}}>
        <div style={{display:"inline-block",background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",marginBottom:24}}>
          Cannabis Compliance + Blockchain
        </div>
        <h1 style={{fontSize:"clamp(28px,6vw,60px)",fontWeight:900,lineHeight:1.1,marginBottom:18}}>
          {"Every batch."}<br/><span style={{color:"#22c55e"}}>{"Verified. Forever."}</span>
        </h1>
        <p style={{color:"rgba(255,255,255,.45)",fontSize:"clamp(14px,1.8vw,18px)",lineHeight:1.75,maxWidth:580,margin:"0 auto 44px"}}>
          StrainChain is blockchain-based cannabis supply chain authentication. COA verification, METRC sync, seed-to-sale chain, and packaging art NFTs all in one protocol built on AuthiChain.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="https://authichain.com/demo-video" style={{background:"#22c55e",color:"#000",padding:"14px 32px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:15}}>{"\u25B6 Watch Demo"}</a>
          <a href="mailto:z@authichain.com?subject=StrainChain Demo" style={{border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"14px 24px",borderRadius:12,textDecoration:"none",fontSize:15}}>Request Access</a>
          <a href="#nft" style={{border:"1px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.6)",padding:"14px 20px",borderRadius:12,textDecoration:"none",fontSize:15}}>{"NFT Collection \u2193"}</a>
        </div>
      </section>

      <section style={{background:"rgba(34,197,94,.03)",borderTop:"0.5px solid rgba(34,197,94,.1)",borderBottom:"0.5px solid rgba(34,197,94,.1)"}}>
        <div style={{maxWidth:860,margin:"0 auto",padding:"64px 24px"}}>
          <h2 style={{fontSize:"clamp(20px,4vw,34px)",fontWeight:900,textAlign:"center",marginBottom:40}}>Full-stack compliance, on-chain</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
            {feats.map((f) => (
              <div key={f.t} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(34,197,94,.12)",borderRadius:14,padding:"22px 20px"}}>
                <div style={{fontSize:28,marginBottom:12}}>{f.icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:"#22c55e",marginBottom:8}}>{f.t}</div>
                <div style={{fontSize:12.5,color:"rgba(255,255,255,.45)",lineHeight:1.7}}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT COLLECTION — personal SVGs from /public/nft */}
      <section id="nft" style={{maxWidth:1200,margin:"0 auto",padding:"88px 24px"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <div style={{display:"inline-block",background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",color:"#22c55e",padding:"5px 16px",borderRadius:20,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",marginBottom:20}}>
            StrainChain Cannabis NFT Collection
          </div>
          <h2 style={{fontSize:"clamp(24px,5vw,42px)",fontWeight:900,lineHeight:1.1,marginBottom:14}}>
            Five <span style={{color:"#22c55e"}}>personal pieces.</span> Forever on-chain.
          </h2>
          <p style={{color:"rgba(255,255,255,.45)",fontSize:"clamp(13px,1.6vw,16px)",lineHeight:1.7,maxWidth:620,margin:"0 auto"}}>
            Original cannabis-native SVG art, blockchain-authenticated through the StrainChain protocol.
            Each piece is a 1 of 1 ERC-721 on Polygon, anchored to Bitcoin via Ordinal, and backed by an
            ArtGuard provenance score. StoryMode origin narrative included.
          </p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:22,marginBottom:44}}>
          {nftCards.map((n) => {
            const color = rarityColor[n.rarity]
            return (
              <a key={n.id} href="/collection" style={{textDecoration:"none",color:"inherit"}}>
                <article style={{background:"#0d0d0d",border:`1px solid ${color}22`,borderRadius:16,overflow:"hidden",display:"flex",flexDirection:"column",transition:"transform .2s, box-shadow .2s"}}>
                  <div style={{position:"relative",aspectRatio:"1 / 1",overflow:"hidden",background:"#000"}}>
                    <Image src={n.svg} alt={`${n.name} — StrainChain NFT`} fill sizes="(max-width:768px) 100vw, 300px" style={{objectFit:"cover"}} unoptimized />
                    <div style={{position:"absolute",top:10,left:10,border:`1px solid ${color}40`,color,background:`${color}14`,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",padding:"3px 9px",borderRadius:4}}>
                      {n.rarity}
                    </div>
                  </div>
                  <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:5}}>
                    <div style={{fontSize:14,fontWeight:800,color:"#e5e5e5",letterSpacing:".03em"}}>{n.name}</div>
                    <div style={{fontSize:10.5,color,fontWeight:600}}>{n.origin}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
                      <div style={{fontSize:9,color:"rgba(255,255,255,.3)",textTransform:"uppercase",letterSpacing:".08em"}}>Floor</div>
                      <div style={{fontSize:16,fontWeight:900,color:"#22c55e"}}>${n.floor.toLocaleString()}</div>
                    </div>
                  </div>
                </article>
              </a>
            )
          })}
        </div>

        <div style={{textAlign:"center"}}>
          <a href="/collection" style={{display:"inline-block",background:"#22c55e",color:"#000",padding:"13px 30px",borderRadius:12,textDecoration:"none",fontWeight:800,fontSize:14,letterSpacing:".02em"}}>
            View Full Collection →
          </a>
        </div>
      </section>

      <section style={{maxWidth:600,margin:"0 auto",padding:"40px 24px 72px",textAlign:"center"}}>
        <div style={{background:"rgba(34,197,94,.06)",border:"1.5px solid rgba(34,197,94,.25)",borderRadius:18,padding:"44px 36px"}}>
          <div style={{fontSize:13,color:"rgba(34,197,94,.7)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Pricing</div>
          <div style={{fontSize:36,fontWeight:900,color:"#22c55e",marginBottom:6}}>{"$199 – $999"}</div>
          <div style={{fontSize:14,color:"rgba(255,255,255,.4)",marginBottom:28}}>per month including METRC sync, COA anchoring, QR codes</div>
          <a href="mailto:z@authichain.com?subject=StrainChain" style={{display:"inline-block",background:"#22c55e",color:"#000",padding:"13px 32px",borderRadius:10,textDecoration:"none",fontWeight:800,fontSize:14}}>Get Started</a>
        </div>
      </section>

      <footer style={{borderTop:"0.5px solid rgba(255,255,255,.06)",padding:"24px 32px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <span style={{color:"#22c55e",fontWeight:900,fontSize:".85rem"}}>{"\uD83C\uDF3F STRAINCHAIN"}</span>
        <div style={{flex:1}}/>
        <a href="https://authichain.com" style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>authichain.com</a>
        <a href="mailto:z@authichain.com" style={{color:"rgba(255,255,255,.3)",textDecoration:"none",fontSize:12}}>z@authichain.com</a>
      </footer>
    </main>
  )
}
