import { array, z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { InterviewType, type ApplicantData, type JobData } from "~/types/types";
import { applicantSchema, jobSchema } from "~/types/schemas";

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getInterviewSystemMessage = (
  type: InterviewType,
  job: JobData,
  applicant: ApplicantData
): ChatCompletionRequestMessage => {
  const company = job.companyName ?? "unspecified company";
  const applicantName =
    applicant.firstName || applicant.lastName
      ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`
      : undefined;

  const content = `I want you to act as an experienced human resources professional working and interview the applicant.
  ${
    job.companyName ? `The compnay you are interviewing for is ${company}` : ""
  }.
  ${job.companyDetails ? `The company details are ${job.companyDetails}` : ""}
  The applicant is applying for the position of ${job.jobTitle}.
  The job description is as follows: ${job.jobDescription}
  ${applicantName ? `The applicant name is ${applicantName}` : ""}
  ${applicant.title ? `The applicant title is ${applicant.title}` : ""}
  ${applicant.resume ? `The applicant resume is ${applicant.resume}` : ""}

  Your focus will be to determine if the applicant is a good fit for the job.
  You will only be able to ask questions that are relevant to the job description, the applicant's resume.
  You will be able to ask questions about the applicant's experience, skills and past work experience.
  You won't ask questions about the applicant's personal life.
  You will close the interview by asking the applicant if they have any questions for you.
  You will only answer questions that are relevant to the job description, the applicant's resume.
  You will only answer questions at the end of the interview.
  You will only answer 3 questions
  After questions you'll provide a feedback to the applicant and tell them if they passed or failed the interview.
  `;

  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getFirstInterviewMessage = (): ChatCompletionRequestMessage => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "Hello, I'm here for the interview",
  };
};

export const interviewRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        interviewType: z.nativeEnum(InterviewType),
        interviewMessages: array(
          z.object({
            role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      console.log({ input });
      const messages = [
        getInterviewSystemMessage(
          input.interviewType,
          input.job,
          input.applicant
        ),
        getFirstInterviewMessage(),
        ...input.interviewMessages,
      ];

      console.log({ messages });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      console.log({ response });
      const finishReason = response.data.choices[0]?.finish_reason;
      // TODO: handle this exception and other finish reasons
      if (finishReason === "lenght") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.data.choices[0]?.message?.content;
      console.log({ responseText });
      if (responseText) {
        return responseText;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API returned no response",
        });
      }
    }),

  sendMessageFake: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        interviewType: z.nativeEnum(InterviewType),
        interviewMessages: array(
          z.object({
            role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await delay(1000);
      console.log({ input });
      const messages = [
        getInterviewSystemMessage(
          input.interviewType,
          input.job,
          input.applicant
        ),
        getFirstInterviewMessage(),
        ...input.interviewMessages,
      ];

      console.log({ messages });

      const responseText = "This is a fake response text";
      console.log({ responseText });
      if (responseText) {
        return responseText;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API returned no response",
        });
      }
    }),
});
