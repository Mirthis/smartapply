import Modal from "./Modal";

const ConfirmApplicationChangeModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: "create" | "update") => void;
}) => {
  const handleConfirm = (mode: "create" | "update") => {
    onConfirm(mode);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Application Details">
      <p>
        Changing application details will delete previously generated content.
        To avoid this create a new application.
      </p>
      <div className="mb-4" />
      <div className="flex flex-col gap-y-4">
        <div>
          <button
            aria-label="Update Application"
            className="btn-primary btn w-full"
            onClick={() => handleConfirm("update")}
          >
            Update application
          </button>
          {/* <p className="p-2 text-xs">
            Update the current application details and clear previously
            generated content.
          </p> */}
        </div>
        <div>
          <button
            aria-label="Create New Application"
            className="btn-secondary btn w-full"
            onClick={() => handleConfirm("create")}
          >
            Create new application
          </button>
          {/* <p className="p-2 text-xs">
            A new application will be created, you can go back to the previous
            one from the &quot;Saved Application&quot; screen.
          </p> */}
        </div>
        <button
          aria-label="Cancel"
          className="btn-outline  btn"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmApplicationChangeModal;
