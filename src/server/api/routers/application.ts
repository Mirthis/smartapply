import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { applicantSchema, jobSchema } from "~/types/schemas";
import { TRPCError } from "@trpc/server";

export const applicationRouter = createTRPCRouter({
  createOrUpdateOld: protectedProcedure
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

  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicationId: z.string().optional(),
        applicant: applicantSchema.optional(),
        job: jobSchema.optional(),
        applicantId: z.string().optional(),
        jobId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;

      let applicantId: string;
      // if applicant id provided check applicant exists in db for the user
      if (input.applicantId) {
        await ctx.prisma.applicant.findUniqueOrThrow({
          where: {
            id_userId: {
              id: input.applicantId,
              userId,
            },
          },
        });
        applicantId = input.applicantId;
      }
      // if applicant id not provided create a new one
      else if (input.applicant) {
        // count number of applicants for user
        const profileApplicants = await ctx.prisma.applicant.count({
          where: {
            userId,
          },
        });

        // if no applicant in profile add the current one to proifle and set as main
        const isMain = profileApplicants === 0;
        const isInProfile = profileApplicants === 0;

        const newApplicant = await ctx.prisma.applicant.create({
          data: {
            userId,
            firstName: input.applicant.firstName,
            lastName: input.applicant.lastName,
            jobTitle: input.applicant.jobTitle,
            resume: input.applicant.resume,
            experience: input.applicant.experience,
            skills: input.applicant.skills,
            isMain,
            isInProfile,
          },
        });
        applicantId = newApplicant.id;
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "applicantId or applicant must be provided",
        });
      }
      let jobId: string;
      // if job id provided check job exists in db for the user
      if (input.jobId) {
        await ctx.prisma.job.findUniqueOrThrow({
          where: {
            id_userId: {
              id: input.jobId,
              userId,
            },
          },
        });
        jobId = input.jobId;
      }
      // if job id not provided create a new one
      else if (input.job) {
        const newJob = await ctx.prisma.job.create({
          data: {
            title: input.job.title,
            description: input.job.description,
            companyName: input.job.companyName,
            companyDetails: input.job.companyDetails,
            userId,
          },
        });
        jobId = newJob.id;
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "jobId or job must be provided",
        });
      }
      // create application
      const applicaitonId = input.applicationId ?? "N/A ";
      const application = await ctx.prisma.application.upsert({
        where: {
          id: applicaitonId,
        },
        create: {
          job: {
            connect: {
              id: jobId,
            },
          },
          applicant: {
            connect: {
              id: applicantId,
            },
          },
          userId,
        },
        update: {
          job: {
            connect: {
              id: jobId,
            },
          },
          applicant: {
            connect: {
              id: applicantId,
            },
          },
        },
        include: {
          job: true,
          applicant: true,
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
