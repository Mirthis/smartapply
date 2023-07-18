import { useAuth } from "@clerk/nextjs";

import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";

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
    { enabled: !!userId }
  );

  const { data: portalLink, isLoading: creatingLink } =
    api.stripe.createPortalLink.useQuery(undefined, {
      enabled: !!subscription,
    });

  return (
    <Layout title="Manage Subscription">
      <Title type="page" title="Manage Your Pro Subscription" />

      {!isLoading && (
        <>
          {subscription ? (
            <div className="flex flex-col gap-y-2 text-2xl">
              <p className="text-success">Your subscription is active.</p>
              <p>
                You can manage your subscription from Stripe customer portal.
              </p>
              {creatingLink && (
                <Spinner text="Creating customer portal link..." />
              )}
              {portalLink && (
                <Link href={portalLink}>
                  <button>Open customer portal</button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-y-2 text-2xl">
              <p className="text-error">
                You do not have any active subscription.
              </p>
              <p>Upgrade to Pro</p>
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
