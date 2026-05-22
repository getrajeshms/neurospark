import { useState, useRef } from 'react';
const WORDS  = ['RED','BLUE','GREEN','YELLOW'];
const COLORS = { RED:'#E24B4A', BLUE:'#378ADD', GREEN:'#3B6D11', YELLOW:'#BA7517' };
const TOTAL  = 10;
export default function StroopGame({ onFinish, setProgress, domainColor }) {
  const [trial,    setTrial]    = useState(0);
  const [correct,  setCorrect]  = useState(0);
  const [word,     setWord]     = useState(()=>WORDS[Math.floor(Math.random()*4)]);
  const [inkColor, setInkColor] = useState(()=>WORDS[Math.floor(Math.random()*4)]);
  const [feedback, setFeedback] = useState(null);
  const rtsRef = useRef([]);
  const startRef = useRef(Date.now());

  const next = (t, c, times) => {
    if (t >= TOTAL) {
      const avg = times.length ? Math.round(times.reduce((a,b)=>a+b,0)/times.length) : 500;
      onFinish({ score:Math.round((c/TOTAL)*100), metrics:[['Correct',`${c}/${TOTAL}`],['Avg reaction',`${avg}ms`],['Accuracy',`${Math.round((c/TOTAL)*100)}%`]] });
      return;
    }
    setProgress(Math.round((t/TOTAL)*100));
    setWord(WORDS[Math.floor(Math.random()*4)]);
    setInkColor(WORDS[Math.floor(Math.random()*4)]);
    setFeedback(null);
    startRef.current = Date.now();
  };

  const handleAnswer = (chosen) => {
    if (feedback) return;
    const rt = Date.now()-startRef.current;
    const ok = chosen===inkColor;
    const nc = ok?correct+1:correct;
    rtsRef.current = [...rtsRef.current, rt];
    setCorrect(nc); setFeedback(ok?'correct':'wrong');
    setTimeout(()=>{ setTrial(t=>{ next(t+1,nc,rtsRef.current); return t+1; }); }, 350);
  };

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Stroop Attention Task</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Tap the <strong>ink colour</strong> — ignore what the word says. Trial {trial+1}/{TOTAL}.</p>
      <div className="game-area" style={{gap:12}}>
        <div style={{fontSize:48,fontWeight:600,letterSpacing:-1,color:COLORS[inkColor]||domainColor,minHeight:64,display:'flex',alignItems:'center',transition:'all .2s'}}>{word}</div>
        <div style={{fontSize:12,color:'var(--text2)'}}>What colour is the ink?</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%',marginTop:8}}>
          {WORDS.map(w=>(
            <button key={w} onClick={()=>handleAnswer(w)} style={{padding:14,borderRadius:14,border:'none',cursor:'pointer',background:COLORS[w],color:'#fff',fontSize:13,fontWeight:600,fontFamily:'inherit',transition:'all .15s',opacity:feedback?0.7:1}}>
              {w}
            </button>
          ))}
        </div>
      </div>
      <div style={{marginTop:14,display:'flex',gap:5,justifyContent:'center',flexWrap:'wrap'}}>
        {Array.from({length:TOTAL},(_,i)=>(
          <div key={i} style={{width:10,height:10,borderRadius:5,background:i<trial?domainColor:'var(--border)'}}/>
        ))}
      </div>
    </div>
  );
}
