import classNames from "classnames";

const Title = ({
  title,
  type = "page",
  className,
}: {
  title: string;
  type?: "page" | "section" | "subsection" | "subsubsection";
  className?: string;
}) => {
  return (
    <>
      {type === "page" && (
        <h1
          className={classNames(
            "mb-6 mt-2 text-2xl font-bold text-primary sm:text-3xl md:text-4xl",
            className
          )}
        >
          {title}
        </h1>
      )}
      {type === "section" && (
        <h2
          className={classNames(
            "mb-4 mt-2 text-xl font-semibold text-primary sm:text-2xl md:text-3xl",
            className
          )}
        >
          {title}
        </h2>
      )}
      {type === "subsection" && (
        <h3
          className={classNames(
            "xl mb-2 mt-2 text-lg text-primary sm:text-xl md:text-2xl",
            className
          )}
        >
          {title}
        </h3>
      )}
      {type === "subsubsection" && (
        <h3
          className={classNames(
            "xl mb-2 mt-2 text-lg text-primary sm:text-xl",
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
