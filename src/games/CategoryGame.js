import { useState } from 'react';
const CATS = [
  {name:'Animals',   members:['Dog','Cat','Lion','Tiger','Eagle','Whale','Fox','Bear','Deer','Owl'],   distractors:['Chair','Cloud','Bread','Lamp','Stone','River','Pen','Cup']},
  {name:'Fruits',    members:['Apple','Mango','Banana','Grape','Kiwi','Peach','Plum','Lime','Pear','Fig'], distractors:['Carrot','Table','Ocean','Boot','Paper','Clock','Bottle']},
  {name:'Vegetables',members:['Carrot','Spinach','Onion','Broccoli','Potato','Tomato','Pea','Garlic'], distractors:['Guitar','Window','Cloud','Pencil','Ocean','Candle','Jacket']},
];
const TRIALS = 8;
function buildOpts(cat) {
  const m=[...cat.members].sort(()=>Math.random()-.5).slice(0,2);
  const d=[...cat.distractors].sort(()=>Math.random()-.5).slice(0,2);
  return [...m,...d].sort(()=>Math.random()-.5);
}
export default function CategoryGame({ onFinish, setProgress, domainColor, domainBg }) {
  const [cat]      = useState(()=>CATS[Math.floor(Math.random()*CATS.length)]);
  const [trial,    setTrial]    = useState(0);
  const [correct,  setCorrect]  = useState(0);
  const [opts,     setOpts]     = useState(()=>buildOpts(CATS[0]));
  const [feedback, setFeedback] = useState(null);
  const [chosen,   setChosen]   = useState(null);

  const pick = (word, idx) => {
    if (feedback!=null) return;
    const ok = cat.members.includes(word);
    const nc = ok?correct+1:correct;
    setCorrect(nc); setChosen(idx); setFeedback(ok?'correct':'wrong');
    setTimeout(()=>{
      const nt=trial+1; setTrial(nt); setProgress(Math.round((nt/TRIALS)*100)); setOpts(buildOpts(cat)); setFeedback(null); setChosen(null);
      if (nt>=TRIALS) {
        const score=Math.round((nc/TRIALS)*100);
        onFinish({score, metrics:[['Correct',`${nc}/${TRIALS}`],['Category',cat.name],['Accuracy',`${score}%`]]});
      }
    }, 450);
  };

  return (
    <div>
      <h2 style={{fontSize:18,fontWeight:500,color:'var(--navy)',marginBottom:6}}>Semantic Fluency</h2>
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.5}}>Tap the word that belongs to: <strong style={{color:domainColor}}>{cat.name}</strong>. Trial {trial+1}/{TRIALS}.</p>
      <div className="game-area" style={{gap:16}}>
        <div style={{background:domainBg,color:domainColor,fontSize:15,fontWeight:600,padding:'8px 24px',borderRadius:14}}>{cat.name}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%'}}>
          {opts.map((word,i)=>{
            let bg='var(--card)',border='1.5px solid var(--border)',color='var(--text)';
            if (feedback!=null && chosen===i) {
              if (feedback==='correct') {bg=domainBg; border=`2px solid ${domainColor}`; color=domainColor;}
              else {bg='var(--red-bg)'; border='2px solid var(--red)'; color='var(--red)';}
            }
            return <button key={i} onClick={()=>pick(word,i)} style={{padding:'18px 10px',borderRadius:14,border,background:bg,color,fontSize:15,fontWeight:500,cursor:'pointer',fontFamily:'inherit',transition:'all .15s',textAlign:'center'}}>{word}</button>;
          })}
        </div>
        {feedback && <div style={{fontSize:14,fontWeight:500,color:feedback==='correct'?'var(--brand)':'var(--red)'}}>{feedback==='correct'?`✓ Yes! That's a ${cat.name.slice(0,-1).toLowerCase()}`:`✗ Not a ${cat.name.slice(0,-1).toLowerCase()}`}</div>}
      </div>
      <div style={{marginTop:14,display:'flex',gap:5,justifyContent:'center'}}>
        {Array.from({length:TRIALS},(_,i)=><div key={i} style={{width:10,height:10,borderRadius:5,background:i<trial?domainColor:'var(--border)'}}/>)}
      </div>
    </div>
  );
}
