import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/formatter";

import { Layout, Title } from "~/components";
import { Spinner } from "~/components/utils";

const ManageSubscriptionPage: NextPage = () => {
  const {
    data: proStatus,
    isLoading,
    isError,
  } = api.user.getProState.useQuery();

  const { data: portalLink, isLoading: creatingLink } =
    api.stripe.createPortalLink.useQuery(undefined, {
      enabled: !!proStatus?.activeSubscription,
    });

  const price = proStatus?.activeSubscription?.price;

  return (
    <Layout title="Manage Subscription">
      <Title type="page" title="Manage Your Pro Subscription" />

      {!isLoading && (
        <>
          {proStatus?.activeSubscription ? (
            <div className="flex flex-col gap-y-2">
              <div className="card-bordered border-primary rounded-md">
                <div className="card-body">
                  <p className="text-primary card-title">
                    Your active subscription
                  </p>
                  {price && (
                    <div>
                      {price.product?.name && <p>{price.product.name}</p>}
                      {price.description && <p>{price.description}</p>}
                      {price.unitAmount && (
                        <p>
                          {formatCurrency(
                            price.unitAmount / 100,
                            price.currency
                          )}
                          /{price.interval}
                        </p>
                      )}
                      {proStatus?.activeSubscription.cancelAt ? (
                        <span>
                          Cancel on{" "}
                          {new Date(
                            proStatus?.activeSubscription.cancelAt
                          ).toLocaleString()}
                        </span>
                      ) : (
                        <span>
                          Renews on{" "}
                          {new Date(
                            proStatus?.activeSubscription.currentPeriodEnd
                          ).toLocaleString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="card-actions">
                    {creatingLink && (
                      <Spinner text="Creating customer portal link..." />
                    )}
                    {portalLink && (
                      <Link href={portalLink} className="btn btn-primary">
                        Manage Subscription
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">
                You do not have any active subscription.
              </p>
              <Link href="/upgrade" className="btn btn-primary">
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
