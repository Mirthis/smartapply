import { buffer } from "micro";
import Cors from "micro-cors";
import Stripe from "stripe";

import { type NextApiRequest, type NextApiResponse } from "next";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2023-10-16",
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
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null,
    metadata: subscription.metadata,
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
  console.log(`Subscription inserted/updated: ${subscription.id}`);
  return dbSubscription;
};

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    defaultPriceId:
      typeof product.default_price === "string" ? product.default_price : null,
    metadata: product.metadata,
  };

  const dbProduct = await prisma.product.upsert({
    where: {
      id: product.id,
    },
    update: {
      ...productData,
    },
    create: {
      ...productData,
    },
  });
  console.log(`Product inserted/updated: ${product.id}`);
  return dbProduct;
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    id: price.id,
    productId: typeof price.product === "string" ? price.product : null,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unitAmount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    intervalCount: price.recurring?.interval_count ?? null,
    trialPeriodDays: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const dbPrice = await prisma.price.upsert({
    where: {
      id: price.id,
    },
    update: {
      ...priceData,
    },
    create: {
      ...priceData,
    },
  });

  console.log(`Price inserted/updated: ${price.id}`);
  return dbPrice;
};

const cancelTrial = async (customerId: string) => {
  const trialSub = await prisma.user.findUniqueOrThrow({
    where: {
      stripeId: customerId,
    },
    include: {
      subscriptions: {
        where: {
          status: "trialing",
        },
      },
    },
  });

  if (!trialSub.subscriptions[0]) return;
  await stripe.subscriptions.cancel(trialSub.subscriptions[0].id);
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
      if (err instanceof Error) console.error(err);
      console.error(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    switch (event.type) {
      case "product.created":
      case "product.updated":
        await upsertProductRecord(event.data.object);
        break;
      case "price.created":
      case "price.updated":
        await upsertPriceRecord(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("subscription event", event.type);
        const subscription = event.data.object;

        await manageSubscriptionStatusChange(
          subscription.id,
          subscription.customer as string
        );
        break;
      case "checkout.session.completed":
        console.log("checkout.session.completed");
        const checkoutSession = event.data.object;
        if (checkoutSession.mode === "subscription") {
          console.log("subscription checkout");
          const subscriptionId = checkoutSession.subscription;
          await manageSubscriptionStatusChange(
            subscriptionId as string,
            checkoutSession.customer as string
          );
          await cancelTrial(checkoutSession.customer as string);
        } else if (checkoutSession.mode === "payment") {
          console.log("payment checkout");
          if (checkoutSession.payment_status === "paid") {
            await prisma.user.updateMany({
              where: {
                stripeId: checkoutSession.customer as string,
              },
              data: {
                lifetimePro: true,
              },
            });
          }
        }
        break;
      default:
        console.warn("Unmanaged event: ", event.type);
    }
    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export default cors(webhookHandler as any);
