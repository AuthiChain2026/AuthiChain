export const metadata = { title: "Grants — AuthiChain", description: "AuthiChain grant applications and government funding pipeline." }
export default function GrantsPage() {
  const grants = [
    {name:"DHS Silicon Valley Innovation Program",amount:"$800K",status:"Applied",deadline:"May 20, 2026",color:"#ef4444"},
    {name:"NSF SBIR Phase I",amount:"$275K",status:"Inquiry sent",deadline:"Rolling",color:"#f59e0b"},
    {name:"DHS SBIR Phase I",amount:"$175K",status:"Researching",deadline:"TBD",color:"#f59e0b"},
    {name:"Databricks Built-On Startup Challenge",amount:"$1M+",status:"Applied",deadline:"May 22, 2026",color:"#a78bfa"},
    {name:"Y Combinator S26",amount:"$500K SAFE",status:"Applying",deadline:"Apr 11, 2026",color:"#22c55e"},
  ]
  const sc = {background:"#080808",color:"#e5e5e5",minHeight:"100vh",fontFamily:"system-ui,sans-serif",padding:"48px 24px",maxWidth:800,margin:"0 auto"}
  return (
    <main style={sc}>
      <a href="/" style={{color:"#c9a227",textDecoration:"none",fontSize:13,fontWeight:600}}>← AuthiChain</a>
      <h1 style={{fontSize:36,fontWeight:900,margin:"24px 0 8px",color:"#c9a227"}}>Grant Pipeline</h1>
      <p style={{color:"rgba(255,255,255,.4)",marginBottom:40}}>$2.75M+ in active applications · SAM.gov UEI pending (INC-GSAFSD20876890)</p>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {grants.map(g=>(
          <div key={g.name} style={{background:"rgba(255,255,255,.04)",border:`1px solid ${g.color}25`,borderLeft:`3px solid ${g.color}`,borderRadius:12,padding:"20px 24px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15,color:"#e5e5e5",marginBottom:4}}>{g.name}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.35)"}}>Deadline: {g.deadline}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:900,color:g.color}}>{g.amount}</div>
              <div style={{fontSize:11,color:g.color,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginTop:2}}>{g.status}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:48,padding:"24px",background:"rgba(201,162,39,.06)",border:"1px solid rgba(201,162,39,.2)",borderRadius:12}}>
        <div style={{fontWeight:700,color:"#c9a227",marginBottom:8}}>SAM.gov Status</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.7}}>
          UEI registration in progress · Ticket INC-GSAFSD20876890<br/>
          APEX Accelerators enrolled: Northeast Michigan (989) 733-8540<br/>
          DHS SVIP application sent to svip@hq.dhs.gov
        </div>
      </div>
    </main>
  )
}
