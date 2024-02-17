import { useRouter } from "next/router";

import { cn } from "~/lib/utils";

const CoverLetterActionButton = ({
  hasPro,
  onClick,
  className,
  disabled,
  text,
}: {
  hasPro: boolean;
  onClick: () => void;
  className?: string;
  disabled: boolean;
  text: string;
}) => {
  const router = useRouter();

  return (
    <>
      {hasPro ? (
        <button
          className={cn(
            `btn-secondary  btn flex gap-x-2 items-center`,
            className
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {text}
        </button>
      ) : (
        <button
          className={cn(
            `btn-disabled pointer-events-auto btn flex gap-x-2 items-center`,
            className
          )}
          data-tip="Pro Feature"
          onClick={() => void router.push("/upgrade")}
        >
          {text}
        </button>
      )}
    </>
  );
};

export default CoverLetterActionButton;
