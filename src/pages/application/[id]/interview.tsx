import { type ChatCompletionMessageParam } from "openai/resources";

import { useState } from "react";

import { type NextPage } from "next";
import { useRouter } from "next/router";

import { INTERVIEWED_CLOSED_TOKEN } from "~/lib/constants";
import { useInterview } from "~/lib/hooks";
import { getIdFromUrlQuery } from "~/lib/utils";

import { ApplicationSideBar, Layout, Title } from "~/components";
import InterViewTitle from "~/components/interview/InterViewTitle";
import InterviewChatInput from "~/components/interview/InterviewChatInput";
import InterviewMessageError from "~/components/interview/InterviewMessageError";
import InterviewMessages from "~/components/interview/InterviewMessages";
import InterviewResetButton from "~/components/interview/InterviewResetButton";
import InterviewTypeSelector from "~/components/interview/InterviewTypeSelector";

import { useApplication } from "~/hooks/useApplication";
import { useHasPro } from "~/hooks/useHasPro";
import { useInterviewStore } from "~/store/interviewStore";
import { type InterviewType } from "~/types/types";

const InterviewPage: NextPage = () => {
  // const [interviewType, setInterviewType] = useState<InterviewType>();
  const router = useRouter();
  const { hasPro } = useHasPro();
  const [chatText, setChatText] = useState("");

  const {
    messages: interviewMessages,
    type: interviewType,
    state: interviewState,
    addInterviewMessage,
    initInterview,
    resetInterview,
    closeInterview,
  } = useInterviewStore((state) => state);

  const applicationId = getIdFromUrlQuery(router.query);

  const { application } = useApplication(applicationId);

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
      let messageText = data;
      if (data.endsWith(INTERVIEWED_CLOSED_TOKEN)) {
        closeInterview();
        messageText = data.replace(INTERVIEWED_CLOSED_TOKEN, "");
      }
      addInterviewMessage({
        content: messageText,
        role: "assistant",
      });
      setChatText("");
    },
    initMessages: interviewMessages,
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
    if (application) {
      const newMessage: ChatCompletionMessageParam = {
        role: "user",
        content: chatText,
      };

      const messages: ChatCompletionMessageParam[] = [...interviewMessages];

      if (!retry) {
        messages.push(newMessage);
      }

      void sendMessage({
        application,
        interviewType,
        text: retry ? undefined : chatText,
      });

      if (!retry) {
        addInterviewMessage(newMessage);
      }
    }
  };

  return (
    <Layout
      title="Interview Simulation"
      description="Simulate a job interview based on the job description and the applicant's resume."
      className="pb-0"
    >
      <div className="flex gap-x-2 min-h-screen">
        <div className="hidden lg:block w-96 shrink-0">
          {applicationId && (
            <ApplicationSideBar applicationId={applicationId} />
          )}
        </div>

        <div className="flex-1 border-0 lg:border-l pl-2 flex-shrink pb-20">
          <>
            <Title title="Interview" type="section" />
            {/* Interview is not started */}
            {interviewState === "Not Started" && (
              <InterviewTypeSelector
                hasPro={hasPro}
                onChangeInterviewType={changeInterviewType}
              />
            )}
            {/* Interview is started or closed, show messages */}
            {interviewState !== "Not Started" && (
              <>
                <div className="flex gap-x-4">
                  <InterViewTitle interviewType={interviewType} />
                  <InterviewResetButton
                    handleReset={handleReset}
                    variant="icon"
                  />
                </div>
                {/* Chat Messages */}
                <InterviewMessages messages={lastMessages} />
                {/* Error bubble only shown if error is present */}
                <InterviewMessageError
                  isError={isError}
                  onRetry={() => send(true)}
                />
              </>
            )}
            {/* Chat Input */}
            {interviewState === "In Progress" && (
              <InterviewChatInput
                chatText={chatText}
                setChatText={setChatText}
                isSending={isLoadingMessage}
                onSend={() => send()}
              />
            )}
            {interviewState === "Completed" && (
              <div className="mt-4 text-center">
                <p className="mb-2">The interview is over.</p>
                <InterviewResetButton
                  handleReset={handleReset}
                  variant="button"
                />
              </div>
            )}
          </>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewPage;
