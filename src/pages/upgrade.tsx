/* eslint-disable @typescript-eslint/no-misused-promises */
import type Stripe from "stripe";

import { useState } from "react";

import { type NextPage } from "next";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatter";
import getStripe from "~/utils/getStipe";

import { Layout, Title } from "~/components";
import { Spinner } from "~/components/utils";

const UpgradePage: NextPage = () => {
  const { mutateAsync: createCheckout } =
    api.stripe.createCheckout.useMutation();

  const {
    data: product,
    isLoading,
    isError,
  } = api.product.getActive.useQuery(undefined, {
    onSuccess: (data) => {
      setSelectedPrice(data.prices[0]?.id);
    },
  });

  const [selectedPrice, setSelectedPrice] = useState<string>();

  // TODO: Add proper error handling
  const handleUpgrade = async () => {
    if (!selectedPrice) return;
    const checkoutSession: Stripe.Checkout.Session = await createCheckout({
      priceId: selectedPrice,
    });
    const stripe = await getStripe();
    if (stripe) {
      await stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSession.id,
      });
    }
  };

  return (
    <Layout title="Upgrade Your Account">
      <Title title="Upgrade Your Account" />
      {isLoading && <Spinner text="Retrieving pricing informations..." />}
      {/* Create predefined error components  */}
      {isError && <p>Something went wrong. Please try again later.</p>}
      {product && (
        <>
          <Title
            title={`Pricing for ${product.name ?? "Pro"} `}
            type="section"
          />

          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {product.prices.map((price) => {
              const selected = price.id === selectedPrice;
              return (
                <button
                  key={price.id}
                  onClick={() => setSelectedPrice(price.id)}
                >
                  <div
                    className={`card h-full w-full border-2 border-secondary  lg:w-96 ${
                      selected
                        ? "bg-secondary text-secondary-content"
                        : "hover:bg-base-200"
                    }`}
                  >
                    <div className="card-body items-center text-center">
                      {price.description && (
                        <p className="uppercase font-semibold">
                          {price.description}
                        </p>
                      )}
                      {price.unitAmount && (
                        <p className="text-bold text-3xl">
                          {formatCurrency(
                            price.unitAmount / 100,
                            price.currency
                          )}{" "}
                          / {price.interval}
                        </p>
                      )}
                      <p className="text-sm">Cancel anytime</p>
                      {selected ? (
                        <button
                          className="btn btn-secondary disabled:bg-primary"
                          disabled
                        >
                          selected
                        </button>
                      ) : (
                        <button className="btn btn-primary">Select Plan</button>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <p>Paymennts and invoicing are managed via Stripe.</p>
            <p>You will be re-directed to Stripe for the checkout.</p>
            <button className="mt-4 btn btn-primary" onClick={handleUpgrade}>
              Upgrade
            </button>
          </div>
        </>
      )}
      <Title title="All benefits of a Pro account" type="section" />
    </Layout>
  );
};

export default UpgradePage;
