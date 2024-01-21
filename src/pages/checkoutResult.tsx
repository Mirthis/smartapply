import React, { useEffect } from "react";

import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/lib/api";

import { Layout } from "~/components";
import Title from "~/components/Title";
import Spinner from "~/components/utils/Spinner";

const CheckoutResultPage: NextPage = () => {
  const router = useRouter();
  const sessionId = router.query.session_id;

  const {
    data: checkoutSession,
    isLoading,
    isError,
  } = api.stripe.getCheckoutSession.useQuery(
    { id: sessionId as string },
    {
      enabled: !!sessionId,
    }
  );

  useEffect(() => {
    if (router.isReady && !sessionId) {
      void router.push("/upgrade");
    }
  }, [router, sessionId]);

  return (
    <Layout title="Upgrade Checkout Summary">
      <Title type="page" title="Checkout Status" />
      {isLoading && <Spinner text="Retrieving status..." />}
      {isError && (
        <div className="flex flex-col gap-y-2 text-2xl">
          <p className="text-error">Something went wrong.</p>
          <p>
            If you think your payment has been processed please{" "}
            <Link href="/contact" className="link-primary">
              contact us
            </Link>
            .
            <br />
            Otherwise retry later.
          </p>
        </div>
      )}
      {checkoutSession && (
        <div>
          {checkoutSession.payment_status === "paid" && (
            <div className="space-y-4 text-xl lg: text-2xl">
              <p className="text-primary">
                🎉 Thank you for upgrading to Pro! 🎉
              </p>
              <p>
                You can now use all SmartApply features and land that dream job.
              </p>
              <div className="flex gap-x-2">
                <Link className="btn btn-primary" href="/dashboard">
                  Go to Dashboard
                </Link>
                <Link
                  href="/subscription"
                  className="btn btn-outline btn-primary"
                >
                  Manage subscription
                </Link>
              </div>
            </div>
          )}
          {checkoutSession.payment_status === "unpaid" && (
            <div className="flex flex-col gap-y-2 text-2xl">
              <p className=" text-error">
                Your payment has not been processed.
              </p>
              <p>
                If you think this is an error please{" "}
                <Link href="/contact" className="link-primary">
                  contact us
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default CheckoutResultPage;
