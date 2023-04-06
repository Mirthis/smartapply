const Title = ({
  title,
  type = "page",
}: {
  title: string;
  type?: "page" | "section";
}) => {
  return (
    <>
      {type === "page" && <h1 className="mb-4 text-5xl">{title}</h1>}
      {type === "section" && <h2 className="mb-2 mt-4 text-3xl">{title}</h2>}
    </>
  );
};

export default Title;
