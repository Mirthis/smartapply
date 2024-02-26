import { MAX_COVER_LETTERS_TABS } from "~/lib/config";

import { type CoverLetter } from "~/types/types";

const CoverLetterSelector = ({
  coverLetters,
  displayedLetter,
  onLetterChange,
}: {
  coverLetters: CoverLetter[];
  displayedLetter: CoverLetter | null;
  onLetterChange: (index: string) => void;
}) => {
  if (coverLetters.length < 1) return null;

  return (
    <>
      <div
        className={`{tabs tab-sm hidden ${
          coverLetters.length < MAX_COVER_LETTERS_TABS ? "lg:block" : ""
        }`}
      >
        Versions:
        {coverLetters.map((c, i) => (
          <a
            className={`${
              displayedLetter?.id === c.id ? "tab-active" : ""
            } tab-bordered tab`}
            key={c.id}
            onClick={() => onLetterChange(c.id)}
          >
            v{coverLetters.length - i} - {c.label}
          </a>
        ))}
      </div>
      <select
        className={`select-bordered select select-sm block ${
          coverLetters.length <= MAX_COVER_LETTERS_TABS ? "lg:hidden" : ""
        }`}
        value={displayedLetter?.id}
        onChange={(e) => onLetterChange(e.target.value)}
        aria-label="Select a cover letter"
      >
        {coverLetters.map((c, i) => (
          <option key={c.id} value={c.id}>
            v{coverLetters.length - i} - {c.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default CoverLetterSelector;
