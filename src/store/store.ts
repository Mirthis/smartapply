import { create } from "zustand";
import { type ApplicantData, type JobData } from "~/types/types";

interface CoverLetter {
  id: number;
  text: string;
}

type CoverLettersData = {
  coverLetters: CoverLetter[];
  currentCoverLetter: CoverLetter;
  lastId: number;
};

type AppStore = {
  applicant?: ApplicantData;
  job?: JobData;
  coverLetters?: CoverLettersData;
  setApplicant: (applicant: ApplicantData) => void;
  setJob: (job: JobData) => void;
  setCoverLetter: (coverLetter: string) => void;
  addCoverLetter: (coverLetter: string) => void;
  reset(): void;
};

const initialState = {
  job: {
    jobTitle: "Software Engineer",
    jobDescription:
      "Develo state of the art web applications, including the next generation of Google's search engine",
    companyName: "Google",
    companyDetails:
      "Google is a major technology company that specializes in Internet-related services and products. These include online advertising technologies, search, cloud computing, software, and hardware.",
  },
  applicant: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    resume:
      "I am a software engineer with 5 years of experience in the field. I have worked on a variety of projects, including the next generation of Google's search engine.",
  },
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,
  setApplicant: (applicant) => set({ applicant }),
  setJob: (job) => set({ job }),
  setCoverLetter: (coverLetter) => {
    const nextId = 1;

    const newCoverLetter = {
      id: nextId,
      text: coverLetter,
    };
    set({
      coverLetters: {
        coverLetters: [newCoverLetter],
        currentCoverLetter: newCoverLetter,
        lastId: nextId,
      },
    });
  },
  addCoverLetter: (coverLetter) => {
    const coverLetters = get().coverLetters;
    const nextId = (coverLetters?.lastId ?? 0) + 1;
    const newCoverLetter = {
      id: nextId,
      text: coverLetter,
    };
    set({
      coverLetters: {
        coverLetters: [...(coverLetters?.coverLetters ?? []), newCoverLetter],
        currentCoverLetter: newCoverLetter,
        lastId: nextId,
      },
    });
  },
  reset: () =>
    set({ applicant: undefined, job: undefined, coverLetters: undefined }),
}));
