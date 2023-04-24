import Modal from "./Modal";

export const ResetCoverLetters = ({
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
      <div className="mb-4" />
      <button className="btn-error btn" onClick={handleConfirm}>
        Reset
      </button>
    </Modal>
  );
};
