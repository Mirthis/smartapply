import { Clipboard } from "lucide-react";

import { formatApiMessage } from "~/lib/formatter";

const CoverLetterDisplay = ({ text }: { text: string }) => {
  return (
    <div className="max-h-[calc(100vh-25rem)] scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 overflow-auto relative rounded-md bg-base-200 p-2">
      {/* {text} */}
      <div>
        {formatApiMessage(text).map((p, i) => (
          <p className="mb-2" key={`cover-letter-paragraph-${i}`}>
            {p}
          </p>
        ))}
      </div>
      <button
        aria-label="Copy to clipboard"
        className="group absolute  right-2 top-2"
        title="Copy to clipboard"
        onClick={() => {
          void navigator.clipboard.writeText(text);
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
  );
};

export default CoverLetterDisplay;
