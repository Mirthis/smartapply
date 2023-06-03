import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { TRPCError } from "@trpc/server";

export const applicationRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicant: applicantSchema,
        job: jobSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { job, applicant } = input;
      const userId = ctx.auth.userId;
      let applicantId: string;
      // if applicant id provided check applicant exists in db for the user
      if (applicant.id) {
        await ctx.prisma.applicant.findUniqueOrThrow({
          where: {
            id_userId: {
              id: applicant.id,
              userId,
            },
          },
        });
        applicantId = applicant.id;
      }
      // if applicant id not provided create a new one
      else {
        const newApplicant = await ctx.prisma.applicant.create({
          data: {
            userId,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            jobTitle: applicant.jobTitle,
            resume: applicant.resume,
            experience: applicant.experience,
            skills: applicant.skills,
          },
        });
        applicantId = newApplicant.id;
      }

      // create application and job
      const application = await ctx.prisma.application.create({
        data: {
          job: {
            create: {
              title: job.title,
              description: job.description,
              companyName: job.companyName,
              companyDetails: job.companyDetails,
              userId,
            },
          },
          applicant: {
            connect: {
              id: applicantId,
            },
          },
          userId,
        },
      });
      return application;
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      const id = input.id;
      const application = await ctx.prisma.application.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          job: true,
          applicant: true,
        },
      });
      if (application.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this application",
        });
      }
      return application;
    }),

  getAllForUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.userId;
    const applications = await ctx.prisma.application.findMany({
      where: {
        userId,
      },
      include: {
        job: true,
        applicant: true,
      },
    });
    return applications;
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      const id = input.id;
      const application = await ctx.prisma.application.findUniqueOrThrow({
        where: {
          id,
        },
      });
      if (application.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this application",
        });
      }
      await ctx.prisma.application.delete({
        where: {
          id,
        },
      });
      return true;
    }),
});
