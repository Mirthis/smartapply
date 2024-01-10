import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import { Layout } from "~/components";
import RedirectToApp from "~/components/utils/RedirectToApp";

const SignInPage = () => (
  <Layout
    title="Sign-in"
    description="Sign-in to your SmartApply account to access your profile, past generated content and all the features."
  >
    <div className="flex justify-center">
      <div className="flex justify-center">
        <SignedOut>
          <SignIn />
        </SignedOut>
        <SignedIn>
          <RedirectToApp />
        </SignedIn>
      </div>
      );
    </div>
  </Layout>
);
export default SignInPage;
