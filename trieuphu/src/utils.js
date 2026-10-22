import { PRIZES, MILESTONES } from './data';

// reason: 'win' | 'wrong' | 'timeout' | 'stop'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'stop') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length ? PRIZES[Math.max(...passed) - 1] : 0;
};

export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


export const pickRandom = (arr, n) =>
  [...arr].sort(() => Math.random() - 0.5).slice(0, n);

export const calcAudience = (correct, hidden) => {
  const result = [0, 0, 0, 0];
  const wrongs = [0, 1, 2, 3].filter((i) => i !== correct && !hidden.includes(i));
  const correctPct = randInt(40, 70);
  result[correct] = correctPct;
  let rest = 100 - correctPct;
  wrongs.forEach((w, k) => {
    if (k === wrongs.length - 1) result[w] = rest;
    else {
      const v = randInt(0, rest);
      result[w] = v;
      rest -= v;
    }
  });
  return result;
};
