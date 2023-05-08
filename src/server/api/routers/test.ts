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
import { type JobData, type TestQuestion } from "~/types/types";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { getJobDetailsPrompt } from "~/utils/prompt";

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getSystemMessage = (job: JobData) => {
  const content = `Your focus is to determine if the applicant is a good fit for the job.
  You will ask multiple choice questions to the applicant, related to skills and responsibilities required by the job.
  The questions must not test if the applicant knows the required skills, but if the applicant has the require skills
  You will focus on technical skills and hard skills required by the job.
  You must not ask the same queston twice.
  ${getJobDetailsPrompt(job)}
  Each question should have 4 possible answers.
  You will create 1 question at at time.
  You will only provide questions in JSON with the following format:
  {
    "question": "What is the answer to this question?",
    "answers": [
      "Answer 1",
      "Answer 2",
      "Answer 3",
      "Answer 4"
    ],
    "correctAnswer": 0
  }
  You will not send any other text with the question only the JSON.
  `;

  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getExplanationPrompt = (answer: string): ChatCompletionRequestMessage => {
  const content = `I think the correct answer is ${answer}.
  Tell me if this is correct or not and provide a detailed explanation for the correct answer.`;

  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const getQuestionPrompt = (): ChatCompletionRequestMessage => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: `Next question (JSON only)`,
  };
};

export const testRouter = createTRPCRouter({
  getQuestion: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
      })
    )
    .mutation(async ({ input }) => {
      if (env.NEXT_PUBLIC_SKIP_AI) {
        await delay(1000);
        const responseText: TestQuestion = {
          id: 0,
          question: "What is React?",
          answers: [
            "A back-end framework",
            "A database technology",
            "A JavaScript library",
            "A front-end programming language",
          ],
          correctAnswer: 2,
        };
        const message: ChatCompletionRequestMessage = {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: JSON.stringify(responseText),
        };
        return message;
      }

      const messages = [getSystemMessage(input.job), getQuestionPrompt()];

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      // ({ response });
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

  getAnswerExplanation: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        messages: array(
          z.object({
            role: z.nativeEnum(ChatCompletionRequestMessageRoleEnum),
            content: z.string(),
          })
        ),
        answer: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (env.NEXT_PUBLIC_SKIP_AI) {
        await delay(1000);
        const message: ChatCompletionRequestMessage = {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: "Correct answer.",
        };
        return message;
      }

      const messages = [
        getSystemMessage(input.job),
        ...input.messages,
        getExplanationPrompt(input.answer),
      ];

      const response = await openai.createChatCompletion({
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
