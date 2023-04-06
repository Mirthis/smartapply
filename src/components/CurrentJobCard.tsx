import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useAppStore } from "~/store/store";
import { EditJobModal } from "./EditJobModal";
import { useState } from "react";

const CurrentJobCard = () => {
  const job = useAppStore((state) => state.job);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EditJobModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="card w-full border border-l-4 border-primary bg-base-100">
        <div className="card-body flex flex-row justify-between p-2">
          <div className="flex flex-row items-center gap-x-2">
            <BriefcaseIcon className="h-8 w-8" />
            <h2 className="card-title">
              {job?.jobTitle} @ {job?.companyName}
            </h2>
          </div>
          <div className="card-actions justify-end">
            <button className="btn-primary btn" onClick={() => setIsOpen(true)}>
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentJobCard;
