import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/lib/api";
import { TEST_ALL_SKILLS } from "~/lib/constants";
import { getIdFromUrlQuery } from "~/lib/utils";

import { ApplicationSideBar, Layout, Title } from "~/components";
import TestQuestion from "~/components/test/TestQuestion";
import TestQuestionSelector from "~/components/test/TestQuestionSelector";
import TestQuestionSkeleton from "~/components/test/TestQuestionSkeleton";
import TestResetButton from "~/components/test/TestResetButton";
import TestResults from "~/components/test/TestResults";
import TestStartControls from "~/components/test/TestStartControls";

import { useApplication } from "~/hooks/useApplication";
import { useHasPro } from "~/hooks/useHasPro";
import { useTestStore } from "~/store/testStore";

const InterviewPage: NextPage = () => {
  const {
    questions,
    status: testStatus,
    skill: testSkill,
    displayedQuestion,
    addTestQuestion,
    addTestMessage,
    initTest,
  } = useTestStore((state) => state);

  const router = useRouter();
  const { hasPro } = useHasPro();

  const applicationId = getIdFromUrlQuery(router.query);

  const { application } = useApplication(applicationId);

  // TODO: add captcha check
  const { mutate: getNewQuestion, isLoading: isLoadingQuestion } =
    api.test.getQuestion.useMutation({
      onSuccess: (data) => {
        addTestQuestion(data.content as string);
        addTestMessage(data);
      },
    });

  const jobSkills = application?.skillsSummary.split(", ") ?? [];

  const startTest = () => {
    initTest(testSkill);
    getNewQuestion({
      applicationId,
      skill: testSkill,
      pastQuestions: "",
    });
  };

  return (
    <Layout
      title="Skill Test"
      description="Simulate a job interview based on the job description and skills required."
      className="pb-0"
    >
      <div className="flex gap-x-2 min-h-screen">
        <div className="hidden lg:block w-96 shrink-0">
          {applicationId && (
            <ApplicationSideBar applicationId={applicationId} />
          )}
        </div>

        <div className="flex-1 border-0 lg:border-l pl-2 flex-shrink pb-20">
          <Title title="Test your knowledge" type="section" />

          {/* if not started display options to start test */}
          {testStatus === "Not Started" && (
            <TestStartControls
              jobSkills={jobSkills}
              hasPro={hasPro}
              onStartTest={startTest}
              isLoadingQuestion={isLoadingQuestion}
            />
          )}

          {(testStatus === "In Progress" || testStatus === "Completed") && (
            <div className="flex flex-col gap-y-4">
              <div className="flex gap-x-4 items-end">
                <Title
                  title={`Test on "${
                    testSkill === TEST_ALL_SKILLS ? "All skills" : testSkill
                  }"`}
                  className="mb-0"
                  type="section"
                />
                <TestResetButton variant="icon" />
              </div>

              <TestQuestionSelector />

              {isLoadingQuestion && <TestQuestionSkeleton />}

              {!isLoadingQuestion && displayedQuestion && application && (
                <TestQuestion
                  question={displayedQuestion}
                  application={application}
                />
              )}
            </div>
          )}

          {/* if finished display result and option to restart test */}
          {testStatus === "Completed" && (
            <div className="flex flex-col gap-y-2 text-primary justify-center items-center">
              <h3 className="text-xl font-bold">
                You have completed the test!
              </h3>
              <TestResults questions={questions} />
              <TestResetButton variant="button" />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InterviewPage;
