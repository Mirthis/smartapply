import { LockKeyhole } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { api } from "~/lib/api";
import { MAX_COVER_LETTERS } from "~/lib/config";
import { useRefineCoverLetter } from "~/lib/hooks";

import { useHasPro } from "~/hooks/useHasPro";
import { useCoverLettersStore } from "~/store/coverLettersStore";
import { type ApplicationData, RefineMode } from "~/types/types";

import CoverLetterActionButton from "./CoverLetterActionButton";
import CoverLetterResetButton from "./CoverLetterResetButton";

const CoverLetterControls = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const { hasPro } = useHasPro();
  const [refineText, setRefineText] = useState("");

  const {
    coverLetters,
    displayedLetter,
    setDisplayedLetter,
    setDisplayedText,
    addCoverLetter,
  } = useCoverLettersStore((state) => state);

  const { mutate: addLetterToDb } = api.coverLetters.create.useMutation({
    onSuccess: (data) => {
      addCoverLetter(data);
      setDisplayedLetter(data);
      setDisplayedText(data.text);
    },
  });

  const {
    execute: refineCoverLetter,
    isLoading: isRefineLoading,
    isError: isRefineError,
    text: refineResponseText,
  } = useRefineCoverLetter({
    onSuccess: (data, args) => {
      if (application) {
        addLetterToDb({
          applicationId: application.id,
          text: data,
          label: args.refineMode,
        });
      }
      setRefineText("");
    },
  });

  const refine = (refineMode: RefineMode) => {
    if (application && displayedLetter) {
      void refineCoverLetter({
        application: application,
        srcCoverLetter: displayedLetter.text,
        refineMode,
        refineText,
      });
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refine(RefineMode.FreeInput);
    }
  };

  useEffect(() => {
    if (isRefineLoading && refineResponseText !== "") {
      setDisplayedText(refineResponseText);
    }
  }, [isRefineLoading, refineResponseText, setDisplayedText]);

  const isMaxLetters = coverLetters.length >= MAX_COVER_LETTERS;
  const disableControl = isRefineLoading || isMaxLetters;
  const disableRefineText =
    disableControl || refineText.length < 5 || refineText.length > 100;

  return (
    <>
      <div className="grid gap-2 w-full grid-cols-9 items-center gap-x-2">
        <input
          type="text"
          className="input-bordered input w-full col-span-6 md:col-span-5"
          placeholder='What change do you need (i.e.: include more details "xyz" from my profile)'
          minLength={5}
          maxLength={100}
          value={refineText}
          onKeyUp={handleKeyUp}
          onChange={(e) => setRefineText(e.target.value)}
          disabled={disableControl}
        />

        <CoverLetterActionButton
          hasPro={hasPro}
          onClick={() => refine(RefineMode.FreeInput)}
          disabled={disableRefineText}
          className="col-span-3 md:col-span-1"
          text="Refine"
        />
        <CoverLetterActionButton
          hasPro={hasPro}
          className=" col-span-3 md:col-span-1"
          onClick={() => refine(RefineMode.Shorten)}
          disabled={disableControl}
          text="Shorten"
        />

        <CoverLetterActionButton
          hasPro={hasPro}
          className=" col-span-3 md:col-span-1"
          onClick={() => refine(RefineMode.Extend)}
          disabled={disableControl}
          text="Extend"
        />

        <CoverLetterResetButton
          hasPro={hasPro}
          isDisabled={disableControl}
          applicationId={application.id}
        />
      </div>
      {isRefineError && (
        <div className="alert alert-error text-error-content">
          Oops, something went wrong. Try again.
        </div>
      )}
      {!hasPro && (
        <div className="flex gap-x-2 items-center text-accent font-semibold">
          <LockKeyhole className="h-4 w-4 text-accent font-semibold " />{" "}
          <Link href="/upgrade">Upgrade to Pro</Link> to refine your cover
          letter.
        </div>
      )}
      {isMaxLetters && (
        <div className=" text-center font-bold text-error">
          You can only generate {MAX_COVER_LETTERS} cover letters for
          application
        </div>
      )}
    </>
  );
};

export default CoverLetterControls;
