import { RotateCcw, SendHorizontal } from "lucide-react";
import {
  type ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

import React, { useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { ApplicationSideBar, BasicCard, Layout, Title } from "~/components";
import MessageBubble from "~/components/MessageBubble";
import { ResetInterviewModal } from "~/components/modals";
import OpacityTransition from "~/components/utils/OpacityTransition";

import { api } from "~/lib/api";
import { interviewTypeCardData } from "~/lib/constants";
import { useInterview } from "~/lib/hooks";
import { useAppStore } from "~/store/store";
import { InterviewType } from "~/types/types";

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
  const router = useRouter();
  const [chatText, setChatText] = useState("");
  const [isOpenResetModal, setIsOpenResetModal] = useState(false);

  const {
    interview,
    addInterviewMessage,
    initInterview,
    resetInterview,
    closeInterview,
  } = useAppStore((state) => state);
  // const messages = interview?.messages ?? [];
  // const interviewType = interview?.type;

  const applicationId =
    router.query.id && !Array.isArray(router.query.id)
      ? router.query.id
      : undefined;

  // TODO: Add error handling
  const { data: application } = api.application.get.useQuery(
    {
      id: applicationId ?? "N/A",
    },
    {
      enabled: !!applicationId,

      onError: (error) => {
        if (error.message === "No Application found") {
          void router.replace("/");
        }
      },
    }
  );

  // const {
  //   mutate: sendMessage,
  //   isLoading: isLoadingMessage,
  //   isError,
  // } = api.interview.sendMessage.useMutation({
  //   onSuccess: (data) => {
  //     if (data.content.endsWith("*END*")) {
  //       setInterviewOpen(false);
  //       data.content = data.content.replace("*END*", "");
  //     }
  //     addInterviewMessage(data);
  //     setChatText("");
  //   },
  // });

  const handleReset = () => {
    resetInterview();
    resetInterviewHook();
  };

  const {
    execute: sendMessage,
    isLoading: isLoadingMessage,
    isError,
    messages: lastMessages,
    reset: resetInterviewHook,
  } = useInterview({
    onSuccess: (data) => {
      if (data.endsWith("*END*")) {
        closeInterview();
        data = data.replace("*END*", "");
      }
      addInterviewMessage({
        content: data,
        role: ChatCompletionRequestMessageRoleEnum.Assistant,
      });
      setChatText("");
    },
    initMessages: interview?.messages,
  });

  const changeInterviewType = (type: InterviewType) => {
    initInterview(type);
    if (application) {
      void sendMessage({
        application,
        interviewType: type,
      });
    }
  };

  const send = (retry = false) => {
    if (interview && application) {
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

      void sendMessage({
        application,
        interviewType: interview.type,
        text: retry ? undefined : chatText,
      });

      if (!retry) {
        addInterviewMessage(newMessage);
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      send();
    }
  };

  return (
    <Layout
      title="Interview Simulation"
      description="Simulate a job interview based on the job description and the applicant's resume."
      className="pb-0"
    >
      <ResetInterviewModal
        onConfirm={handleReset}
        onClose={() => setIsOpenResetModal(false)}
        isOpen={isOpenResetModal}
      />
      <div className="flex gap-x-2 min-h-screen">
        <div className="hidden lg:block w-96 shrink-0">
          {applicationId && (
            <ApplicationSideBar applicationId={applicationId} />
          )}
        </div>

        <div className="flex-1 border-0 lg:border-l pl-2 flex-shrink pb-20">
          {application && (
            <>
              {/* Interview is not started yet */}
              {!interview && (
                <>
                  <Title title="Interview" type="section" />

                  <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-2">
                    {interviewTypeCardData.map((card) => (
                      <BasicCard
                        onClick={() => changeInterviewType(card.type)}
                        title={card.title}
                        description={card.description}
                        Icon={card.icon}
                        key={card.title}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Interview is started */}
              {interview && (
                <>
                  <div className="flex gap-x-4">
                    <Title
                      title={interviewTitle(interview.type)}
                      type="section"
                    />
                    <button
                      className="font-bold uppercase text-accent flex gap-x-2 items-center hover:underline underline-offset-2"
                      onClick={() => setIsOpenResetModal(true)}
                    >
                      <RotateCcw className="h-8 w-8" />
                      Restart
                    </button>
                  </div>
                  {/* Chat Messages */}
                  <div>
                    {lastMessages.map((message, i) => (
                      <OpacityTransition key={`message-${i}`} show appear>
                        <MessageBubble message={message} />
                      </OpacityTransition>
                    ))}
                  </div>
                  {/* <OpacityTransition
                show={isLoadingMessage && lastMessageText === ""}
                noFadeOut
              >
                <LoadingBubble />
              </OpacityTransition> */}
                  {/* <OpacityTransition
                show={isLoadingMessage && lastMessageText !== ""}
                noFadeOut
              >
                <MessageBubble
                  message={{
                    content: lastMessageText,
                    role: "assistant",
                  }}
                />
              </OpacityTransition> */}
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
              {interview && interview.isOpen && (
                <div className="mt-4 flex items-start justify-start gap-x-2">
                  <textarea
                    value={chatText}
                    onChange={(e) => setChatText(e.target.value)}
                    className="textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
                    placeholder="Type your message here"
                    onKeyUp={handleKeyUp}
                    rows={3}
                  ></textarea>
                  <div className="flex flex-col gap-x-2 gap-y-2">
                    <div>
                      <button
                        className="btn-primary btn flex w-14 flex-col sm:w-36"
                        type="submit"
                        onClick={() => send()}
                        disabled={chatText.length === 0 || isLoadingMessage}
                      >
                        <SendHorizontal className="h-6 w-6" />
                        <p className="hidden text-center  sm:block">
                          Send
                          <br />
                          <span className="text-[8px]">Shift+Enter</span>
                        </p>
                      </button>
                    </div>
                    {/* <button
                      className="btn-secondary btn w-14 sm:w-36"
                      onClick={() => setIsOpenResetModal(true)}
                    >
                      <ArrowPathIcon className="h-6 w-6" />
                      <span className="ml-2 hidden sm:block">Reset</span>
                    </button> */}
                  </div>
                </div>
              )}
              {interview && !interview.isOpen && (
                <div className="mt-4 text-center">
                  <p className="mb-2">The interview is over.</p>
                  <button className="btn-primary btn" onClick={handleReset}>
                    Start new interview
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InterviewPage;
