import "simplebar-react/dist/simplebar.min.css";

import Head from "next/head";

import { cn } from "~/lib/utils";

import Footer from "./Footer";
import NavBar from "./NavBar";

const defaultTitle = "SmartApply";
const defaultDesc =
  "AI powered tools to make your job application succesfull. Cover letter generation, interview simulation, multiple choice tests";
const Layout = ({
  children,
  title,
  description,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <main>
        <NavBar />
        <div className="mx-auto max-w-7xl">
          <div className={cn("min-h-screen px-4 pt-20 pb-20", className)}>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
