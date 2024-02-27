import { Briefcase, PencilLine, UserRound } from "lucide-react";

import { useState } from "react";

import { type ApplicationData } from "~/types/types";

import ServiceLinks from "./ServiceLinks";
import Title from "./Title";
import EditApplicationModal from "./modals/EditApplicationModal";

const ApplicationSideBar = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);

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
      {/* {isLoading && <ApplicationDetailsSkeleton />} */}
      {/* {application && !isLoading && ( */}
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
              {application.applicant.firstName} {application.applicant.lastName}
            </p>
            <p>{application.applicant.jobTitle}</p>
          </div>
        </div>

        {/* Edit Application Link */}
        <div className="flex justify-end">
          <button
            aria-label="Edit Application"
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
        {/* <Title title="I need..." type="subsection" /> */}
        <ServiceLinks applicationId={application.id} />
      </div>
      {/* )} */}
    </>
  );
};

export default ApplicationSideBar;
