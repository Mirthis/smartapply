import { createTRPCRouter } from "~/server/api/trpc";
import { coverLettersRouter } from "./routers/coverLetters";
import { interviewRouter } from "./routers/interview";
import { testRouter } from "./routers/test";
import { applicantRouter } from "./routers/applicant";
import { profileRouter } from "./routers/profile";
import { contactRouter } from "./routers/contact";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
