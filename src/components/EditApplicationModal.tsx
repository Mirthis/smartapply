import ApplicantForm from "./forms/ApplicantForm";
import Modal from "./ui/Modal";

export const EditApplicantbModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Details">
      <ApplicantForm onSuccess={onClose} />
    </Modal>
  );
};
