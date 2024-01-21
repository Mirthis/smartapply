/* eslint-disable @typescript-eslint/no-misused-promises */
import type Stripe from "stripe";

import { useEffect, useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { api } from "~/lib/api";
import { formatCurrency } from "~/lib/formatter";
import getStripe from "~/lib/getStipe";
import { cn } from "~/lib/utils";

import { Layout, Title } from "~/components";
import { Spinner } from "~/components/utils";
import TimeLeft from "~/components/utils/TimeLeft";

const UpgradePage: NextPage = () => {
  const { mutateAsync: createCheckout } =
    api.stripe.createCheckout.useMutation();

  const { data: proData, isLoading: isLoadingPro } =
    api.user.getProState.useQuery();

  const router = useRouter();

  const {
    data: product,
    isLoading: isLoadingPricing,
    isError,
  } = api.product.getActive.useQuery(undefined, {
    onSuccess: (data) => {
      // setSelectedPrice(data.prices[0]?.id);
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

  useEffect(() => {
    if (proData?.hasPro) {
      void router.replace("/subscription");
    }
  }, [proData, router]);

  const trialEnd = proData?.trailSubscription?.trialEnd;
  const isLoading = isLoadingPricing || isLoadingPro;

  return (
    <Layout title="Upgrade Your Account">
      <Title title="Upgrade Your Account" />
      {isLoadingPro && <Spinner text="Retrieving subscription data..." />}
      {!isLoading && !proData?.hasPro && (
        <>
          {trialEnd && (
            <>
              <div className="alert alert-warning  justify-start">
                <p>Free trial ending in: </p>
                <TimeLeft endDate={trialEnd} />
              </div>
            </>
          )}
          {/* Create predefined error components  */}
          {isError && <p>Something went wrong. Please try again later.</p>}
          {product && (
            <>
              <Title
                title={`Pricing for ${product.name ?? "Pro"} `}
                type="section"
              />

              <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
                {product.prices
                  .sort((a, b) => {
                    if (a.unitAmount && b.unitAmount) {
                      return a.unitAmount - b.unitAmount;
                    }
                    return 0;
                  })
                  .map((price) => {
                    const selected = price.id === selectedPrice;
                    return (
                      <button
                        key={price.id}
                        disabled={price.id === selectedPrice}
                        onClick={() => setSelectedPrice(price.id)}
                      >
                        <div
                          className={cn(
                            "card h-full w-full border-2 border-secondary lg:w-96",
                            {
                              "border-4 border-primary": selected,
                              "hover:bg-base-200": !selected,
                            }
                          )}
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
                                )}
                                {price.type === "recurring" && (
                                  <span> / {price.interval}</span>
                                )}
                              </p>
                            )}
                            {price.type === "recurring" && (
                              <p className="text-sm">Cancel anytime</p>
                            )}
                            {selected ? (
                              <p className="btn btn-primary pointer-events-none  font-bold w-36">
                                Selected
                              </p>
                            ) : (
                              <p className="btn btn-secondary w-36">
                                Select Plan
                              </p>
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
                <button
                  className="mt-4 btn btn-primary"
                  onClick={handleUpgrade}
                  disabled={!selectedPrice}
                >
                  Upgrade
                </button>
              </div>
            </>
          )}
          <Title title="All benefits of a Pro account" type="section" />
        </>
      )}
    </Layout>
  );
};

export default UpgradePage;
