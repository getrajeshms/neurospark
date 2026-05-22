import { useState, useEffect, useRef } from 'react';
const ROUNDS = 6;
export default function DigitGame({ onFinish, setProgress, domainColor }) {
  const [round,   setRound]   = useState(0);
  const [seq,     setSeq]     = useState('');
  const [typed,   setTyped]   = useState('');
  const [phase,   setPhase]   = useState('showing');
  const [status,  setStatus]  = useState('Memorise!');
  const [correct, setCorrect] = useState(0);
  const timerRef = useRef(null);

  const startRound = (r) => {
    setProgress(Math.round((r/ROUNDS)*100));
    const len = 3+r;
    const s = Array.from({length:len},()=>Math.floor(Math.random()*10)).join('');
    setSeq(s); setTyped(''); setPhase('showing'); setStatus('Memorise!');
    timerRef.current = setTimeout(()=>{ setPhase('input'); setStatus('Type the digits you saw'); }, 1800+r*250);
  };

  useEffect(()=>{ startRound(0); return ()=>clearTimeout(timerRef.current); },[]);// eslint-disable-line

  const handleDigit = (d) => {
    if (phase!=='input') return;
    const nt = typed+d;
    setTyped(nt);
    if (nt.length===seq.length) {
      const ok = nt===seq;
      const nc = ok?correct+1:correct;
      setCorrect(nc); setPhase('feedback'); setStatus(ok?'✓ Correct!':`✗ Was: ${seq}`);
      const nr = round+1;
      if (nr>=ROUNDS) {
        setTimeout(()=>onFinish({ score:Math.round((nc/ROUNDS)*100), metrics:[['Rounds passed',`${nc}/${ROUNDS}`],['Max span',`${3+round} digits`],['Accuracy',`${Math.round((nc/ROUNDS)*100)}%`]] }), 900);
      } else {
        timerRef.current = setTimeout(()=>{ setRound(nr); startRound(nr); }, 1000);
      }
    }
  };

  const handleDel = () => { if (phase!=='input') return; setTyped(t=>t.slice(0,-1)); };

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Digit Span</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Memorise the digits shown, then type them back. Round {round+1}/{ROUNDS}.</p>
      <div className="game-area" style={{gap:16}}>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:44,fontWeight:300,letterSpacing:10,color:phase==='showing'?'var(--navy)':'var(--text3)',minHeight:60,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .3s'}}>
          {phase==='showing' ? seq : '— '.repeat(seq.length).trim()}
        </div>
        <div style={{fontSize:12,color:'var(--text2)'}}>{status}</div>
        <div style={{fontSize:28,letterSpacing:8,color:phase==='feedback'?(typed===seq?'var(--brand)':'var(--red)'):domainColor,minHeight:40,transition:'color .3s'}}>
          {(phase==='input'||phase==='feedback') ? (typed.split('').join(' ')||'·') : ''}
        </div>
        {phase==='input' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,width:'100%',marginTop:8}}>
            {[1,2,3,4,5,6,7,8,9,0].map(n=>(
              <button key={n} onClick={()=>handleDigit(String(n))} style={{height:44,borderRadius:12,border:'1.5px solid var(--border)',background:'var(--card)',fontSize:16,fontWeight:500,cursor:'pointer',fontFamily:'inherit',color:'var(--text)',transition:'all .1s'}}>{n}</button>
            ))}
            <button onClick={handleDel} style={{height:44,borderRadius:12,border:'1.5px solid var(--border)',background:'var(--card)',fontSize:14,cursor:'pointer',fontFamily:'inherit',color:'var(--text2)'}}>⌫</button>
          </div>
        )}
      </div>
    </div>
  );
}
