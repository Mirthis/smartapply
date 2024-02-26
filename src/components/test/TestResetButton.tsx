import { RotateCcw } from "lucide-react";

import { useTestStore } from "~/store/testStore";

const TestResetButton = ({ variant }: { variant: "icon" | "button" }) => {
  const { resetTest } = useTestStore((state) => state);

  return (
    <>
      {variant === "icon" ? (
        <button
          aria-label="Restart Test"
          className="font-bold uppercase text-accent flex gap-x-2 items-center hover:underline underline-offset-2"
          onClick={resetTest}
        >
          <RotateCcw className="h-8 w-8" />
          Restart
        </button>
      ) : (
        <button
          aria-label="Restart Test"
          className="btn-primary btn w-full sm:w-96"
          onClick={resetTest}
        >
          Start a new test
        </button>
      )}
    </>
  );
};

export default TestResetButton;
