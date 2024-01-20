import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";

import { env } from "~/env.mjs";
import { absoluteUrl } from "~/lib/utils";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
});

export const stripeRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    // .input(z.object({ id: z.string() }))
    .input(z.object({ priceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: ctx.auth.userId,
        },
      });
      let stripeId = user?.stripeId;
      // create stripe customer if not present
      if (!stripeId) {
        const stripeCustomer: Stripe.Customer = await stripe.customers.create({
          email: user.email ?? undefined,
          metadata: {
            id: ctx.auth.userId,
          },
        });
        stripeId = stripeCustomer.id;
        console.log("New Stripe customer created: ", stripeId);
        await ctx.prisma.user.update({
          where: {
            id: ctx.auth.userId,
          },
          data: {
            stripeId,
          },
        });
      }

      const price = await ctx.prisma.price.findUniqueOrThrow({
        where: {
          id: input.priceId,
        },
      });

      try {
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          mode: price.type === "recurring" ? "subscription" : "payment",
          payment_method_types: ["card"],
          customer: stripeId,
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],

          success_url: absoluteUrl(
            `/checkoutResult?session_id={CHECKOUT_SESSION_ID}`
          ),
          cancel_url: absoluteUrl(`/upgrade`),
          client_reference_id: ctx.auth.userId,
        };
        const checkoutSession: Stripe.Checkout.Session =
          await stripe.checkout.sessions.create(params);

        return checkoutSession;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getCheckoutSession: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const id = input.id;
      try {
        if (!id.startsWith("cs_")) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incorrect CheckoutSession ID.",
          });
        }
        const checkout_session: Stripe.Checkout.Session =
          await stripe.checkout.sessions.retrieve(id, {
            expand: ["payment_intent"],
          });

        return checkout_session;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: errorMessage,
        });
      }
    }),
  createPortalLink: protectedProcedure.query(async ({ ctx }) => {
    const stipeCustomer = await ctx.prisma.user.findFirstOrThrow({
      where: {
        id: ctx.auth.userId,
      },
      select: {
        stripeId: true,
      },
    });
    if (!stipeCustomer.stripeId)
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Stripe customer not found.",
      });

    const { url } = await stripe.billingPortal.sessions.create({
      customer: stipeCustomer.stripeId,
      return_url: absoluteUrl(`/subscription`),
    });
    return url;
  }),
});
