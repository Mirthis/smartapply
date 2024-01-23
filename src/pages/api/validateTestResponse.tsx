// import { getAuth } from "@clerk/nextjs/server";
// import {
//   type ChatCompletionRequestMessage,
//   ChatCompletionRequestMessageRoleEnum,
// } from "openai";
// import { OpenAI } from "openai-streams";
// import { z } from "zod";

// import { type NextRequest } from "next/server";

// import { env } from "~/env.mjs";
// import { addDelay } from "~/lib/utils";
// import { applicantSchema, jobSchema } from "~/types/schemas";

// const requestSchema = z.object({
//   job: jobSchema,
//   applicant: applicantSchema,
//   question: z.string(),
//   answer: z.string(),
// });

// const getExplanationPrompt = (
//   question: string,
//   answer: string
// ): ChatCompletionRequestMessage => {
//   const content = `Your question was: ${question}
//   I think the correct answer is ${answer}.
//   Tell me if this is correct or not and provide a detailed explanation for the correct answer.`;

//   return {
//     role: ChatCompletionRequestMessageRoleEnum.User,
//     content,
//   };
// };

// // TODO: add better error handling based on api return
// export default async function handler(request: NextRequest) {
//   const { userId } = getAuth(request);
//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const input = requestSchema.parse(await request.json());

//   if (env.SKIP_AI) {
//     await addDelay(1000);

//     return new Response("Correct answer.");
//   }

//   const messages = [getExplanationPrompt(input.question, input.answer)];

//   const stream = await OpenAI("chat", {
//     model: "gpt-3.5-turbo",
//     messages,
//   });
//   // const finishReason = response.data.choices[0]?.finish_reason;

//   return new Response(stream);
// }

// export const config = {
//   runtime: "edge",
// };
