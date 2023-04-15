import { type z } from "zod";
import { type applicantSchema, type jobSchema } from "./schemas";
import { type ChatCompletionRequestMessage } from "openai";

export type JobData = z.infer<typeof jobSchema>;
export type ApplicantData = z.infer<typeof applicantSchema>;

export enum InterviewType {
  tech = "Technology",
  hr = "HR",
  lead = "Leadershiop",
}

export type InterviewMessage = ChatCompletionRequestMessage & {
  id: number;
};

export interface CoverLetter {
  id: number;
  text: string;
}

export type CoverLettersData = {
  coverLetters: CoverLetter[];
  currentCoverLetter: CoverLetter;
  lastId: number;
};

export type InterviewData = {
  type: InterviewType;
  messages: InterviewMessage[];
  lastId: number;
};
