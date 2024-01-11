import { z } from "zod";

import { applicantSchema } from "~/types/schemas";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const applicantRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicant: applicantSchema,
        setAsMain: z.boolean().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // if appliocant.id is null, create new applicant in db, otherwise update existing applicant
      // return applicant
      const isMain = input?.setAsMain ?? true;
      const applicant = input.applicant;
      const userId = ctx.auth.userId;
      const queryData = {
        userId: userId,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        jobTitle: applicant.jobTitle,
        resume: applicant.resume,
        experience: applicant.experience,
        skills: applicant.skills,
      };

      // Check that id exists and userId is the same as the userId in the applicant
      if (applicant.id) {
        await ctx.prisma.applicant.findUniqueOrThrow({
          where: {
            id_userId: {
              id: applicant.id,
              userId: userId,
            },
          },
        });
      }

      if (isMain) {
        await ctx.prisma.applicant.updateMany({
          where: {
            userId: userId,
          },
          data: {
            isMain: false,
          },
        });
      }

      const returnApplicant = await ctx.prisma.applicant.upsert({
        where: {
          id: applicant.id ?? "N/A",
        },
        update: {
          ...queryData,
          isInProfile: true,
          isMain: isMain,
        },
        create: {
          ...queryData,
          isInProfile: true,
          isMain: isMain,
        },
      });

      return returnApplicant;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // return applicant with id
      const applicant = await ctx.prisma.applicant.findUnique({
        where: {
          id: input.id,
        },
      });
      return applicant;
    }),

  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // return applicant with id
      const applicant = await ctx.prisma.applicant.findMany({
        where: {
          userId: input.userId,
        },
      });
      return applicant;
    }),

  getForLoggedUser: protectedProcedure
    .input(z.object({ isInProfile: z.boolean() }).optional())
    .query(async ({ ctx, input }) => {
      const isInProfile = input?.isInProfile ?? true;
      // return applicant with id
      const userId = ctx.auth.userId;
      const applicant = await ctx.prisma.applicant.findMany({
        where: {
          userId: userId,
          isInProfile: isInProfile,
        },
      });
      return applicant;
    }),

  setAsMain: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // return applicant with id  and set as main
      const userId = ctx.auth.userId;

      await ctx.prisma.applicant.updateMany({
        where: {
          userId: userId,
        },
        data: {
          isMain: false,
        },
      });

      const applicant = await ctx.prisma.applicant.update({
        where: {
          id_userId: {
            id: input.id,
            userId: userId,
          },
        },
        data: {
          isMain: true,
        },
      });
      return applicant;
    }),

  deleteFromProfile: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // return applicant with id
      const userId = ctx.auth.userId;
      const applicant = await ctx.prisma.applicant.delete({
        where: {
          id_userId: {
            id: input.id,
            userId: userId,
          },
        },
      });
      return applicant;
    }),
});
