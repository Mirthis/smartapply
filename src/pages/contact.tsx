/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import Title from "~/components/Title";
import ContactForm from "~/components/forms/ContactForm";
import { env } from "~/env.mjs";

const ContactPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>SmartApply - Contact Us</title>
        <meta
          property="og:title"
          content="SmartApply - Contact Us"
          key="title"
        />
      </Head>
      <Title title="Contact" />
      <GoogleReCaptchaProvider
        reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
      >
        <ContactForm />
      </GoogleReCaptchaProvider>
    </>
  );
};

export default ContactPage;
