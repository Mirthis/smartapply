import { useTestStore } from "~/store/testStore";

const TestQuestionSelector = () => {
  const { questions, displayedQuestion, setDisplayedQuestion } = useTestStore(
    (state) => state
  );

  if (questions.length === 0) return null;

  return (
    <div className="btn-group flex-wrap gap-2">
      {questions.map((q, i) => {
        let classes = "";
        if (q.id === displayedQuestion?.id) {
          classes += "btn-primary";
        } else {
          classes +=
            q.providedAnswer === q.correctAnswer
              ? "btn-success btn-outline"
              : "btn-error btn-outline";
        }
        return (
          <button
            key={`select-q-${q.id}`}
            className={`${classes} btn w-10`}
            onClick={() => setDisplayedQuestion(q)}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

export default TestQuestionSelector;
