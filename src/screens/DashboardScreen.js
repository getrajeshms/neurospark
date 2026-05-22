import { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
import { DOMAINS, scoreColor, scoreTag } from '../data';

export default function DashboardScreen({ navigate, scores, sessions }) {
  const [tab, setTab] = useState('overview');
  const completed = DOMAINS.filter(d=>scores[d.id]);
  const avg = completed.length ? Math.round(completed.reduce((a,d)=>a+scores[d.id].score,0)/completed.length) : null;
  const best  = completed.length ? completed.reduce((b,d)=>scores[d.id].score>scores[b.id].score?d:b,completed[0]) : null;
  const worst = completed.length ? completed.reduce((b,d)=>scores[d.id].score<scores[b.id].score?d:b,completed[0]) : null;
  const radarData = DOMAINS.map(d=>({domain:d.shortName, score:scores[d.id]?.score||0, fullMark:100}));

  return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('home')}>← Home</button>
        <span style={{fontSize:15,fontWeight:500}}>Cognitive Profile</span>
        <div style={{width:70}}/>
      </nav>
      <div style={{display:'flex',borderBottom:'1px solid var(--border)',background:'var(--card)',padding:'0 20px',overflowX:'auto'}}>
        {['overview','domains','history'].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'12px 18px',background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:tab===t?500:400,fontFamily:'inherit',color:tab===t?'var(--brand)':'var(--text2)',borderBottom:`2px solid ${tab===t?'var(--brand)':'transparent'}`,whiteSpace:'nowrap',transition:'all .2s',textTransform:'capitalize'}}>
            {t}
          </button>
        ))}
      </div>
      <div style={{padding:'20px'}}>
        {tab==='overview' && (
          completed.length===0
            ? <div style={{textAlign:'center',padding:'40px 0'}}>
                <div style={{fontSize:40,marginBottom:12}}>🧠</div>
                <div style={{fontSize:15,fontWeight:500,marginBottom:8}}>No assessments yet</div>
                <p style={{fontSize:13,color:'var(--text2)',marginBottom:24,lineHeight:1.6}}>Complete at least one domain assessment to see your cognitive profile.</p>
                <button className="btn-primary" onClick={()=>navigate('domains')}>Start Assessment →</button>
              </div>
            : <>
                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:20}}>
                  <div className="card" style={{textAlign:'center',padding:'16px 10px'}}>
                    <div style={{fontSize:28,fontWeight:600,color:scoreColor(avg)}}>{avg}%</div>
                    <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>Average score</div>
                  </div>
                  <div className="card" style={{textAlign:'center',padding:'16px 10px'}}>
                    <div style={{fontSize:24,fontWeight:600,color:'var(--navy)'}}>{completed.length}/7</div>
                    <div style={{fontSize:11,color:'var(--text2)',marginTop:3}}>Domains done</div>
                  </div>
                  {best && <div className="card" style={{padding:'12px 14px'}}>
                    <div style={{fontSize:11,color:'var(--text3)',marginBottom:4}}>Strongest</div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span>{best.icon}</span>
                      <span style={{fontSize:13,fontWeight:500}}>{best.shortName}</span>
                      <span style={{fontSize:13,color:'var(--brand)',marginLeft:'auto'}}>{scores[best.id]?.score}%</span>
                    </div>
                  </div>}
                  {worst && <div className="card" style={{padding:'12px 14px'}}>
                    <div style={{fontSize:11,color:'var(--text3)',marginBottom:4}}>Needs attention</div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span>{worst.icon}</span>
                      <span style={{fontSize:13,fontWeight:500}}>{worst.shortName}</span>
                      <span style={{fontSize:13,color:'var(--amber)',marginLeft:'auto'}}>{scores[worst.id]?.score}%</span>
                    </div>
                  </div>}
                </div>
                {completed.length>=3 && (
                  <div className="card" style={{marginBottom:20}}>
                    <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>Cognitive radar</div>
                    <div style={{fontSize:11,color:'var(--text3)',marginBottom:12}}>Based on {completed.length} domains assessed</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--border)"/>
                        <PolarAngleAxis dataKey="domain" tick={{fontSize:11,fill:'var(--text2)'}}/>
                        <Radar name="Score" dataKey="score" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.2} strokeWidth={2}/>
                        <Tooltip formatter={v=>[`${v}%`,'Score']} contentStyle={{fontSize:12,borderRadius:10,border:'1px solid var(--border)'}}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <button className="btn-primary" onClick={()=>navigate('domains')}>{completed.length<7?'Continue Assessment →':'Retake Assessment →'}</button>
              </>
        )}
        {tab==='domains' && (
          <div>
            {DOMAINS.map(d=>{
              const s=scores[d.id]; const tag=scoreTag(s?.score);
              return (
                <div key={d.id} className="card" style={{marginBottom:12,cursor:'pointer'}} onClick={()=>navigate('game',{domain:d})}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:s?14:0}}>
                    <div style={{width:42,height:42,borderRadius:12,background:d.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{d.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:500}}>{d.name}</div>
                      <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{d.neuropsych}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:18,fontWeight:600,color:scoreColor(s?.score)}}>{s?s.score+'%':'—'}</div>
                      <span className={`tag ${tag.cls}`}>{tag.label}</span>
                    </div>
                  </div>
                  {s && <>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${s.score}%`,background:d.color}}/></div>
                    <div style={{fontSize:11,color:'var(--text3)',marginTop:6}}>Last assessed: {s.date} · {s.elapsed}s</div>
                  </>}
                </div>
              );
            })}
          </div>
        )}
        {tab==='history' && (
          sessions.length===0
            ? <div style={{textAlign:'center',padding:'40px 0',fontSize:13,color:'var(--text2)'}}>No session history yet. Complete assessments to build your history.</div>
            : sessions.map((s,i)=>{
                const d=DOMAINS.find(x=>x.id===s.domainId);
                return (
                  <div key={i} className="card" style={{marginBottom:10,display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:38,height:38,borderRadius:10,background:d?.bg||'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{d?.icon||'🧠'}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:500}}>{s.domain}</div>
                      <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{s.date}</div>
                    </div>
                    <div style={{fontSize:18,fontWeight:600,color:scoreColor(s.score)}}>{s.score}%</div>
                  </div>
                );
              })
        )}
      </div>
      <p className="disclaimer">⚠ NeuroSpark is for research and informational use only. Not a clinical diagnostic tool.</p>
    </div>
  );
}
