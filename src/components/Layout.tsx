import Head from "next/head";
import NavBar from "./NavBar";

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

      <main className="mx-auto max-w-7xl p-4">
        <NavBar />
        <div className="mt-16">{children}</div>
      </main>
    </>
  );
};

export default Layout;
