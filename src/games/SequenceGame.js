import { useState, useEffect, useRef, useCallback } from 'react';
const TOTAL = 6;
export default function SequenceGame({ onFinish, setProgress, domainColor, domainBg }) {
  const [litTile, setLitTile]     = useState(null);
  const [tileState, setTileState] = useState({});
  const [phase, setPhase]         = useState('intro');
  const [status, setStatus]       = useState('');
  const [round, setRound]         = useState(0);
  const [correct, setCorrect]     = useState(0);
  const seqRef   = useRef([]);
  const userRef  = useRef([]);
  const timerRef = useRef(null);

  const showSeq = useCallback((seq) => {
    setPhase('showing'); setStatus('Watch carefully…'); userRef.current = [];
    let i = 0;
    const flash = () => {
      if (i >= seq.length) { setLitTile(null); setTimeout(()=>{ setPhase('input'); setStatus('Tap tiles in the same order!'); }, 400); return; }
      setLitTile(seq[i]);
      timerRef.current = setTimeout(()=>{ setLitTile(null); i++; timerRef.current = setTimeout(flash, 300); }, 550);
    };
    timerRef.current = setTimeout(flash, 600);
  }, []);

  const startRound = useCallback((r) => {
    setProgress(Math.round((r/TOTAL)*100));
    const len = 2+r;
    const seq = Array.from({length:len}, ()=>Math.floor(Math.random()*9));
    seqRef.current = seq; userRef.current = [];
    setTileState({});
    showSeq(seq);
  }, [setProgress, showSeq]);

  useEffect(() => { timerRef.current = setTimeout(()=>startRound(0), 400); return ()=>clearTimeout(timerRef.current); }, [startRound]);

  const handleTile = (idx) => {
    if (phase !== 'input') return;
    const pos = userRef.current.length;
    userRef.current = [...userRef.current, idx];
    if (idx !== seqRef.current[pos]) {
      setTileState({[idx]:'wrong'});
      setPhase('done'); setStatus('Wrong! Game over.');
      setTimeout(()=>onFinish({ score:Math.round((correct/TOTAL)*100), metrics:[['Rounds passed',`${correct}/${TOTAL}`],['Max sequence',`${2+round} tiles`],['Accuracy',`${Math.round((correct/TOTAL)*100)}%`]] }), 900);
      return;
    }
    setTileState({[idx]:'correct'});
    setTimeout(()=>setTileState({}), 220);
    if (userRef.current.length === seqRef.current.length) {
      const newCorrect = correct+1;
      setCorrect(newCorrect);
      const nextRound = round+1;
      if (nextRound >= TOTAL) {
        setStatus('🎉 All rounds complete!');
        setTimeout(()=>onFinish({ score:96, metrics:[['Rounds passed',`${TOTAL}/${TOTAL}`],['Max sequence',`${2+round} tiles`],['Accuracy','96%']] }), 700);
        return;
      }
      setRound(nextRound);
      setStatus('✓ Correct! Next round…');
      timerRef.current = setTimeout(()=>startRound(nextRound), 900);
    }
  };

  useEffect(()=>()=>clearTimeout(timerRef.current), []);

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Sequence Memory</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Watch the tiles light up, then tap them in the same order. Round {round+1}/{TOTAL}.</p>
      <div className="game-area" style={{gap:16}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,width:'100%',maxWidth:220}}>
          {Array.from({length:9},(_,i)=>{
            const s=tileState[i];
            const bg = litTile===i ? domainColor : s==='correct' ? '#1D9E75' : s==='wrong' ? '#A32D2D' : '#e8eeec';
            return <div key={i} onClick={()=>handleTile(i)} style={{aspectRatio:'1',borderRadius:14,background:bg,cursor:phase==='input'?'pointer':'default',transition:'background .15s, transform .1s',transform:litTile===i?'scale(1.08)':'scale(1)',border:`2px solid ${bg==='#e8eeec'?'var(--border)':'transparent'}`}}/>;
          })}
        </div>
        <div style={{fontSize:13,color:'var(--text2)',textAlign:'center',minHeight:20}}>{status}</div>
      </div>
      <div style={{marginTop:14,display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
        {(seqRef.current||[]).map((_,i)=>(
          <div key={i} style={{width:12,height:12,borderRadius:6,background:i<(userRef.current?.length||0)?domainColor:'var(--border)',transition:'background .2s'}}/>
        ))}
      </div>
    </div>
  );
}
