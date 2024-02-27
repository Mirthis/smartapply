/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/lib/api";
import { getIdFromUrlQuery } from "~/lib/utils";

import { ApplicationSideBar, Layout, Title } from "~/components";
import CoverLetterControls from "~/components/coverLetter/CoverLetterControls";
import CoverLetterCreateButton from "~/components/coverLetter/CoverLetterCreateButton";
import CoverLetterDisplay from "~/components/coverLetter/CoverLetterDisplay";
import CoverLetterSelector from "~/components/coverLetter/CoverLetterSelector";
import { CoverLettersSkeleton } from "~/components/skeletons";

import { useApplication } from "~/hooks/useApplication";
import { useCoverLettersStore } from "~/store/coverLettersStore";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const {
    coverLetters,
    setCoverLetters,
    displayedLetter,
    displayedText,
    setDisplayedText,
    setDisplayedLetter,
  } = useCoverLettersStore((state) => state);

  const applicationId = getIdFromUrlQuery(router.query);
  console.log({ applicationId });

  const { application, isFetching: isLoadingApplication } =
    useApplication(applicationId);

  const { isFetching: isLoadingCoverLetters } =
    api.coverLetters.getAll.useQuery(
      {
        applicationId: applicationId ?? "N/A",
      },
      {
        enabled: !!applicationId,
        onSuccess: (data) => {
          setCoverLetters(data);
          const currentCoverLetter = data[0];

          if (!currentCoverLetter) return;

          setDisplayedLetter(currentCoverLetter);
          setDisplayedText(currentCoverLetter.text);
        },
      }
    );

  const handleLettersTabChange = (index: string) => {
    const selectedLetter = coverLetters.find((c) => c.id === index);
    if (selectedLetter) {
      setDisplayedLetter(selectedLetter);
      setDisplayedText(selectedLetter?.text);
    }
  };

  const isLoading = isLoadingApplication || isLoadingCoverLetters;

  return (
    <Layout
      title="Generate Cover Letter"
      description="Generate cover letters for a job application and job applicant."
      className="pb-0"
    >
      <div className="flex gap-x-2 min-h-screen">
        <div className="hidden lg:block w-96 shrink-0">
          {application && <ApplicationSideBar application={application} />}
        </div>
        <div className="flex-1 border-0 lg:border-l pl-2 flex-shrink pb-20 space-y-2">
          <Title title="Create Cover Letter" type="section" />

          {isLoading ? (
            <CoverLettersSkeleton />
          ) : (
            <>
              {coverLetters.length === 0 && application && (
                <CoverLetterCreateButton application={application} />
              )}
              {displayedText !== "" && (
                <>
                  <div className="flex-start flex items-baseline gap-x-4">
                    <Title title="Your cover letter" type="section" />
                    <CoverLetterSelector
                      coverLetters={coverLetters}
                      displayedLetter={displayedLetter}
                      onLetterChange={handleLettersTabChange}
                    />
                  </div>

                  {displayedText && application && (
                    <div className="space-y-2">
                      <CoverLetterDisplay text={displayedText} />
                      <CoverLetterControls application={application} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CoverLetterPage;
