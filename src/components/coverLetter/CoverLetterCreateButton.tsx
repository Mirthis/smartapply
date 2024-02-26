import { useEffect } from "react";

import { api } from "~/lib/api";
import { useGenerateCoverLetter } from "~/lib/hooks";

import { useCoverLettersStore } from "~/store/coverLettersStore";
import { type ApplicationData } from "~/types/types";

import { Spinner } from "../utils";

const CoverLetterCreateButton = ({
  application,
}: {
  application: ApplicationData;
}) => {
  const { setDisplayedLetter, setDisplayedText, addCoverLetter } =
    useCoverLettersStore((state) => state);

  const { mutate: addLetterToDb } = api.coverLetters.create.useMutation({
    onSuccess: (data) => {
      addCoverLetter(data);
      setDisplayedLetter(data);
      setDisplayedText(data.text);
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

  const generate = () => {
    void createCoverLetter({ application });
  };

  useEffect(() => {
    if (createLoading && createResponseText !== "") {
      setDisplayedText(createResponseText);
    }
  }, [createLoading, createResponseText, setDisplayedText]);

  return (
    <div className="text-center space-y-2">
      {!createResponseText.length && (
        <button
          aria-label="Generate Cover Letter"
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
      )}
      {createError && (
        <div className="alert alert-error text-error-content">
          Oops, something went wrong. Try again.
        </div>
      )}
    </div>
  );
};

export default CoverLetterCreateButton;
