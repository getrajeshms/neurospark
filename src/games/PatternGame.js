import { useState } from 'react';
const PATTERNS = [
  {target:['🔵','🔴','🔵'],         options:[['🔵','🔴','🔵'],['🔴','🔵','🔴'],['🔵','🔵','🔴']],         answer:0},
  {target:['⬛','⬜','⬛','⬜'],     options:[['⬜','⬛','⬜','⬛'],['⬛','⬜','⬛','⬜'],['⬛','⬛','⬜','⬜']], answer:1},
  {target:['🔺','🔻','🔺'],         options:[['🔻','🔺','🔻'],['🔺','🔻','🔺'],['🔺','🔺','🔻']],         answer:1},
  {target:['🟦','🟨','🟦','🟨'],   options:[['🟨','🟦','🟨','🟦'],['🟦','🟨','🟦','🟨'],['🟦','🟦','🟨','🟦']], answer:1},
  {target:['🔴','🟡','🟢','🔴'],   options:[['🟡','🔴','🟢','🔴'],['🔴','🟡','🟢','🔴'],['🟢','🟡','🔴','🔴']], answer:1},
  {target:['🟥','⬜','🟥'],         options:[['🟥','⬜','🟥'],['⬜','🟥','⬜'],['🟥','🟥','⬜']],         answer:0},
];
export default function PatternGame({ onFinish, setProgress, domainColor, domainBg }) {
  const [trial,    setTrial]    = useState(0);
  const [correct,  setCorrect]  = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [chosen,   setChosen]   = useState(null);
  const cur = PATTERNS[trial];

  const pick = (idx) => {
    if (feedback!=null) return;
    const ok = idx===cur.answer;
    const nc = ok?correct+1:correct;
    setChosen(idx); setFeedback(ok?'correct':'wrong'); setCorrect(nc);
    setTimeout(()=>{
      const nt=trial+1; setTrial(nt); setProgress(Math.round((nt/PATTERNS.length)*100)); setFeedback(null); setChosen(null);
      if (nt>=PATTERNS.length) {
        const score=Math.round((nc/PATTERNS.length)*100);
        onFinish({score, metrics:[['Correct',`${nc}/${PATTERNS.length}`],['Pattern accuracy',`${score}%`],['Domain','Visuospatial']]});
      }
    }, 500);
  };

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Pattern Recognition</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Which option exactly matches the target? Trial {trial+1}/{PATTERNS.length}.</p>
      <div className="game-area" style={{gap:16}}>
        <div>
          <div style={{fontSize:11,color:'var(--text3)',marginBottom:8,textAlign:'center',letterSpacing:.5,textTransform:'uppercase'}}>Target pattern</div>
          <div style={{background:domainBg,borderRadius:14,padding:'14px 20px',fontSize:28,letterSpacing:6,display:'flex',justifyContent:'center',gap:6}}>
            {cur.target.map((e,i)=><span key={i}>{e}</span>)}
          </div>
        </div>
        <div style={{width:'100%'}}>
          <div style={{fontSize:11,color:'var(--text3)',marginBottom:8,textAlign:'center',letterSpacing:.5,textTransform:'uppercase'}}>Choose the match</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {cur.options.map((opt,i)=>{
              let border='1.5px solid var(--border)', bg='var(--card)';
              if (feedback!=null && chosen===i) {
                border=feedback==='correct'?`2px solid ${domainColor}`:'2px solid var(--red)';
                bg=feedback==='correct'?domainBg:'var(--red-bg)';
              }
              return (
                <button key={i} onClick={()=>pick(i)} style={{display:'flex',justifyContent:'center',gap:6,padding:'13px 16px',borderRadius:14,border,background:bg,cursor:'pointer',fontSize:24,letterSpacing:6,fontFamily:'inherit',transition:'all .15s'}}>
                  {opt.map((e,j)=><span key={j}>{e}</span>)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
