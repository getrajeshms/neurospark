import { DOMAINS } from '../data';
import A1Badge from '../components/A1Badge';
export default function HomeScreen({ navigate, scores }) {
  const done = Object.keys(scores).length;
  return (
    <div className="fade-up">
      <nav className="nav">
        <span className="nav-logo">Neuro<span>Spark</span></span>
        <button className="btn-secondary" style={{width:'auto',padding:'7px 16px',fontSize:13}} onClick={()=>navigate('dashboard')}>Dashboard</button>
      </nav>
      <div style={{padding:'32px 24px 20px',textAlign:'center'}}>
        <div style={{display:'inline-block',background:'var(--brand-light)',color:'var(--brand)',fontSize:11,fontWeight:600,letterSpacing:'.6px',textTransform:'uppercase',padding:'4px 14px',borderRadius:20,marginBottom:16}}>AI-Powered Cognitive Health</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,lineHeight:1.22,color:'var(--navy)',marginBottom:12}}>Discover how your<br/>brain performs today</h1>
        <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.7,maxWidth:320,margin:'0 auto 28px'}}>7 evidence-based mini-games measuring key cognitive domains. Complete in under 15 minutes.</p>
        <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:320,margin:'0 auto'}}>
          <button className="btn-primary" onClick={()=>navigate('intake')}>{done===0?'Start Assessment →':`Continue (${done}/7 done)`}</button>
          <button className="btn-secondary" onClick={()=>navigate('dashboard')}>View my cognitive profile</button>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,padding:'0 20px 24px'}}>
        {[['7','Domains'],['<15','Minutes'],['AI','Scoring']].map(([v,l])=>(
          <div key={l} className="card" style={{textAlign:'center',padding:'14px 10px'}}>
            <div style={{fontSize:22,fontWeight:600,color:'var(--navy)'}}>{v}</div>
            <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>{l}</div>
          </div>
        ))}
      </div>
      <div className="section">
        <div className="section-title">How it works</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
          {[
            ['Play brain games','Short, engaging tasks designed to measure specific cognitive functions'],
            ['AI extracts biomarkers','Reaction time, accuracy, error rate & learning curves analysed'],
            ['Get your cognitive profile','Domain-by-domain breakdown with trend tracking over time'],
          ].map(([t,d],i)=>(
            <div key={i} className="card" style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:30,height:30,borderRadius:9,background:'var(--brand-light)',color:'var(--brand)',fontSize:13,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
              <div><div style={{fontSize:13,fontWeight:500}}>{t}</div><div style={{fontSize:12,color:'var(--text2)',marginTop:3,lineHeight:1.5}}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <div className="section-title">Domains assessed</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:16}}>
          {DOMAINS.map(d=>(
            <div key={d.id} style={{background:d.bg,color:d.color,fontSize:12,fontWeight:500,padding:'5px 12px',borderRadius:20,display:'flex',alignItems:'center',gap:5}}>
              <span>{d.icon}</span>{d.shortName}
            </div>
          ))}
        </div>
      </div>
      <A1Badge />
      <p className="disclaimer">⚠ NeuroSpark is not a diagnostic tool. Results should not be used to make medical decisions without consulting a qualified medical professional. For research use only.</p>
    </div>
  );
}
