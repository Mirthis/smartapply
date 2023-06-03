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
import { useGenerateCoverLetter, useRefineCoverLetter } from "~/utils/hooks";
import { api } from "~/utils/api";
import { MAX_COVER_LETTERS, MAX_COVER_LETTERS_TABS } from "~/utils/constants";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState<CoverLetter>();
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);

  const {
    applicationId,
    applicant,
    job,
    coverLetters,
    setApplication,
    addCoverLetter,
    setCoverLetters,
    clearCoverLetters,
  } = useAppStore((state) => state);

  const queryId =
    router.query.id && !Array.isArray(router.query.id)
      ? router.query.id
      : "N/A";

  // TODO: Add error handling
  const { isFetching: isLoadingApplication } = api.application.get.useQuery(
    {
      id: queryId,
    },
    {
      enabled: router.query.id !== applicationId,
      onSuccess: (data) => {
        setApplication(data.id, data.applicant, data.job);
      },
    }
  );

  const { isFetching: isLoadingCoverLetters } =
    api.coverLetters.getAll.useQuery(
      {
        applicationId: queryId,
      },
      {
        enabled: router.query.id !== applicationId,
        onSuccess: (data) => {
          setCoverLetters(data);
        },
      }
    );

  const { mutate: addLetterToDb } = api.coverLetters.create.useMutation({
    onSuccess: (data) => {
      addCoverLetter(data);
    },
  });

  const { mutate: deleteAll } = api.coverLetters.deleteAll.useMutation({
    onSuccess: () => {
      clearCoverLetters();
    },
  });

  const {
    execute: createCoverLetter,
    isLoading: createLoading,
    isError: createError,
    text: createResponseText,
  } = useGenerateCoverLetter({
    onSuccess: (data) => {
      if (applicationId) {
        addLetterToDb({ applicationId, text: data, label: "new" });
      }
    },
  });

  const {
    execute: refineCoverLetter,
    isLoading: refineLoading,
    isError: refineError,
    text: refineResponseText,
  } = useRefineCoverLetter({
    onSuccess: (data, args) => {
      if (applicationId) {
        addLetterToDb({ applicationId, text: data, label: args.refineMode });
      }
    },
  });

  const reset = () => {
    if (applicationId) {
      deleteAll({ applicationId });
    }
    generate();
  };

  const generate = () => {
    if (job && applicant) {
      void createCoverLetter({ job, applicant });
    }
  };

  const refine = (refineMode: RefineMode) => {
    if (job && applicant && displayedLetter) {
      void refineCoverLetter({
        job,
        applicant,
        srcCoverLetter: displayedLetter.text,
        refineMode,
        refineText,
      });
    }
  };

  useEffect(() => {
    if (router.isReady && !router.query.id) {
      void router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    const currentCoverLetter = coverLetters[0];

    if (!currentCoverLetter) return;

    setDisplayedLetter(currentCoverLetter);
  }, [coverLetters]);

  const handleLettersTabChange = (index: string) => {
    setDisplayedLetter(coverLetters.find((c) => c.id === index));
  };

  const handleReset = () => {
    setIsOpenResetModal(true);
  };

  const getDisplayedText = () => {
    if (createLoading) return createResponseText;
    if (refineLoading) return refineResponseText;
    return displayedLetter?.text;
  };

  const displayedText = getDisplayedText();
  const isGenerating = createLoading || refineLoading;
  const isLoading = isLoadingApplication || isLoadingCoverLetters;
  const isError = createError || refineError;
  const isMaxLetters = coverLetters.length >= MAX_COVER_LETTERS;

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
        onConfirm={reset}
      />
      <Title title="Create Cover Letter" />
      {isLoadingApplication ? (
        <div className="flex animate-pulse flex-col gap-x-4 gap-y-4 lg:flex-row">
          <div className="card h-20 w-full bg-base-300"></div>
          <div className="card h-20 w-full bg-base-300"></div>
        </div>
      ) : (
        <ApplicationDetails />
      )}
      {isLoadingCoverLetters && (
        <div className="mt-4 flex animate-pulse flex-col gap-y-4">
          <div className="card h-32 w-full bg-base-300 " />
          <div className="flex-rows flex gap-x-2">
            <div className="card h-14 w-3/4 bg-base-300 " />
            <div className="card h-14 w-1/4 bg-base-300 " />
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {coverLetters.length === 0 && !createResponseText ? (
            <div className="mt-4 text-center">
              <button
                className="btn-primary btn w-full disabled:btn-outline sm:w-96"
                onClick={generate}
                disabled={isGenerating}
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
          ) : (
            <>
              <div className="flex-start flex items-baseline gap-x-4">
                <Title title="Your cover letter" type="section" />
                {(coverLetters.length ?? 0) > 1 && (
                  <>
                    <div
                      className={`{tabs tab-sm hidden ${
                        coverLetters.length < MAX_COVER_LETTERS_TABS
                          ? "lg:block"
                          : ""
                      }`}
                    >
                      Versions:
                      {coverLetters.map((c, i) => (
                        <a
                          className={`${
                            displayedLetter?.id === c.id ? "tab-active" : ""
                          } tab-bordered tab`}
                          key={c.id}
                          onClick={() => handleLettersTabChange(c.id)}
                        >
                          v{coverLetters.length - i} - {c.label}
                        </a>
                      ))}
                    </div>
                    <select
                      className={`select-bordered select select-sm block ${
                        coverLetters.length <= MAX_COVER_LETTERS_TABS
                          ? "lg:hidden"
                          : ""
                      }`}
                      value={displayedLetter?.id}
                      onChange={(e) => handleLettersTabChange(e.target.value)}
                    >
                      {coverLetters.map((c, i) => (
                        <option key={c.id} value={c.id}>
                          v{coverLetters.length - i} - {c.label}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

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
                    <div className="flex w-full items-center gap-x-2">
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
                          isGenerating ||
                          refineText.length < 5 ||
                          !displayedLetter ||
                          refineText.length > 100 ||
                          isMaxLetters
                        }
                      >
                        Refine
                      </button>
                    </div>
                    <div className="grid w-full grid-cols-3 items-center gap-x-2 sm:w-fit">
                      <button
                        className="btn-secondary btn"
                        onClick={() => refine(RefineMode.Shorten)}
                        disabled={
                          isGenerating || !displayedLetter || isMaxLetters
                        }
                      >
                        Shorten
                      </button>
                      <button
                        className="btn-secondary btn"
                        onClick={() => refine(RefineMode.Extend)}
                        disabled={
                          isGenerating || !displayedLetter || isMaxLetters
                        }
                      >
                        Extend
                      </button>
                      <button
                        className="btn-secondary btn"
                        onClick={handleReset}
                        disabled={isGenerating || !displayedLetter}
                      >
                        Reset
                      </button>
                    </div>
                    <Spinner
                      className={`${
                        isGenerating ? "visible" : "invisible"
                      } h-16 w-16`}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {isError && (
            <div className="mt-2 text-center font-bold text-error">
              Ooop, something went wrong. Try again.
            </div>
          )}
          {isMaxLetters && (
            <div className="mt-2 text-center font-bold text-error">
              You can only generate {MAX_COVER_LETTERS} cover letters for
              application
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CoverLetterPage;
