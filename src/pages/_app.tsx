import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { env } from "~/env.mjs";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <Component {...pageProps} />
      </GoogleReCaptchaProvider>
    </Layout>
  );
};

export default api.withTRPC(MyApp);
