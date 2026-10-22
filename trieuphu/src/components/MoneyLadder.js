import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ current }) => (
  <ul className="ladder">
    {PRIZES.map((prize, i) => ({ prize, n: i + 1 }))
      .reverse()
      .map(({ prize, n }) => (
        <li
          key={n}
          className={`${n === current ? 'current' : ''} ${MILESTONES.includes(n) ? 'milestone' : ''}`}
        >
          {n}. {formatMoney(prize)}
        </li>
      ))}
  </ul>
);

export default MoneyLadder;
