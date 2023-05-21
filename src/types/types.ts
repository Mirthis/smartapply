import { type z } from "zod";
import {
  type contactFormSchema,
  type applicantSchema,
  type jobSchema,
} from "./schemas";
import { type ChatCompletionRequestMessage } from "openai";

export type JobData = z.infer<typeof jobSchema>;
export type ApplicantData = z.infer<typeof applicantSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;

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
  label: string;
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

export type TestQuestion = {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  providedAnswer?: number;
  explanation?: string;
};

export type TestData = {
  questions: TestQuestion[];
  lastId: number;
  currentQuestion: TestQuestion;
  messages: ChatCompletionRequestMessage[];
};

export enum FormStep {
  Job = "job",
  Applicant = "applicant",
  Complete = "complete",
}

export enum RefineMode {
  FreeInput = "freeinput",
  Shorten = "shorten",
  Extend = "extend",
}
