import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { applicantSchema } from "~/types/schemas";
import { type ApplicantData } from "~/types/types";
import { TRPCError } from "@trpc/server";

export const applicantRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicant: applicantSchema,
        saveInProfile: z.boolean().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
      // if appliocant.id is null, create new applicant in db, otherwise update existing applicant
      // return applicant
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

      let returnApplicant: ApplicantData;

      // Check that id exists and userId is the same as the userId in the applicant
      if (applicant.id) {
        const extApplicant = await ctx.prisma.applicant.findUnique({
          where: {
            id: applicant.id,
          },
        });
        if (!extApplicant || extApplicant.userId !== userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Applicant not found",
          });
        }

        returnApplicant = await ctx.prisma.applicant.update({
          where: {
            id: applicant.id,
          },
          data: queryData,
        });
        // if id is null, create new applicant
      } else {
        returnApplicant = await ctx.prisma.applicant.create({
          data: queryData,
        });
      }
      // if saveInProfile is true, save applicantId in Profile
      if (input.saveInProfile) {
        await ctx.prisma.profile.upsert({
          where: {
            userId: userId,
          },
          update: {
            applicantId: returnApplicant.id,
          },
          create: {
            userId: userId,
            applicantId: returnApplicant.id,
          },
        });
      }
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

  getForLoggedUser: protectedProcedure.query(async ({ ctx }) => {
    // return applicant with id
    const userId = ctx.auth.userId;
    console.log({ userId });
    const applicant = await ctx.prisma.applicant.findFirst({
      where: {
        userId: userId,
        Profile: {
          userId: userId,
        },
      },
    });
    return applicant;
  }),
});
