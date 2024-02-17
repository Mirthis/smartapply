import { Briefcase, PencilLine, UserRound } from "lucide-react";

import { useState } from "react";

import { api } from "~/lib/api";

import { useAppStore } from "~/store/appStore";
import { useCoverLettersStore } from "~/store/coverLettersStore";
import { useInterviewStore } from "~/store/interviewStore";
import { useTestStore } from "~/store/testStore";

import ServiceLinks from "./ServiceLinks";
import Title from "./Title";
import EditApplicationModal from "./modals/EditApplicationModal";
import { ApplicationDetailsSkeleton } from "./skeletons";

const ApplicationSideBar = ({ applicationId }: { applicationId: string }) => {
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);
  const {
    applicationId: storeApplicationId,
    setApplicationID: setStoreApplicationID,
  } = useAppStore((state) => state);
  const resetCoverLetters = useCoverLettersStore((state) => state.reset);
  const resetTest = useTestStore((state) => state.resetTest);
  const resetInterview = useInterviewStore((state) => state.resetInterview);

  if (applicationId !== storeApplicationId) {
    resetCoverLetters();
    resetTest();
    resetInterview();
    setStoreApplicationID(applicationId);
  }

  const { data: application, isFetching: isLoading } =
    api.application.get.useQuery({ id: applicationId });

  return (
    <>
      {application && (
        <EditApplicationModal
          isOpen={isEditApplicationOpen}
          onClose={() => setIsEditApplicationOpen(false)}
          application={application}
        />
      )}
      <Title title="Application" type="section" />
      {isLoading && <ApplicationDetailsSkeleton />}
      {application && !isLoading && (
        <div className="space-y-2">
          {/* Job Details */}
          <div className="flex gap-x-4 items-center text-xl">
            <Briefcase className="w-8 h-8" />
            <div>
              <p>{application.title}</p>
              {application.companyName && <p>@{application.companyName}</p>}
            </div>
          </div>
          {/* Applicant Details */}
          <div className="flex gap-x-4 items-center text-xl">
            <UserRound className="w-8 h-8" />
            <div>
              <p>
                {application.applicant.firstName}{" "}
                {application.applicant.lastName}
              </p>
              <p>{application.applicant.jobTitle}</p>
            </div>
          </div>

          {/* Edit Application Link */}
          <div className="flex justify-end">
            <button
              className="font-bold uppercase text-secondary flex gap-x-2 items-center hover:underline underline-offset-2"
              onClick={() => setIsEditApplicationOpen(true)}
            >
              <PencilLine className="h-8 w-8" />
              Edit
            </button>
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Link to services */}
          {/* <Title title="I neeed..." type="subsection" /> */}
          <ServiceLinks applicationId={application.id} />
        </div>
      )}
    </>
  );
};

export default ApplicationSideBar;
