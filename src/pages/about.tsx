import {
  InboxArrowDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

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
          You can visit my portfolio site for some more info about me and my
          projects or contact me via the contact form on this site.
        </p>
        <div className="flex gap-x-4">
          <Link
            href="https://www.andreacardinale.me/"
            className="w-full sm:w-48"
          >
            <button className="flex space-x-2 btn-outline btn-primary  btn w-full ">
              <UserCircleIcon className="h-6 w-6" />
              <p>Portfolio</p>
            </button>
          </Link>
          <Link href="/contact" className="w-full sm:w-48">
            <button className="flex space-x-2  btn-outline btn-primary  btn w-full">
              <InboxArrowDownIcon className="h-6 w-6" />
              <p>Contact Me</p>
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
