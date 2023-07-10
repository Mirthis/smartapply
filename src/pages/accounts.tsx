import { UserProfile } from "@clerk/nextjs";

import { type NextPage } from "next";

import { Layout } from "~/components";

const AccountsPage: NextPage = () => {
  return (
    <Layout title="User Account">
      <UserProfile />
    </Layout>
  );
};

export default AccountsPage;
