import Modal from "./Modal";

const ResetCoverLettersModal = ({
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
        This will clear all the cover letters and restart the process by
        creating the first version.
      </p>
      <div className="mt-8 flex gap-x-4">
        <button
          aria-label="Cancel Reset Cover Letters"
          className="btn-outline btn-info btn w-36"
          onClick={onClose}
        >
          Cancel
        </button>

        <div className="mb-4" />
        <button
          aria-label="Reset Cover Letters"
          className="btn-error btn w-36"
          onClick={handleConfirm}
        >
          Reset
        </button>
      </div>
    </Modal>
  );
};

export default ResetCoverLettersModal;
