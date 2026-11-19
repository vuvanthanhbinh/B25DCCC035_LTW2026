import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './index.css';
import { GRADES, SEMESTERS } from './data';
import { getGrade, calcStats } from './utils';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import useLocalStorage from './hooks/useLocalStorage';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { removeCourse, selectCourses, setCourses, setScore } from './features/coursesSlice';
import { hasSaved } from './store';
import CourseRow from './components/CourseRow';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "gp-4073";

const App = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const { theme, toggleTheme } = useTheme();
  const { showNotice } = useNotice();
  const { data, loading, error } = useFetch('/data/courses.json');
  const [semester, setSemester] = useLocalStorage('ltw_sodiem_semester', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!hasSaved && data) dispatch(setCourses(data));
  }, [data, dispatch]);

  const handleKey = useCallback((e) => {
    if (e.key === '/') {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return;
      e.preventDefault();
      if (searchRef.current) searchRef.current.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
      setSearch('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const viewCourses = useMemo(
    () => (semester === 'all' ? courses : courses.filter((c) => c.semester === semester)),
    [courses, semester]
  );
  const shown = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (q === '') return viewCourses;
    return viewCourses.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    );
  }, [viewCourses, debouncedSearch]);

  const stats = useMemo(() => calcStats(viewCourses), [viewCourses]);
  const allStats = useMemo(() => calcStats(courses), [courses]);
  const distribution = useMemo(() => {
    const counts = viewCourses.reduce((acc, c) => {
      const letter = getGrade(c.score).letter;
      return { ...acc, [letter]: (acc[letter] || 0) + 1 };
    }, {});
    return GRADES.map((g) => ({ letter: g.letter, count: counts[g.letter] || 0 }));
  }, [viewCourses]);

  useEffect(() => {
    document.title = allStats.count > 0 ? `GPA ${allStats.gpa.toFixed(2)} – Sổ điểm` : 'Sổ điểm';
  }, [allStats]);

  const handleScore = useCallback((id, score) => dispatch(setScore({ id, score })), [dispatch]);
  const handleRemove = useCallback(
    (course) => {
      dispatch(removeCourse(course.id));
      showNotice(`Đã xóa môn ${course.name}`);
    },
    [dispatch, showNotice]
  );
  const handleReset = () => {
    if (!data) return;
    dispatch(setCourses(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };
  const handleCourseShift = (e) => setSearch(e.target.value);

  const showLoading = !hasSaved && loading;
  const showError = !hasSaved && error;

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <header>
        <h1>Sổ điểm sinh viên</h1>
        <button type="button" onClick={toggleTheme}>
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </header>

      <section>
        <h2>Thống kê</h2>
        {showLoading ? (
          <p>Đang tải bảng điểm...</p>
        ) : showError ? (
          <p>Không tải được bảng điểm</p>
        ) : (
          <>
            <p>Số môn: {stats.count}</p>
            <p>Tổng tín chỉ: {stats.credits}</p>
            <p>GPA (hệ 4): {stats.gpa.toFixed(2)}</p>
            <p>Xếp loại: {stats.rank}</p>
            <p>GPA tích lũy: {allStats.gpa.toFixed(2)}</p>
            <h3>Phân bố điểm chữ</h3>
            <ul>
              {distribution.map((d) => (
                <li key={d.letter}>
                  {d.letter}: {d.count}{' '}
                  <span className="bar" style={{ width: 24 * d.count }} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <h2>Bảng điểm</h2>
        <label htmlFor="sem">Xem học kỳ</label>
        <select id="sem" value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option value="all">Tất cả</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>{' '}
        <label htmlFor="search">Tìm môn học</label>
        <input id="search" type="text" ref={searchRef} value={search} onChange={handleCourseShift} />
        <p>Tìm thấy {shown.length} môn</p>
        {showLoading ? (
          <p>Đang tải bảng điểm...</p>
        ) : showError ? (
          <p>Không tải được bảng điểm</p>
        ) : courses.length === 0 ? (
          <p>Chưa có môn học nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>Tín chỉ</th>
                <th>Học kỳ</th>
                <th>Điểm (hệ 10)</th>
                <th>Điểm chữ</th>
                <th>Điểm (hệ 4)</th>
                <th>Số lần render</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <CourseRow key={c.id} course={c} onScore={handleScore} onRemove={handleRemove} />
              ))}
            </tbody>
          </table>
        )}
        <p>
          <button type="button" onClick={handleReset}>Đặt lại dữ liệu mẫu</button>
        </p>
      </section>

      <section>
        <h2>Thêm môn học</h2>
        <AddCourseForm />
      </section>

      <section>
        <h2>Mục tiêu GPA</h2>
        <GoalPlanner />
      </section>
    </div>
  );
};

export default App;
