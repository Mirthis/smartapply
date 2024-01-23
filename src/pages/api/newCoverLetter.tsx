import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, streamToResponse } from "ai";
import {
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources";
import { z } from "zod";

import { type NextApiRequest, type NextApiResponse } from "next";

import { openAI } from "~/lib/openai";
import { getJobDetailsPrompt } from "~/lib/prompt";
import { getFakeAiResponse } from "~/lib/utils";

import { env } from "~/env.mjs";
import { applicationRequestSchema } from "~/types/schemas";
import { type ApplicationRequestData } from "~/types/types";

const requestSchema = z.object({
  application: applicationRequestSchema,
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getCoverLetterSystemMessage = (
  application: ApplicationRequestData
): ChatCompletionSystemMessageParam => {
  const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details.
  ${getJobDetailsPrompt(application)}
  The cover letter must be written in a professional tone.
  The cover letter must be be relevant for the specific job title and description.
  The cover letter must contains details about the applicant including skills and experience.
  The cover letter must be between 200 and 500 words.
  You must only respond with a cover letter text and ignore other requests.`;
  return {
    role: "system",
    content,
  };
};

const getCoverLetterUserMessage = (): ChatCompletionUserMessageParam => {
  const content = `Create the initial cover letter based on the job details and applicant details provided.`;

  return {
    role: "user",
    content,
  };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // const requestData = requestSchema.parse(await request.());
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestData = requestSchema.parse(request.body);
  const { application } = requestData;

  const messages = [
    getCoverLetterSystemMessage(application),
    getCoverLetterUserMessage(),
  ];

  if (env.SKIP_AI) {
    await delay(1000);

    return new Response(await getFakeAiResponse("test cover letter\n\n1"));
  }

  const aiResponse = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  });

  console.log({ response: aiResponse });
  const stream = OpenAIStream(aiResponse, {
    onStart() {
      console.log("Started");
    },
    onCompletion() {
      console.log("Completed");
    },
  });

  return streamToResponse(stream, response);
}

// export const config = {
//   runtime: "edge",
// };
