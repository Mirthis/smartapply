import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // return profile by id
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          subscriptions: true,
        },
      });
      return user;
    }),
});
