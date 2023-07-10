import { SignIn } from "@clerk/nextjs";

import { Layout } from "~/components";

const SignInPage = () => (
  <Layout title="Sign-in">
    <div className="flex justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  </Layout>
);
export default SignInPage;
