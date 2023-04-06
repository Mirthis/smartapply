import React, { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useAppStore } from "~/store/store";
import { EditApplicantbModal } from "./EditApplicationModal";

const ApplicantCard = () => {
  const applicant = useAppStore((state) => state.applicant);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EditApplicantbModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="card w-full border border-l-4 border-secondary bg-base-100">
        <div className="card-body flex flex-row justify-between p-2">
          <div className="flex flex-row items-center gap-x-2">
            <UserIcon className="h-8 w-8" />
            <h2 className="card-title">
              {applicant?.firstName} {applicant?.lastName} - {applicant?.title}
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

export default ApplicantCard;
