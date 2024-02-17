import { type ChatCompletionMessageParam } from "openai/resources";
import { create } from "zustand";

import { TEST_ALL_SKILLS } from "~/lib/constants";

import { type TestData, type TestQuestion } from "~/types/types";

type TestStoreInitialState = TestData;

type TestStore = TestStoreInitialState & {
  initTest: (skill: string) => void;
  addTestMessage: (question: ChatCompletionMessageParam) => void;
  addTestQuestion: (question: string) => void;
  addTestAnswer: (question: TestQuestion, answer: number) => void;
  addTestExplanation: (questionId: number, explanation: string) => void;
  setTestStatus: (status: "Not Started" | "In Progress" | "Completed") => void;
  setTestSkill: (skill: string) => void;
  setDisplayedQuestion: (question: TestQuestion) => void;
  resetTest: () => void;
};

const initialState: TestStoreInitialState = {
  skill: TEST_ALL_SKILLS,
  status: "Not Started",
  questions: [],
  lastId: 0,
  lastQuestion: undefined,
  displayedQuestion: undefined,
  messages: [],
};

export const useTestStore = create<TestStore>((set, get) => ({
  ...initialState,

  initTest: (skill) => {
    set({
      ...initialState,
      skill,
      status: "In Progress",
    });
  },
  setTestStatus: (status) => {
    set({
      status,
    });
  },
  setTestSkill: (skill: string) => {
    set({
      skill,
    });
  },
  addTestMessage: (message: ChatCompletionMessageParam) => {
    const messages = get().messages;
    const newMessage = {
      ...message,
    };
    set({
      messages: [...messages, newMessage],
    });
  },
  addTestQuestion: (question: string) => {
    const nextId = get().lastId + 1;
    const questionObj: TestQuestion = JSON.parse(question) as TestQuestion;
    const newQuestion = {
      ...questionObj,
      id: nextId,
    };
    set({
      questions: [...(get().questions ?? []), newQuestion],
      lastId: nextId,
      lastQuestion: newQuestion,
      displayedQuestion: newQuestion,
    });
  },
  addTestAnswer: (question, answer) => {
    const newQuestions = get().questions.map((q) => {
      if (q.id === question.id) {
        return {
          ...q,
          providedAnswer: answer,
        };
      }
      return q;
    });
    const currentQuestion = newQuestions?.find((q) => q.id === question.id);
    if (!newQuestions || !currentQuestion) return;
    set({
      questions: newQuestions,
      lastQuestion: currentQuestion,
      displayedQuestion: currentQuestion,
    });
  },
  setDisplayedQuestion: (question) => {
    set({
      displayedQuestion: question,
    });
  },
  addTestExplanation: (questionId, explanation) => {
    console.log("addTestExplanation", questionId, explanation);
    const newQuestions = get().questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          explanation,
        };
      }
      return q;
    });
    console.log("newQuestions", newQuestions);
    const currentQuestion = newQuestions?.find((q) => q.id === questionId);
    if (!newQuestions || !currentQuestion) return;
    set({
      questions: newQuestions,
      lastQuestion: currentQuestion,
    });
  },
  resetTest: () => set(initialState),
}));
