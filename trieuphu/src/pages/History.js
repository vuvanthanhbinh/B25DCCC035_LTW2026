import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const max = history.reduce((m, h) => Math.max(m, h.prize), 0);
  const total = history.reduce((s, h) => s + h.prize, 0);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <p>Số lượt chơi: {history.length}</p>
          <p>Tiền thưởng cao nhất: {formatMoney(max)}</p>
          <p>Tổng tiền thưởng: {formatMoney(total)}</p>
          <button onClick={onClear}>Xóa lịch sử</button>
          <table>
            <thead>
              <tr><th>Người chơi</th><th>Số câu đúng</th><th>Tiền thưởng</th><th>Thời gian</th></tr>
            </thead>
            <tbody>
              {sorted.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.correctCount}</td>
                  <td>{formatMoney(h.prize)}</td>
                  <td>{h.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default History;
