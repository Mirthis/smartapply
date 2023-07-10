import {
  InboxArrowDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

import { type NextPage } from "next";
import Link from "next/link";

import { Layout, Title } from "~/components";

const AboutPage: NextPage = () => {
  return (
    <Layout title="About">
      <Title title="About" />
      <Title title="Dev Team" type="section" />
      <div className="flex flex-col gap-y-4">
        <p>
          Concept, design and all the back-end and front-end development by
          Andrea Cardinale.
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
            <button className="btn-outline btn-primary btn-sm btn w-full ">
              <UserCircleIcon className="mr-2 h-6 w-6" />
              Visit Portfolio
            </button>
          </Link>
          <Link href="/contact" className="w-full sm:w-48">
            <button className="btn-outline btn-primary btn-sm btn w-full ">
              <InboxArrowDownIcon className="mr-2 h-6 w-6" />
              Conact Form
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
