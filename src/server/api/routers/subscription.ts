import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const subscriptionRouter = createTRPCRouter({
  getAllByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // return profile by id
      const subscriptions = await ctx.prisma.subscription.findMany({
        where: {
          userId: input.userId,
        },
      });
      return subscriptions;
    }),
  getActiveByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // return profile by id
      const subscription = await ctx.prisma.subscription.findFirst({
        where: {
          userId: input.userId,
          status: "active",
        },
        include: {
          price: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          currentPeriodEnd: "desc",
        },
      });
      return subscription;
    }),
});
