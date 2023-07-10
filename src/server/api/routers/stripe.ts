import { createTRPCRouter, protectedProcedure } from "../trpc";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

export const stripeRouter = createTRPCRouter({
  createCheckout: protectedProcedure
    // .input(z.object({ id: z.string() }))
    .mutation(async () => {
      try {
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          mode: "payment",
          line_items: [
            {
              price: env.STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],
          success_url: `${env.WEBSITE_URL}/checkoutResult?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.WEBSITE_URL}/upgrade`,
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
});
