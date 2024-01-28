import { LockKeyhole } from "lucide-react";

import Link from "next/link";

const ProMarker = ({ text }: { text?: string }) => {
  return (
    <Link
      href="/upgrade"
      className="flex gap-x-2 items-center link-accent font-semibold"
    >
      <LockKeyhole className="w-6 h-6 shrink-0" />

      <p>{text ? text : "Pro Feature"}</p>
    </Link>
  );
};

export default ProMarker;
