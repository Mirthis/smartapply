import { TRPCError } from "@trpc/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// import nodemailer from "nodemailer";
import { env } from "~/env.mjs";
import { validateRecaptcha } from "~/lib/utils";
import { contactFormSchema } from "~/types/schemas";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const contactRouter = createTRPCRouter({
  sendMail: publicProcedure
    .input(contactFormSchema.extend({ captchaToken: z.string() }))
    .mutation(async ({ input }) => {
      await validateRecaptcha(input.captchaToken);

      const transporter = nodemailer.createTransport({
        port: Number(env.SMTP_PORT),

        host: env.SMTP_HOST,
        auth: {
          user: env.SMTP_USERNAME,
          pass: env.SMTP_PASSWORD,
        },
        secure: true,
      });

      const emailData = {
        to: env.EMAIL_RECIPIENT, // Your email where you'll receive emails
        from: env.SMTP_USERNAME, // your website email address here
        subject: `[SmartApply.app] : ${input.subject}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html lang="en">
          <head>
            <meta charset="utf-8">
          </head>
          
          <body>
            <h3>You've got a new mail from ${input.name}, their email is: ✉️${input.email} </h3>
            <p>Message:</p>
            <p>${input.message}</p>
          </body>
          </html>`,
      };

      try {
        await transporter.sendMail(emailData);
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          message: "Mail delivery failed",
          code: "BAD_REQUEST",
        });
      }
      return true;
    }),
});
