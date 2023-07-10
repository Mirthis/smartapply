import { ClerkProvider } from "@clerk/nextjs";

import { type AppType } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";

import { api } from "~/utils/api";

import "~/styles/globals.css";

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
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
