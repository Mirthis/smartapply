/* eslint-disable @typescript-eslint/no-misused-promises */
import { Clipboard } from "lucide-react";

import { useEffect, useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/lib/api";
import { MAX_COVER_LETTERS, MAX_COVER_LETTERS_TABS } from "~/lib/constants";
import { formatApiMessage } from "~/lib/formatter";
import { useGenerateCoverLetter, useRefineCoverLetter } from "~/lib/hooks";

import { ApplicationSideBar, Layout, Title } from "~/components";
import { ResetCoverLettersModal } from "~/components/modals";
import { CoverLettersSkeleton } from "~/components/skeletons";
import Spinner from "~/components/utils/Spinner";

import { useAppStore } from "~/store/store";
import { type CoverLetter, RefineMode } from "~/types/types";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState<CoverLetter>();
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);

  const { coverLetters, addCoverLetter, setCoverLetters, clearCoverLetters } =
    useAppStore((state) => state);

  const { data: proStatus } = api.user.getProState.useQuery();
  const hasPro = proStatus?.hasPro ?? false;

  const applicationId =
    router.query.id && !Array.isArray(router.query.id)
      ? router.query.id
      : "N/A";

  // TODO: Add error handling
  const { data: application, isFetching: isLoadingApplication } =
    api.application.get.useQuery(
      {
        id: applicationId ?? "N/A",
      },
      {
        enabled: !!applicationId,

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
        applicationId: applicationId,
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
      void createCoverLetter({ application });
    }
  };

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
      className="pb-0"
    >
      <ResetCoverLettersModal
        isOpen={isOpenResetModal}
        onClose={() => setIsOpenResetModal(false)}
        onConfirm={reset}
      />
      <div className="flex gap-x-2 min-h-screen">
        <div className="hidden lg:block w-96 shrink-0">
          {applicationId && (
            <ApplicationSideBar applicationId={applicationId} />
          )}
        </div>
        <div className="flex-1 border-0 lg:border-l pl-2 flex-shrink pb-20">
          <Title title="Create Cover Letter" type="section" />

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
                          onChange={(e) =>
                            handleLettersTabChange(e.target.value)
                          }
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
                      {/* <SimpleBar
                        autoHide={false}
                        
                        className="max-h-[calc(100vh-23rem)] max-w-none lg:max-h-[calc(100vh-20rem)]"
                      > */}
                      <div className="max-h-[calc(100vh-23rem)] scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 overflow-auto relative rounded-md bg-base-200 p-2">
                        {/* {displayedText} */}
                        <div>
                          {formatApiMessage(displayedText).map((p, i) => (
                            <p
                              className="mb-2"
                              key={`coverletter-paragraph-${i}`}
                            >
                              {p}
                            </p>
                          ))}
                        </div>
                        <button
                          className="group absolute  right-2 top-2"
                          title="Copy to clipboard"
                          onClick={() => {
                            void navigator.clipboard.writeText(displayedText);
                          }}
                        >
                          <div className="flex">
                            <p className="opacity-0 transition-opacity duration-700 group-active:opacity-100 group-active:duration-0">
                              Copied
                            </p>
                            <Clipboard className="h-6 w-6" />
                          </div>
                        </button>
                      </div>
                      {/* </SimpleBar> */}

                      <div className="mt-4 flex flex-col items-center gap-x-4 gap-y-4 sm:flex-row">
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
                            className="btn-primary btn "
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
                        <div className="grid w-full grid-cols-3 items-center gap-x-2 sm:max-w-fit">
                          <button
                            className="btn-secondary btn "
                            onClick={() => refine(RefineMode.Shorten)}
                            disabled={
                              isGenerating || !displayedLetter || isMaxLetters
                            }
                          >
                            Shorten
                          </button>
                          <button
                            className="btn-secondary btn "
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
        </div>
      </div>
    </Layout>
  );
};

export default CoverLetterPage;
