import { api } from "~/lib/api";
import { type ApplicantData, type ApplicantFormData } from "~/types/types";

import ApplicantForm from "../forms/ApplicantForm";
import Modal from "./Modal";

const EditProfileApplicantModal = ({
  isOpen,
  onClose,
  applicant,
}: {
  isOpen: boolean;
  onClose: () => void;
  applicant?: ApplicantData | undefined;
}) => {
  const utils = api.useContext();

  const { mutateAsync: upsertApplicant } =
    api.applicant.createOrUpdate.useMutation({
      onSuccess: () => {
        void utils.applicant.getForLoggedUser.invalidate();
        void utils.user.getOnboardingState.invalidate();
        onClose();
      },
    });

  const onSubmit = (data: ApplicantFormData) => {
    const setAsMain = !applicant || applicant.isMain;

    void upsertApplicant({
      applicant: data,
      setAsMain,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Edit Applicant Details"
    >
      <ApplicantForm applicant={applicant} onSubmit={onSubmit} />
    </Modal>
  );
};

export default EditProfileApplicantModal;
