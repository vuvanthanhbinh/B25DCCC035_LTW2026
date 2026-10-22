import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const best = history.reduce((b, h) => (!b || h.prize > b.prize ? h : b), null);

  return (
    <div>
      <h1>Ai là triệu phú</h1>
      {best && <p className="record">Kỷ lục: {formatMoney(best.prize)} – {best.name}</p>}
      <ul>
        <li>15 câu hỏi trắc nghiệm về HTML, CSS, ES6, React; mỗi câu có 30 giây.</li>
        <li>Trả lời đúng để leo lên bậc tiền thưởng tiếp theo, câu 15 trị giá {formatMoney(250000000)}.</li>
        <li>Câu 5, 10, 15 là mốc an toàn. Trả lời sai hoặc hết giờ chỉ nhận tiền của mốc cao nhất đã qua.</li>
        <li>Có 3 quyền trợ giúp: 50:50, Hỏi khán giả, Dừng cuộc chơi.</li>
      </ul>
      <label>
        Tên người chơi:{' '}
        <input
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nhập tên của bạn"
        />
      </label>{' '}
      <button disabled={!playerName.trim()} onClick={() => navigate('/play')}>Bắt đầu</button>
    </div>
  );
};

export default Home;
