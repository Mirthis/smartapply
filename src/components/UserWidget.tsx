import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";

import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useHasPro } from "~/hooks/useHasPro";

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
