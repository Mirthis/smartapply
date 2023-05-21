import { OpenAI } from "openai-streams";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { type ApplicantData, type JobData } from "~/types/types";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { env } from "~/env.mjs";
import { getJobDetailsPrompt } from "~/utils/prompt";
import { getFakeAiResponse } from "~/utils/misc";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

const requestSchema = z.object({
  job: jobSchema,
  applicant: applicantSchema,
  srcCoverLetter: z.string(),
  refineMode: z.enum(["shorten", "extend", "freeinput"]),
  refineText: z.string().optional(),
});

const getCoverLetterSystemMessage = (
  job: JobData,
  applicant: ApplicantData
): ChatCompletionRequestMessage => {
  const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details.
  ${getJobDetailsPrompt(job, applicant)}
  The cover letter must be written in a professional tone.
  The cover letter must be be relevant for the specific job title and description.
  The cover letter must contains details about the applicant's skills and experience.
  The cover letter must be between 200 and 500 words.
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

export default async function handler(request: NextRequest) {
  // const requestData = requestSchema.parse(await request.());
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const input = requestSchema.parse(await request.json());

  if (env.SKIP_AI) {
    switch (input.refineMode) {
      case "shorten":
        return new Response(await getFakeAiResponse("Shortened letter"));
      case "extend":
        return new Response(
          await getFakeAiResponse(
            "Extended letter\n\nExtended letter\n\nExtended letter"
          )
        );
      case "freeinput":
        return new Response(
          await getFakeAiResponse("Refined letter\n\n1\n\n2\n\n3")
        );
    }
  }

  const messages = [
    getCoverLetterSystemMessage(input.job, input.applicant),
    getCoverLetterUserMessage(),
    createAssistantMessage(input.srcCoverLetter),
  ];
  switch (input.refineMode) {
    case "shorten":
      messages.push(getShortenMessage());
      break;
    case "extend":
      messages.push(getExtendMessage());
      break;
    case "freeinput":
      messages.push(getRfineMessage(input.refineText || ""));
      break;
  }

  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages,
  });

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};
