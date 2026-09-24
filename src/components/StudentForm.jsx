import React, { useState } from "react";

const StudentForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", score: "", class: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, score, class: className } = form;
    const scoreNum = parseFloat(score);

    if (!name.trim() || !className.trim() || score === "") {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp.");
      return;
    }
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10).");
      return;
    }

    onAdd({
      id: Date.now(),
      name: name.trim(),
      score: scoreNum,
      class: className.trim(),
    });
    setForm({ name: "", score: "", class: "" });
    setError("");
  };

  return (
    <div className="card">
      <h2>Thêm sinh viên mới</h2>
      <form className="addform" onSubmit={handleSubmit}>
        <div>
          <label>Họ tên</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label>Điểm số</label>
          <input name="score" value={form.score} onChange={handleChange} placeholder="0 - 10" />
        </div>
        <div>
          <label>Lớp</label>
          <input name="class" value={form.class} onChange={handleChange} placeholder="10A1" />
        </div>
        <button type="submit" className="btn-primary">
          Thêm
        </button>
      </form>
      {error && <div className="err">{error}</div>}
    </div>
  );
};

export default StudentForm;
