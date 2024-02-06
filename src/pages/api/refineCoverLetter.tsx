import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";

import { type NextRequest } from "next/server";

import { openAI } from "~/lib/openai";
import {
  getCoverLetterCreateMessage,
  getCoverLetterExistingMessage,
  getCoverLetterExtendMessage,
  getCoverLetterRefineMessage,
  getCoverLetterShortenMessage,
  getCoverLetterSystemMessage,
} from "~/lib/prompt";
import { getFakeAiResponse } from "~/lib/utils";

import { env } from "~/env.mjs";
import { applicationRequestSchema } from "~/types/schemas";

const requestSchema = z.object({
  application: applicationRequestSchema,
  srcCoverLetter: z.string(),
  refineMode: z.enum(["shorten", "extend", "freeinput"]),
  refineText: z.string().optional(),
});

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
    getCoverLetterSystemMessage(),
    getCoverLetterCreateMessage(input.application),
    getCoverLetterExistingMessage(input.srcCoverLetter),
  ];
  switch (input.refineMode) {
    case "shorten":
      messages.push(getCoverLetterShortenMessage());
      break;
    case "extend":
      messages.push(getCoverLetterExtendMessage());
      break;
    case "freeinput":
      messages.push(getCoverLetterRefineMessage(input.refineText || ""));
      break;
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
