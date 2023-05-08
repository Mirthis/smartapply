import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // return profile by id
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          id: input.id,
        },
      });
      return profile;
    }),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // return profile by userId
      const profile = await ctx.prisma.profile.findUnique({
        where: {
          userId: input.userId,
        },
      });
      return profile;
    }),
});
