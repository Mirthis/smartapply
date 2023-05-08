import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

const SignUpPage = () => (
  <>
    <Head>
      <title>SmartApply - Sign-up</title>
      <meta property="og:title" content="SmartApply - Sign-up" key="title" />
    </Head>
    <div className="flex justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  </>
);
export default SignUpPage;
