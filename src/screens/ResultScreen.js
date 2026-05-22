import { scoreColor, DOMAINS } from '../data';
import A1Badge from '../components/A1Badge';
export default function ResultScreen({ result, navigate }) {
  if (!result) return null;
  const { domain, score, metrics, elapsed } = result;
  const remaining = DOMAINS.filter(d=>d.id!==domain.id);
  const nextDomain = remaining[Math.floor(Math.random()*remaining.length)];
  const msg = score>=75 ? 'Strong performance in this domain!' : score>=50 ? 'Room for improvement — try again to track progress.' : 'This domain may need attention. Consider repeating the assessment.';
  return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('domains')}>← Domains</button>
        <span style={{fontSize:14,fontWeight:500}}>Game Result</span>
        <div style={{width:70}}/>
      </nav>
      <div style={{padding:'28px 24px 20px',textAlign:'center'}}>
        <div style={{width:64,height:64,borderRadius:18,background:domain.bg,fontSize:28,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>{domain.icon}</div>
        <div style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>{domain.name}</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:64,lineHeight:1,color:scoreColor(score),margin:'8px 0 4px'}}>
          {score}<span style={{fontSize:28}}>%</span>
        </div>
        <div style={{fontSize:13,color:'var(--text2)',marginBottom:4}}>Domain Score</div>
        <p style={{fontSize:13,color:'var(--text2)',maxWidth:280,margin:'10px auto 0',lineHeight:1.6}}>{msg}</p>
      </div>
      <div style={{padding:'0 20px 20px'}}>
        <div className="card" style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--text3)',letterSpacing:'.5px',textTransform:'uppercase',marginBottom:14}}>Performance Breakdown</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {metrics.map(([key,val])=>(
              <div key={key} style={{background:'var(--bg)',borderRadius:12,padding:14}}>
                <div style={{fontSize:18,fontWeight:500,color:'var(--text)'}}>{val}</div>
                <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>{key}</div>
              </div>
            ))}
            <div style={{background:'var(--bg)',borderRadius:12,padding:14}}>
              <div style={{fontSize:18,fontWeight:500,color:'var(--text)'}}>{elapsed}s</div>
              <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>Time taken</div>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:20,background:domain.bg,border:`1px solid ${domain.color}33`}}>
          <div style={{fontSize:11,fontWeight:600,color:domain.color,letterSpacing:'.5px',textTransform:'uppercase',marginBottom:8}}>About this domain</div>
          <p style={{fontSize:13,color:'var(--text)',lineHeight:1.6}}>{domain.detail}</p>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <button className="btn-primary" onClick={()=>navigate('game',{domain:nextDomain})}>Next: {nextDomain.shortName} →</button>
          <button className="btn-secondary" onClick={()=>navigate('domains')}>Choose another domain</button>
          <button className="btn-secondary" style={{borderColor:'var(--brand)',color:'var(--brand)'}} onClick={()=>navigate('dashboard')}>View full profile</button>
        </div>
      </div>
      <A1Badge />
      <p className="disclaimer">⚠ These results are for informational purposes only and are not a clinical diagnosis.</p>
    </div>
  );
}
