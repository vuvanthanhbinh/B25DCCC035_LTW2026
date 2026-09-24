import React from "react";
import StudentItem from "./StudentItem";

const StudentTable = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <div className="empty">Không có sinh viên nào phù hợp.</div>;
  }

  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Điểm</th>
            <th>Lớp</th>
            <th>Xếp loại</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentItem key={student.id} student={student} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
