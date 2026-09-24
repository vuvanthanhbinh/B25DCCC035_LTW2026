import React from "react";

const StudentStats = ({ total, average }) => {
  return (
    <div className="card">
      <div className="stats">
        <div className="stat">
          <div className="val">{total}</div>
          <div className="lab">Tổng số sinh viên</div>
        </div>
        <div className="stat">
          <div className="val">{average.toFixed(2)}</div>
          <div className="lab">Điểm trung bình lớp</div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;
