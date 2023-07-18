import { buffer } from "micro";
import Cors from "micro-cors";
import Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2022-11-15",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});

const toDateTime = (secs: number) => {
  const t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string
) => {
  // retrieve user based on stripe user id
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      stripeId: customerId,
    },
  });

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  // create or update subscription
  const data = {
    id: subscription.id,
    userId: user.id,
    status: subscription.status,
    priceId: subscription.items?.data[0]?.price.id ?? null,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    currentPeriodStart: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    currentPeriodEnd: toDateTime(subscription.current_period_end).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    endedAt: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
  };

  const dbSubscription = await prisma.subscription.upsert({
    where: {
      id: subscription.id,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
    },
  });
  return dbSubscription;
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    if (!sig) return res.status(400).send("Webhook Error: No signature");

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      // On error, log and return the error message.
      if (err instanceof Error) console.log(err);
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    // Successfully constructed event.
    console.log("✅ Success:", event.id, event.type);

    // Cast event data to Stripe object.

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("subscription event", event.type);
        const subscription = event.data.object as Stripe.Subscription;

        await manageSubscriptionStatusChange(
          subscription.id,
          subscription.customer as string
        );
        break;
      case "checkout.session.completed":
        console.log("checkout.session.completed");
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.mode === "subscription") {
          const subscriptionId = checkoutSession.subscription;
          await manageSubscriptionStatusChange(
            subscriptionId as string,
            checkoutSession.customer as string
          );
        }
        break;
      default:
        console.log("Unmanaged event");
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default cors(webhookHandler as any);
