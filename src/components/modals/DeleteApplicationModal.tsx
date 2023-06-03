import { type ApplicationData } from "~/types/types";
import Modal from "./Modal";
import { api } from "~/utils/api";
import Spinner from "../utils/Spinner";

export const DeleteApplicantbModal = ({
  isOpen,
  onClose,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationData;
}) => {
  const utils = api.useContext();

  const {
    mutate: deleteApplication,
    isLoading,
    isError,
  } = api.application.delete.useMutation({
    onSuccess: () => {
      onClose();
      void utils.application.getAllForUser.invalidate();
    },
  });

  const handleConfirm = () => {
    deleteApplication({ id: application.id });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Application">
      <p className="mb-4">
        Do you want to delete this application and all related content?
      </p>
      <p>
        <span className="font-semibold">Job:</span> {application.job.title} @{" "}
        {application.job.companyName}
      </p>
      <p>
        <span className="font-semibold">Applicant:</span>{" "}
        {application.applicant.firstName} {application.applicant.lastName} -{" "}
        {application.applicant.jobTitle}
      </p>
      <div className="mt-8 flex gap-x-4">
        <button
          className="btn-outline btn-secondary btn w-36"
          disabled={isLoading}
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="btn-error btn w-36"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {!isLoading ? <p>Confirm</p> : <Spinner text="Deleteting..." />}
        </button>
      </div>
      {isError && (
        <p className="text-error">
          There was an error deleting the application. Please try again.
        </p>
      )}
    </Modal>
  );
};
