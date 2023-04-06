/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Spinner from "~/components/ui/Spinner";
import { api } from "~/utils/api";
import { formatApiMessage } from "~/utils/formatter";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useAppStore } from "~/store/store";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";

const CoverLetterPage: NextPage = () => {
  const { setCoverLetter, addCoverLetter, coverLetters } = useAppStore(
    (state) => state
  );
  const currentCoverLetter = coverLetters?.currentCoverLetter;

  const { job, applicant } = useAppStore((state) => state);

  const [refineText, setRefineText] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState(currentCoverLetter);

  const { mutate: createCoverLetter, isLoading: createLoading } =
    api.coverLetters.createLetterFake.useMutation({
      onSuccess: (data) => {
        setCoverLetter(data);
      },
    });

  const { mutate: refineCoverLetter, isLoading: refineLoading } =
    api.coverLetters.refineLetterFake.useMutation({
      onSuccess: (data) => {
        addCoverLetter(data);
      },
    });

  const generate = () => {
    if (job && applicant) {
      createCoverLetter({
        job,
        applicant,
      });
    }
  };

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

  console.log({ coverLetters });

  return (
    <>
      <Title title="Cover Letter" />
      <ApplicationDetails />

      {!createLoading && !coverLetters && (
        <button className="brn-primary btn" onClick={generate}>
          Generate Cover Letter
        </button>
      )}
      {(createLoading || coverLetters) && (
        <div className="flex-start flex items-baseline gap-x-4">
          <h1 className="mb-2 mt-4 text-3xl">Your Cover Letter</h1>
          {(coverLetters?.coverLetters.length ?? 0) > 1 && (
            <div className="tabs tab-sm ">
              {coverLetters?.coverLetters.map((c) => (
                <a
                  className="tab tab-bordered"
                  key={c.id}
                  onClick={() => handleLettersTabChange(c.id)}
                >
                  v {c.id}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      {createLoading && (
        <div className="flex flex-col items-center">
          <Spinner className="mb-2 h-10 w-10" />
          <p>Generating cover letter...</p>
        </div>
      )}
      {!createLoading && displayedLetter && (
        <div>
          <div className="relative rounded-md bg-neutral p-2">
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
          <div className="mt-4 flex flex-col gap-x-4 gap-y-4 lg:flex-row">
            <div className="flex w-full gap-x-2">
              <input
                type="text"
                className="input-bordered input w-full"
                placeholder="Add more details about me"
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
                  refineText.length < 5 ||
                  !currentCoverLetter ||
                  refineText.length > 100
                }
              >
                Refine
              </button>
            </div>
            <div className="grid grid-cols-3 gap-x-2">
              <button
                className="btn-secondary btn"
                onClick={() => refine("shorten")}
              >
                Shorten
              </button>
              <button
                className="btn-secondary btn"
                onClick={() => refine("extend")}
              >
                Extend
              </button>
              <button className="btn-secondary btn" onClick={generate}>
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoverLetterPage;
