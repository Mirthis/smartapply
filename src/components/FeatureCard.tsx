import Image from "next/image";

const FeatureCard = ({
  title,
  description,
  imgName,
}: {
  title: string;
  description: string;
  imgName: string;
}) => {
  return (
    <div className="card bg-base-200 shadow-xl flex md:flex-row lg:flex-col">
      <figure className="md:flex-1 lg:flex-none">
        <Image
          src={`/images/${imgName}`}
          alt="Feature Image"
          width={547}
          height={364}
        />
      </figure>
      <div className="card-body md:flex-1 lg:flex-none">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
