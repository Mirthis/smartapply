import { useUser } from "@clerk/nextjs";
import { CircleUserRound, UserCircle } from "lucide-react";
import { type ChatCompletionMessageParam } from "openai/resources";

import Image from "next/image";

import { formatApiMessage } from "~/lib/formatter";

import LoadingText from "./utils/LoadingText";

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
  message: ChatCompletionMessageParam;
}) => {
  const { user } = useUser();

  return (
    <>
      {message.role === "user" && (
        <div className="flex  items-end gap-x-2">
          <div className="chat chat-end w-full">
            <div className="chat-bubble chat-bubble-primary">
              <MessageBubbleText text={message.content as string} />
            </div>
          </div>
          {user?.imageUrl ? (
            <Image
              className="mb-1 h-10 w-10 rounded-full"
              src={user.imageUrl}
              width={50}
              height={50}
              alt="User Image"
            />
          ) : (
            <CircleUserRound className="h-10 w-10 rounded-full text-primary" />
          )}
        </div>
      )}
      {message.role === "assistant" && (
        <div className="flex items-end">
          <UserCircle className="h-12 w-12 text-secondary" />
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-secondary">
              <MessageBubbleText text={message.content as string} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
