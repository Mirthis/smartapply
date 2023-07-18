/* eslint-disable @typescript-eslint/no-misused-promises */
import type Stripe from "stripe";

import { type NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import getStripe from "~/utils/getStipe";

import { BasicCard } from "~/components";

import { Plan } from "~/types/types";

const UpgradePage: NextPage = () => {
  const { mutateAsync: createCheckout } =
    api.stripe.createCheckout.useMutation();

  // TODO: Add proper error handling
  const handleUpgrade = async (plan: Plan) => {
    // Create a Checkout Session.
    const checkoutSession: Stripe.Checkout.Session = await createCheckout({
      plan,
    });
    // Redirect to Checkout.
    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSession.id,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>SmartApply - Upgrade</title>
        <meta property="og:title" content="SmartApply - Upgrade" key="title" />
      </Head>
      <div className="flex flex-col items-center justify-center gap-y-8">
        {/* Hero */}
        <BasicCard
          title="Monthly"
          description="$10/month"
          onClick={() => handleUpgrade(Plan.Monthly)}
        />
        <BasicCard
          title="Yearly"
          description="$100/year"
          onClick={() => handleUpgrade(Plan.Yearly)}
        />
        <BasicCard
          title="Lifetime"
          description="$100/year"
          onClick={() => handleUpgrade(Plan.Lifetime)}
        />

        <p className="text-center">
          <span className="font-bold">Note:</span> You will be redirected to
          Stripe to complete the upgrade.
        </p>
      </div>
    </>
  );
};

export default UpgradePage;
