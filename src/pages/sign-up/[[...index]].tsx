import { SignUp } from "@clerk/nextjs";

import { Layout } from "~/components";

const SignUpPage = () => (
  <Layout
    title="Sign-up"
    description="Sign-up for a new SmartApply account to create your profile and have full access to all you need to make your job application successful."
  >
    <div className="flex justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  </Layout>
);
export default SignUpPage;
