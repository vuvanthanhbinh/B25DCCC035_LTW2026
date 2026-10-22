import { LETTERS } from '../data';

// state: '' | 'selected' | 'correct' | 'wrong'
const AnswerButton = ({ index, text, state, hidden, disabled, onClick }) => (
  <button
    className={`answer ${state} ${hidden ? 'is-hidden' : ''}`}
    disabled={disabled || hidden}
    onClick={() => onClick(index)}
  >
    {hidden ? '' : `${LETTERS[index]}. ${text}`}
  </button>
);

export default AnswerButton;
