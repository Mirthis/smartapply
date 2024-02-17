import { create } from "zustand";

import { type CoverLetter } from "~/types/types";

type CoverLettersStoreInitialState = {
  coverLetters: CoverLetter[];
  displayedLetter: CoverLetter | null;
  displayedText: string;
};

type CoverLettersStore = CoverLettersStoreInitialState & {
  addCoverLetter: (coverLetter: CoverLetter) => void;
  setCoverLetters: (coverLetters: CoverLetter[]) => void;
  setDisplayedLetter: (coverLetter: CoverLetter | null) => void;
  setDisplayedText: (test: string) => void;
  reset: () => void;
};

const initialState: CoverLettersStoreInitialState = {
  coverLetters: [],
  displayedLetter: null,
  displayedText: "",
};

export const useCoverLettersStore = create<CoverLettersStore>((set, get) => ({
  ...initialState,

  addCoverLetter: (coverLetter) => {
    const coverLetters = get().coverLetters;

    const newCoverLetters = coverLetters
      ? [coverLetter, ...coverLetters]
      : [coverLetter];

    set({
      coverLetters: newCoverLetters,
    });
    return coverLetter;
  },

  setCoverLetters: (coverLetters) => {
    set({ coverLetters });
  },

  reset: () => set({ ...initialState }),

  setDisplayedLetter: (coverLetter) => {
    set({ displayedLetter: coverLetter });
  },

  setDisplayedText: (test) => {
    set({ displayedText: test });
  },
}));
