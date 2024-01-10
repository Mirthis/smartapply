import { type NextPage } from "next";
import Link from "next/link";

import { Layout, Title } from "~/components";

const Custom404Page: NextPage = () => {
  return (
    <Layout title="Page Not Found" description="Page Not Found">
      <Title title="Page Not Found" />
      <Link href="/" className="link-primary">
        Go back home
      </Link>
    </Layout>
  );
};

export default Custom404Page;
