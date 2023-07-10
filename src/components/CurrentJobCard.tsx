import { BriefcaseIcon } from "@heroicons/react/24/outline";

import { useState } from "react";

import { type ApplicationData } from "~/types/types";

import EditJobModal from "./modals/EditJobModal";

const CurrentJobCard = ({ application }: { application: ApplicationData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const job = application.job;

  return (
    <>
      <EditJobModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        application={application}
      />
      <div className="card w-full border border-l-4 border-secondary bg-base-100">
        <div className="card-body flex flex-row items-center justify-between p-2">
          <div className="flex flex-row items-center gap-x-2">
            <BriefcaseIcon className="h-8 w-8" />
            <h2 className="card-title text-base sm:text-lg">
              {job?.title} {job.companyName ? `@ ${job.companyName}` : ""}
            </h2>
          </div>
          <div className="card-actions justify-end">
            <button
              className="btn-secondary btn"
              onClick={() => setIsOpen(true)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentJobCard;
