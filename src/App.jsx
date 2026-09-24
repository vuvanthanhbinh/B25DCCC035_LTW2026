import React, { useState, useMemo } from "react";
import StudentForm from "./components/StudentForm";
import StudentStats from "./components/StudentStats";
import StudentTable from "./components/StudentTable";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Nguyễn Văn An", score: 8.5, class: "10A1" },
  { id: 2, name: "Trần Thị Bình", score: 6.2, class: "10A2" },
  { id: 3, name: "Lê Hoàng Cường", score: 4.3, class: "10A1" },
  { id: 4, name: "Phạm Minh Đức", score: 9.1, class: "10A3" },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");

  const handleAdd = (newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = useMemo(() => {
    if (filter === "gioi") return students.filter((s) => s.score >= 8);
    if (filter === "truot") return students.filter((s) => s.score < 5);
    return students;
  }, [students, filter]);

  const { total, average } = useMemo(() => {
    const total = students.length;
    const average =
      total === 0 ? 0 : students.reduce((sum, s) => sum + s.score, 0) / total;
    return { total, average };
  }, [students]);

  return (
    <div className="wrap">
      <h1>Quản lý Điểm Sinh viên</h1>
      <div className="sub">
        Ứng dụng quản lý danh sách, điểm số và xếp loại sinh viên.
      </div>

      <StudentForm onAdd={handleAdd} />
      <StudentStats total={total} average={average} />

      <div className="card">
        <h2>Danh sách sinh viên</h2>
        <div className="filters">
          <button
            className={`chip ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`chip ${filter === "gioi" ? "active" : ""}`}
            onClick={() => setFilter("gioi")}
          >
            Giỏi (≥ 8)
          </button>
          <button
            className={`chip ${filter === "truot" ? "active" : ""}`}
            onClick={() => setFilter("truot")}
          >
            Trượt môn (&lt; 5)
          </button>
        </div>
        <StudentTable students={filteredStudents} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;
