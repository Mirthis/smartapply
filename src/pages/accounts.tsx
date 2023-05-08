import { UserProfile } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

const AccountsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SmartApply - Account</title>
        <meta property="og:title" content="SmartApply - Account" key="title" />
      </Head>
      <div className="flex justify-center">
        <UserProfile />
      </div>
    </>
  );
};

export default AccountsPage;
