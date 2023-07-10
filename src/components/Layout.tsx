import Footer from "./Footer";
import NavBar from "./NavBar";

import Head from "next/head";

const defaultTitle = "SmartApply";

const Layout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  return (
    <>
      <Head>
        <title>SmartApply</title>

        <title>{pageTitle}</title>
        <meta charSet="utf-8" />
        <meta property="og:title" content="SmartApply" key={pageTitle} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="AI power tools to make your job application succesfull"
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
