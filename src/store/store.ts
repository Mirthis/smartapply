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
} from "~/types/types";
import { MAX_COVER_LETTERS } from "~/utils/constants";

type AppStoreInitialState = {
  applicant?: ApplicantData;
  job?: JobData;
  coverLetters?: CoverLettersData;
  interview?: InterviewData;
  test?: TestData;
};

type AppStore = {
  applicant?: ApplicantData;
  job?: JobData;
  coverLetters?: CoverLettersData;
  interview?: InterviewData;
  test?: TestData;

  setApplicant: (applicant: ApplicantData) => void;
  setJob: (job: JobData) => void;
  setCoverLetter: (coverLetter: string) => void;
  addCoverLetter: (coverLetter: string, label: string) => void;
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

const initialState: AppStoreInitialState = {
  job: undefined,
  applicant: undefined,
  coverLetters: undefined,
  interview: undefined,
  test: undefined,
};

if (env.SKIP_AI) {
  initialState.job = {
    jobTitle: "Senior Manager, Data Engineering",
    jobDescription: `Expedia Group's Stream Engineering team builds the streaming platform for the whole of Expedia. The Stream Platform ingests billions of messages everyday and is quickly becoming one of the largest streaming platforms in the world. The platform supports multiple brands and internal teams and powers many of the business critical processes, data products and AI and ML workflows.

    The team is focused on delivery of a scalable, reliable, secure and easy to use platform. The team places a heavy emphasis on distributed systems architecture and automation, utilising appropriate technologies such as Kafka, Spring, Kubernetes and common Devops automation tooling. We scale on AWS but we aim to be able to deploy to any environment in any location to meet any demand.
    
    You are a technology leader who is passionate about building and running robust, scalable, and performant platforms. You are always keen to learn and grow. You are a humble leader who can work alongside engineers as well as business partners. You are a good communicator and listener. You enjoying getting things done but can meet high standards and quality requirements. You enjoying unlocking, unblocking and facilitating the team to succeed. You are the voice for your team and help build and drive the careers and achievements of others.
    
    What You'll Do
    Team management - recruitment, performance management, mentoring, and motivating to achieve a common goal, Promote and maintain diversity and an equal opportunity inclusive work environment.
    Contribute to the creation and consumption of open, standards-based solutions, promoting a commitment to automation, agile, lean-startup, continuous delivery
    Drive and maintain high standards of platform availability, monitoring, quality, and performance
    Focus on quality delivery : Deliver solutions to business problems spanning teams, Influence product roadmap, ensure the flawless execution of new ideas or approaches, determine and prioritize different phases of delivery
    Process improvement : Coordinates with the team to define the measures of success for process improvements.
    Set goal and vision : Define team's goals and how they relate to the platform vision, partner with the product and architects to have a clear understanding of how the technology stack is tied to business outcomes and our bottom line.
    Bridge the gap in discussions between technology and non-technology personnel
    Who You Are
    Bachelor's degree or Masters in Computer Science or equivalent related professional experience
    5+ years of proven experience in technical development and 2+ years in technical leadership.
    Strong in multiple technologies or languages.
    You have strong technical acumen and broad knowledge in data architecture patterns including Cloud, security, data modeling, metadata management, streams, persistence, enrichment, and access.
    You have experience with managing distributed teams of full-time staff and vendors
    You have presented new technology choice to technical and non-technical observers)`,
    companyName: "Expedia Group",
    companyDetails: `Expedia Group (NASDAQ: EXPE) powers travel for everyone, everywhere through our global platform. Driven by the core belief that travel is a force for good, we help people experience the world in new ways and build lasting connections. We provide industry-leading technology solutions to fuel partner growth and success, while facilitating memorable experiences for travelers. Expedia Group's family of brands includes: Brand Expedia®, Hotels.com®, Expedia® Partner Solutions, Vrbo®, trivago®, Orbitz®, Travelocity®, Hotwire®, Wotif®, ebookers®, CheapTickets®, Expedia Group™ Media Solutions, Expedia Local Expert®, CarRentals.com™, and Expedia Cruises`,
  };
  initialState.applicant = {
    firstName: "John",
    lastName: "Doe",
    jobTitle: "Data and Analytics Delivery Manager",
    resume: `Data and analytics expert and leader with more than 15 years of experience driving the delivery of complex transformation projects across business intelligence (BI), big data, cloud, and analytics. Thoroughly assesses enterprise needs and provides solutions in alignment with organisational structures, policies, procedures, and mission. Blends deep technical knowledge with business acumen to strategically drive efforts of cross-functional teams focused on surpassing objectives while optimising data and reporting functions. Poised to harness skills gained in a dynamic career delivering data and analytics solutions.`,
    skills: `Project and Programme Management, Solution Architecture, Technical Architecture, Data Management,
    Business Transformations, Reporting, Agile, Scrum / SAFe, Stakeholder Relations, Delivery Management,
    Change Management, Data Migration, Data Engineering, Data Architecture, Data Strategy, Data Governanc`,
    experience: `Data and Analytics Senior Manager
    Orchestrate data and analytics solution delivery to major international clients across a wide range of industries.
    Play a leading role in diverse information management projects, encompassing migrations and integration of legacy systems as well as delivery of new strategic analytics solutions.
    Coordinate efforts of multicultural teams working onshore / offshore to ensure timely and quality implementation of complex transformation programmes.`,
  };
}

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
      label: "New",
    };
    set({
      coverLetters: {
        coverLetters: [newCoverLetter],
        currentCoverLetter: newCoverLetter,
        lastId: nextId,
      },
    });
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
  },

  resetCoverLetters: () => set({ coverLetters: undefined }),

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

  reset: () => set({ ...initialState }),
}));
