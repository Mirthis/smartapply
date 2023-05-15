import { type ApplicantData, type JobData } from "~/types/types";

export const getJobDetailsPrompt = (
  job: JobData,
  applicant?: ApplicantData
) => {
  const company = job.companyName ?? "unspecified company";

  let prompt = `Job details are as follows: ${
    job.companyName ? `Compnay name: ${company}` : ""
  }.
  ${job.companyDetails ? `Company details: ${job.companyDetails}` : ""}
  Job title: ${job.jobTitle}.
  Job description: ${job.jobDescription}
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
