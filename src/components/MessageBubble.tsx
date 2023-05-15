import { type InterviewMessage } from "~/types/types";
import { useMemo } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { UserIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const MessageBubble = ({ message }: { message: InterviewMessage }) => {
  const text = useMemo(() => message.content.split("\n\n"), [message.content]);
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
              {text.map((t, i) => (
                <p className="mb-2" key={`message-text-${message.id}-${i}`}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      {message.role === "assistant" && (
        <div className="flex items-end gap-x-2">
          <UserCircleIcon className="h-14 w-14 text-secondary" />
          <div className="chat chat-start w-full">
            <div className="chat-bubble chat-bubble-secondary">
              {text.map((t, i) => (
                <p className="mb-2" key={`message-text-${message.id}-${i}`}>
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
