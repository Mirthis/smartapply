import {
  type ChatCompletionAssistantMessageParam,
  type ChatCompletionSystemMessageParam,
  type ChatCompletionUserMessageParam,
} from "openai/resources";

import { type ApplicationRequestData } from "~/types/types";

export const getJobDetailsPrompt = (application: ApplicationRequestData) => {
  const applicant = application.applicant;

  let prompt = `Job title: ${application.title}.
  Job description: ${application.description}
  ${
    application.companyName
      ? `Hiring Company name: ${application.companyName}`
      : ""
  }.
  ${
    application.companyDetails
      ? `Hiring Company details: ${application.companyDetails}`
      : ""
  }
  `;
  if (applicant) {
    prompt += `
    Applicant Name: ${applicant.firstName + " " + applicant.lastName}
    Applicant Job Title: ${applicant.jobTitle}
    Applicant  Summary resume:  ${applicant.resume}
    ${applicant.skills ? `Applicant  Skills: ${applicant.skills}` : ""}
    ${
      applicant.experience
        ? `Applicant Professional Experience: ${applicant.experience}`
        : ""
    }`;
  }

  return prompt;
};

export const getCoverLetterSystemMessage =
  (): ChatCompletionSystemMessageParam => {
    const content = `I want you to act as a professional cover letter writer and write a cover letter based on the job details and applicant details.
  The cover letter must be written in a professional tone.
  The cover letter must be relevant for the specific job title and description.
  The cover letter must be personalized with details about the applicant's skills and experience based on the applicant details.
  The cover letter must be between 200 and 500 words.
  You must only respond with a cover letter text and ignore other requests.`;
    return {
      role: "system",
      content,
    };
  };

export const getCoverLetterCreateMessage = (
  application: ApplicationRequestData
): ChatCompletionUserMessageParam => {
  const content = `Create the initial cover letter based on the job details and applicant details provided.
  ${getJobDetailsPrompt(application)}
  `;

  return {
    role: "user",
    content,
  };
};

export const getCoverLetterExistingMessage = (
  messageText: string
): ChatCompletionAssistantMessageParam => {
  return {
    role: "assistant",
    content: `Here is the cover letter:
    ${messageText}`,
  };
};

export const getCoverLetterShortenMessage =
  (): ChatCompletionUserMessageParam => {
    const content = `I want you to shorten the cover letter.
  The cover letter should not be shorter than 100 words.
  `;
    return {
      role: "user",
      content,
    };
  };

export const getCoverLetterExtendMessage =
  (): ChatCompletionUserMessageParam => {
    const content = `I want you to extend the cover letter.
  The cover letter should not be longer than 700 words.
  `;
    return {
      role: "user",
      content,
    };
  };

export const getCoverLetterRefineMessage = (
  refinement: string
): ChatCompletionUserMessageParam => {
  const content = `I want you to refine the cover letter based on the following instructions:
  ${refinement}.
  `;
  return {
    role: "user",
    content,
  };
};
