import { type NextPage } from "next";
import Link from "next/link";

import { Layout, Title } from "~/components";

const AboutPage: NextPage = () => {
  return (
    <Layout title="About" description="How SmartApply came to life.">
      <Title title="About" />
      <Title title="Dev Team" type="section" />
      <div className="flex flex-col gap-y-4">
        <p>
          Concept, design, back-end and front-end development by Andrea
          Cardinale.
        </p>
        <p>
          You can visit my portfolio site for more information about me and my
          projects and to get in touch with me.
        </p>
        <div className="flex gap-x-4">
          <Link
            href="https://www.andreacardinale.me/"
            className="w-full sm:w-48"
          >
            <button
              aria-label="Visit My Portfolio"
              className="flex space-x-2  btn-primary btn w-full "
            >
              <p>Visit My Portfolio</p>
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
