import LoadingText from "./utils/LoadingText";
import { useUser } from "@clerk/nextjs";
import { UserCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { type ChatCompletionResponseMessage } from "openai";

import Image from "next/image";

import { formatApiMessage } from "~/utils/formatter";

const MessageBubbleText = ({ text }: { text: string }) => {
  if (text === "") {
    return <LoadingText />;
  }

  return (
    <>
      {formatApiMessage(text).map((t, i) => (
        <p className="mb-2" key={`message-text-${i}`}>
          {t}
        </p>
      ))}
    </>
  );
};

const MessageBubble = ({
  message,
}: {
  message: ChatCompletionResponseMessage;
}) => {
  const { user } = useUser();

  return (
    <>
      {message.role === "user" && (
        <div className="flex  items-end gap-x-2">
          {user?.profileImageUrl ? (
            <Image
              className="mb-1 h-10 w-10 rounded-full"
              src={user.profileImageUrl}
              width={50}
              height={50}
              alt="User Image"
            />
          ) : (
            <UserIcon className="h-10 w-10 rounded-full text-primary" />
          )}
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-primary">
              <MessageBubbleText text={message.content} />
            </div>
          </div>
        </div>
      )}
      {message.role === "assistant" && (
        <div className="flex items-end">
          <UserCircleIcon className="h-12 w-12 text-secondary" />
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-secondary">
              <MessageBubbleText text={message.content} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
