import { type ApplicantData, type JobData } from "~/types/types";

export const getJobDetailsPrompt = (job: JobData, applicant: ApplicantData) => {
  const company = job.companyName ?? "unspecified company";
  const applicantName =
    applicant.firstName || applicant.lastName
      ? `${applicant.firstName ?? ""} ${applicant.lastName ?? ""}`
      : undefined;

  return `${
    job.companyName
      ? `The compnay tht applicant is applying for is ${company}`
      : ""
  }.
  ${job.companyDetails ? `The company details are ${job.companyDetails}` : ""}
  The applicant is applying for the position of ${job.jobTitle}.
  The job description is as follows: ${job.jobDescription}
  ${applicantName ? `The applicant name is ${applicantName}` : ""}
  ${applicant.title ? `The applicant title is ${applicant.title}` : ""}
  ${applicant.resume ? `The applicant resume is ${applicant.resume}` : ""}
  `;
};
