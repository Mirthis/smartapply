import { type inferRouterOutputs } from "@trpc/server";
import { type ChatCompletionMessageParam } from "openai/resources";
import { type z } from "zod";

import { type AppRouter } from "~/server/api/root";

import {
  type applicantSchema,
  type applicationRequestSchema,
  type applicationSchema,
  type contactFormSchema,
  type interviewRequestSchema,
  type jobSchema,
} from "./schemas";

export type JobData = z.infer<typeof jobSchema>;
export type ApplicantFormData = z.infer<typeof applicantSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type InterviewRequest = z.infer<typeof interviewRequestSchema>;
export type InterviewHookRequest = Omit<
  z.infer<typeof interviewRequestSchema>,
  "messages"
>;

export type EditApplicationData = z.infer<typeof applicationSchema>;

export enum InterviewType {
  tech = "Technology",
  hr = "HR",
  lead = "Leadership",
  generic = "Generic",
}

export type InterviewMessage = ChatCompletionMessageParam & {
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
  state: "Not Started" | "In Progress" | "Completed";
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
  lastQuestion: TestQuestion | undefined;
  messages: ChatCompletionMessageParam[];
  displayedQuestion: TestQuestion | undefined;
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
export type ApplicantData = RouterOutput["applicant"]["getForLoggedUser"][0];

export type ApplicationRequestData = z.infer<typeof applicationRequestSchema>;

export interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

type FeatureScore = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4;
type ReturnMatchingTextOnly = boolean;
export type FeatureSet =
  | [(item: TextItem) => boolean, FeatureScore]
  | [
      (item: TextItem) => RegExpMatchArray | null,
      FeatureScore,
      ReturnMatchingTextOnly
    ];

export interface TextScore {
  text: string;
  score: number;
  match: boolean;
}
export type TextScores = TextScore[];

export interface ParsedResume {
  firstName: string;
  lastName: string;
  jobTitle: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    description: string;
  }[];
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
