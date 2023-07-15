import { SignIn } from "@clerk/nextjs";

import { Layout } from "~/components";

const SignInPage = () => (
  <Layout title="Sign-in" description="Sign-in to your SmartApply account.">
    <div className="flex justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  </Layout>
);
export default SignInPage;
