import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";

import { type NextRequest } from "next/server";

import { openAI } from "~/lib/openai";
import {
  getCoverLetterCreateMessage,
  getCoverLetterSystemMessage,
} from "~/lib/prompt";
import { getFakeAiResponse } from "~/lib/utils";

import { env } from "~/env.mjs";
import { applicationRequestSchema } from "~/types/schemas";

const requestSchema = z.object({
  application: applicationRequestSchema,
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
    getCoverLetterCreateMessage(),
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

  const stream = OpenAIStream(aiResponse);

  return new StreamingTextResponse(stream);
}

export const config = {
  runtime: "edge",
};
