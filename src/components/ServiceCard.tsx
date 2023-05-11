import Link from "next/link";
import { type ComponentType } from "react";

const ServiceCard = ({
  url,
  title,
  description,
  Icon,
}: {
  url: string;
  title: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
}) => {
  return (
    <Link href={url}>
      <div className="card h-full w-full bg-base-200  hover:bg-base-300 lg:w-96">
        <div className="card-body items-center text-center">
          <Icon className="h-16 w-16" />
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
