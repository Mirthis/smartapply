import Modal from "./Modal";

export const ResetContent = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Clear Generating content">
      <p>Changing the job or applicant data will clear any generated content</p>
      <div className="mb-4" />
      <div className="flex gap-x-4">
        <button className="btn-error btn" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="btn-outline btn-error btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};
