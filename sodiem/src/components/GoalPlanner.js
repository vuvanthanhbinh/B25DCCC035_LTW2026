import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { setRemaining, setTarget } from '../features/goalSlice';
import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector((state) => state.goal);
  const dispatch = useDispatch();

  const result = useMemo(() => calcRequired(courses, target, remaining), [courses, target, remaining]);

  return (
    <div>
      <div>
        <label htmlFor="g-target">GPA mục tiêu</label>
        <input id="g-target" type="number" step="0.01" value={target} onChange={(e) => dispatch(setTarget(e.target.value))} />
      </div>
      <div>
        <label htmlFor="g-remaining">Số tín chỉ còn lại</label>
        <input id="g-remaining" type="number" value={remaining} onChange={(e) => dispatch(setRemaining(e.target.value))} />
      </div>
      <p>{result}</p>
    </div>
  );
};

export default GoalPlanner;
