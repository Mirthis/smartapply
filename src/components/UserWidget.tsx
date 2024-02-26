import { SignedIn, SignedOut } from "@clerk/nextjs";

import UserWidgetSignedIn from "./UserWidgetSignedIn";
import UserWidgetSignedOut from "./UserWidgetSignedOut";

export default function UserWidget() {
  return (
    <>
      <SignedIn>
        <UserWidgetSignedIn />
      </SignedIn>
      <SignedOut>
        <UserWidgetSignedOut />
      </SignedOut>
    </>
  );
}
