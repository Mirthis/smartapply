import React, { useCallback } from "react";
import { api } from "~/lib/api";
import { useValidateTestResponse } from "~/lib/hooks";
import { useTestStore } from "~/store/testStore";
import { type ApplicationData, TestQuestion } from "~/types/types";
import { Spinner } from "../utils";
import { MAX_TEST_QUESTIONS } from "~/lib/config";
import { formatApiMessage } from "~/lib/formatter";

const TestQuestion = ({question, application}:{question:TestQuestion, application:ApplicationData}) => {
  const {
    lastQuestion,
    questions,
    status: testStatus,
    skill: testSkill,
    displayedQuestion,
    addTestQuestion,
    addTestAnswer,
    addTestMessage,
    addTestExplanation,
    setTestStatus,
  } = useTestStore((state) => state);


  const { mutate: getNewQuestion, isLoading: isLoadingQuestion } =
  api.test.getQuestion.useMutation({
    onSuccess: (data) => {
      addTestQuestion(data.content as string);
      addTestMessage(data);
    },
  });

const {
  execute: getAnswerExplanation,
  isLoading: isLoadingAnswer,
  isError: isAnswerError,
  text: answerExplanation,
  reset: resetAnswerExplanation,
} = useValidateTestResponse({
  onSuccess: (data) => {
    if (!lastQuestion?.id) return;
    addTestExplanation(lastQuestion.id, data);
    if (questions.length === MAX_TEST_QUESTIONS) {
      setTestStatus("Completed");
    }
  },
});

const getQuestion = useCallback(() => {
  const questionsText = questions.map((q) => q.question).join("\n");

  resetAnswerExplanation();
  getNewQuestion({
    applicationId: application.id,
    skill: testSkill,
    pastQuestions: questionsText,
  });
}, [application, questions, getNewQuestion, testSkill, resetAnswerExplanation]);

const sendAnswer = (question: TestQuestion, answerId: number) => {
  const answer = question.answers[answerId];
  if (!answer) return;

  if (application) {
    void getAnswerExplanation({
      job: application,
      applicant: application.applicant,
      answer,
      question: question.question + ":\n" + question.answers.join("\n"),
    });
  }
  addTestAnswer(question, answerId);
};

const displayedExplanation = displayedQuestion?.explanation
? displayedQuestion.explanation : answerExplanation

// console.log("displayedExplanation", displayedExplanation);
// console.log("answerExplanation", answerExplanation);

  return (
    <>
      <h2 className="mb-2 text-2xl font-bold">{question.question}</h2>
      <div className="flex flex-col space-y-2">
        {question.answers.map((answer, index) => {
          let classes = "";
          const currentAnswer = question.providedAnswer === index;
          if (currentAnswer) {
            if (
              question.providedAnswer ===
              question.correctAnswer
            ) {
              classes += "disabled:btn-success";
            } else {
              classes += "disabled:btn-error";
            }
          }
          return (
            <button
              aria-label={answer}
              key={`q-${question.id}-${index}`}
              disabled={question.providedAnswer !== undefined}
              className={`${classes} btn-outline btn-primary btn justify-start text-left normal-case`}
              onClick={() => {
                sendAnswer(question, index);
              }}
            >
              {index + 1}. {answer}
            </button>
          );
        })}
      </div>
      {isLoadingAnswer && !displayedExplanation && (
        <div className="mt-4 flex gap-x-2">
          <Spinner /> Loading answer explanation...
        </div>
      )}
       {testStatus === "In Progress" &&
          lastQuestion?.explanation &&
          !isLoadingAnswer && (
            <div className="text-center">
              <button
                aria-label="Get Next Question"
                disabled={isLoadingQuestion}
                className="btn-primary btn w-full sm:w-96"
                onClick={() => getQuestion()}
              >
                {isLoadingQuestion ? <Spinner text="Loading question" /> :  "Get Next Question" }
              </button>
            </div>
          )}
          {displayedExplanation && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl font-bold">Explanation</h3>
              {formatApiMessage(displayedExplanation).map((p, i) => (
                <p key={i} className="mb-2">
                  {p}
                </p>
              ))}
            </div>
          )}
          {isAnswerError && (
            <div className="alert alert-error text-error-content mt-4">
              There was an error while submitting your answer. Please try
              again later.
            </div>
          )}

    </>
  );
};

export default TestQuestion;
