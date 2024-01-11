import { SignUp, SignedIn, SignedOut } from "@clerk/nextjs";

import { Layout } from "~/components";
import RedirectToApp from "~/components/utils/RedirectToApp";

const SignUpPage = () => (
  <Layout
    title="Sign-up"
    description="Sign-up for a new SmartApply account to create your profile and have full access to all you need to make your job application successful."
  >
    <div className="flex justify-center">
      <SignedOut>
        <SignUp afterSignInUrl="/dashboard" afterSignUpUrl="/onboarding" />
      </SignedOut>
      <SignedIn>
        <RedirectToApp />
      </SignedIn>
    </div>
  </Layout>
);
export default SignUpPage;
