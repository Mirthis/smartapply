import Modal from "./Modal";
import { type ApplicantData } from "~/types/types";
import { api } from "~/utils/api";
import ApplicantForm from "../forms/ApplicantForm";

export const EditProfileApplicantModal = ({
  isOpen,
  onClose,
  applicant,
}: {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantData | undefined;
}) => {
  const utils = api.useContext();

  const { mutateAsync: upsertApplicant } =
    api.applicant.createOrUpdate.useMutation({
      onSuccess: () => {
        void utils.applicant.getForLoggedUser.invalidate();
        onClose();
      },
    });

  const onSubmit = (data: ApplicantData) => {
    const setAsMain = !data.id;

    void upsertApplicant({
      applicant: data,
      saveInProfile: true,
      setAsMain,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Applicant Details">
      <ApplicantForm applicant={applicant} onSubmit={onSubmit} />
    </Modal>
  );
};
