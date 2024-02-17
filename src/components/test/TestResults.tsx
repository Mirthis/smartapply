import React from "react";

import { type TestQuestion } from "~/types/types";

const TestResults = ({ questions }: { questions: TestQuestion[] }) => {
  const correctAnswers = questions.filter(
    (q) => q.providedAnswer === q.correctAnswer
  ).length;

  return (
    <p>
      You got {correctAnswers} out of {questions.length} answers correct.
    </p>
  );
};

export default TestResults;
