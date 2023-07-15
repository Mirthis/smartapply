import { type NextPage } from "next";
import Link from "next/link";

import { Layout } from "~/components";

const Custom404Page: NextPage = () => {
  return (
    <Layout title="Page Not Found" description="Page Not Found">
      <p className="text-error text-xl">Page Not Found</p>
      <Link href="/" className="link-primary">
        Go back home
      </Link>
    </Layout>
  );
};

export default Custom404Page;
