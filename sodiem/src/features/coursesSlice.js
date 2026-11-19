import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => action.payload,
    addCourse: (state, action) => {
      const id = state.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      state.push({ ...action.payload, id });
    },
    removeCourse: (state, action) => state.filter((c) => c.id !== action.payload),
    setScore: (state, action) => {
      const course = state.find((c) => c.id === action.payload.id);
      if (course) course.score = action.payload.score;
    },
  },
});

export const { setCourses, addCourse, removeCourse, setScore } = coursesSlice.actions;
export const selectCourses = (state) => state.courses;
export default coursesSlice.reducer;
