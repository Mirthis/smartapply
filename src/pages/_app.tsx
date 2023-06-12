import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { ClerkProvider } from "@clerk/nextjs";
import { GoogleAnalytics } from "nextjs-google-analytics";

const MyApp: AppType = ({ Component, pageProps }) => {
  // TODO: Add web vitals tracking into Google Analytics
  return (
    <ClerkProvider
      appearance={
        {
          // variables: { colorBackground: "#23282E" },
        }
      }
    >
      <GoogleAnalytics trackPageViews />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
