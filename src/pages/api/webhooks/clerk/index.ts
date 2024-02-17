import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { buffer } from "micro";
// import Stripe from "stripe";
import { Webhook } from "svix";

import { type NextApiRequest, type NextApiResponse } from "next";

// import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

// const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
//   // https://github.com/stripe/stripe-node#configuration
//   apiVersion: "2023-10-16",
// });

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405);
  }
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occured -- no svix headers" });
  }

  // Get the body
  const body = (await buffer(req)).toString();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return res.status(400).json({ Error: err });
  }

  switch (evt.type) {
    case "user.created": // this is typed
      const userEmail = evt.data.email_addresses[0]?.email_address;
      const userId = evt.data.id;

      const user = await prisma.user.create({
        data: {
          id: userId,
          email: userEmail,
          // stripeId,
        },
      });
      console.log("New user created: ", user.id);

      // FIXME: add default price field to db and retrieve from there
      // const priceId = "price_1NVE8uJ8kIO1cCrZFmbcdiJC";

      // create trial subscription
      // const trialSubscription = await stripe.subscriptions.create({
      //   customer: stripeId,
      //   items: [{ price: priceId }],
      //   trial_period_days: Number(env.STRIPE_TRIAL_PERIOD_DAYS),
      //   trial_settings: {
      //     end_behavior: {
      //       missing_payment_method: "cancel",
      //     },
      //   },
      // });
      // console.log("New trial subscription created: ", trialSubscription.id);

      return res.status(200).json(user);
    default:
      console.warn("Clerk webhooks - unhandled event type: ", evt.type);
      return res.status(200).send("ok");
  }
};

export default handler;
