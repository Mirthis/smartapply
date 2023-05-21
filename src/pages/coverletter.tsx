/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Spinner from "~/components/utils/Spinner";
import { formatApiMessage } from "~/utils/formatter";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useAppStore } from "~/store/store";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";
import { type CoverLetter, RefineMode } from "~/types/types";
import { ResetCoverLetters } from "~/components/modals/ResetCoverLetters";
import Head from "next/head";
import { useRouter } from "next/router";
import OpacityTransition from "~/components/utils/OpacityTransition";
import { useGenerateCoverLetter } from "~/utils/hooks";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState<CoverLetter>();
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);
  // const [displayedText, setDisplayedText] = useState("");

  const {
    addCoverLetter,
    coverLetters,
    job,
    applicant,
    resetCoverLetters,
    initFromLocalStore,
  } = useAppStore((state) => state);

  const {
    createCoverLetter,
    refineCoverLetter,
    isLoading: createLoading,
    isError: createError,
    text: newText,
  } = useGenerateCoverLetter({
    onSuccess: (data, label) => {
      const newCoverLetter = addCoverLetter(data, label);
      setDisplayedLetter(newCoverLetter);
    },
  });

  const generate = () => {
    resetCoverLetters();
    if (job && applicant) {
      void createCoverLetter(job, applicant);
    }
  };

  const refine = (refineMode: RefineMode) => {
    if (job && applicant && displayedLetter) {
      void refineCoverLetter(
        job,
        applicant,
        displayedLetter.text,
        refineMode,
        refineText
      );
    }
  };

  useEffect(() => {
    if (!applicant || !job) {
      const { applicant: storedApplicant, job: storedJob } =
        initFromLocalStore();
      if (!storedApplicant || !storedJob) {
        void router.replace("/");
      }
    }
  }, [applicant, job, router, initFromLocalStore]);

  // useEffect(() => {
  //   if (!coverLetters) return;
  //   const currentCoverLetter =
  //     coverLetters.coverLetters[coverLetters.coverLetters.length - 1];

  //   if (!currentCoverLetter) return;

  //   setDisplayedLetter(currentCoverLetter);
  // }, [coverLetters]);

  const handleLettersTabChange = (index: number) => {
    setDisplayedLetter(coverLetters?.coverLetters.find((c) => c.id === index));
  };

  const handleReset = () => {
    setIsOpenResetModal(true);
  };

  const displayedText = createLoading ? newText : displayedLetter?.text;

  return (
    <>
      <Head>
        <title>SmartApply - Cover Letter Generator</title>
        <meta
          property="og:title"
          content="SmartApply - Cover Letter Generator"
          key="title"
        />
      </Head>
      <ResetCoverLetters
        isOpen={isOpenResetModal}
        onClose={() => setIsOpenResetModal(false)}
        onConfirm={generate}
      />
      <Title title="Create Cover Letter" />
      <ApplicationDetails />
      <div className="mb-4" />

      {!coverLetters && !newText && (
        <div className="text-center">
          <button
            className="btn-primary btn w-full disabled:btn-outline sm:w-96"
            onClick={generate}
            disabled={createLoading}
          >
            {createLoading ? (
              <div className="flex items-center gap-x-2">
                <Spinner
                  className="mb-2 h-10 w-10"
                  text="Generating cover letter..."
                />
              </div>
            ) : (
              <p>Generate Cover Letter</p>
            )}
          </button>
        </div>
      )}

      {coverLetters && (
        <div className="flex-start flex items-baseline gap-x-4">
          <Title title="Your cover letter" type="section" />
          {(coverLetters?.coverLetters.length ?? 0) > 1 && (
            <>
              <div className="tabs tab-sm hidden lg:block">
                Versions:
                {coverLetters?.coverLetters.map((c) => (
                  <a
                    className={`${
                      displayedLetter?.id === c.id ? "tab-active" : ""
                    } tab-bordered tab`}
                    key={c.id}
                    onClick={() => handleLettersTabChange(c.id)}
                  >
                    v{c.id} - {c.label}
                  </a>
                ))}
              </div>
              <select
                className="select-bordered select select-sm block lg:hidden"
                value={displayedLetter?.id}
                onChange={(e) => handleLettersTabChange(+e.target.value)}
              >
                {coverLetters?.coverLetters.map((c) => (
                  <option key={c.id} value={c.id}>
                    v{c.id} - {c.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {displayedText && (
        <div>
          <div className="relative rounded-md bg-base-200 p-2">
            {/* {displayedText} */}
            {formatApiMessage(displayedText).map((p, i) => (
              <OpacityTransition
                show
                appear
                key={`${displayedLetter?.id || 0}-${i}`}
              >
                <p className="mb-2">{p}</p>
              </OpacityTransition>
            ))}
            <button
              className="group absolute right-2 top-2"
              title="Copy to clipboard"
              onClick={() => {
                void navigator.clipboard.writeText(displayedText);
              }}
            >
              <div className="flex">
                <p className="opacity-0 transition-opacity duration-700 group-active:opacity-100 group-active:duration-0">
                  Copied
                </p>
                <ClipboardIcon className="h-6 w-6" />
              </div>
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center gap-x-4 gap-y-4 lg:flex-row">
            <div className="flex w-full items-center justify-center gap-x-2">
              <input
                type="text"
                className="input-bordered input w-full"
                placeholder="Specify wich change you need (i.e.: include more details from my profile)"
                minLength={5}
                maxLength={100}
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
              />

              <button
                className="btn-primary btn"
                onClick={() => refine(RefineMode.FreeInput)}
                disabled={
                  createLoading ||
                  refineText.length < 5 ||
                  !displayedLetter ||
                  refineText.length > 100
                }
              >
                Refine
              </button>
            </div>
            <div className="grid w-full grid-cols-3 items-center gap-x-2 sm:w-fit">
              <button
                className="btn-secondary btn"
                onClick={() => refine(RefineMode.Shorten)}
                disabled={createLoading || !displayedLetter}
              >
                Shorten
              </button>
              <button
                className="btn-secondary btn"
                onClick={() => refine(RefineMode.Extend)}
                disabled={createLoading || !displayedLetter}
              >
                Extend
              </button>

              <button
                className="btn-secondary btn"
                onClick={handleReset}
                disabled={createLoading || !displayedLetter}
              >
                Reset
              </button>
            </div>
            <Spinner
              className={`${createLoading ? "visible" : "invisible"} h-16 w-16`}
            />
          </div>
        </div>
      )}
      {createError && (
        <div className="mt-2 text-center font-bold text-error">
          Ooop, something went wrong. Try again.
        </div>
      )}
    </>
  );
};

export default CoverLetterPage;
