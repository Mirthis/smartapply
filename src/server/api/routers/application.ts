import { TRPCError } from "@trpc/server";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { z } from "zod";

import { openaiClient } from "~/lib/openai";
import { type PrismaClientType } from "~/server/db";
import { jobSchema } from "~/types/schemas";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const deleteOrphans = async (prisma: PrismaClientType, userId: string) => {
  await prisma.applicant.deleteMany({
    where: {
      userId,
      applications: {
        none: {},
      },
      isInProfile: false,
    },
  });
};

export const applicationRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        applicationId: z.string().optional(),
        job: jobSchema,
        applicantId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      const { applicantId, job, applicationId } = input;

      // if applicant id provided check applicant exists in db for the user
      await ctx.prisma.applicant.findUniqueOrThrow({
        where: {
          id_userId: {
            id: input.applicantId,
            userId,
          },
        },
        select: {
          id: true,
        },
      });

      if (applicationId) {
        await ctx.prisma.application.findUniqueOrThrow({
          where: {
            id_userId: {
              id: applicationId,
              userId,
            },
          },
          select: {
            id: true,
          },
        });
      }

      // create our update job
      const response = await openaiClient.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            content: `Provide a comma separated list of the top 10 skills that should be used to test a candidate for the following job:
  Job Title: ${input.job.title},
  Job Description: ${input.job.description}
  Only return the list no other text should be included.`,
            role: ChatCompletionRequestMessageRoleEnum.User,
          },
        ],
      });

        const skillsSummary = response.data.choices[0]?.message?.content;
        if (!skillsSummary) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Unable to generate skills summary",
          });
        }

        // console.log("GPT3 Skill summary");
        // console.log(skillsSummary);

        const newJob = await ctx.prisma.job.create({
          data: {
            title: input.job.title,
            description: input.job.description,
            companyName: input.job.companyName,
            companyDetails: input.job.companyDetails,
            skillsSummary,
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
          id: applicationId ?? "N/A ",
        },
        create: {
          title: job.title,
          description: job.description,
          companyName: job.companyName,
          companyDetails: job.companyDetails,
          skillsSummary,

          applicant: {
            connect: {
              id: applicantId,
            },
          },
          userId,
        },
        update: {
          title: job.title,
          description: job.description,
          companyName: job.companyName,
          companyDetails: job.companyDetails,
          skillsSummary,
          applicant: {
            connect: {
              id: applicantId,
            },
          },
        },
        include: {
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
      await deleteOrphans(ctx.prisma, userId);

      return true;
    }),
});
