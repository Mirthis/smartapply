import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import React from "react";

import Link from "next/link";

type IconType =
  | typeof DocumentTextIcon
  | typeof ChatBubbleLeftRightIcon
  | typeof ClipboardDocumentCheckIcon;

const ServiceLink = ({
  href,
  text,
  Icon,
}: {
  href: string;
  text: string;
  Icon: IconType;
}) => {
  return (
    <Link
      className="flex flex-col items-center gap-y-2 text-primary-focus hover:underline underline-offset-2"
      href={href}
    >
      <Icon className="h-12 w-12 border border-primary-focus p-2 rounded-full hover:text-base-100 hover:bg-primary-focus" />
      <p className="">{text}</p>
    </Link>
  );
};

const ServiceLinks = ({ applicationId }: { applicationId: string }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ServiceLink
        href={`/coverletter/${applicationId}`}
        text="Cover Letters"
        Icon={DocumentTextIcon}
      />
      <ServiceLink
        href={`/interview/${applicationId}`}
        text="Interview"
        Icon={ChatBubbleLeftRightIcon}
      />
      <ServiceLink
        href={`/test/${applicationId}`}
        text="Test"
        Icon={ClipboardDocumentCheckIcon}
      />
    </div>
  );
};

export default ServiceLinks;
