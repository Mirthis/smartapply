import classNames from "classnames";

const Title = ({
  title,
  type = "page",
  className,
}: {
  title: string;
  type?: "page" | "section";
  className?: string;
}) => {
  return (
    <>
      {type === "page" && (
        <h1
          className={classNames(
            "mb-6 mt-2 text-3xl font-semibold text-secondary sm:text-4xl",
            className
          )}
        >
          {title}
        </h1>
      )}
      {type === "section" && (
        <h2
          className={classNames(
            "mb-4 mt-2 text-2xl text-secondary sm:text-3xl",
            className
          )}
        >
          {title}
        </h2>
      )}
    </>
  );
};

export default Title;
