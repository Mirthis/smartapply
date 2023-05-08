import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="relative pb-2 pr-5">
        <p className="w-full text-6xl font-extrabold">
          <span className=" text-primary">Smart</span>
          <span className="text-accent">Apply</span>
        </p>
        <div className="absolute bottom-0 right-0 rounded-md text-xs font-semibold text-red-600">
          Beta
        </div>
      </div>
    </Link>
  );
};

export default Logo;
