import { z } from "zod";

import { InterviewType } from "./types";

const COMPANY_NAME_MIN_LENGTH = 2;
const COMPANY_NAME_MAX_LENGTH = 20;
const COMPANY_DESC_MIN_LENGTH = 20;
export const COMPANY_DESC_MAX_LENGTH = 5000;
const JOB_TITLE_MIN_LENGTH = 5;
const JOB_TITLE_MAX_LENGTH = 50;
const JD_MIN_LENGTH = 20;
export const JD_MAX_LENGTH = 5000;

export const jobSchema = z.object({
  id: z.string().nullish(),
  title: z
    .string()
    .min(JOB_TITLE_MIN_LENGTH, {
      message: `Job title must be at least ${JOB_TITLE_MIN_LENGTH} characters`,
    })
    .max(JOB_TITLE_MAX_LENGTH, {
      message: `Job title can be maximum ${JOB_TITLE_MAX_LENGTH} characters`,
    }),
  description: z
    .string()
    .min(JD_MIN_LENGTH, {
      message: `Job description must be at least ${JD_MIN_LENGTH} characters`,
    })
    .max(JD_MAX_LENGTH, {
      message: `Job description can be maximum ${JD_MAX_LENGTH} characters`,
    }),
  companyName: z.union([
    z
      .string()
      .min(COMPANY_NAME_MIN_LENGTH, {
        message: `Company name must be at least ${COMPANY_NAME_MIN_LENGTH} characters`,
      })
      .max(COMPANY_NAME_MAX_LENGTH, {
        message: `Company name can be maximum ${COMPANY_NAME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  companyDetails: z.union([
    z
      .string()
      .min(COMPANY_DESC_MIN_LENGTH, {
        message: `Company description must be at least ${COMPANY_DESC_MIN_LENGTH} characters`,
      })
      .max(COMPANY_DESC_MAX_LENGTH, {
        message: `Company description can be maximum ${COMPANY_DESC_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),
});

export const appplicationSchema = z.object({
  id: z.string().nullish(),
  title: z
    .string()
    .min(JOB_TITLE_MIN_LENGTH, {
      message: `Job title must be at least ${JOB_TITLE_MIN_LENGTH} characters`,
    })
    .max(JOB_TITLE_MAX_LENGTH, {
      message: `Job title can be maximum ${JOB_TITLE_MAX_LENGTH} characters`,
    }),
  description: z
    .string()
    .min(JD_MIN_LENGTH, {
      message: `Job description must be at least ${JD_MIN_LENGTH} characters`,
    })
    .max(JD_MAX_LENGTH, {
      message: `Job description can be maximum ${JD_MAX_LENGTH} characters`,
    }),
  companyName: z.union([
    z
      .string()
      .min(COMPANY_NAME_MIN_LENGTH, {
        message: `Company name must be at least ${COMPANY_NAME_MIN_LENGTH} characters`,
      })
      .max(COMPANY_NAME_MAX_LENGTH, {
        message: `Company name can be maximum ${COMPANY_NAME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  companyDetails: z.union([
    z
      .string()
      .min(COMPANY_DESC_MIN_LENGTH, {
        message: `Company description must be at least ${COMPANY_DESC_MIN_LENGTH} characters`,
      })
      .max(COMPANY_DESC_MAX_LENGTH, {
        message: `Company description can be maximum ${COMPANY_DESC_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),
  applicantId: z.string().min(1),
});

const APPL_FIRST_NAME_MIN_LENGTH = 2;
const APPL_FIRST_NAME_MAX_LENGTH = 20;
const APPL_LAST_NAME_MIN_LENGTH = 2;
const APPL_LAST_NAME_MAX_LENGTH = 20;
const APPL_TITLE_MIN_LENGTH = 5;
const APPL_TITLE_MAX_LENGTH = 50;
const APPL_RESUME_MIN_LENGTH = 100;
export const APPL_RESUME_MAX_LENGTH = 2000;
const APPL_SKILLS_MIN_LENGTH = 10;
export const APPL_SKILLS_MAX_LENGTH = 1000;
const APPL_EXP_MIN_LENGTH = 50;
export const APPL_EXP_MAX_LENGTH = 2000;

export const applicantSchema = z.object({
  id: z.string().nullish(),
  firstName: z
    .string()
    .min(APPL_FIRST_NAME_MIN_LENGTH, {
      message: `First name must be at least ${APPL_FIRST_NAME_MIN_LENGTH} characters`,
    })
    .max(APPL_FIRST_NAME_MAX_LENGTH, {
      message: `First name can be maximum ${APPL_FIRST_NAME_MAX_LENGTH} characters`,
    }),

  lastName: z
    .string()
    .min(APPL_LAST_NAME_MIN_LENGTH, {
      message: `Last name must be at least ${APPL_LAST_NAME_MIN_LENGTH} characters`,
    })
    .max(APPL_LAST_NAME_MAX_LENGTH, {
      message: `Last name can be maximum ${APPL_LAST_NAME_MAX_LENGTH} characters`,
    }),

  jobTitle: z
    .string()
    .min(APPL_TITLE_MIN_LENGTH, {
      message: `Title must be at least ${APPL_TITLE_MIN_LENGTH} characters`,
    })
    .max(APPL_TITLE_MAX_LENGTH, {
      message: `Title can be maximum ${APPL_TITLE_MAX_LENGTH} characters`,
    }),

  resume: z
    .string()
    .min(APPL_RESUME_MIN_LENGTH, {
      message: `Resume must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
    })
    .max(APPL_RESUME_MAX_LENGTH, {
      message: `Resume can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
    }),

  skills: z.union([
    z
      .string()
      .min(APPL_SKILLS_MIN_LENGTH, {
        message: `Skills must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
      })
      .max(APPL_SKILLS_MAX_LENGTH, {
        message: `Skills can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  experience: z.union([
    z
      .string()
      .min(APPL_EXP_MIN_LENGTH, {
        message: `Experience must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
      })
      .max(APPL_EXP_MAX_LENGTH, {
        message: `Experience can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  isMain: z.boolean(),
});

export const applicationRequestSchema = appplicationSchema.merge(
  z.object({
    applicant: applicantSchema,
  })
);

export const contactFormSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  subject: z.string().min(5).max(50),
  message: z.string().min(10).max(500),
});

export const interviewRequestSchema = z.object({
  application: applicationRequestSchema,
  interviewType: z.nativeEnum(InterviewType),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  // text: z.string(),
});
