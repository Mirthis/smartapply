import { OpenAI } from "openai-streams";
import { interviewRequestSchema } from "~/types/schemas";
import { InterviewType, type ApplicantData, type JobData } from "~/types/types";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { env } from "~/env.mjs";
import { getJobDetailsPrompt } from "~/utils/prompt";
import { getFakeAiResponse } from "~/utils/misc";
import { getAuth } from "@clerk/nextjs/server";
import { type NextRequest } from "next/server";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getInterviewCommonPrompt = () => {
  return `
  Your focus will be to determine if the applicant is a good fit for the job
  You should ask the applicant 5 different questions, one at a time.
  After asking 5 questions You will close the interview by asking the applicant if they have any questions for you.
  If the applicant ask questions before you ask him you should say that you will answer them at the end of the interview.
  You will only answer 3 questions from the applicant.
  After the applicant questions you'll provide a feedback to the applicant on how their interview went and tell them if they passed or failed.
  The last message should have the *END* token.`;
};

const getInterviewHRPrompt = () => {
  return [
    "I want you to act as an experienced human resources professional and interview the applicant",
    "You will not got to much into the technical details of the job and focus instead on the soft skills required by role",
  ];
};

const getInterviewTechPrompt = () => {
  return [
    "I want you to act as a senior technology professional and interview the applicant",
    "You will focus on the technical aspect of the job and the hard skills required by role",
  ];
};

const getInterviewLeadPrompt = () => {
  return [
    "I want you to act as a leadership team member and interview the applicant",
    "You will focus on the applicant leadership skills and how they will fit in the team",
  ];
};

const getInterviewSystemMessage = (
  type: InterviewType,
  job: JobData,
  applicant: ApplicantData
) => {
  let specicifPromt: string[] = [];
  switch (type) {
    case InterviewType.hr:
      specicifPromt = getInterviewHRPrompt();
      break;
    case InterviewType.lead:
      specicifPromt = getInterviewLeadPrompt();
      break;
    case InterviewType.tech:
      specicifPromt = getInterviewTechPrompt();
      break;
  }

  const content = `${specicifPromt[0] || ""}.
  ${getJobDetailsPrompt(job, applicant)}.
  ${specicifPromt[1] || ""}.
  ${getInterviewCommonPrompt()}
  `;

  return {
    role: ChatCompletionRequestMessageRoleEnum.System,
    content,
  };
};

const getFirstInterviewMessage = (): ChatCompletionRequestMessage => {
  return {
    role: ChatCompletionRequestMessageRoleEnum.User,
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
  const { job, applicant, interviewType, messages } = requestData;

  if (env.SKIP_AI) {
    await delay(1000);
    return new Response(
      await getFakeAiResponse("test interview message\n\nanother line*END*")
    );
  }

  const requestMessages = [
    getInterviewSystemMessage(interviewType, job, applicant),
    getFirstInterviewMessage(),
    ...messages,
  ];

  const stream = await OpenAI("chat", {
    model: "gpt-3.5-turbo",
    messages: requestMessages,
  });

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};
