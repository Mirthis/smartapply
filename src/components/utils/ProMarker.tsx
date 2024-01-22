import { Lock } from "lucide-react";

import Link from "next/link";

const ProMarker = () => {
  return (
    <Link href="/upgrade" className="flex items-center link-accent">
      <Lock className="w-4 h-4 mr-2" />
      Pro
    </Link>
  );
};

export default ProMarker;
