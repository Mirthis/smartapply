import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    // return profile by id
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        id: ctx.auth.userId,
      },
      select: {
        _count: {
          select: {
            subscriptions: { where: { status: "active" } },
          },
        },
      },
    });
    return user;
  }),
});
