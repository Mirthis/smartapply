import {
  BriefcaseIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";

import { api } from "~/lib/api";

import ServiceLinks from "./ServiceLinks";
import Title from "./Title";
import EditApplicationModal from "./modals/EditApplicationModal";
import { ApplicationDetailsSkeleton } from "./skeletons";

const ApplicationSideBar = ({ applicationId }: { applicationId: string }) => {
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);
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
            <BriefcaseIcon className="w-8 h-8" />
            <div>
              <p>{application.title}</p>
              {application.companyName && <p>@{application.companyName}</p>}
            </div>
          </div>
          {/* Applicant Details */}
          <div className="flex gap-x-4 items-center text-xl">
            <UserIcon className="w-8 h-8" />
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
              <PencilIcon className="h-8 w-8" />
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
