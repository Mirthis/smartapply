import { type Application } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionMessageParam,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources";
import { z } from "zod";

import { TEST_ALL_SKILLS } from "~/lib/constants";
import { openAI } from "~/lib/openai";
import { addDelay } from "~/lib/utils";

import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { type TestQuestion } from "~/types/types";

const getSystemMessage = (): ChatCompletionSystemMessageParam => {
  const content = `Create multiple choice questions to assess a job applicant knowledge.
  You must not ask the same question twice.
  Questions should be hard difficulty and validate applicant knowledge of advanced topics.
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
    role: "system",
    content,
  };
};

const getExplanationPrompt = (
  question: string,
  answer: string
): ChatCompletionUserMessageParam => {
  const content = `Your question was: ${question}
  I think the correct answer is ${answer}.
  Tell me if this is correct or not and provide a detailed explanation for the correct answer.`;

  return {
    role: "user",
    content,
  };
};

const getPastQuestionsPrompt = (
  pastQuestions: string
): ChatCompletionSystemMessageParam => {
  const content = `Here are the questions you asked so far and you must not ask again:
  ${pastQuestions}
  `;
  return {
    role: "system",
    content,
  };
};

const getQuestionPrompt = (
  application: Application,
  skill: string
): ChatCompletionUserMessageParam => {
  const skills = skill === TEST_ALL_SKILLS ? application.skillsSummary : skill;
  return {
    role: "user",
    content: `Next question on one of the following  skills: ${skills}`,
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
        const message: ChatCompletionAssistantMessageParam = {
          role: "assistant",
          content: JSON.stringify(responseText),
        };
        return message;
      }

      const application = await ctx.prisma.application.findUniqueOrThrow({
        where: { id: input.applicationId },
      });

      const messages: ChatCompletionMessageParam[] = [getSystemMessage()];
      if (input.pastQuestions) {
        messages.push(getPastQuestionsPrompt(input.pastQuestions));
      }
      messages.push(getQuestionPrompt(application, input.skill));

      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      const finishReason = response.choices[0]?.finish_reason;
      // TODO: handle this exception and other finish reasons
      if (finishReason === "length") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.choices[0]?.message?.content;
      if (responseText) {
        const message: ChatCompletionAssistantMessageParam = {
          role: "assistant",
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
        const message: ChatCompletionAssistantMessageParam = {
          role: "assistant",
          content: "Correct answer.",
        };
        return message;
      }

      const messages = [getExplanationPrompt(input.question, input.answer)];
      const response = await openAI.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
      });
      const finishReason = response.choices[0]?.finish_reason;
      // TODO: handle this exception and other finish reasons
      if (finishReason === "length") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.choices[0]?.message?.content;
      if (responseText) {
        const message: ChatCompletionAssistantMessageParam = {
          role: "assistant",
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
