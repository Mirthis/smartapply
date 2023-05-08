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
    <div className="card bg-base-300 shadow-xl">
      <figure>
        <Image
          src={`/images/${imgName}`}
          alt="Feature Image"
          width={547}
          height={364}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
