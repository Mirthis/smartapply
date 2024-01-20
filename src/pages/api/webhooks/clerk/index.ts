import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const evt = req.body as WebhookEvent;
  switch (evt.type) {
    case "user.created": // this is typed
      const userEmail = evt.data.email_addresses[0]?.email_address;
      const userId = evt.data.id;
      // create stripe user, needed for trial and future subscriptions
      const stripeCustomer: Stripe.Customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          clerkIUserId: userId,
        },
      });
      const stripeId = stripeCustomer.id;
      console.log("New Stripe customer created: ", stripeId);

      // create user in app db
      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail,
          stripeId,
        },
      });
      console.log("New user created: ", user.id);

      // FIXME: add default price field to db and retrieve from there
      const priceId = "price_1NVE8uJ8kIO1cCrZFmbcdiJC";

      // create trial subscription
      const trialSubscription = await stripe.subscriptions.create({
        customer: stripeId,
        items: [{ price: priceId }],
        trial_period_days: Number(env.STRIPE_TRIAL_PERIOD_DAYS),
        trial_settings: {
          end_behavior: {
            missing_payment_method: "cancel",
          },
        },
      });
      console.log("New trial subscription created: ", trialSubscription.id);

      return res.status(200).json(user);
    default:
      console.warn("Clerk webhooks - unhandled event type: ", evt.type);
      return res.status(200).send("ok");
  }
};

export default handler;
