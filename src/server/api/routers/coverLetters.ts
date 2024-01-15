import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const coverLettersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        text: z.string(),
        label: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // insert new cover letter
      const coverLetter = await ctx.prisma.coverLetter.create({
        data: {
          userId: ctx.auth.userId,
          text: input.text,
          label: input.label,
          application: {
            connect: {
              id: input.applicationId,
            },
          },
        },
      });

      return coverLetter;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const coverLetter = await ctx.prisma.coverLetter.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (coverLetter.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this application",
        });
      }

      return coverLetter;
    }),

  getAll: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const coverLetters = await ctx.prisma.coverLetter.findMany({
        where: {
          userId: ctx.auth.userId,
          applicationId: input.applicationId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return coverLetters;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coverLetter = await ctx.prisma.coverLetter.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      if (coverLetter.userId !== ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this application",
        });
      }

      const deleted = await ctx.prisma.coverLetter.delete({
        where: {
          id: input.id,
        },
      });

      return deleted;
    }),

  deleteAll: protectedProcedure
    .input(z.object({ applicationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const coverLetters = await ctx.prisma.coverLetter.deleteMany({
        where: {
          userId: ctx.auth.userId,
          applicationId: input.applicationId,
        },
      });

      return coverLetters;
    }),
});
