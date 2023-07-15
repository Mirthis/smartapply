import { useCallback, useEffect, useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { MAX_TEST_QUESTIONS } from "~/utils/constants";
import { formatApiMessage } from "~/utils/formatter";
import { useValidateTestResponse } from "~/utils/hooks";

import { ApplicationDetails, Layout, Title } from "~/components";
import { ApplicationDetailsSkeleton } from "~/components/skeletons";
import Spinner from "~/components/utils/Spinner";

import { useAppStore } from "~/store/store";
import { type TestQuestion } from "~/types/types";

const InterviewPage: NextPage = () => {
  const {
    application,
    test,
    addTestQuestion,
    addTestAnswer,
    addTestMessage,
    addTestExplanation,
    setTestStatus,
    initTest,
    resetTest,
    setApplication,
  } = useAppStore((state) => state);
  const currentQuestion = test?.currentQuestion;
  const questions = test?.questions ?? [];
  const router = useRouter();

  const [skill, setSkill] = useState<string>("*ALL*");

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
      if (questions.length === MAX_TEST_QUESTIONS) {
        setTestStatus("Completed");
      }
      // addTestMessage(data);
    },
  });

  const getQuestion = useCallback(() => {
    // extract question text (no answers) and concatenate in single string
    const questionsText = test?.questions.map((q) => q.question).join("\n");

    if (application) {
      newQuestion({
        applicationId: application.id,
        skill,
        pastQuestions: questionsText,
      });
    }
  }, [application, newQuestion, test, skill]);

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

  const jobSkills = application?.job.skillsSummary.split(",") ?? [];

  const startTest = () => {
    initTest(skill);
    getQuestion();
  };

  const testStatus = test?.status ?? "Not Started";

  return (
    <Layout
      title="Skill Test"
      description="Simulate a job interview based on the job description and skills required."
    >
      <Title title="Test your knowledge" type="page" />
      {isLoadingApplication || !application ? (
        <ApplicationDetailsSkeleton />
      ) : (
        <ApplicationDetails application={application} />
      )}
      <div className="mt-4" />
      {/* if not started display options to start test */}
      {testStatus === "Not Started" && (
        <div className="flex flex-col gap-2">
          {jobSkills.length > 0 && (
            <div className="flex flex-col  gap-2 md:flex-row">
              <label className="label">
                <span className="label-text font-semibold text-primary">
                  Select a skill to be tested on:
                </span>
              </label>
              <select
                className="select-bordered select w-full md:w-fit"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              >
                <option value="*ALL*">All skills</option>
                {jobSkills.map((skill, i) => (
                  <option key={`skill-${i}`} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="text-center">
            <button
              disabled={isLoadingQuestion}
              className="btn-primary btn w-full sm:w-96"
              onClick={startTest}
            >
              Start Test
            </button>
          </div>
        </div>
      )}

      {(testStatus === "In Progress" || testStatus === "Completed") && (
        <div className="flex flex-col gap-y-4">
          <Title
            title={`Test on "${skill === "*ALL*" ? "All skills" : skill}"`}
            className="mb-0"
            type="section"
          />
          {/* if more than one question show question selector */}
          {questions.length > 1 && (
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
          )}
          {isLoadingQuestion && (
            <>
              <h2 className="mb-2 text-2xl font-bold">
                Loading new question...
              </h2>
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
                  const currentAnswer =
                    displayedQuestion.providedAnswer === index;
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

          {isAnswerError && (
            <div className="mt-4 font-semibold text-error">
              There was an error while submitting your answer. Please try again
              later.
            </div>
          )}
        </div>
      )}

      {testStatus === "In Progress" &&
        currentQuestion?.explanation &&
        !isLoadingQuestion &&
        !isLoadingAnswer && (
          <div className="text-center">
            <button
              disabled={isLoadingQuestion}
              className="btn-primary btn w-full sm:w-96"
              onClick={() => getQuestion()}
            >
              Get Next Question
            </button>
          </div>
        )}

      {/* if finished display options to restart test */}
      {testStatus === "Completed" && (
        <div className="flex flex-col gap-y-2 text-primary">
          <h3 className="text-xl font-bold">You have completed the test!</h3>
          <p>
            You got{" "}
            {
              questions.filter((q) => q.providedAnswer === q.correctAnswer)
                .length
            }{" "}
            out of {questions.length} answers correct.
          </p>

          <button
            className="btn-primary btn w-full sm:w-96"
            onClick={resetTest}
          >
            Start a new test
          </button>
        </div>
      )}

      <div className="mb-4" />
    </Layout>
  );
};

export default InterviewPage;
