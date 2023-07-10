import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { applicantSchema } from "~/types/schemas";
import { type ApplicantData } from "~/types/types";

export const applicantRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicant: applicantSchema,
        saveInProfile: z.boolean().nullish(),
        setAsMain: z.boolean().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // if appliocant.id is null, create new applicant in db, otherwise update existing applicant
      // return applicant
      const saveInProfile = input?.saveInProfile ?? false;
      const isMain = input?.setAsMain && saveInProfile ? true : false;
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

        const hasApplications = await ctx.prisma.application.count({
          where: {
            applicantId: applicant.id,
          },
        });

        // can't update profile has linked to applicaionts create a copy and remove old one
        // from profile
        if (hasApplications) {
          await ctx.prisma.applicant.update({
            where: {
              id: applicant.id,
            },
            data: {
              isInProfile: false,
              isMain: false,
            },
          });
          returnApplicant = await ctx.prisma.applicant.create({
            data: {
              ...queryData,
              isInProfile: saveInProfile,
              isMain: extApplicant.isMain,
            },
          });
        } else {
          returnApplicant = await ctx.prisma.applicant.update({
            where: {
              id: applicant.id,
            },
            data: queryData,
          });
        }

        // if id is null, create new applicant
      } else {
        // remove isMain from other applicant for this user
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

        returnApplicant = await ctx.prisma.applicant.create({
          data: {
            ...queryData,
            isInProfile: saveInProfile,
            isMain: isMain,
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

  getForLoggedUser: protectedProcedure
    .input(z.object({ isInProfile: z.boolean() }).optional())
    .query(async ({ ctx, input }) => {
      const isInProfile = input?.isInProfile ?? false;
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
      const applicant = await ctx.prisma.applicant.update({
        where: {
          id_userId: {
            id: input.id,
            userId: userId,
          },
        },
        data: {
          isInProfile: false,
        },
      });
      return applicant;
    }),
});
