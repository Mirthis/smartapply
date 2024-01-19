import { CloudIcon, DocumentIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
import Dropzone from "react-dropzone";

import { api } from "~/lib/api";
import {
  MAX_FILE_NUM_PAGES,
  MAX_FILE_SIZE_KB,
  MAX_FILE_TEXT_LENGTH,
} from "~/lib/constants";
import { readPdf } from "~/lib/read-pdf";
import { type ParsedResume } from "~/types/types";

function sizeValidator(file: File) {
  if (file.size > MAX_FILE_SIZE_KB * 1024) {
    return {
      code: "file-too-large",
      message: `File cannot be bigger than ${MAX_FILE_SIZE_KB} KB`,
    };
  }

  return null;
}

const FileUpload = ({
  onParseSuccess,
}: {
  onParseSuccess: (parsedResume: ParsedResume) => void;
}) => {
  const [parseError, setParseError] = useState<string | undefined>();

  const {
    mutate: parseResume,
    isLoading: isProcessing,
    isError: isErrorProcessing,
  } = api.applicant.parseResume.useMutation({
    onSuccess: (data) => {
      onParseSuccess(data);
    },
  });

  // TODO: add error handling (e.g. file too big, wrong format, parsing failure)
  // TODO: revieww size limit, add extra checks before sending to API (i.e.: num of pages, text length
  return (
    <Dropzone
      multiple={false}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onDrop={async (acceptedFiles) => {
        setParseError(undefined);
        if (acceptedFiles.length == 0 || !acceptedFiles[0]) return;
        const fileURL = URL.createObjectURL(acceptedFiles[0]);
        const {
          text: resumeText,
          numPages,
          textLength,
        } = await readPdf(fileURL);
        if (numPages > MAX_FILE_NUM_PAGES) {
          setParseError(
            `File cannot have more than ${MAX_FILE_NUM_PAGES} pages`
          );
          return;
        }
        if (textLength > MAX_FILE_TEXT_LENGTH) {
          setParseError(
            `File cannot have more than ${MAX_FILE_TEXT_LENGTH} characters`
          );
          return;
        }
        parseResume({ resumeText: resumeText.join(" ") });
      }}
      validator={sizeValidator}
      accept={{ "application/pdf": [".pdf"] }}
    >
      {({ getRootProps, getInputProps, acceptedFiles, fileRejections }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center h-full w-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudIcon className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm  text-zinc-700">
                  <span className="font-semibold">Click to uploade</span> or
                  drag and drop
                </p>
                <p className="text-xs text-zinc-500">
                  PDF (up to {MAX_FILE_SIZE_KB} KB )
                </p>
              </div>
              <div className="space-y-2">
                {acceptedFiles.length > 0 && acceptedFiles[0] && (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <DocumentIcon className="h-4 w-4 text-primary-focus" />
                    </div>
                    <div className="px-3 py-2 h-full text-sm truncate">
                      {acceptedFiles[0].name}
                    </div>
                  </div>
                )}
                {fileRejections.length > 0 && fileRejections[0] && (
                  <>
                    <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <DocumentIcon className="h-4 w-4 text-error" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {fileRejections[0].file.name}
                      </div>
                    </div>
                    <div className="text-sm text-error">
                      {fileRejections[0].errors[0]?.message}
                    </div>
                  </>
                )}
                {!!isProcessing && (
                  <div className="w-full mt-4 max-w-xs mx-auto">
                    <progress className="progress w-full progress-primary"></progress>
                  </div>
                )}
                {parseError && (
                  <div className="text-xs text-error">{parseError}</div>
                )}
                {isErrorProcessing && (
                  <div className="text-xs text-error">
                    There was an error processing your file. Please try again
                    later.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default FileUpload;
