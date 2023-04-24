import { z } from "zod";

const COMPANY_NAME_MIN_LENGTH = 2;
const COMPANY_NAME_MAX_LENGTH = 20;
const COMPANY_DESC_MIN_LENGTH = 20;
const COMPANY_DESC_MAX_LENGTH = 5000;
const JOB_TITLE_MIN_LENGTH = 5;
const JOB_TITLE_MAX_LENGTH = 40;
const JD_MIN_LENGTH = 20;
const JD_MAX_LENGTH = 5000;

export const jobSchema = z.object({
  jobTitle: z
    .string()
    .min(JOB_TITLE_MIN_LENGTH, {
      message: `Job title must be at least ${JOB_TITLE_MIN_LENGTH} characters`,
    })
    .max(JOB_TITLE_MAX_LENGTH, {
      message: `Job title can be maximum ${JOB_TITLE_MAX_LENGTH} characters`,
    }),
  jobDescription: z
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

const APPL_FIRST_NAME_MIN_LENGTH = 3;
const APPL_FIRST_NAME_MAX_LENGTH = 20;
const APPL_LAST_NAME_MIN_LENGTH = 3;
const APPL_LAST_NAME_MAX_LENGTH = 20;
const APPL_TITLE_MIN_LENGTH = 5;
const APPL_TITLE_MAX_LENGTH = 40;
const APPL_RESUME_MIN_LENGTH = 100;
const APPL_RESUME_MAX_LENGTH = 1000;
const APPL_SKILLS_MIN_LENGTH = 50;
const APPL_SKILLS_MAX_LENGTH = 500;
const APPL_EXP_MIN_LENGTH = 100;
const APPL_EXP_MAX_LENGTH = 5000;

export const applicantSchema = z.object({
  firstName: z.union([
    z
      .string()
      .min(APPL_FIRST_NAME_MIN_LENGTH, {
        message: `First name be at least ${APPL_FIRST_NAME_MIN_LENGTH} characters`,
      })
      .max(APPL_FIRST_NAME_MAX_LENGTH, {
        message: `First name can be maximum ${APPL_FIRST_NAME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  lastName: z.union([
    z
      .string()
      .min(APPL_LAST_NAME_MIN_LENGTH, {
        message: `Last name must be at least ${APPL_LAST_NAME_MIN_LENGTH} characters`,
      })
      .max(APPL_LAST_NAME_MAX_LENGTH, {
        message: `Last name can be maximum ${APPL_LAST_NAME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  title: z.union([
    z
      .string()
      .min(APPL_TITLE_MIN_LENGTH, {
        message: `Title must be at least ${APPL_TITLE_MIN_LENGTH} characters`,
      })
      .max(APPL_TITLE_MAX_LENGTH, {
        message: `Title can be maximum ${APPL_TITLE_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  resume: z.union([
    z
      .string()
      .min(APPL_RESUME_MIN_LENGTH, {
        message: `Resume must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
      })
      .max(APPL_RESUME_MAX_LENGTH, {
        message: `Resume can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  skills: z.union([
    z
      .string()
      .min(APPL_SKILLS_MIN_LENGTH, {
        message: `Resume must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
      })
      .max(APPL_SKILLS_MAX_LENGTH, {
        message: `Resume can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),

  experience: z.union([
    z
      .string()
      .min(APPL_EXP_MIN_LENGTH, {
        message: `Resume must be at least ${APPL_RESUME_MIN_LENGTH} characters`,
      })
      .max(APPL_EXP_MAX_LENGTH, {
        message: `Resume can be maximum ${APPL_RESUME_MAX_LENGTH} characters`,
      }),
    z.string().length(0),
    z.null(),
  ]),
});
