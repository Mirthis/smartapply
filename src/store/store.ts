import { type ChatCompletionRequestMessage } from "openai";
import { create } from "zustand";
import {
  type ApplicantData,
  type JobData,
  type InterviewType,
  type CoverLettersData,
  type InterviewData,
} from "~/types/types";

type AppStore = {
  applicant?: ApplicantData;
  job?: JobData;
  coverLetters?: CoverLettersData;
  interview?: InterviewData;

  setApplicant: (applicant: ApplicantData) => void;
  setJob: (job: JobData) => void;
  setCoverLetter: (coverLetter: string) => void;
  addCoverLetter: (coverLetter: string) => void;
  initInterview: (type: InterviewType) => void;
  addInterviewMessage: (message: ChatCompletionRequestMessage) => void;
  resetInterview: () => void;
  reset(): void;
};

const initialState = {
  job: {
    jobTitle: "Frontend Engineer",
    jobDescription: `Contributing to Frontend development at Robin AI as part of one of our product squads
      Collaborating with engineers, designers and other teams across the business to create innovative new features and improve workflows
      Writing high quality, well-tested code that solves challenging problems
      Sharing your knowledge and experience with the frontend chapter to help define technical standards and approaches for frontend development at RobinAI
      Participate in the entire development process (design, development and deployment)`,
    companyName: "RobinAI",
    companyDetails:
      "To be one of Europe's most diverse software companies, renowned for experimentation and world-class talent.",
  },
  applicant: {
    firstName: "John",
    lastName: "Doe",
    title: "Front-end Engineer",
    resume: `Front-end engineer with 3 years of experience building responsive web and mobile application using React and React Native.
      In depth knmowledge of Javascript, Typescript, Tailwind CSS, React  and NextJs`,
  },
  coverletters: undefined,
  interview: undefined,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,
  setApplicant: (applicant) =>
    set({ applicant, interview: undefined, coverLetters: undefined }),
  setJob: (job) => set({ job, interview: undefined, coverLetters: undefined }),
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

  initInterview: (type) => {
    set({
      interview: {
        messages: [],
        type,
        lastId: 0,
      },
    });
  },

  addInterviewMessage(message) {
    const interview = get().interview;
    if (!interview) return;
    const nextId = (interview?.lastId ?? 0) + 1;

    const messages = interview?.messages ?? [];
    const newMessage = {
      ...message,
      id: nextId,
    };
    set({
      interview: {
        ...interview,
        messages: [...messages, newMessage],
        lastId: nextId,
      },
    });
  },

  resetInterview: () => set({ interview: undefined }),

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

  reset: () => set({ ...initialState }),
}));
