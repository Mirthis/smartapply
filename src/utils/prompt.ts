import { type ApplicantData, type JobData } from "~/types/types";

export const getJobDetailsPrompt = (
  job: JobData,
  applicant?: ApplicantData
) => {
  const company = job.companyName ?? "unspecified company";

  let prompt = `${
    job.companyName
      ? `The compnay tht applicant is applying for is ${company}`
      : ""
  }.
  ${job.companyDetails ? `The company details are ${job.companyDetails}` : ""}
  The applicant is applying for the position of ${job.jobTitle}.
  The job description is as follows: ${job.jobDescription}
  `;
  if (applicant) {
    const applicantName =
      applicant.firstName || applicant.lastName
        ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`
        : undefined;

    prompt += `Applicant details are as follows:
    ${applicantName ? `Name: ${applicantName}` : ""}
    ${applicant.jobTitle ? `Title: ${applicant.jobTitle}` : ""}
    ${applicant.resume ? `Summary resume:  ${applicant.resume}` : ""}
    ${applicant.skills ? `Skills: ${applicant.skills}` : ""}
    ${applicant.experience ? `Experience: ${applicant.experience}` : ""}`;
  }

  return prompt;
};
