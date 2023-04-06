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
