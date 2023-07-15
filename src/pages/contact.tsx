/* eslint-disable @typescript-eslint/no-misused-promises */
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { type NextPage } from "next";

import { Layout, Title } from "~/components";
import ContactForm from "~/components/forms/ContactForm";

import { env } from "~/env.mjs";

const ContactPage: NextPage = () => {
  return (
    <Layout
      title="Contact Us"
      description="Contact us for any feedback, question and (hopefully not) issue you face using the app."
    >
      <Title title="Contact" />
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <ContactForm />
      </GoogleReCaptchaProvider>
    </Layout>
  );
};

export default ContactPage;
