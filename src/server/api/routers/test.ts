import { type Job } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { z } from "zod";

import { addDelay } from "~/utils/misc";
import { openaiClient } from "~/utils/openai";

import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { type TestQuestion } from "~/types/types";

const getSystemMessage = (job: Job, skill: string) => {
  const skills = skill === "*ALL*" ? job.skillsSummary : skill;

  const content = `Create multiple choice questions to assess a job applicant knowledge of the following skills: ${skills}.
  You must not ask the same queston twice.
  Questions should be medium to high complexity.
  For technical skills, question can include code snippets.
  Each question should have 4 possible answers.
  You will only provide 1 question at at time in JSON format. For example:
  {
    "question": "What of the following React hooks can be used to manage global state?",
    "answers": [
      "useContext",
      "useEffect",
      "useState",
      "useRef"
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

const getExplanationPrompt = (
  question: string,
  answer: string
): ChatCompletionRequestMessage => {
  const content = `Your question was: ${question}
  I think the correct answer is ${answer}.
  Tell me if this is correct or not and provide a detailed explanation for the correct answer.`;

  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const getPastQuestionsPrompt = (pastQuestions: string) => {
  const content = `Here are the questions you asked so far:
  ${pastQuestions}
  `;
  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
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
  getQuestion: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        skill: z.string(),
        pastQuestions: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (env.SKIP_AI) {
        // await addDelay(1000);
        const responseText: TestQuestion = {
          id: 0,
          question: `Skill: ${input.skill} - What is React?`,
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

      const application = await ctx.prisma.application.findUniqueOrThrow({
        where: { id: input.applicationId },
        include: {
          job: true,
        },
      });

      const messages: ChatCompletionRequestMessage[] = [
        getSystemMessage(application.job, input.skill),
      ];
      if (input.pastQuestions) {
        messages.push(getPastQuestionsPrompt(input.pastQuestions));
      }
      messages.push(getQuestionPrompt());

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

  getAnswerExplanation: protectedProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        question: z.string(),
        answer: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (env.SKIP_AI) {
        // throw new TRPCError({
        //   code: "INTERNAL_SERVER_ERROR",
        //   message: "OpenAI API returned no response",
        // });
        await addDelay(1000);
        const message: ChatCompletionRequestMessage = {
          role: ChatCompletionRequestMessageRoleEnum.Assistant,
          content: "Correct answer.",
        };
        return message;
      }

      const messages = [getExplanationPrompt(input.question, input.answer)];
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
