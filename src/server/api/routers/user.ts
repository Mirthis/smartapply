import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getOnboardingState: protectedProcedure.query(async ({ ctx }) => {
    const applicant = await ctx.prisma.applicant.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
    });
    const application = await ctx.prisma.application.findFirst({
      where: {
        userId: ctx.auth.userId,
      },
    });
    return {
      hasApplicant: !!applicant,
      hasApplication: !!application,
    };
    // return {
    //   hasApplicant: true,
    //   hasApplication: true,
    // };
  }),
});
