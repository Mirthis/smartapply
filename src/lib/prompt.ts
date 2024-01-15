import { type ApplicationRequestData } from "~/types/types";

export const getJobDetailsPrompt = (application: ApplicationRequestData) => {
  const applicant = application.applicant;
  const company = application.companyName ?? "unspecified company";

  let prompt = `Job details are as follows: ${
    application.companyName ? `Compnay name: ${company}` : ""
  }.
  ${
    application.companyDetails
      ? `Company details: ${application.companyDetails}`
      : ""
  }
  Job title: ${application.title}.
  Job description: ${application.description}
  `;
  if (applicant) {
    const applicantName =
      applicant.firstName || applicant.lastName
        ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`
        : undefined;

    prompt += `Applicant details are as follows:
    ${applicantName ? `Name: ${applicantName}` : ""}
    ${applicant.jobTitle ? `Job Title: ${applicant.jobTitle}` : ""}
    ${applicant.resume ? `Summary resume:  ${applicant.resume}` : ""}
    ${applicant.skills ? `Skills: ${applicant.skills}` : ""}
    ${applicant.experience ? `Experience: ${applicant.experience}` : ""}`;
  }

  return prompt;
};
