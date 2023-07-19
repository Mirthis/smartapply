import { createTRPCRouter } from "~/server/api/trpc";

import { applicantRouter } from "./routers/applicant";
import { applicationRouter } from "./routers/application";
import { contactRouter } from "./routers/contact";
import { coverLettersRouter } from "./routers/coverLetters";
import { interviewRouter } from "./routers/interview";
import { productRouter } from "./routers/product";
import { stripeRouter } from "./routers/stripe";
import { subscriptionRouter } from "./routers/subscription";
import { testRouter } from "./routers/test";
import { userRouter } from "./routers/user";

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
  profile: userRouter,
  contact: contactRouter,
  application: applicationRouter,
  stripe: stripeRouter,
  subscription: subscriptionRouter,
  product: productRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
