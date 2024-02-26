import { RotateCcw } from "lucide-react";

import { useState } from "react";

import { ResetInterviewModal } from "../modals";

const ResetInterviewButton = ({
  handleReset,
  variant,
}: {
  handleReset: () => void;
  variant: "icon" | "button";
}) => {
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);

  return (
    <>
      <ResetInterviewModal
        onConfirm={handleReset}
        onClose={() => setIsOpenResetModal(false)}
        isOpen={isOpenResetModal}
      />
      {variant === "icon" ? (
        <button
          aria-label="Restart Interview"
          className="font-bold uppercase text-accent flex gap-x-2 items-center hover:underline underline-offset-2"
          onClick={() => setIsOpenResetModal(true)}
        >
          <RotateCcw className="h-8 w-8" />
          Restart
        </button>
      ) : (
        <button
          aria-label="Start New Interview"
          className="btn-primary btn"
          onClick={handleReset}
        >
          Start new interview
        </button>
      )}
    </>
  );
};

export default ResetInterviewButton;
