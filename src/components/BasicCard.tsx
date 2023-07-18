import { type ComponentType } from "react";

import { useRouter } from "next/router";

const BasicCard = ({
  url = "",
  title,
  description,
  Icon,
  onClick,
}: {
  url?: string;
  title: string;
  description: string;
  Icon?: ComponentType<{ className?: string }>;
  onClick?: () => void;
}) => {
  const router = useRouter();

  return (
    <button onClick={onClick ? onClick : () => void router.push(url)}>
      <div className="card h-full w-full bg-base-200  hover:bg-base-300 lg:w-96">
        <div className="card-body items-center text-center">
          {Icon && <Icon className="h-16 w-16" />}
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </button>
  );
};

export default BasicCard;
