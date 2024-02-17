import { type ChatCompletionMessageParam } from "openai/resources";

import React from "react";

import { OpacityTransition } from "../utils";
import MessageBubble from "./MessageBubble";

const InterviewMessages = ({
  messages,
}: {
  messages: ChatCompletionMessageParam[];
}) => {
  return (
    <div>
      {messages.map((message, i) => (
        <OpacityTransition key={`message-${i}`} show appear>
          <MessageBubble message={message} />
        </OpacityTransition>
      ))}
    </div>
  );
};

export default InterviewMessages;
