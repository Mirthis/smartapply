import Head from "next/head";

import Footer from "./Footer";
import NavBar from "./NavBar";

const defaultTitle = "SmartApply";
const defaultDesc =
  "AI powered tools to make your job application succesfull. Cover letter generation, interview simulation, multiple choice tests";
const Layout = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) => {
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDesc = description ? description : defaultDesc;

  return (
    <>
      <Head>
        <title>SmartApply</title>

        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta property="og:title" content="SmartApply" key={pageTitle} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={pageDesc} />
        <meta
          name="google-site-verification"
          content="h8IMaJ7eZCVyj5If1lwGf7jSBi5eFMO6M999ClvxOyw"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NavBar />
        <div className="mx-auto max-w-7xl">
          <div className="min-h-screen px-4 pb-20 pt-20">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
