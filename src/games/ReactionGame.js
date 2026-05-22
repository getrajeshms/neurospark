import { useState, useRef } from 'react';
const TRIALS = 8;
export default function ReactionGame({ onFinish, setProgress, domainColor, domainBg }) {
  const [phase,  setPhase]  = useState('waiting');
  const [trial,  setTrial]  = useState(0);
  const [lastRt, setLastRt] = useState(null);
  const rtsRef   = useRef([]);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const scheduleGo = () => {
    setPhase('ready');
    timerRef.current = setTimeout(()=>{ setPhase('go'); startRef.current = Date.now(); }, 1200+Math.random()*2200);
  };

  const handleTap = () => {
    if (phase==='waiting') { scheduleGo(); return; }
    if (phase==='ready')   { clearTimeout(timerRef.current); setPhase('tooEarly'); timerRef.current = setTimeout(()=>scheduleGo(), 1000); return; }
    if (phase==='go') {
      const rt = Date.now()-startRef.current;
      const newRts = [...rtsRef.current, rt];
      rtsRef.current = newRts;
      setLastRt(rt);
      const nt = trial+1;
      setTrial(nt);
      setProgress(Math.round((nt/TRIALS)*100));
      if (nt>=TRIALS) {
        const avg  = Math.round(newRts.reduce((a,b)=>a+b,0)/newRts.length);
        const best = Math.min(...newRts);
        const score = Math.max(10, Math.min(100, Math.round(100-(avg-180)/4)));
        onFinish({ score, metrics:[['Avg reaction',`${avg}ms`],['Fastest tap',`${best}ms`],['Trials',`${TRIALS}/${TRIALS}`]] });
        return;
      }
      setPhase('waiting');
    }
  };

  const cfg = {
    waiting:  { bg:'var(--border)',     txt:'👆 Tap to start', sub:'Get ready' },
    ready:    { bg:domainBg,            txt:'⏳',              sub:'Wait for green…' },
    go:       { bg:domainColor,         txt:'TAP!',            sub:'As fast as you can!' },
    tooEarly: { bg:'var(--red-bg)',     txt:'⚠',              sub:'Too early! Wait…' },
  }[phase];

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Reaction Time</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Tap the circle as fast as you can when it turns green. Trial {Math.min(trial+1,TRIALS)}/{TRIALS}.</p>
      <div className="game-area" style={{cursor:'pointer',userSelect:'none',gap:20}} onClick={handleTap}>
        <div style={{width:120,height:120,borderRadius:'50%',background:cfg.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:phase==='go'?20:32,fontWeight:700,color:phase==='go'?'#fff':'var(--text2)',transition:'background .15s',border:`3px solid ${phase==='go'?domainColor:'var(--border)'}`}}>{cfg.txt}</div>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:13,color:'var(--text2)'}}>{cfg.sub}</div>
          {lastRt && phase==='waiting' && <div style={{fontSize:18,fontWeight:600,color:domainColor,marginTop:4}}>{lastRt}ms ✓</div>}
        </div>
      </div>
      {rtsRef.current.length>0 && (
        <div style={{marginTop:14}}>
          <div style={{fontSize:11,color:'var(--text3)',marginBottom:8}}>Reaction times (ms)</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {rtsRef.current.map((rt,i)=>(
              <div key={i} style={{background:domainBg,color:domainColor,fontSize:11,fontWeight:500,padding:'3px 8px',borderRadius:8}}>{rt}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
