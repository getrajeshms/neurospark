import { DOMAINS, scoreTag, scoreColor } from '../data';
export default function DomainsScreen({ navigate, scores, participant }) {
  const done = Object.keys(scores).length;
  return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('home')}>← Home</button>
        <span style={{fontSize:15,fontWeight:500}}>Select Domain</span>
        <div style={{width:70}}/>
      </nav>
      {participant && (
        <div style={{padding:'10px 20px 0',display:'flex',alignItems:'center',gap:10}}>
          <div style={{background:'var(--brand-light)',borderRadius:10,padding:'6px 12px',fontSize:12,color:'var(--brand)',fontWeight:500}}>
            👤 {participant.name} · Age {participant.age}
          </div>
        </div>
      )}
      <div style={{padding:'12px 20px 8px'}}>
        <p style={{fontSize:14,color:'var(--text2)',lineHeight:1.6}}>Tap any domain to start its assessment game. Complete all 7 for a full cognitive profile.</p>
      </div>
      <div style={{padding:'8px 20px 16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span style={{fontSize:12,color:'var(--text2)'}}>Progress</span>
          <span style={{fontSize:12,fontWeight:500,color:'var(--brand)'}}>{done}/7 completed</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${(done/7)*100}%`}}/></div>
      </div>
      <div className="section" style={{paddingTop:0}}>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
          {DOMAINS.map(d=>{
            const s=scores[d.id]; const tag=scoreTag(s?.score);
            return (
              <div key={d.id} className="card" style={{display:'flex',alignItems:'center',gap:14,cursor:'pointer',transition:'all .2s'}}
                onClick={()=>navigate('game',{domain:d})}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=d.color; e.currentTarget.style.transform='translateY(-1px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='none';}}>
                <div style={{width:48,height:48,borderRadius:14,background:d.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{d.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{d.name}</div>
                  <div style={{fontSize:12,color:'var(--text2)'}}>{d.desc}</div>
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:3}}>{d.neuropsych} · {d.duration}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:18,fontWeight:600,color:scoreColor(s?.score)}}>{s?s.score+'%':'—'}</div>
                  <span className={`tag ${tag.cls}`} style={{marginTop:4,display:'inline-block'}}>{tag.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {done >= 3 && (
        <div style={{padding:'0 20px 16px'}}>
          <button className="btn-primary" style={{background:'var(--navy)'}} onClick={()=>navigate('report')}>
            {done===7 ? '📄 View Full Report & Brain Age' : `📄 Partial Report (${done}/7 domains)`}
          </button>
        </div>
      )}
      <p className="disclaimer">Scores update after each game. Repeat any domain to track changes over time.</p>
    </div>
  );
}
