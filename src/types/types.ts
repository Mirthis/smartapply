import { type z } from "zod";
import {
  type contactFormSchema,
  type applicantSchema,
  type jobSchema,
  type interviewRequestSchema,
} from "./schemas";
import { type ChatCompletionRequestMessage } from "openai";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

export type JobData = z.infer<typeof jobSchema>;
export type ApplicantData = z.infer<typeof applicantSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type InterviewRequest = z.infer<typeof interviewRequestSchema>;
export type InterviewHookRequest = Omit<
  z.infer<typeof interviewRequestSchema>,
  "messages"
>;

export enum InterviewType {
  tech = "Technology",
  hr = "HR",
  lead = "Leadershiop",
}

export type InterviewMessage = ChatCompletionRequestMessage & {
  id: number;
};

export interface CoverLetter {
  id: string;
  text: string;
  label: string;
}

export type InterviewData = {
  type: InterviewType;
  messages: InterviewMessage[];
  isOpen: boolean;
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
  skill: string;
  status: "Not Started" | "In Progress" | "Completed";
  questions: TestQuestion[];
  lastId: number;
  currentQuestion: TestQuestion | undefined;
  messages: ChatCompletionRequestMessage[];
};

export enum FormStep {
  New = "new",
  Job = "job",
  Applicant = "applicant",
  Service = "service",
  Complete = "complete",
}

export enum RefineMode {
  FreeInput = "freeinput",
  Shorten = "shorten",
  Extend = "extend",
}

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ApplicationData = RouterOutput["application"]["getAllForUser"][0];
