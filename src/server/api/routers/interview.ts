import { TRPCError } from "@trpc/server";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { z } from "zod";

import { env } from "~/env.mjs";
import { openaiClient } from "~/lib/openai";
import { getJobDetailsPrompt } from "~/lib/prompt";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { type ApplicantData, InterviewType, type JobData } from "~/types/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getInterviewCommonPrompt = () => {
  return `
  Your focus will be to determine if the applicant is a good fit for the job
  You should ask the applicant 5 different questions, one at a time.
  After asking 5 questions You will close the interview by asking the applicant if they have any questions for you.
  If the applicant ask questions before you ask him you should say that you will answer them at the end of the interview.
  You will only answer 3 questions from the applicant.
  After the applicant questions you'll provide a feedback to the applicant on how their interview went and tell them if they passed or failed.
  The last message should have the *END* token.`;
};

const getInterviewHRPrompt = () => {
  return [
    "I want you to act as an experienced human resources professional and interview the applicant",
    "You will not got to much into the technical details of the job and focus instead on the soft skills required by role",
  ];
};

const getInterviewTechPrompt = () => {
  return [
    "I want you to act as a senior technology professional and interview the applicant",
    "You will focus on the technical aspect of the job and the hard skills required by role",
  ];
};

const getInterviewLeadPrompt = () => {
  return [
    "I want you to act as a leadership team member and interview the applicant",
    "You will focus on the applicant leadership skills and how they will fit in the team",
  ];
};

const getInterviewSystemMessage = (
  type: InterviewType,
  job: JobData,
  applicant: ApplicantData
) => {
  let specicifPromt: string[] = [];
  switch (type) {
    case InterviewType.hr:
      specicifPromt = getInterviewHRPrompt();
      break;
    case InterviewType.lead:
      specicifPromt = getInterviewLeadPrompt();
      break;
    case InterviewType.tech:
      specicifPromt = getInterviewTechPrompt();
      break;
  }

  const content = `${specicifPromt[0] || ""}.
  ${getJobDetailsPrompt(job, applicant)}.
  ${specicifPromt[1] || ""}.
  ${getInterviewCommonPrompt()}
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
  sendMessage: protectedProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        interviewType: z.nativeEnum(InterviewType),
        interviewMessages: z.array(
          z.object({
            role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      if (env.SKIP_AI) {
        await delay(1000);
        const message: ChatCompletionRequestMessage = {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: "I'm sorry, I'm not feeling well today",
        };

        return message;
      }

      const messages = [
        getInterviewSystemMessage(
          input.interviewType,
          input.job,
          input.applicant
        ),
        getFirstInterviewMessage(),
        ...input.interviewMessages,
      ];

      const response = await openaiClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      const finishReason = response.data.choices[0]?.finish_reason;
      // TODO: handle this exception and other finish reasons
      if (finishReason === "lenght") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.data.choices[0]?.message?.content;
      if (responseText) {
        const message: ChatCompletionRequestMessage = {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: responseText,
        };

        return message;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API returned no response",
        });
      }
    }),
});
