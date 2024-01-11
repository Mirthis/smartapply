import { api } from "~/lib/api";
import { type ApplicantData } from "~/types/types";

import Spinner from "../utils/Spinner";
import Modal from "./Modal";

const DeleteProfileApplicantbModal = ({
  isOpen,
  onClose,
  applicant,
}: {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantData;
}) => {
  const utils = api.useContext();

  const {
    mutate: deleteApplicant,
    isLoading,
    isError,
  } = api.applicant.deleteFromProfile.useMutation({
    onSuccess: () => {
      void utils.applicant.getForLoggedUser.invalidate();
      onClose();
    },
  });

  const handleConfirm = () => {
    if (applicant.id) {
      deleteApplicant({ id: applicant.id });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove applicant from profile"
    >
      <p className="mb-4">
        <span className="font-semibold">
          Do you want to remove this applicant from your profile?
        </span>
        <br />
        Application data will where the applicant appears will not be deleted.
      </p>

      <p className="font-semibold text-error">
        {applicant.firstName} {applicant.lastName} - {applicant.jobTitle}-
      </p>
      <div className="mt-8 flex gap-x-4">
        <button
          className="btn-outline btn-info btn w-36"
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
          {!isLoading ? <p>Confirm</p> : <Spinner text="Removing..." />}
        </button>
      </div>
      {isError && (
        <p className="text-error">
          There was an error removing the applicant. Please try again.
        </p>
      )}
    </Modal>
  );
};

export default DeleteProfileApplicantbModal;
