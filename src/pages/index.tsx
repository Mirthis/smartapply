import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import FeatureCard from "~/components/FeatureCard";
import Title from "~/components/Title";
import { featureCardsData } from "~/utils/constants";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SmartApply - Homepage</title>
        <meta property="og:title" content="SmartApply - Homepage" key="title" />
      </Head>
      <div className="flex flex-col items-center justify-center gap-y-8">
        {/* Hero */}
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-y-12">
          <h1 className="max-w-6xl bg-gradient-to-r from-primary to-accent bg-clip-text pb-8 text-center text-6xl font-extrabold leading-none text-transparent md:text-9xl">
            Land your dream job today
          </h1>
          <p className=" max-w-5xl text-center text-xl text-secondary md:text-3xl">
            Take the stress out of job applications and interviews. Our
            AI-powered tool generates personalized cover letters and interview
            questions to help you land your dream job.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-x-4 gap-y-2 sm:flex-row">
            {/* Call to action */}
            <Link href="/new" className="w-full sm:w-48">
              <button className="btn-primary btn w-full ">Get Started</button>
            </Link>
            <Link href="/#features" scroll={false} className="w-full sm:w-48">
              <button className="btn-secondary btn w-full ">Lear More</button>
            </Link>
          </div>
        </div>
        {/* Feature Cards */}
        <div id="features" className="pt-20">
          <Title
            type="page"
            title="Explore Our Key Features"
            className="text-center"
          />

          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {featureCardsData.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* Call to action */}
        <Link href="/new" className="w-full sm:w-48">
          <button className="btn-primary btn w-full">Get Started</button>
        </Link>
      </div>
    </>
  );
};

export default Home;
