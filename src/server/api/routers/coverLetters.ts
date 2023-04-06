import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getCoverLetterSystemMessage = (): ChatCompletionRequestMessage => {
  const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details provided
  The cover letter should be written in a professional tone and should be free of grammatical errors.
  The cover letter should be be relevant for the specific job title and description.
  The cover letter should contains details specific to the applicant (when provided).
  The cover letter should be at least 200 words long.
  The cover letter should be at most 500 words long.
  You should not provide any response not related to the job or applicant details.
  You should only respond within this context and only with a cover letter text, no other information is required.`;
  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getCoverLetterUserMessage = (
  job: JobData,
  applicant: ApplicantData
): ChatCompletionRequestMessage => {
  const content = `I need a cover letter based on the following job and applicant details:
  Job title: ${job.jobTitle}
  Job description: ${job.jobDescription}
  ${
    job.companyName && job.companyName !== ""
      ? `Company hiring (name): ${job.companyName}`
      : ""
  }
  ${
    job.companyDetails && job.companyDetails !== ""
      ? `Company hiring (details): ${job.companyDetails}`
      : ""
  }
  ${
    applicant.firstName && applicant.firstName !== ""
      ? `Applicant (first name): ${applicant.firstName}`
      : ""
  }
  ${
    applicant.lastName && applicant.lastName !== ""
      ? `Applicant (last name): ${applicant.lastName}`
      : ""
  }
  ${
    applicant.title && applicant.title !== ""
      ? `Applicant (title): ${applicant.title}`
      : ""
  }
  ${
    applicant.resume && applicant.resume !== ""
      ? `Applicant (resume): ${applicant.resume}`
      : ""
  }
`;
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
  createLetter: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
      })
    )
    .mutation(async ({ input }) => {
      console.log({ input });
      const messages = [
        getCoverLetterSystemMessage(),
        getCoverLetterUserMessage(input.job, input.applicant),
      ];

      console.log({ messages });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      console.log({ response });
      const finishReason = response.data.choices[0]?.finish_reason;
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

  refineLetter: publicProcedure
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
      console.log({ input });
      const messages = [
        getCoverLetterSystemMessage(),
        getCoverLetterUserMessage(input.job, input.applicant),
        createAssistantMessage(input.coverLetter),
      ];
      if (input.refineOption) {
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
      }

      console.log({ messages });

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      console.log({ response });
      const finishReason = response.data.choices[0]?.finish_reason;
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

  createLetterFake: publicProcedure
    .input(
      z.object({
        job: jobSchema,
        applicant: applicantSchema,
      })
    )
    .mutation(async ({ input }) => {
      console.log({ input });
      const messages = [
        getCoverLetterSystemMessage(),
        getCoverLetterUserMessage(input.job, input.applicant),
      ];
      console.log({ messages });

      await delay(1500);

      const response =
        "Dear Hiring Manager,\n" +
        "\n" +
        "I am writing to express my interest in the Software Engineer position at Google. As an experienced Software Engineer, I am excited about the opportunity to build cool stuff with cool people in a cool environment.\n" +
        "\n" +
        "I am very impressed by Google's reputation as a big tech company with a lot of perks. I am confident that the company's culture of innovation and dedication to excellence will provide me with the perfect platform to enhance my skills and contribute to the success of the team.\n" +
        "\n" +
        "As a Software Engineer with several years of experience, I have worked on various projects where I have applied my expertise in developing and implementing software. My vast experience in designing and testing software gives me the confidence to approach any software development project with ease.\n" +
        "\n" +
        "I have a thorough understanding of multiple programming languages and I have worked with various database management systems. I am also skilled in identifying system bugs and flaws and coming up with innovative solutions for them. Additionally, I can effortlessly adapt to new technologies and software development techniques.\n" +
        "\n" +
        "In my previous role as a Software Engineer, I was responsible for leading a team of developers to design and develop software applications that improved user experience while enhancing functionality. The success of this project was largely due to my ability to work diligently with my team members while staying focused on the end goal.\n" +
        "\n" +
        "I am confident that my skills in software development, leadership, and collaboration make me a perfect fit for the Software Engineer position at Google. I look forward to contributing my skills to your team and learning from the best in the industry.\n" +
        "\n" +
        "Thank you for considering my application. I look forward to hearing from you.\n" +
        "\n" +
        "Best regards,\n" +
        "\n" +
        "John Doe";

      return response;
    }),

  refineLetterFake: publicProcedure
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
      console.log({ input });
      const messages = [
        getCoverLetterSystemMessage(),
        getCoverLetterUserMessage(input.job, input.applicant),
        createAssistantMessage(input.coverLetter),
      ];
      let responseText = "";
      if (input.refineOption) {
        switch (input.refineOption) {
          case "shorten":
            messages.push(getShortenMessage());
            responseText = "This is a shortened cover letter";
            break;
          case "extend":
            messages.push(getExtendMessage());
            responseText = "This is an extended cover letter";
            break;
          case "freeinput":
            messages.push(getRfineMessage(input.refineFreeInput || ""));
            responseText = "This is a refined cover letter";
            break;
        }
      }

      console.log({ messages });

      await delay(1500);

      console.log({ responseText });
      return responseText;
    }),
});
