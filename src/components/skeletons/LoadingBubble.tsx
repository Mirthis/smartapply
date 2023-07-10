import LoadingText from "../utils/LoadingText";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const LoadingBubble = () => {
  return (
    <div className="flex items-end gap-x-2">
      <UserCircleIcon className="h-14 w-14 text-secondary" />
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary">
          <LoadingText />
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;
