import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";

import { env } from "~/env.mjs";
import { Plan } from "~/types/types";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

const getPlanPriceId = (plan: Plan) => {
  switch (plan) {
    case Plan.Monthly:
      return env.STRIPE_PRICE_ID_MONTHLY;
    case Plan.Yearly:
      return env.STRIPE_PRICE_ID_YEARLY;
    case Plan.Lifetime:
      return env.STRIPE_PRICE_ID_LIFETIME;
    default:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect plan.",
      });
  }
};

export const stripeRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    // .input(z.object({ id: z.string() }))
    .input(z.object({ plan: z.nativeEnum(Plan) }))
    .mutation(async ({ ctx, input }) => {
      const price = getPlanPriceId(input.plan);

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
      console.log("Stripe customer ID: ", stripeId);

      try {
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          mode: input.plan == Plan.Lifetime ? "payment" : "subscription",
          payment_method_types: ["card"],
          customer: stripeId,
          line_items: [
            {
              price,
              quantity: 1,
            },
          ],
          success_url: `${env.WEBSITE_URL}/checkoutResult?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.WEBSITE_URL}/upgrade`,
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
      return_url: `${env.WEBSITE_URL}/subscription`,
    });
    return url;
  }),
});
