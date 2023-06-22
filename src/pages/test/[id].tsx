import { type NextPage } from "next";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";
import { api } from "~/utils/api";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "~/store/store";
import { type TestQuestion } from "~/types/types";
import { MAX_TEST_QUESTIONS } from "~/utils/constants";
import { formatApiMessage } from "~/utils/formatter";
import Spinner from "~/components/utils/Spinner";
import Head from "next/head";
import { useRouter } from "next/router";
import { useValidateTestResponse } from "~/utils/hooks";
import { ApplicationDetailsSkeleton } from "~/components/skeletons/ApplicationDetailsSkeleton";

const InterviewPage: NextPage = () => {
  const {
    application,
    test,
    addTestQuestion,
    addTestAnswer,
    addTestMessage,
    addTestExplanation,
    resetTest,
    setApplication,
  } = useAppStore((state) => state);
  const currentQuestion = test?.currentQuestion;
  const questions = test?.questions ?? [];
  const router = useRouter();

  const queryId =
    router.query.id && !Array.isArray(router.query.id)
      ? router.query.id
      : "N/A";

  // TODO: Add error handling
  const { isFetching: isLoadingApplication } = api.application.get.useQuery(
    {
      id: queryId,
    },
    {
      enabled: router.query.id !== application?.id,
      onSuccess: (data) => {
        setApplication(data);
      },
      onError: (error) => {
        if (error.message === "No Application found") {
          void router.replace("/");
        }
      },
    }
  );

  const [displayedQuestion, setDisplayedQuestion] = useState<TestQuestion>();
  // TODO: add captcha check
  const { mutate: newQuestion, isLoading: isLoadingQuestion } =
    api.test.getQuestion.useMutation({
      onSuccess: (data) => {
        addTestQuestion(data.content);
        addTestMessage(data);
      },
    });

  const {
    execute: getAnswerExplanation,
    isLoading: isLoadingAnswer,
    isError: isAnswerError,
    text: answerExplanation,
  } = useValidateTestResponse({
    onSuccess: (data) => {
      const id = test?.lastId;
      if (!id) return;
      addTestExplanation(id, data);
      // addTestMessage(data);
    },
  });

  const getQuestion = useCallback(() => {
    // extract question text (no answers) and concatenate in single string
    const questionsText = test?.questions.map((q) => q.question).join("\n");

    if (application) {
      newQuestion({
        applicationId: application.id,
        pastQuestions: questionsText,
      });
    }
  }, [application, newQuestion, test]);

  const sendAnswer = (questionId: number, answerId: number) => {
    const question = test?.questions.find((q) => q.id === questionId);
    if (!question) return;
    const answer = question.answers[answerId];
    if (!answer) return;

    if (application) {
      void getAnswerExplanation({
        job: application.job,
        applicant: application.applicant,
        answer,
        question: question.question + ":\n" + question.answers.join("\n"),
      });
    }
    addTestAnswer(questionId, answerId);
  };

  useEffect(() => {
    setDisplayedQuestion(currentQuestion);
  }, [currentQuestion]);

  const displayedExplanation = isLoadingAnswer
    ? answerExplanation
    : displayedQuestion?.explanation;

  return (
    <>
      <Head>
        <title>SmartApply - Knowledge Test</title>
        <meta
          property="og:title"
          content="SmartApply - Knowledge Test"
          key="title"
        />
      </Head>
      <Title title="Test your knowledge" type="page" />
      {isLoadingApplication || !application ? (
        <ApplicationDetailsSkeleton />
      ) : (
        <ApplicationDetails application={application} />
      )}
      {questions.length > 1 && (
        <div className="btn-group gap-x-2">
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
                className={`${classes} btn rounded-md`}
                onClick={() => setDisplayedQuestion(q)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      )}
      <div className="mb-4" />
      {isLoadingQuestion && (
        <>
          <h2 className="mb-2 text-2xl font-bold">Loading new question...</h2>
          <div className="flex flex-col space-y-2">
            <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
            <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
            <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
            <div className="btn-outline btn-disabled btn-secondary btn animate-pulse" />
          </div>
        </>
      )}
      {!isLoadingQuestion && displayedQuestion && (
        <>
          <h2 className="mb-2 text-2xl font-bold">
            {displayedQuestion.question}
          </h2>
          <div className="flex flex-col space-y-2">
            {displayedQuestion.answers.map((answer, index) => {
              let classes = "";
              const currentAnswer = displayedQuestion.providedAnswer === index;
              if (currentAnswer && !isAnswerError) {
                if (
                  displayedQuestion.providedAnswer ===
                  displayedQuestion.correctAnswer
                ) {
                  classes += "disabled:btn-success";
                } else {
                  classes += "disabled:btn-error";
                }
              }
              return (
                <button
                  key={`q-${displayedQuestion.id}-${index}`}
                  disabled={
                    displayedQuestion.providedAnswer !== undefined &&
                    !isAnswerError
                  }
                  className={`${classes} btn-outline btn-primary btn justify-start text-left normal-case`}
                  onClick={() => {
                    sendAnswer(displayedQuestion.id, index);
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
        </>
      )}
      <div className="mb-4" />

      {(!currentQuestion ||
        (currentQuestion.explanation &&
          questions.length < MAX_TEST_QUESTIONS)) &&
        !isLoadingQuestion &&
        !isLoadingAnswer && (
          <div className="text-center">
            <button
              disabled={isLoadingQuestion}
              className="btn-primary btn w-full sm:w-96"
              onClick={() => getQuestion()}
            >
              {questions.length == 0
                ? "Get First Question"
                : "Get Next Question"}
            </button>
          </div>
        )}
      {isAnswerError && (
        <div className="mt-4 font-semibold text-error">
          There was an error while submitting your answer. Please try again
          later.
        </div>
      )}
      {currentQuestion?.explanation &&
        questions.length === MAX_TEST_QUESTIONS && (
          <div>
            <h2 className="mb-2 text-2xl font-bold">
              You have completed the test!
            </h2>
            <button className="btn-primary btn" onClick={resetTest}>
              Start a new test
            </button>
          </div>
        )}
    </>
  );
};

export default InterviewPage;
