import JobForm from "./forms/JobForm";
import Modal from "./ui/Modal";

export const EditJobModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Details">
      <JobForm onSuccess={onClose} />
    </Modal>
  );
};
