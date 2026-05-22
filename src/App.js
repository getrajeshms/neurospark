import { useState, useCallback } from 'react';
import HomeScreen      from './screens/HomeScreen';
import IntakeScreen    from './screens/IntakeScreen';
import DomainsScreen   from './screens/DomainsScreen';
import GameScreen      from './screens/GameScreen';
import ResultScreen    from './screens/ResultScreen';
import DashboardScreen from './screens/DashboardScreen';
import ReportScreen    from './screens/ReportScreen';

export default function App() {
  const [screen,       setScreen]       = useState('home');
  const [activeDomain, setActiveDomain] = useState(null);
  const [lastResult,   setLastResult]   = useState(null);
  const [scores,       setScores]       = useState({});
  const [sessions,     setSessions]     = useState([]);
  const [participant,  setParticipant]  = useState(null);

  const navigate = useCallback((to, opts = {}) => {
    if (opts.domain) setActiveDomain(opts.domain);
    setScreen(to);
    window.scrollTo(0, 0);
  }, []);

  const onIntake = useCallback((data) => {
    setParticipant(data);
  }, []);

  const onGameFinish = useCallback((result) => {
    const entry = {
      score:   result.score,
      metrics: result.metrics,
      elapsed: result.elapsed,
      date:    new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short' }),
    };
    setScores(prev => ({ ...prev, [activeDomain.id]: entry }));
    setSessions(prev => [{ domain: activeDomain.name, domainId: activeDomain.id, score: result.score, date: entry.date }, ...prev]);
    setLastResult({ ...entry, domain: activeDomain });
    setScreen('result');
    window.scrollTo(0, 0);
  }, [activeDomain]);

  return (
    <div className="app-shell">
      {screen === 'home'      && <HomeScreen      navigate={navigate} scores={scores} />}
      {screen === 'intake'    && <IntakeScreen    navigate={navigate} onIntake={onIntake} />}
      {screen === 'domains'   && <DomainsScreen   navigate={navigate} scores={scores} participant={participant} />}
      {screen === 'game'      && <GameScreen      domain={activeDomain} onFinish={onGameFinish} navigate={navigate} />}
      {screen === 'result'    && <ResultScreen    result={lastResult} navigate={navigate} scores={scores} />}
      {screen === 'dashboard' && <DashboardScreen navigate={navigate} scores={scores} sessions={sessions} participant={participant} />}
      {screen === 'report'    && <ReportScreen    navigate={navigate} scores={scores} sessions={sessions} participant={participant} />}
    </div>
  );
}
