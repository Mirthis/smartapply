import { getAuth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import {
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources";

import { type NextRequest } from "next/server";

import { MAX_INTERVIEW_PHASE_1_MESSAGES } from "~/lib/config";
import { openAI } from "~/lib/openai";
import { getJobDetailsPrompt } from "~/lib/prompt";
import { getFakeAiResponse } from "~/lib/utils";

import { env } from "~/env.mjs";
import { interviewRequestSchema } from "~/types/schemas";
import { type ApplicationRequestData, InterviewType } from "~/types/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getInterviewCommonPrompt = () => {
  return `
  Your focus will be to determine if the applicant is a good fit for the job
  You should ask the applicant one interview question at a time.
  You should not ask the same question twice.
  `;
};

const getInterviewHRPrompt = () => {
  return [
    "I want you to act as an experienced human resources professional and interview the applicant",
    "You will not go into the technical details of the job and will focus instead on the soft skills required by the role",
  ];
};

const getInterviewTechPrompt = () => {
  return [
    "I want you to act as a senior technology professional and interview the applicant",
    "You will focus on the technical aspect of the job and the hard skills required by the role",
  ];
};

const getInterviewLeadPrompt = () => {
  return [
    "I want you to act as a leadership team member and interview the applicant",
    "You will focus on the applicant leadership skills and how they will fit in the team",
  ];
};

const getInterviewStandardPrompt = () => {
  return [
    "I want you to act as a recrutment manager for the company and interview the applicant",
    "You will assess the applicant's skills and how they meet the job requirements",
  ];
};

const getInterviewClosedMessage = (): ChatCompletionSystemMessageParam => {
  return {
    role: "system",
    content: `Povide feedback on the last answer provided by the applicant.
      Then close the interview by providing feedback to the applicant on the overall interview.
      The message should end with the text '*END*'`,
  };
};

const getInterviewSystemMessage = (
  type: InterviewType,
  application: ApplicationRequestData
): ChatCompletionSystemMessageParam => {
  let specificPrompt: string[] = [];
  switch (type) {
    case InterviewType.hr:
      specificPrompt = getInterviewHRPrompt();
      break;
    case InterviewType.lead:
      specificPrompt = getInterviewLeadPrompt();
      break;
    case InterviewType.tech:
      specificPrompt = getInterviewTechPrompt();
      break;
    case InterviewType.generic:
      specificPrompt = getInterviewStandardPrompt();
      break;
  }

  const content = `${specificPrompt[0] || ""}.
  ${getJobDetailsPrompt(application)}.
  ${specificPrompt[1] || ""}.
  ${getInterviewCommonPrompt()}
  `;

  return {
    role: "system",
    content,
  };
};

const getFirstInterviewMessage = (): ChatCompletionUserMessageParam => {
  return {
    role: "user",
    content: "Hello, I'm here for the interview",
  };
};

export default async function handler(request: NextRequest) {
  // const requestData = requestSchema.parse(await request.());
  const { userId } = getAuth(request);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestData = interviewRequestSchema.parse(await request.json());
  const { application, interviewType, messages } = requestData;

  if (env.SKIP_AI) {
    await delay(1000);
    return new Response(
      await getFakeAiResponse("test interview message\n\nanother line*END*")
    );
  }

  const requestMessages = [
    getInterviewSystemMessage(interviewType, application),
    getFirstInterviewMessage(),
    ...messages,
  ];

  if (messages.length > MAX_INTERVIEW_PHASE_1_MESSAGES) {
    requestMessages.push(getInterviewClosedMessage());
  }

  const aiResponse = await openAI.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: requestMessages,
    stream: true,
  });

  const stream = OpenAIStream(aiResponse);

  return new StreamingTextResponse(stream);
}

export const config = {
  runtime: "edge",
};
