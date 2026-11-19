const KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : null;
  } catch (err) {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(courses));
  } catch (err) {
    // bỏ qua lỗi ghi
  }
};
