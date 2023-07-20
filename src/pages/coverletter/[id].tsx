/* eslint-disable @typescript-eslint/no-misused-promises */
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { MAX_COVER_LETTERS, MAX_COVER_LETTERS_TABS } from "~/utils/constants";
import { formatApiMessage } from "~/utils/formatter";
import { useGenerateCoverLetter, useRefineCoverLetter } from "~/utils/hooks";

import { ApplicationDetails, Layout, Title } from "~/components";
import { ResetCoverLettersModal } from "~/components/modals";
import {
  ApplicationDetailsSkeleton,
  CoverLettersSkeleton,
} from "~/components/skeletons";
import { ProMarker } from "~/components/utils";
import Spinner from "~/components/utils/Spinner";

import { useAppStore } from "~/store/store";
import { type CoverLetter, RefineMode } from "~/types/types";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState<CoverLetter>();
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);

  const {
    application,
    coverLetters,
    setApplication,
    addCoverLetter,
    setCoverLetters,
    clearCoverLetters,
  } = useAppStore((state) => state);

  const { data: dbUser } = api.user.get.useQuery();
  const hasPro = (dbUser?._count?.subscriptions ?? 0) > 0;
  // const hasPro = true;

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
      enabled: router.query.id !== application?.id,
      onSuccess: (data) => {
        setApplication(data);
      },
      onError: (error) => {
        if (error.message === "No Application found") {
          void router.replace("/");
        }
      },
    }
  );

  const { isFetching: isLoadingCoverLetters } =
    api.coverLetters.getAll.useQuery(
      {
        applicationId: queryId,
      },
      {
        enabled: router.query.id !== application?.id,
        onSuccess: (data) => {
          setCoverLetters(data);
        },
      }
    );

  const { mutate: addLetterToDb } = api.coverLetters.create.useMutation({
    onSuccess: (data) => {
      addCoverLetter(data);
      setDisplayedLetter(data);
      setDisplayedText(data.text);
    },
  });

  const { mutate: deleteAll } = api.coverLetters.deleteAll.useMutation({
    onSuccess: () => {
      clearCoverLetters();
      setDisplayedLetter(undefined);
      setDisplayedText("");
    },
  });

  const {
    execute: createCoverLetter,
    isLoading: createLoading,
    isError: createError,
    text: createResponseText,
  } = useGenerateCoverLetter({
    onSuccess: (data) => {
      if (application) {
        addLetterToDb({
          applicationId: application.id,
          text: data,
          label: "new",
        });
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

  const reset = () => {
    if (application) {
      deleteAll({ applicationId: application.id });
    }
    generate();
  };

  const generate = () => {
    if (application) {
      const { job, applicant } = application;
      void createCoverLetter({ job, applicant });
    }
  };

  const refine = (refineMode: RefineMode) => {
    if (application && displayedLetter) {
      void refineCoverLetter({
        job: application.job,
        applicant: application.applicant,
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
    if (displayedLetter) return;
    const currentCoverLetter = coverLetters[0];

    if (!currentCoverLetter) return;

    setDisplayedLetter(currentCoverLetter);
    setDisplayedText(currentCoverLetter.text);
  }, [coverLetters, displayedLetter]);

  const handleLettersTabChange = (index: string) => {
    const selectedLetter = coverLetters.find((c) => c.id === index);
    if (selectedLetter) {
      setDisplayedLetter(selectedLetter);
      setDisplayedText(selectedLetter?.text);
    }
  };

  const handleReset = () => {
    setIsOpenResetModal(true);
  };

  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (createLoading && createResponseText !== "") {
      setDisplayedText(createResponseText);
    } else if (refineLoading && refineResponseText !== "") {
      setDisplayedText(refineResponseText);
    }
  }, [createLoading, createResponseText, refineLoading, refineResponseText]);

  // const getDisplayedText = () => {
  //   if (createLoading && createResponseText !== "") return createResponseText;
  //   if (refineLoading && refineResponseText !== "") return refineResponseText;
  //   return displayedLetter?.text;
  // };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refine(RefineMode.FreeInput);
    }
  };

  // const displayedText = getDisplayedText();
  const isGenerating = createLoading || refineLoading;
  const isLoading = isLoadingApplication || isLoadingCoverLetters;
  const isError = createError || refineError;
  const isMaxLetters = coverLetters.length >= MAX_COVER_LETTERS;

  return (
    <Layout
      title="Generate Cover Letter"
      description="Geenerate cover letters for a job application and job applicant."
    >
      <ResetCoverLettersModal
        isOpen={isOpenResetModal}
        onClose={() => setIsOpenResetModal(false)}
        onConfirm={reset}
      />
      <Title title="Create Cover Letter" />
      {isLoadingApplication || !application ? (
        <ApplicationDetailsSkeleton />
      ) : (
        <ApplicationDetails application={application} />
      )}
      {isLoadingCoverLetters && <CoverLettersSkeleton />}

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
                    <div>
                      {formatApiMessage(displayedText).map((p, i) => (
                        <p className="mb-2" key={`coverletter-paragraph-${i}`}>
                          {p}
                        </p>
                      ))}
                    </div>
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
                        onKeyUp={handleKeyUp}
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
                          isMaxLetters ||
                          !hasPro
                        }
                      >
                        {!hasPro && <LockClosedIcon className="w-4 h-4 " />}
                        Refine
                      </button>
                    </div>
                    <div className="grid w-full grid-cols-3 items-center gap-x-2 ">
                      <button
                        className="btn-secondary btn "
                        onClick={() => refine(RefineMode.Shorten)}
                        disabled={
                          isGenerating ||
                          !displayedLetter ||
                          isMaxLetters ||
                          !hasPro
                        }
                      >
                        {!hasPro && <LockClosedIcon className="w-4 h-4 " />}
                        Shorten
                      </button>
                      <button
                        className="btn-secondary btn"
                        onClick={() => refine(RefineMode.Extend)}
                        disabled={
                          isGenerating ||
                          !displayedLetter ||
                          isMaxLetters ||
                          !hasPro
                        }
                      >
                        {!hasPro && <LockClosedIcon className="w-4 h-4 " />}
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
                    {!hasPro && <ProMarker />}
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
    </Layout>
  );
};

export default CoverLetterPage;
