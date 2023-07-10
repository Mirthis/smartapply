import { type NextPage } from "next";
import Head from "next/head";
import type Stripe from "stripe";
import { api } from "~/utils/api";
import getStripe from "~/utils/getStipe";

const UpgradePage: NextPage = () => {
  const { mutateAsync: createCheckout } =
    api.stripe.createCheckout.useMutation();

  // TODO: Add proper error handling
  const handleUpgrade = async () => {
    // Create a Checkout Session.
    const checkoutSession: Stripe.Checkout.Session = await createCheckout();
    console.log({ checkoutSession });
    // Redirect to Checkout.
    const stripe = await getStripe();
    console.log({ stripe });
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
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <button className="btn-primary btn" onClick={handleUpgrade}>
          Upgrade
        </button>
      </div>
    </>
  );
};

export default UpgradePage;
