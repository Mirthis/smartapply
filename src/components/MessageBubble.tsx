import { type InterviewMessage } from "~/types/types";
import { useMemo } from "react";

const MessageBubble = ({ message }: { message: InterviewMessage }) => {
  const text = useMemo(() => message.content.split("\n\n"), [message.content]);

  return (
    <>
      {message.role === "user" && (
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-secondary">
            {text.map((t, i) => (
              <p className="mb-2" key={`message-text-${message.id}-${i}`}>
                {t}
              </p>
            ))}
          </div>
        </div>
      )}
      {message.role === "assistant" && (
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-primary">
            {text.map((t, i) => (
              <p className="mb-2" key={`message-text-${message.id}-${i}`}>
                {t}
              </p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
