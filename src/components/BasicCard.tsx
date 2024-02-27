import { type ComponentType } from "react";

import { useRouter } from "next/router";

import { ProMarker } from "./utils";

const BasicCard = ({
  url = "",
  title,
  description,
  Icon,
  onClick,
  restrictToPro,
}: {
  url?: string;
  title: string;
  description: string;
  Icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
  restrictToPro?: boolean;
}) => {
  const router = useRouter();

  return (
    <button
      aria-label={`select ${description}`}
      onClick={onClick ? onClick : () => void router.push(url)}
    >
      <div className="card h-full w-full bg-base-100  hover:bg-base-200 border border-primary">
        <div className="card-body items-center text-center">
          {Icon && <Icon className="h-16 w-16" />}
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          {restrictToPro && <ProMarker />}
        </div>
      </div>
    </button>
  );
};

export default BasicCard;
