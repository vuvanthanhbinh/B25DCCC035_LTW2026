import { GRADES, RANKS } from './data';

export const getGrade = (score) => GRADES.find((g) => score >= g.min);

export const getRank = (gpa) => RANKS.find((r) => gpa >= r.min).title;

export const calcStats = (courses) => {
  const count = courses.length;
  const credits = courses.reduce((sum, c) => sum + c.credits, 0);
  const points = courses.reduce((sum, c) => sum + c.credits * getGrade(c.score).point, 0);
  if (count === 0 || credits === 0) {
    return { count, credits, points, gpa: 0, rank: 'Chưa xếp loại' };
  }
  const gpa = Math.round((points / credits) * 100) / 100;
  return { count, credits, points, gpa, rank: getRank(gpa) };
};
