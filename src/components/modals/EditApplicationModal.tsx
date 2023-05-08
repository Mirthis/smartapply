import ApplicantForm from "../forms/ApplicantForm";
import Modal from "./Modal";

export const EditApplicantbModal = ({
  isOpen,
  onClose,
  type = "application",
}: {
  isOpen: boolean;
  onClose: () => void;
  type?: "application" | "profile";
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Details">
      <ApplicantForm onSuccess={onClose} confirm={true} type={type} />
    </Modal>
  );
};
