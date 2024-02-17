import { type ChatCompletionMessageParam } from "openai/resources";
import { create } from "zustand";

import { type InterviewData, InterviewType } from "~/types/types";

type InterviewStoreInitialState = InterviewData;

type InterviewStore = InterviewStoreInitialState & {
  initInterview: (type: InterviewType) => void;
  resetInterview: () => void;
  closeInterview: () => void;
  addInterviewMessage: (message: ChatCompletionMessageParam) => void;
};

const initialState: InterviewStoreInitialState = {
  type: InterviewType.generic,
  messages: [],
  lastId: 0,
  state: "Not Started",
};

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  ...initialState,
  initInterview: (type) => {
    set({
      messages: [],
      type,
      lastId: 0,
      state: "In Progress",
    });
  },
  addInterviewMessage(message) {
    const nextId = get().lastId;

    const messages = get().messages;
    const newMessage = {
      ...message,
      id: nextId,
    };
    set({
      messages: [...messages, newMessage],
      lastId: nextId,
    });
  },
  resetInterview: () => set(initialState),
  closeInterview: () => {
    set({
      state: "Completed",
    });
  },
}));
