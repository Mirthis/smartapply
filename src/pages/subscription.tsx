import { useAuth } from "@clerk/nextjs";

import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatter";

import { Layout, Title } from "~/components";
import { Spinner } from "~/components/utils";

const ManageSubscriptionPage: NextPage = () => {
  const userId = useAuth().userId;

  const {
    data: subscription,
    isLoading,
    isError,
  } = api.subscription.getActiveByUser.useQuery(
    { userId: userId || "N/A" },
    {
      enabled: !!userId,
      onSuccess: () => console.log("Page - subscription loaded"),
    }
  );

  const { data: portalLink, isLoading: creatingLink } =
    api.stripe.createPortalLink.useQuery(undefined, {
      enabled: !!subscription,
    });

  const price = subscription?.price;

  return (
    <Layout title="Manage Subscription">
      <Title type="page" title="Manage Your Pro Subscription" />

      {!isLoading && (
        <>
          {subscription ? (
            <div className="flex flex-col gap-y-2">
              <div>
                <p className="text-success">You have an active subscription:</p>
                {price && (
                  <div>
                    {price.product?.name && <p>{price.product.name}</p>}
                    {price.description && <p>{price.description}</p>}
                    {price.unitAmount && (
                      <p>
                        {formatCurrency(price.unitAmount / 100, price.currency)}
                        /{price.interval}
                      </p>
                    )}
                    {subscription.cancelAt ? (
                      <span>
                        Cancel on{" "}
                        {new Date(subscription.cancelAt).toLocaleString()}
                      </span>
                    ) : (
                      <span>
                        Renews on{" "}
                        {new Date(subscription.currentPeriodEnd).toLocaleString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p>
                You can manage your subscription from Stripe customer portal.
              </p>
              {creatingLink && (
                <Spinner text="Creating customer portal link..." />
              )}
              {portalLink && (
                <Link href={portalLink} className="link-primary link">
                  Open Striple Customer Portal
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              <p className="text-warning">
                You do not have any active subscription.
              </p>
              <Link href="/upgrade" className="link-primary link">
                Upgrade to Pro
              </Link>
            </div>
          )}
        </>
      )}
      {isLoading && <Spinner text="Retrieving subscription data..." />}
      {isError && <p className="text-error">Something went wrong.</p>}
    </Layout>
  );
};

export default ManageSubscriptionPage;
