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
import { usersRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  applicant: applicantRouter,
  application: applicationRouter,
  contact: contactRouter,
  coverLetters: coverLettersRouter,
  interview: interviewRouter,
  product: productRouter,
  stripe: stripeRouter,
  subscription: subscriptionRouter,
  test: testRouter,

  user: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
