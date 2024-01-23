// import { getAuth } from "@clerk/nextjs/server";
// import {
//   type ChatCompletionRequestMessage,
//   ChatCompletionRequestMessageRoleEnum,
// } from "openai";
// import { OpenAI } from "openai-streams";

// import { type NextRequest } from "next/server";

// import { env } from "~/env.mjs";
// import { MAX_INTERVIEW_PHASE_1_MESSAGES } from "~/lib/constants";
// import { getJobDetailsPrompt } from "~/lib/prompt";
// import { getFakeAiResponse } from "~/lib/utils";
// import { interviewRequestSchema } from "~/types/schemas";
// import { type ApplicationRequestData, InterviewType } from "~/types/types";

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// const getInterviewCommonPrompt = () => {
//   return `
//   Your focus will be to determine if the applicant is a good fit for the job
//   You should ask the applicant one interview question at a time.
//   You should not ask the same question twice.
//   If the applicant ask questions you should say that you will answer them at the end of the interview.
//   `;
// };

// const getInterviewHRPrompt = () => {
//   return [
//     "I want you to act as an experienced human resources professional and interview the applicant",
//     "You will not got to much into the technical details of the job and focus instead on the soft skills required by role",
//   ];
// };

// const getInterviewTechPrompt = () => {
//   return [
//     "I want you to act as a senior technology professional and interview the applicant",
//     "You will focus on the technical aspect of the job and the hard skills required by role",
//   ];
// };

// const getInterviewLeadPrompt = () => {
//   return [
//     "I want you to act as a leadership team member and interview the applicant",
//     "You will focus on the applicant leadership skills and how they will fit in the team",
//   ];
// };

// const getInterviewClosedMessage = () => {
//   return {
//     role: ChatCompletionRequestMessageRoleEnum.System,
//     content: `Povide feedback on the last answer provided by the applicant.
//       Then close the interview by providing feedback to the applicant on the overall interview.
//       The message should end with the text '*END*'`,
//   };
// };

// const getInterviewSystemMessage = (
//   type: InterviewType,
//   application: ApplicationRequestData
// ) => {
//   let specicifPromt: string[] = [];
//   switch (type) {
//     case InterviewType.hr:
//       specicifPromt = getInterviewHRPrompt();
//       break;
//     case InterviewType.lead:
//       specicifPromt = getInterviewLeadPrompt();
//       break;
//     case InterviewType.tech:
//       specicifPromt = getInterviewTechPrompt();
//       break;
//   }

//   const content = `${specicifPromt[0] || ""}.
//   ${getJobDetailsPrompt(application)}.
//   ${specicifPromt[1] || ""}.
//   ${getInterviewCommonPrompt()}
//   `;

//   return {
//     role: ChatCompletionRequestMessageRoleEnum.System,
//     content,
//   };
// };

// const getFirstInterviewMessage = (): ChatCompletionRequestMessage => {
//   return {
//     role: ChatCompletionRequestMessageRoleEnum.User,
//     content: "Hello, I'm here for the interview",
//   };
// };

// export default async function handler(request: NextRequest) {
//   // const requestData = requestSchema.parse(await request.());
//   const { userId } = getAuth(request);
//   if (!userId) {
//     return new Response("Unauthorized", { status: 401 });
//   }

//   const requestData = interviewRequestSchema.parse(await request.json());
//   const { application, interviewType, messages } = requestData;

//   if (env.SKIP_AI) {
//     await delay(1000);
//     return new Response(
//       await getFakeAiResponse("test interview message\n\nanother line*END*")
//     );
//   }

//   const requestMessages = [
//     getInterviewSystemMessage(interviewType, application),
//     getFirstInterviewMessage(),
//     ...messages,
//   ];

//   if (messages.length > MAX_INTERVIEW_PHASE_1_MESSAGES) {
//     requestMessages.push(getInterviewClosedMessage());
//   }

//   const stream = await OpenAI("chat", {
//     model: "gpt-3.5-turbo",
//     messages: requestMessages,
//   });

//   return new Response(stream);
// }

// export const config = {
//   runtime: "edge",
// };
