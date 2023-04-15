import { type NextPage } from "next";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";
import { InterviewType } from "~/types/types";
import { api } from "~/utils/api";
import { useAppStore } from "~/store/store";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";
import OpacityTransition from "~/components/utils/OpacityTransition";
import MessageBubble from "~/components/MessageBubble";
import LoadingText from "~/components/utils/LoadingText";

const interviewTitle = (type: InterviewType) => {
  switch (type) {
    case InterviewType.hr:
      return "HR Interview";
    case InterviewType.tech:
      return "Technical Interview";
    case InterviewType.lead:
      return "Lead Interview";
  }
};

const InterviewPage: NextPage = () => {
  // const [interviewType, setInterviewType] = useState<InterviewType>();
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const {
    job,
    applicant,
    interview,
    addInterviewMessage,
    initInterview,
    resetInterview,
  } = useAppStore((state) => state);
  const messages = interview?.messages ?? [];
  const interviewType = interview?.type;

  console.log({ interview });

  const {
    mutate: sendMessage,
    isLoading,
    isError,
  } = api.interview.sendMessageFake.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data.content.endsWith("*END*")) {
        setInterviewOpen(false);
        data.content = data.content.replace("*END*", "");
      }
      addInterviewMessage(data);
      setChatText("");
    },
  });

  const changeInterviewType = (type: InterviewType) => {
    setInterviewOpen(true);
    initInterview(type);
    if (job && applicant) {
      sendMessage({
        job,
        applicant,
        interviewType: type,
        interviewMessages: [],
      });
    }
  };

  const send = (retry = false) => {
    if (interviewType && job && applicant) {
      const newMessage = {
        role: ChatCompletionRequestMessageRoleEnum.User,
        content: chatText,
      };

      const messages: ChatCompletionRequestMessage[] = [
        ...(interview?.messages ?? []),
      ];

      if (!retry) {
        messages.push(newMessage);
      }

      sendMessage({
        job,
        applicant,
        interviewType,
        interviewMessages: messages,
      });

      if (!retry) {
        addInterviewMessage(newMessage);
      }
    }
  };

  return (
    <>
      <Title title="Interview" />
      <ApplicationDetails />
      {!interviewType && (
        <>
          <h1 className="mb-2 mt-4 text-3xl">Select Interview Type</h1>
          <div className="md:columns-3">
            <button onClick={() => changeInterviewType(InterviewType.hr)}>
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">HR Interview</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
                  </p>
                </div>
              </div>
            </button>
            <button onClick={() => changeInterviewType(InterviewType.tech)}>
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">Technical Interview</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
                  </p>
                </div>
              </div>
            </button>
            <button onClick={() => changeInterviewType(InterviewType.lead)}>
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">Leadership interview</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
                  </p>
                </div>
              </div>
            </button>
          </div>
        </>
      )}
      {interviewType && (
        <>
          <Title title={interviewTitle(interviewType)} type="section" />
          {/* Chat Messages */}
          <div>
            {messages.map((message) => (
              <>
                <OpacityTransition key={`message-${message.id}`} show appear>
                  <MessageBubble message={message} />
                </OpacityTransition>
              </>
            ))}
          </div>
          <OpacityTransition show={isLoading} noFadeOut>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-primary">
                <LoadingText />
              </div>
            </div>
          </OpacityTransition>
          <OpacityTransition show={isError} noFadeOut>
            <div className="chat chat-start">
              <div className="chat-bubble bg-error text-white">
                <div>
                  Something went wrong.{" "}
                  <button
                    className="font-semibold underline"
                    onClick={() => send(true)}
                  >
                    Resent last message.
                  </button>
                </div>
              </div>
            </div>
          </OpacityTransition>
        </>
      )}
      {/* Chat Input */}
      {interviewOpen && (
        <div className="flex items-end justify-start gap-x-2">
          <textarea
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            className="textarea-bordered textarea w-full"
            placeholder="Type your message here"
          ></textarea>
          <button
            className="btn-primary btn"
            onClick={() => send()}
            disabled={chatText.length === 0 || isLoading}
          >
            Send
          </button>
        </div>
      )}
      {!interviewOpen && (
        <div className="mt-4 text-center">
          <p className="mb-2">The interview is over.</p>
          <button className="btn-primary btn" onClick={resetInterview}>
            Start new interview
          </button>
        </div>
      )}
    </>
  );
};

export default InterviewPage;
