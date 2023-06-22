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
  type InterviewData,
  type TestData,
  type TestQuestion,
  type CoverLetter,
  type ApplicationData,
} from "~/types/types";

type AppStoreInitialState = {
  application: ApplicationData | undefined;
  newApplication: {
    job: JobData | undefined;
    applicant: ApplicantData | undefined;
  };
  coverLetters: CoverLetter[];
  interview?: InterviewData;
  test?: TestData;
  initialized: boolean;
};

type AppStore = AppStoreInitialState & {
  initFromLocalStore: () => void;
  setApplication: (application: ApplicationData) => void;

  setNewApplicant: (applicant: ApplicantData) => void;
  setNewJob: (job: JobData) => void;
  addCoverLetter: (coverLetter: CoverLetter) => void;
  setCoverLetters: (coverLetters: CoverLetter[]) => void;
  clearCoverLetters: () => void;
  initInterview: (type: InterviewType) => void;
  resetInterview: () => void;
  closeInterview: () => void;
  addInterviewMessage: (message: ChatCompletionRequestMessage) => void;
  addTestMessage: (question: ChatCompletionResponseMessage) => void;
  addTestQuestion: (question: string) => void;
  addTestAnswer: (questionId: number, answer: number) => void;
  addTestExplanation: (questionId: number, explanation: string) => void;
  resetTest: () => void;
  resetGenerated: () => void;
  reset: () => void;
};

