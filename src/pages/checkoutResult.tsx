import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Title from "~/components/Title";
import Spinner from "~/components/utils/Spinner";
import { api } from "~/utils/api";

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

  console.log({ checkoutSession });
  return (
    <>
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
            <div className="flex  flex-col gap-y-2 text-2xl">
              <p className="text-success">Thank you for upgrading to Pro.</p>
              <p>You can now use all the features of SmartApply.</p>
            </div>
          )}
          {checkoutSession.payment_status === "paid" && (
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
    </>
  );
};

export default CheckoutResultPage;
