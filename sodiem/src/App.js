import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import './index.css';
import { CREDIT_OPTIONS, SEMESTERS, formatPoint } from './data';
import { calcStats, getGrade } from './utils';
import useFetch from './hooks/useFetch';
import coursesReducer from './coursesReducer';
//không làm gì cả , em note đây để commit lại
const BUILD_TAG = "gp-4073";

const EMPTY = { code: '', name: '', credits: '3', semester: SEMESTERS[0], score: '' };

const App = () => {
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const { data, loading, error } = useFetch('/data/courses.json');
  const [semester, setSemester] = useState('all');
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const codeRef = useRef(null);

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  const viewCourses = useMemo(
    () => (semester === 'all' ? courses : courses.filter((c) => c.semester === semester)),
    [courses, semester]
  );
  const stats = useMemo(() => calcStats(viewCourses), [viewCourses]);
  const allStats = useMemo(() => calcStats(courses), [courses]);

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleScore = (id, e) => {
    const v = e.target.valueAsNumber;
    if (v >= 0 && v <= 10) dispatch({ type: 'SET_SCORE', payload: { id, score: v } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = form.code.trim();
    const name = form.name.trim();
    const score = Number(form.score);
    const next = {};
    if (code === '') next.code = 'Hãy nhập mã môn';
    else if (courses.some((c) => c.code.toLowerCase() === code.toLowerCase()))
      next.code = 'Mã môn đã tồn tại';
    if (name === '') next.name = 'Hãy nhập tên môn';
    if (form.score.trim() === '' || Number.isNaN(score) || score < 0 || score > 10)
      next.score = 'Điểm phải từ 0 đến 10';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        code: code.toUpperCase(),
        name,
        credits: Number(form.credits),
        semester: form.semester,
        score,
      },
    });
    setForm(EMPTY);
    codeRef.current.focus();
  };

  return (
    <div className="app light" data-build={BUILD_TAG}>
      <h1>Sổ điểm sinh viên</h1>

      <section>
        <h2>Thống kê</h2>
        {loading ? (
          <p>Đang tải bảng điểm...</p>
        ) : error ? (
          <p>Không tải được bảng điểm</p>
        ) : (
          <>
            <p>Số môn: {stats.count}</p>
            <p>Tổng tín chỉ: {stats.credits}</p>
            <p>GPA (hệ 4): {stats.gpa.toFixed(2)}</p>
            <p>Xếp loại: {stats.rank}</p>
            <p>GPA tích lũy: {allStats.gpa.toFixed(2)}</p>
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
        </select>
        {loading ? (
          <p>Đang tải bảng điểm...</p>
        ) : error ? (
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
                <th />
              </tr>
            </thead>
            <tbody>
              {viewCourses.map((c) => {
                const grade = getGrade(c.score);
                const failed = grade.letter === 'F';
                return (
                  <tr key={c.id} style={failed ? { color: '#c62828' } : undefined}>
                    <td>{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.credits}</td>
                    <td>{c.semester}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        aria-label={`Điểm ${c.name}`}
                        value={c.score}
                        onChange={(e) => handleScore(c.id, e)}
                      />
                    </td>
                    <td>{failed ? 'F – Học lại' : grade.letter}</td>
                    <td>{formatPoint(grade.point)}</td>
                    <td>
                      <button type="button" onClick={() => dispatch({ type: 'REMOVE', payload: c.id })}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Thêm môn học</h2>
        <form onSubmit={handleSubmit} noValidate className="add-form">
          <div>
            <label htmlFor="f-code">Mã môn</label>
            <input id="f-code" name="code" type="text" ref={codeRef} value={form.code} onChange={handleField} />
            {errors.code && <div role="alert" className="error">{errors.code}</div>}
          </div>
          <div>
            <label htmlFor="f-name">Tên môn</label>
            <input id="f-name" name="name" type="text" value={form.name} onChange={handleField} />
            {errors.name && <div role="alert" className="error">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="f-credits">Số tín chỉ</label>
            <select id="f-credits" name="credits" value={form.credits} onChange={handleField}>
              {CREDIT_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-semester">Học kỳ</label>
            <select id="f-semester" name="semester" value={form.semester} onChange={handleField}>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-score">Điểm hệ 10</label>
            <input id="f-score" name="score" type="number" step="0.1" value={form.score} onChange={handleField} />
            {errors.score && <div role="alert" className="error">{errors.score}</div>}
          </div>
          <button type="submit">Thêm môn</button>
        </form>
      </section>
    </div>
  );
};

export default App;
