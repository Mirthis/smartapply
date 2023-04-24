import Head from "next/head";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Smart Apply</title>
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
