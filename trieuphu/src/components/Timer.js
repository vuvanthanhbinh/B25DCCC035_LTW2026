const Timer = ({ seconds }) => (
  <p className={`timer ${seconds <= 10 ? 'danger' : ''}`}>Còn {Math.max(seconds, 0)} giây</p>
);

export default Timer;