const getInitalState = () => {
  const initialState: AppStoreInitialState = {
    application: undefined,
    newApplication: {
      job: undefined,
      applicant: undefined,
    },
    coverLetters: [],
    interview: undefined,
    test: undefined,
    initialized: false,
  };

  if (!!env.NEXT_PUBLIC_INIT_STORE) {
    initialState.newApplication.job = {
      title: "Full Stack JavaScript Developer ",
      description: `The Role
      We are currently seeking a passionate, highly motivated and organized Mid-Level Full Stack JavaScript Developer to join our dedicated team. The successful candidate will have a keen interest in educational technology and be ready to help us take our innovative product to the next level.
      
      Key Responsibilities
      Collaborate with our team to design, develop, and maintain our web applications.
      Write clean, efficient, and reusable code that drives our innovative platform.
      Ensure our software meets all requirements of quality, security, scalability, and usability.
      Keep up-to-date with emerging technologies and industry trends.
      Design and implementation of low-latency, high-availability, and performance applications.
      
      Key Qualifications
      Minimum of 3+ years' experience in a SAAS environment.
      Proficient in JavaScript, Node.js, MongoDB, and React.
      Understanding of backend technologies with a demonstrated preference for backend development.
      Strong understanding of security best practices.
      Exceptional attention to detail.
      Excellent problem-solving skills.
      Solid understanding of the full web development life cycle.
      
      Nice to have
      Experience with DevOps and Google Cloud Platform 
    `,
      companyName: "Night Zookeeper",
      companyDetails: `At Night Zookeeper, we are passionate about fostering creativity and improving literacy for children aged 6-12 through our engaging online learning program. Our platform has been instrumental in developing reading, writing, and creative thinking skills for over a million children worldwide. Our offerings extend beyond online learning to story books, activity packs, and other learning resources.`,
      //   title: "Sr Technical Program Manager",
      //   description: `As a Senior Technical Program Manager at Ring, you will work with a focused team of product managers, engineers, and partner teams building and releasing new products and features. You will have an enormous opportunity to impact the customer experience, design, architecture, and implementation of a cutting edge product that will be used every day.
      //   We are looking for entrepreneurial, innovative individuals who thrive on solving tough problems. Maturity, high judgment, negotiation skills, ability to influence, analytical talent, and leadership are essential to success in this role.
      //   You will anticipate bottlenecks, provide escalation management, anticipate and make tradeoffs, and balance customer and business needs versus technical constraints. An ability to take large, complex projects and break them down into manageable pieces, develop functional specifications, then deliver them in a successful and timely manner is expected.

      //   Key job responsibilities:
      //   Collaborate with Business, Engineering, and other internal teams to solve business needs
      //   Be expected to be familiar with system development cycle and key performance metrics
      //   Communicate regularly with senior management on status, risks, and change control
      //   Be expected to dive deep into the technical details of the program

      //   REFERRED QUALIFICATIONS:
      //   Ability to communicate effectively with both technical and non-technical individuals
      //   Excellent oral and written communication skills
      //   Track record for being detail-oriented with a demonstrated ability to self-motivate and follow-through on projects
      //   Ability to define scope, and solve problems creatively and practically
      //   Strong track record of software project delivery for large, cross functional, projects
      //   Fluency with Atlassian SCM Suite (Confluence/JIRA)
      //   Experience in productization and shipping of software products (Services or Consumer Electronics)
      //   Knowledge of Software Development Life Cycle (SDLC)
      //   Tenacious, does not give up
      // `,
      //   companyName: "Amazon",
      //   // companyDetails: null,
      //   companyDetails: `VIOOH's mission is to connect Out of Home (OOH) and digital advertising to create brand experiences and meaningful outcomes for advertisers. Their aim is to make it easy to trade, efficiently by delivering a premium OOH marketplace which connects buyers and sellers, simply.`,
    };
    initialState.newApplication.applicant = {
      firstName: "John",
      lastName: "Doe",
      jobTitle: "Delivery Manager",
      resume: `Data and analytics expert and leader with more than 15 years of experience driving the delivery of complex transformation projects across business intelligence (BI), big data, cloud, and analytics. Thoroughly assesses enterprise needs and provides solutions in alignment with organisational structures, policies, procedures, and mission. Blends deep technical knowledge with business acumen to strategically drive efforts of cross-functional teams focused on surpassing objectives while optimising data and reporting functions. Poised to harness skills gained in a dynamic career delivering data and analytics solutions.`,
      skills: `Project and Programme Management | Solution Architecture | Technical Architecture | Data Management Business Transformations | Reporting | Agile, Scrum / SAFe | Stakeholder Relations | Delivery Management  Change Management | Data Migration | Data Engineering | Data Architecture | Data Strategy | Data Governance`,
      experience: `07.2007-Present:
      Data and Analytics Senior Manager
      Orchestrate data and analytics solution delivery to major international clients across a wide range of industries.
      Play a leading role in diverse information management projects, encompassing migrations and integration of legacy systems as well as delivery of new strategic analytics solutions.
      Coordinate efforts of multicultural teams working onshore / offshore to ensure timely and quality implementation of complex transformation programmes.`,
    };
    initialState.initialized = true;
  }

  return initialState;
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...getInitalState(),
  setApplication: (application) => {
    const { id: applicationId, applicant, job } = application;
    set({
      application: application,
    });
    localStorage.setItem("applicationId", JSON.stringify(applicationId));
    localStorage.setItem("applicant", JSON.stringify(applicant));
    localStorage.setItem("job", JSON.stringify(job));
  },

  setNewApplicant: (applicant) => {
    const newApplication = get().newApplication;
    set({
      newApplication: { applicant: applicant, job: newApplication.job },
    });
    localStorage.setItem("applicant", JSON.stringify(applicant));
  },
  setNewJob: (job) => {
    const newApplication = get().newApplication;
    set({
      newApplication: { applicant: newApplication.applicant, job },
    });
    localStorage.setItem("job", JSON.stringify(job));
  },
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
    set({ coverLetters: coverLetters });
  },
  clearCoverLetters: () => set({ coverLetters: [] }),
  initFromLocalStore: () => {
    if (get().initialized)
      return {
        applicant: get().newApplication.applicant,
        job: get().newApplication.job,
      };
    const storedApplicant = localStorage.getItem("applicant");
    const storedJob = localStorage.getItem("job");

    const applicant = storedApplicant
      ? (JSON.parse(storedApplicant) as ApplicantData)
      : undefined;
    const job = storedJob ? (JSON.parse(storedJob) as JobData) : undefined;
    set({
      // applicationId: storedApplicationId ?? undefined,
      newApplication: {
        applicant,
        job,
      },
      initialized: true,
    });
    return { applicant, job };
  },
  initInterview: (type) => {
    set({
      interview: {
        messages: [],
        type,
        lastId: 0,
        isOpen: true,
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
  closeInterview: () => {
    const interview = get().interview;
    if (!interview) return;
    set({
      interview: {
        ...interview,
        isOpen: false,
      },
    });
  },
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
      coverLetters: [],
      interview: undefined,
      test: undefined,
    });
  },
  reset: () => {
    localStorage.removeItem("applicationId");
    localStorage.removeItem("applicant");
    localStorage.removeItem("job");
    set({ ...getInitalState() });
  },
}));
