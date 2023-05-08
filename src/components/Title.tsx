import classNames from "classnames";

const Title = ({
  title,
  type = "page",
  className,
}: {
  title: string;
  type?: "page" | "section" | "subsection";
  className?: string;
}) => {
  return (
    <>
      {type === "page" && (
        <h1
          className={classNames(
            "mb-6 mt-2 text-3xl font-bold text-primary sm:text-4xl",
            className
          )}
        >
          {title}
        </h1>
      )}
      {type === "section" && (
        <h2
          className={classNames(
            "mb-4 mt-2 text-2xl font-semibold text-primary sm:text-3xl",
            className
          )}
        >
          {title}
        </h2>
      )}
      {type === "subsection" && (
        <h3
          className={classNames(
            "text-primarysm:text-xl mb-2 mt-2 text-lg",
            className
          )}
        >
          {title}
        </h3>
      )}
    </>
  );
};

export default Title;
