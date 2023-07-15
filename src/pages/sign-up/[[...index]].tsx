import { SignUp } from "@clerk/nextjs";

import { Layout } from "~/components";

const SignUpPage = () => (
  <Layout title="Sign-up" description="Sign-up for a new SmartApply account.">
    <div className="flex justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  </Layout>
);
export default SignUpPage;
