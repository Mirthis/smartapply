import {
  BookOpenCheck,
  FileText,
  type LucideIcon,
  MessagesSquare,
} from "lucide-react";

import React from "react";

import Link from "next/link";

const ServiceLink = ({
  href,
  text,
  Icon,
}: {
  href: string;
  text: string;
  Icon: LucideIcon;
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
        href={`/application/${applicationId}/coverletters`}
        text="Cover Letters"
        Icon={FileText}
      />
      <ServiceLink
        href={`/application/${applicationId}/interview`}
        text="Interview"
        Icon={MessagesSquare}
      />
      <ServiceLink
        href={`/application/${applicationId}/test`}
        text="Test"
        Icon={BookOpenCheck}
      />
    </div>
  );
};

export default ServiceLinks;
