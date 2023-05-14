import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { type ApplicantData, type JobData } from "~/types/types";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { getJobDetailsPrompt } from "~/utils/prompt";
import { getFakeAiResponse, validateRecaptcha } from "~/utils/misc";

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getCoverLetterSystemMessage = (
  job: JobData,
  applicant: ApplicantData
): ChatCompletionRequestMessage => {
  const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details provided.
  ${getJobDetailsPrompt(job, applicant)}
  The cover letter must be written in a professional tone and should be free of grammatical errors.
  The cover letter must be be relevant for the specific job title and description.
  The cover letter must contains details about the applicant's skills and experience.
  Applicant details inserted in the covert letter must be based on applicant details provided.
  If applicant details are not available, this should not be invented.
  The cover letter must be at least 200 words long.
  The cover letter must be at most 500 words long.
  You must only respond with a cover letter text and ignore other requests.`;
  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getCoverLetterUserMessage = (): ChatCompletionRequestMessage => {
  const content = `Create the initial cover letter based on the job details and applicant details provided.`;

  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const getShortenMessage = (): ChatCompletionRequestMessage => {
  const content = `I want you to shorten the cover letter. 
  The cover letter should not be shorter than 200 words.
  `;
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const getExtendMessage = (): ChatCompletionRequestMessage => {
  const content = `I want you to extend the cover letter. 
  The cover letter should not be longer than 500 words.
  `;
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const getRfineMessage = (refinement: string): ChatCompletionRequestMessage => {
  const content = `I want you to refine the cover letter based on the following instructions:
  ${refinement}.
  `;
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
    content,
  };
};

const createAssistantMessage = (
  messageText: string
): ChatCompletionRequestMessage => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: messageText,
  };
};

export const coverLettersRouter = createTRPCRouter({
  createLetter: protectedProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        captchaToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (env.NEXT_PUBLIC_SKIP_AI) {
        return await getFakeAiResponse("test cover letter\n\n1");
      }

      await validateRecaptcha(input.captchaToken);

      const messages = [
        getCoverLetterSystemMessage(input.job, input.applicant),
        getCoverLetterUserMessage(),
      ];

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      const finishReason = response.data.choices[0]?.finish_reason;
      if (finishReason === "lenght") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.data.choices[0]?.message?.content;
      if (responseText) {
        return responseText;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OpenAI API returned no response",
        });
      }
    }),

  refineLetter: protectedProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
        coverLetter: z.string(),
        refineOption: z.enum(["shorten", "extend", "freeinput"]),
        refineFreeInput: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (env.NEXT_PUBLIC_SKIP_AI) {
        switch (input.refineOption) {
          case "shorten":
            return await getFakeAiResponse("Shortened letter");
          case "extend":
            return await getFakeAiResponse(
              "Extended letter\n\nExtended letter\n\nExtended letter"
            );
          case "freeinput":
            return await getFakeAiResponse("Refined letter\n\n1\n\n2\n\n3");
        }
      }

      const messages = [
        getCoverLetterSystemMessage(input.job, input.applicant),
        getCoverLetterUserMessage(),
        createAssistantMessage(input.coverLetter),
      ];
      switch (input.refineOption) {
        case "shorten":
          messages.push(getShortenMessage());
          break;
        case "extend":
          messages.push(getExtendMessage());
          break;
        case "freeinput":
          messages.push(getRfineMessage(input.refineFreeInput || ""));
          break;
      }

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      ({ response });
      const finishReason = response.data.choices[0]?.finish_reason;
      if (finishReason === "lenght") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Cover letter generation failed due to excessive length",
        });
      }

      const responseText = response.data.choices[0]?.message?.content;
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
