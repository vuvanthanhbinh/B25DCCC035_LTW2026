import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CREDIT_OPTIONS, SEMESTERS } from '../data';
import { addCourse, selectCourses } from '../features/coursesSlice';
import { useNotice } from '../context/NoticeContext';

const EMPTY = { code: '', name: '', credits: '3', semester: SEMESTERS[0], score: '' };

const AddCourseForm = () => {
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const { showNotice } = useNotice();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const codeRef = useRef(null);

  const handleField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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

    dispatch(
      addCourse({
        code: code.toUpperCase(),
        name,
        credits: Number(form.credits),
        semester: form.semester,
        score,
      })
    );
    showNotice(`Đã thêm môn ${name}`);
    setForm(EMPTY);
    codeRef.current.focus();
  };

  return (
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
  );
};

export default AddCourseForm;
