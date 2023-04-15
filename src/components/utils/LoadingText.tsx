import { useEffect, useState } from "react";

const LoadingText = () => {
  const [text, setText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prevText) => (prevText === "..." ? "." : prevText + "."));
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>{text}</div>;
};

export default LoadingText;
