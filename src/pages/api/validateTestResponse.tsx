import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { type ChatCompletionMessageParam } from "openai/resources";
import { z } from "zod";

import { type NextRequest } from "next/server";

import { openAI } from "~/lib/openai";
import { addDelay } from "~/lib/utils";

import { env } from "~/env.mjs";
import { applicantSchema, jobSchema } from "~/types/schemas";

const requestSchema = z.object({
  job: jobSchema,
  applicant: applicantSchema,
  question: z.string(),
  answer: z.string(),
});

const getExplanationPrompt = (
  question: string,
  answer: string
): ChatCompletionMessageParam[] => {
  return [
    {
      role: "assistant",
      content: `Question:\n${question}`,
    },
    {
      role: "user",
      content: `I think the correct answer is ${answer}.
      Tell me if this is correct or not and provide a detailed explanation for the correct answer.`,
    },
  ];
};

// TODO: add better error handling based on api return
export default async function handler(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const input = requestSchema.parse(await request.json());

  if (env.SKIP_AI) {
    await addDelay(1000);

    return new Response("Correct answer.");
  }

  const messages = getExplanationPrompt(input.question, input.answer);

  const aiResponse = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  });
  // const finishReason = response.data.choices[0]?.finish_reason;

  const stream = OpenAIStream(aiResponse);

  return new StreamingTextResponse(stream);
}

export const config = {
  runtime: "edge",
};
