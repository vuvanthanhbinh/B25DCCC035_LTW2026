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

export const calcRequired = (courses, target, remaining) => {
  const t = Number(target);
  const r = Number(remaining);
  const invalid =
    String(target).trim() === '' ||
    String(remaining).trim() === '' ||
    Number.isNaN(t) ||
    t < 0 ||
    t > 4 ||
    !Number.isInteger(r) ||
    r < 1;
  if (invalid) return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  const { credits, points } = calcStats(courses);
  const need = (t * (credits + r) - points) / r;
  if (need > 4) return 'Không thể đạt mục tiêu này';
  if (need <= 0) return 'Bạn đã đạt mục tiêu';
  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${r} tín chỉ còn lại`;
};
