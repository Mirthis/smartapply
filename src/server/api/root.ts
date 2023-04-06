import { createTRPCRouter } from "~/server/api/trpc";
import { coverLettersRouter } from "./routers/coverLetters";
import { interviewRouter } from "./routers/interview";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  coverLetters: coverLettersRouter,
  interview: interviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
