import { type NextPage } from "next";
import Link from "next/link";
import Title from "~/components/Title";
import {
  InboxArrowDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Head from "next/head";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SmartApply - About</title>
        <meta property="og:title" content="SmartApply - About" key="title" />
      </Head>
      <Title title="About" />
      <Title title="Dev Team" type="subsection" />
      <p>
        Concept, design and all the back-end and front-end development has been
        done by Andrea Cardinale (who is also the person writing this text).
      </p>
      <p>
        This is a side project non-related to my daily job, and made out of
        passion for web development and coding in general.
      </p>
      <p>
        You can visit my portfolio site for some more info about me and my
        projects or contact me via the contact form on this site.
      </p>
      <div className="mt-4 flex gap-x-4">
        <Link href="https://www.andreacardinale.me/" className="w-full sm:w-48">
          <button className="btn-outline btn-secondary btn-sm btn w-full ">
            <UserCircleIcon className="mr-2 h-6 w-6" />
            Visit Portfolio
          </button>
        </Link>
        <Link href="/contact" className="w-full sm:w-48">
          <button className="btn-outline btn-secondary btn-sm btn w-full ">
            <InboxArrowDownIcon className="mr-2 h-6 w-6" />
            Conact Form
          </button>
        </Link>
      </div>
    </>
  );
};

export default AboutPage;
