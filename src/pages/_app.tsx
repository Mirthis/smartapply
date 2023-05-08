import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "~/env.mjs";
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
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <GoogleAnalytics trackPageViews />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GoogleReCaptchaProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
