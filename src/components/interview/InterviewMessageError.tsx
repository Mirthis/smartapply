import { OpacityTransition } from "../utils";

const InterviewMessageError = ({
  isError,
  onRetry,
}: {
  isError: boolean;
  onRetry: () => void;
}) => {
  return (
    <OpacityTransition show={isError} noFadeOut>
      <div className="chat chat-start">
        <div className="chat-bubble bg-error text-white">
          <div>
            Something went wrong.{" "}
            <button className="font-semibold underline" onClick={onRetry}>
              Resent last message.
            </button>
          </div>
        </div>
      </div>
    </OpacityTransition>
  );
};

export default InterviewMessageError;
