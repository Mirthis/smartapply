import Modal from "./Modal";

export const ResetInterview = ({
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
    <Modal isOpen={isOpen} onClose={onClose} title="Clear Cover Letters">
      <p>
        This will clear the current interview history and allow to start a new
        interview.
      </p>
      <div className="mt-8 flex gap-x-4">
        <button className="btn-outline btn-info btn w-36" onClick={onClose}>
          Cancel
        </button>

        <div className="mb-4" />
        <button className="btn-error btn w-36" onClick={handleConfirm}>
          Reset
        </button>
      </div>
    </Modal>
  );
};
