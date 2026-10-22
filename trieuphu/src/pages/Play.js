import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION, LETTERS } from '../data';
import { calcPrize, calcAudience, pickRandom } from '../utils';

const Game = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering'); 
  const [selected, setSelected] = useState(null); 
  const [seconds, setSeconds] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [used, setUsed] = useState({ fifty: false, audience: false });

  const q = questions[index];
  const name = playerName.trim();

  const finish = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({
      id: Date.now(),
      name,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', { replace: true, state: { name, prize, correctCount, reason } });
  };

  const next = () => {
    setIndex((i) => i + 1);
    setStatus('answering');
    setSelected(null);
    setSeconds(TIME_PER_QUESTION);
    setHidden([]);
    setAudience(null);
  };

  const choose = (i) => {
    setSelected(i);
    setStatus('locked');
  };

  
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [status, index]);

  
  useEffect(() => {
    if (status === 'answering' && seconds <= 0) {
      setSelected(-1);
      setStatus('revealed');
    }
  }, [seconds, status]);


  useEffect(() => {
    if (status === 'locked') {
      const t = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(t);
    }
    if (status === 'revealed') {
      const t = setTimeout(() => {
        if (selected === q.answer) {
          if (index + 1 >= questions.length) finish(index + 1, 'win');
          else next();
        } else {
          finish(index, selected === -1 ? 'timeout' : 'wrong');
        }
      }, 2000);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  
  useEffect(() => {
    const handleKey = (e) => {
      if (status !== 'answering') return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && !hidden.includes(i)) choose(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden]);

  
  useEffect(() => {
    document.title = `Câu ${index + 1}/${questions.length} – ${name}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, name, questions.length]);

  const getState = (i) => {
    if (status === 'locked') return i === selected ? 'selected' : '';
    if (status === 'revealed') {
      if (i === q.answer) return 'correct';
      if (i === selected) return 'wrong';
    }
    return '';
  };

  const useFifty = () => {
    const wrongs = [0, 1, 2, 3].filter((i) => i !== q.answer);
    setHidden(pickRandom(wrongs, 2));
    setUsed((u) => ({ ...u, fifty: true }));
  };

  const useAudience = () => {
    setAudience(calcAudience(q.answer, hidden));
    setUsed((u) => ({ ...u, audience: true }));
  };

  const busy = status !== 'answering';

  return (
    <div className="play">
      <div className="play-main">
        <Timer seconds={seconds} />
        <QuestionCard
          number={index + 1}
          total={questions.length}
          question={q}
          getState={getState}
          hidden={hidden}
          disabled={busy}
          onChoose={choose}
        />
        <Lifelines
          used={used}
          disabled={busy}
          onFifty={useFifty}
          onAudience={useAudience}
          onStop={() => finish(index, 'stop')}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <MoneyLadder current={index + 1} />
    </div>
  );
};

const Play = ({ questions, playerName, onFinish }) =>
  playerName.trim() ? (
    <Game questions={questions} playerName={playerName} onFinish={onFinish} />
  ) : (
    <Navigate to="/" replace />
  );

export default Play;
