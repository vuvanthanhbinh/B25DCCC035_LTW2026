const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const HISTORY_KEY = 'ltw_trieuphu_history';

const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(loadHistory);

  // Mounting: gọi API
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);


  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addGame = (record) => setHistory((h) => [...h, record]);
  const clearHistory = () => setHistory([]);

  const wrap = (el) =>
    loading ? <p>Đang tải câu hỏi...</p> : error ? <p>Không tải được câu hỏi.</p> : el;

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />}
          />
          <Route
            path="play"
            element={wrap(<Play questions={questions} playerName={playerName} onFinish={addGame} />)}
          />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History history={history} onClear={clearHistory} />} />
          <Route path="questions" element={wrap(<QuestionBank questions={questions} />)} />
          <Route path="questions/:id" element={wrap(<QuestionDetail questions={questions} />)} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
