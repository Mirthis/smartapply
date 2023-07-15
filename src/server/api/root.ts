import { createTRPCRouter } from "~/server/api/trpc";

import { applicantRouter } from "./routers/applicant";
import { applicationRouter } from "./routers/application";
import { contactRouter } from "./routers/contact";
import { coverLettersRouter } from "./routers/coverLetters";
import { interviewRouter } from "./routers/interview";
import { profileRouter } from "./routers/profile";
import { stripeRouter } from "./routers/stripe";
import { testRouter } from "./routers/test";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  coverLetters: coverLettersRouter,
  interview: interviewRouter,
  test: testRouter,
  applicant: applicantRouter,
  profile: profileRouter,
  contact: contactRouter,
  application: applicationRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
