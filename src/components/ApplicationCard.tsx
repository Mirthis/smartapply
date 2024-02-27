import { PencilLine, Trash2, UserCircle2 } from "lucide-react";

import { type ApplicationData } from "~/types/types";

import ServiceLinks from "./ServiceLinks";
import { ProMarker } from "./utils";

const ApplicationCard = ({
  application,
  hasPro,
  handleEdit,
  handleDelete,
}: {
  application: ApplicationData;
  hasPro: boolean;
  handleEdit: (application: ApplicationData) => void;
  handleDelete: (application: ApplicationData) => void;
}) => {
  return (
    <div
      key={application.id}
      className="card h-full w-full border border-primary xl:w-96"
    >
      <div className="card-body flex flex-col gap-y-2">
        <h2 className="card-title">
          {application.title}{" "}
          {application.companyName ? ` @ ${application.companyName}` : ""}
        </h2>
        <div className="flex items-center gap-x-2">
          <UserCircle2 className="h-6 w-6" />
          <p>
            {application.applicant.firstName} {application.applicant.lastName} -{" "}
            {application.applicant.jobTitle}
          </p>
        </div>

        <div>
          <div className="divider" />
          {application.applicant.isMain || hasPro ? (
            <ServiceLinks applicationId={application.id} />
          ) : (
            <ProMarker text="Change applicant or upgrade to pro to access all the features for this application." />
          )}

          <div className="divider" />
        </div>
        <div className="flex gap-y-2">
          <div className="card-actions justify-center text-sm flex-1 ">
            <button
              aria-label="Edit Application"
              className="font-bold uppercase text-secondary flex gap-x-2 items-center hover:underline underline-offset-2"
              onClick={() => handleEdit(application)}
            >
              <PencilLine className="h-6 w-6" />
              Edit
            </button>
          </div>
          <div className="card-actions justify-center text-sm flex-1 ">
            <button
              aria-label="Delete Application"
              className="font-bold flex gap-x-2 items-center uppercase text-error hover:underline underline-offset-2"
              onClick={() => handleDelete(application)}
            >
              <Trash2 className="h-6 w-6" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
