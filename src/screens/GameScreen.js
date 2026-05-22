import { useState, useEffect, useRef } from 'react';
import SequenceGame  from '../games/SequenceGame';
import StroopGame    from '../games/StroopGame';
import DigitGame     from '../games/DigitGame';
import ReactionGame  from '../games/ReactionGame';
import SwitchingGame from '../games/SwitchingGame';
import PatternGame   from '../games/PatternGame';
import CategoryGame  from '../games/CategoryGame';

const MAP = { sequence:SequenceGame, stroop:StroopGame, digit:DigitGame, reaction:ReactionGame, switching:SwitchingGame, pattern:PatternGame, category:CategoryGame };

export default function GameScreen({ domain, onFinish, navigate }) {
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed]   = useState(0);
  const timerRef = useRef(null);
  useEffect(() => {
    timerRef.current = setInterval(()=>setElapsed(t=>t+1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);
  const handleFinish = (result) => { clearInterval(timerRef.current); onFinish({...result, elapsed}); };
  const Game = MAP[domain?.game];
  return (
    <div className="fade-up">
      <nav className="nav">
        <button className="nav-back" onClick={()=>navigate('domains')}>← Domains</button>
        <span className="timer-badge">⏱ {elapsed}s</span>
      </nav>
      <div style={{padding:'10px 20px 4px'}}>
        <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
      </div>
      <div style={{padding:'12px 20px 4px',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:36,height:36,borderRadius:10,background:domain.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{domain.icon}</div>
        <div>
          <div style={{fontSize:14,fontWeight:500,color:'var(--navy)'}}>{domain.name}</div>
          <div style={{fontSize:11,color:'var(--text3)'}}>{domain.neuropsych}</div>
        </div>
      </div>
      <div style={{padding:'12px 20px 24px'}}>
        {Game && <Game onFinish={handleFinish} setProgress={setProgress} domainColor={domain.color} domainBg={domain.bg}/>}
      </div>
    </div>
  );
}
