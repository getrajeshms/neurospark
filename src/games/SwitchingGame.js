import { useState, useRef } from 'react';
const TOTAL = 12;
const ITEMS = [{shape:'circle',color:'blue',emoji:'🔵'},{shape:'circle',color:'red',emoji:'🔴'},{shape:'square',color:'blue',emoji:'🟦'},{shape:'square',color:'red',emoji:'🟥'}];
const RULES = ['SHAPE','COLOR'];
export default function SwitchingGame({ onFinish, setProgress, domainColor, domainBg }) {
  const [trial,   setTrial]   = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback,setFeedback]= useState(null);
  const [item,    setItem]    = useState(()=>ITEMS[Math.floor(Math.random()*4)]);
  const timerRef = useRef(null);
  const rule = RULES[trial%2];

  const handle = (side) => {
    if (feedback) return;
    let ok = false;
    if (rule==='SHAPE') ok = (side==='circle'&&item.shape==='circle')||(side==='square'&&item.shape==='square');
    else                ok = (side==='blue'&&item.color==='blue')||(side==='red'&&item.color==='red');
    const nc = ok?correct+1:correct;
    setCorrect(nc); setFeedback(ok?'correct':'wrong');
    timerRef.current = setTimeout(()=>{
      const nt=trial+1;
      setTrial(nt); setProgress(Math.round((nt/TOTAL)*100));
      setItem(ITEMS[Math.floor(Math.random()*4)]); setFeedback(null);
      if (nt>=TOTAL) {
        const score=Math.round((nc/TOTAL)*100);
        onFinish({score, metrics:[['Correct',`${nc}/${TOTAL}`],['Rule switches',`${Math.floor(TOTAL/2)}`],['Accuracy',`${score}%`]]});
      }
    }, 420);
  };

  const btnStyle = { display:'flex',flexDirection:'column',alignItems:'center',gap:6,padding:'16px 10px',borderRadius:14,border:'1.5px solid var(--border)',background:'var(--card)',cursor:'pointer',fontFamily:'inherit',transition:'all .15s' };

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Cognitive Flexibility</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Sort by <strong style={{color:domainColor}}>{rule}</strong>. Trial {trial+1}/{TOTAL}. <span style={{color:'var(--text3)'}}>Next rule: {RULES[(trial+1)%2]}</span></p>
      <div className="game-area" style={{gap:16}}>
        <div style={{background:domainBg,color:domainColor,fontSize:13,fontWeight:600,padding:'6px 20px',borderRadius:12,letterSpacing:.5}}>Sort by: {rule}</div>
        <div style={{fontSize:64,lineHeight:1,filter:feedback==='wrong'?'grayscale(0.8)':'none',transition:'filter .2s'}}>{item.emoji}</div>
        {feedback && <div style={{fontSize:16,color:feedback==='correct'?'var(--brand)':'var(--red)',fontWeight:500}}>{feedback==='correct'?'✓ Correct!':'✗ Wrong!'}</div>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,width:'100%'}}>
          {rule==='SHAPE' ? <>
            <button onClick={()=>handle('circle')} style={btnStyle}><span style={{fontSize:24}}>⚪</span><span style={{fontSize:13}}>Circle</span></button>
            <button onClick={()=>handle('square')} style={btnStyle}><span style={{fontSize:24}}>⬜</span><span style={{fontSize:13}}>Square</span></button>
          </> : <>
            <button onClick={()=>handle('blue')} style={{...btnStyle,borderColor:'#378ADD'}}><span style={{fontSize:24}}>🔵</span><span style={{fontSize:13}}>Blue</span></button>
            <button onClick={()=>handle('red')}  style={{...btnStyle,borderColor:'#E24B4A'}}><span style={{fontSize:24}}>🔴</span><span style={{fontSize:13}}>Red</span></button>
          </>}
        </div>
      </div>
      <div style={{marginTop:14,display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap'}}>
        {Array.from({length:TOTAL},(_,i)=><div key={i} style={{width:9,height:9,borderRadius:5,background:i<trial?domainColor:'var(--border)'}}/>)}
      </div>
    </div>
  );
}
