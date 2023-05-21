import {
  type ChatCompletionResponseMessage,
  type ChatCompletionRequestMessage,
} from "openai";
import { create } from "zustand";
import { env } from "~/env.mjs";
import {
  type ApplicantData,
  type JobData,
  type InterviewType,
  type CoverLettersData,
  type InterviewData,
  type TestData,
  type TestQuestion,
  type CoverLetter,
} from "~/types/types";
import { MAX_COVER_LETTERS } from "~/utils/constants";

type AppStoreInitialState = {
  applicant?: ApplicantData;
  job?: JobData;
  coverLetters?: CoverLettersData;
  interview?: InterviewData;
  test?: TestData;
  initialized: boolean;
};

type AppStore = AppStoreInitialState & {
  initFromLocalStore: () => {
    job: JobData | undefined;
    applicant: ApplicantData | undefined;
  };
  setApplicant: (applicant: ApplicantData) => void;
  setJob: (job: JobData) => void;
  // setCoverLetter: (coverLetter: string) => void;
  addCoverLetter: (coverLetter: string, label: string) => CoverLetter;
  initInterview: (type: InterviewType) => void;
  addInterviewMessage: (message: ChatCompletionRequestMessage) => void;
  addTestMessage: (question: ChatCompletionResponseMessage) => void;
  addTestQuestion: (question: string) => void;
  addTestAnswer: (questionId: number, answer: number) => void;
  addTestExplanation: (questionId: number, explanation: string) => void;
  resetTest: () => void;
  resetInterview: () => void;
  resetCoverLetters: () => void;
  resetGenerated: () => void;
  reset: () => void;
};

const getInitalState = () => {
  const initialState: AppStoreInitialState = {
    job: undefined,
    applicant: undefined,
    coverLetters: undefined,
    interview: undefined,
    test: undefined,
    initialized: false,
  };

  if (!!env.NEXT_PUBLIC_INIT_STORE) {
    initialState.job = {
      jobTitle: "Front End Engineer",
      jobDescription: `Who you are:
      Strong knowledge of modern Javascript
      Strong knowledge of CSS fundamentals and best practices
      Prior commercial experience working with React and Redux
      Good understanding of REST APIs
      Experience working with GIT
      
      Desirable:
      Commercial experience with Typescript
      Experience working with Webpack
      Experience in optimising rendering and loading performances
      Experience with refactoring, following best practices
      Experience in writing unit, integration and acceptance tests
      
      What the job involves:
      In order to expand our team, we’re looking for a Front-end Developer with previous experience in the React and Redux ecosystem
      You will be working in a cross-functional team in a continuous delivery workflow, developing new features
      You will also be responsible for refactoring code, improving the quality of the codebase and keeping it in a well organised and updated state
      Working in a multicultural, collaborative environment, you will have the opportunity to make an impact and grow both professionally and personally`,
      companyName: "VIOOH",
      companyDetails: `VIOOH's mission is to connect Out of Home (OOH) and digital advertising to create brand experiences and meaningful outcomes for advertisers. Their aim is to make it easy to trade, efficiently by delivering a premium OOH marketplace which connects buyers and sellers, simply.`,
    };
    initialState.applicant = {
      firstName: "John",
      lastName: "Doe",
      jobTitle: "Full Stack Engineer",
      resume: `Engineer with 5 years of experience developing full stack applications using Node, React and NextJs. I have worked in a variety of industries including finance, healthcare and retail. I am passionate about building products that solve real world problems.`,
      skills: `Javascript, Typescript, React, NextJs, Tailwind CSS, Git, Prisma, NodeJs`,
      experience: `Developed a web application for a healthcare company that allows patients to book appointments with doctors. The application was built using React, NextJs and Prisma. The application was deployed to AWS using Docker and Kubernetes.`,
    };
    initialState.initialized = true;
  }

  return initialState;
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...getInitalState(),
  setApplicant: (applicant) => {
    set({
      applicant,
      interview: undefined,
      coverLetters: undefined,
      initialized: true,
    });
    localStorage.setItem("applicant", JSON.stringify(applicant));
  },
  setJob: (job) => {
    set({
      job,
      interview: undefined,
      coverLetters: undefined,
      initialized: true,
    });
    localStorage.setItem("job", JSON.stringify(job));
  },
  addCoverLetter: (coverLetter, label: string) => {
    const coverLetters = get().coverLetters;
    const nextId = (coverLetters?.lastId ?? 0) + 1;
    const newCoverLetter = {
      id: nextId,
      text: coverLetter,
      label,
    };
    const newCoverLetters = [
      ...(coverLetters?.coverLetters ?? []),
      newCoverLetter,
    ];
    if (newCoverLetters.length > MAX_COVER_LETTERS) {
      newCoverLetters.shift();
    }
    set({
      coverLetters: {
        coverLetters: newCoverLetters,
        currentCoverLetter: newCoverLetter,
        lastId: nextId,
      },
    });
    return newCoverLetter;
  },
  resetCoverLetters: () => set({ coverLetters: undefined }),
  initFromLocalStore: () => {
    if (get().initialized)
      return { applicant: get().applicant, job: get().job };
    const storedApplicant = localStorage.getItem("applicant");
    const storedJob = localStorage.getItem("job");

    const applicant = storedApplicant
      ? (JSON.parse(storedApplicant) as ApplicantData)
      : undefined;
    const job = storedJob ? (JSON.parse(storedJob) as JobData) : undefined;
    set({ applicant, job, initialized: true });
    return { applicant, job };
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
  addTestMessage: (message: ChatCompletionRequestMessage) => {
    const test = get().test;
    if (!test) return;
    const messages = test?.messages ?? [];
    const newMessage = {
      ...message,
    };
    set({
      test: {
        ...test,
        messages: [...messages, newMessage],
      },
    });
  },
  addTestQuestion: (question: string) => {
    const test = get().test;
    const nextId = (test?.lastId ?? 0) + 1;
    const questionObj: TestQuestion = JSON.parse(question) as TestQuestion;
    const newQuestion = {
      ...questionObj,
      id: nextId,
    };
    set({
      test: {
        messages: test?.messages ?? [],
        questions: [...(test?.questions ?? []), newQuestion],
        lastId: nextId,
        currentQuestion: newQuestion,
      },
    });
  },
  addTestAnswer: (questionId, answer) => {
    const test = get().test;
    if (!test) return;
    const newQuestions = test?.questions?.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          providedAnswer: answer,
        };
      }
      return q;
    });
    const currentQuestion = newQuestions?.find((q) => q.id === questionId);
    if (!newQuestions || !currentQuestion) return;
    set({
      test: {
        ...test,
        questions: newQuestions,
        currentQuestion,
      },
    });
  },
  addTestExplanation: (questionId, explanation) => {
    const test = get().test;
    if (!test) return;
    const newQuestions = test?.questions?.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          explanation,
        };
      }
      return q;
    });
    const currentQuestion = newQuestions?.find((q) => q.id === questionId);
    if (!newQuestions || !currentQuestion) return;
    set({
      test: {
        ...test,
        questions: newQuestions,
        currentQuestion,
      },
    });
  },
  resetTest: () => set({ test: undefined }),
  resetGenerated: () => {
    set({
      coverLetters: undefined,
      interview: undefined,
      test: undefined,
    });
  },
  reset: () => set({ ...getInitalState() }),
}));
