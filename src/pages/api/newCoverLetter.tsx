import { getAuth } from "@clerk/nextjs/server";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { OpenAI } from "openai-streams";
import { z } from "zod";

import { type NextRequest } from "next/server";

import { env } from "~/env.mjs";
import { getJobDetailsPrompt } from "~/lib/prompt";
import { getFakeAiResponse } from "~/lib/utils";
import { applicationRequestSchema } from "~/types/schemas";
import { type ApplicationRequestData } from "~/types/types";

const requestSchema = z.object({
  application: applicationRequestSchema,
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getCoverLetterSystemMessage = (
  application: ApplicationRequestData
): ChatCompletionRequestMessage => {
  const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details.
  ${getJobDetailsPrompt(application)}
  The cover letter must be written in a professional tone.
  The cover letter must be be relevant for the specific job title and description.
  The cover letter must contains details about the applicant including skills and experience.
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

export default async function handler(request: NextRequest) {
  // const requestData = requestSchema.parse(await request.());
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestData = requestSchema.parse(await request.json());
  const { application } = requestData;

  const messages = [
    getCoverLetterSystemMessage(application),
    getCoverLetterUserMessage(),
  ];

  if (env.SKIP_AI) {
    await delay(1000);

    return new Response(await getFakeAiResponse("test cover letter\n\n1"));
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
