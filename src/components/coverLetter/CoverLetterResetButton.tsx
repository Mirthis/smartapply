import React, { useState } from "react";

import { api } from "~/lib/api";

import { useCoverLettersStore } from "~/store/coverLettersStore";

import { ResetCoverLettersModal } from "../modals";
import CoverLetterActionButton from "./CoverLetterActionButton";

const CoverLetterResetButton = ({
  applicationId,
  hasPro,
  isDisabled,
}: {
  applicationId: string;
  hasPro: boolean;
  isDisabled: boolean;
}) => {
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);
  const {
    setDisplayedLetter,
    setDisplayedText,
    reset: clearCoverLetters,
  } = useCoverLettersStore((state) => state);

  const { mutate: deleteAll } = api.coverLetters.deleteAll.useMutation({
    onSuccess: () => {
      clearCoverLetters();
      setDisplayedLetter(null);
      setDisplayedText("");
    },
  });

  const handleReset = () => {
    setIsOpenResetModal(true);
  };

  const reset = () => {
    deleteAll({ applicationId });
  };

  return (
    <>
      <ResetCoverLettersModal
        isOpen={isOpenResetModal}
        onClose={() => setIsOpenResetModal(false)}
        onConfirm={reset}
      />
      <CoverLetterActionButton
        hasPro={hasPro}
        className=" col-span-3 md:col-span-1"
        onClick={() => handleReset()}
        disabled={isDisabled}
        text="Reset"
      />
    </>
  );
};

export default CoverLetterResetButton;
