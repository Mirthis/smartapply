/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Spinner from "~/components/utils/Spinner";
import { api } from "~/utils/api";
import { formatApiMessage } from "~/utils/formatter";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "~/store/store";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";
import { type CoverLetter } from "~/types/types";
import { ResetCoverLetters } from "~/components/modals/ResetCoverLetters";
import { useRecaptcha } from "~/utils/hooks";
import Head from "next/head";
import { useRouter } from "next/router";

const CoverLetterPage: NextPage = () => {
  const router = useRouter();

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState<CoverLetter>();
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);
  const firstLoad = useRef(true);

  const {
    setCoverLetter,
    addCoverLetter,
    coverLetters,
    job,
    applicant,
    resetCoverLetters,
  } = useAppStore((state) => state);

  const currentCoverLetter = coverLetters?.currentCoverLetter;

  //TODO: test recaptcha works (currently always passing)
  const { handleReCaptchaVerify, captchaError, captchaReady } = useRecaptcha();

  const {
    mutate: createCoverLetter,
    isLoading: createLoading,
    isError: createError,
  } = api.coverLetters.createLetter.useMutation({
    onSuccess: (data) => {
      setCoverLetter(data);
    },
  });

  useEffect(() => {
    if (!applicant || !job) {
      void router.replace("/");
    }
  }, [applicant, job, router]);

  const {
    mutate: refineCoverLetter,
    isLoading: refineLoading,
    isError: refineError,
  } = api.coverLetters.refineLetter.useMutation({
    onSuccess: (data, { refineOption }) => {
      const label = {
        freeinput: "Refine",
        shorten: "Shorten",
        extend: "Extend",
      }[refineOption];
      addCoverLetter(data, label);
    },
  });

  const generate = useCallback(async () => {
    resetCoverLetters();
    if (job && applicant) {
      const token = await handleReCaptchaVerify();
      if (token) {
        createCoverLetter({
          job,
          applicant,
          captchaToken: token,
        });
      }
    }
  }, [
    applicant,
    createCoverLetter,
    handleReCaptchaVerify,
    job,
    resetCoverLetters,
  ]);

  useEffect(() => {
    if (!coverLetters && captchaReady && firstLoad.current) {
      firstLoad.current = false;
      void generate();
      return;
    }
  }, [captchaReady, coverLetters, generate]);

  useEffect(() => {
    setDisplayedLetter(currentCoverLetter);
  }, [currentCoverLetter]);

  const refine = (mode: "freeinput" | "shorten" | "extend") => {
    if (job && applicant && coverLetters) {
      refineCoverLetter({
        job,
        applicant,
        coverLetter: coverLetters.currentCoverLetter.text,
        refineOption: mode,
        refineFreeInput: refineText,
      });
    }
  };

  const handleLettersTabChange = (index: number) => {
    setDisplayedLetter(coverLetters?.coverLetters.find((c) => c.id === index));
  };

  const handleReset = () => {
    setIsOpenResetModal(true);
  };

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

      {createError && (
        <div className="mb-4 font-bold text-error">
          Ooop, something went wrong. Try again.
        </div>
      )}

      {!coverLetters && (
        <div className="text-center">
          <button
            className="btn-primary btn w-full sm:w-96"
            onClick={generate}
            disabled={createLoading}
          >
            {createLoading ? (
              <div className="flex items-center gap-x-2">
                <Spinner className="mb-2 h-10 w-10" />
                <p>Generating cover letter...</p>
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
              <select className="select-bordered select select-sm block lg:hidden">
                {coverLetters?.coverLetters.map((c) => (
                  <option
                    {...(displayedLetter?.id === c.id
                      ? { selected: true }
                      : {})}
                    key={c.id}
                    onSelect={() => handleLettersTabChange(c.id)}
                  >
                    v{c.id} - {c.label}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {!createLoading && displayedLetter && (
        <div>
          <div className="relative rounded-md bg-base-200 p-2">
            {formatApiMessage(displayedLetter.text).map((p, i) => (
              <p key={i} className="mb-2">
                {p}
              </p>
            ))}
            <button
              className="group absolute right-2 top-2"
              title="Copy to clipboard"
              onClick={() => {
                void navigator.clipboard.writeText(displayedLetter.text);
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
                onClick={() => refine("freeinput")}
                disabled={
                  refineLoading ||
                  createLoading ||
                  refineText.length < 5 ||
                  !currentCoverLetter ||
                  refineText.length > 100
                }
              >
                Refine
              </button>
            </div>
            <div className="grid w-full grid-cols-3 items-center gap-x-2 sm:w-fit">
              <button
                className="btn-secondary btn"
                onClick={() => refine("shorten")}
                disabled={refineLoading || createLoading || !currentCoverLetter}
              >
                Shorten
              </button>
              <button
                className="btn-secondary btn"
                onClick={() => refine("extend")}
                disabled={refineLoading || createLoading || !currentCoverLetter}
              >
                Extend
              </button>

              <button
                className="btn-secondary btn"
                onClick={handleReset}
                disabled={refineLoading || createLoading || !currentCoverLetter}
              >
                Reset
              </button>
            </div>
            <Spinner
              className={`${
                refineLoading || createLoading ? "visible" : "invisible"
              } h-16 w-16`}
            />
          </div>
          {refineError && (
            <div className="text-right font-bold text-error">
              Ooop, something went wrong. Try again.
            </div>
          )}
        </div>
      )}
      {captchaError && (
        <div className="mt-4 text-center font-semibold text-error">
          Ooop, something went wrong with the Captcha verification. Try again.
        </div>
      )}
    </>
  );
};

export default CoverLetterPage;
