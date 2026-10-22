import AnswerButton from './AnswerButton';

const QuestionCard = ({ number, total, question, getState, hidden, disabled, onChoose }) => (
  <div className="question-card">
    <p className="q-number">Câu {number}/{total}</p>
    <h2 className="q-text">{question.question}</h2>
    <div className="answers">
      {question.options.map((opt, i) => (
        <AnswerButton
          key={i}
          index={i}
          text={opt}
          state={getState(i)}
          hidden={hidden.includes(i)}
          disabled={disabled}
          onClick={onChoose}
        />
      ))}
    </div>
  </div>
);

export default QuestionCard;
