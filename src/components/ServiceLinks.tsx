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
      <div className="border border-primary-focus rounded-full p-2 hover:bg-primary-focus">
        <Icon className="h-8 w-8  hover:text-base-100 " />
      </div>
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
