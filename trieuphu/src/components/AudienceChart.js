import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    <h4>Ý kiến khán giả</h4>
    {percents.map((p, i) => (
      <div className="aud-row" key={i}>
        <span className="aud-label">{LETTERS[i]}: {p}%</span>
        <div className="aud-bar" style={{ width: `${p}%` }} />
      </div>
    ))}
  </div>
);

export default AudienceChart;