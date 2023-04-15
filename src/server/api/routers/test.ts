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
import { getJobDetailsPrompt } from "~/utils/prompt";

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getSystemMessage = (job: JobData, applicant: ApplicantData) => {
  const content = `You are going to create multiple choice questions for the applicant to answer.
  ${getJobDetailsPrompt(job, applicant)}
  Each question should have 4 possible answers.
  You will create 1 question at at time.
  Questions and answers will be returned in json format so that theye can be parsed in jvascript using JSON.parse.
  `;

  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getQuestionPrompt = (): ChatCompletionRequestMessage => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: "I'm ready for the next question.",
  };
};

export const interviewRouter = createTRPCRouter({
  getQuestion: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
      })
    )
    .mutation(async ({ input }) => {
      console.log({ input });
      const messages = [
        getSystemMessage(input.job, input.applicant),
        getQuestionPrompt(),
      ];

      console.log({ messages });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      // console.log({ response });
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
        getSystemMessage(input.job, input.applicant),
        getQuestionPrompt(),
        ...input.interviewMessages,
      ];

      console.log({ messages });

      const responseText =
        "This is a fake response\n\nThis is a second line\n*END*";
      console.log({ responseText });
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
