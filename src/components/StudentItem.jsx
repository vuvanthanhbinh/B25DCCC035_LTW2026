import React from "react";

const classify = (score) => {
  if (score >= 8) return { label: "Giỏi", className: "gioi" };
  if (score < 5) return { label: "Trượt môn", className: "truot" };
  return { label: "Trung bình", className: "tb" };
};

const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;
  const info = classify(score);

  return (
    <tr>
      <td>{name}</td>
      <td>{score.toFixed(1)}</td>
      <td>{className}</td>
      <td>
        <span className={`badge ${info.className}`}>{info.label}</span>
      </td>
      <td>
        <button className="btn-danger" onClick={() => onDelete(id)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
