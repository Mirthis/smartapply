import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

const SignInPage = () => (
  <>
    <Head>
      <title>SmartApply - Sign-in</title>
      <meta property="og:title" content="SmartApply - Sign-in" key="title" />
    </Head>
    <div className="flex justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  </>
);
export default SignInPage;
