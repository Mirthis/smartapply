import { type NextPage } from "next";
import { UserIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
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
import Head from "next/head";
import { useRouter } from "next/router";
import { UserCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { BasicCard } from "~/components/BasicCard";
import { interviewTypeCardData } from "~/utils/constants";

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
  const router = useRouter();

  const {
    job,
    applicant,
    interview,
    addInterviewMessage,
    initInterview,
    resetInterview,
    initFromLocalStore,
  } = useAppStore((state) => state);
  const messages = interview?.messages ?? [];
  const interviewType = interview?.type;

  // TODO: add captcha check
  const {
    mutate: sendMessage,
    isLoading,
    isError,
  } = api.interview.sendMessage.useMutation({
    onSuccess: (data) => {
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

  // TODO: find a better way to manage loading from storage
  useEffect(() => {
    if (!applicant || !job) {
      const { applicant: storedApplicant, job: storedJob } =
        initFromLocalStore();
      if (!storedApplicant || !storedJob) {
        void router.replace("/");
      }
    }
  }, [applicant, job, router, initFromLocalStore]);

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
      <Head>
        <title>SmartApply - Interview Simulation</title>
        <meta
          property="og:title"
          content="SmartApply - Interview Simulation"
          key="title"
        />
      </Head>
      <Title title="Interview" />
      <ApplicationDetails />
      {/* Interview is not started yet */}
      {!interviewType && (
        <>
          <Title title="Interview" type="section" />
          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {interviewTypeCardData.map((card) => (
              <BasicCard
                onClick={() => changeInterviewType(card.type)}
                title={card.title}
                description={card.description}
                Icon={card.icon}
                key={card.title}
              />
            ))}

            <button onClick={() => changeInterviewType(InterviewType.hr)}>
              <div className="card h-full w-full bg-base-300 hover:bg-base-200 lg:w-96">
                <div className="card-body items-center text-center">
                  <UserIcon className="h-16 w-16" />
                  <h2 className="card-title">HR Interview</h2>
                  <p>
                    Simulate an HR interview focuing on soft skills and
                    high-level assessment of the applicant.
                  </p>
                </div>
              </div>
            </button>

            <button onClick={() => changeInterviewType(InterviewType.tech)}>
              <div className="card h-full w-full bg-base-300 hover:bg-base-200 lg:w-96">
                <div className="card-body items-center text-center">
                  <CodeBracketIcon className="h-16 w-16" />
                  <h2 className="card-title">Technical Interview</h2>
                  <p>
                    Simulate a technical interview focuing on the
                    applicant&apos;s technical skills.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </>
      )}
      {/* Interview is started */}
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
            <div className="flex items-end gap-x-2">
              <UserCircleIcon className="h-14 w-14 text-secondary" />
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                  <LoadingText />
                </div>
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
        <div className="mt-4 flex items-start justify-start gap-x-2">
          <textarea
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            className="textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
            placeholder="Type your message here"
            rows={2}
          ></textarea>
          <button
            className="btn-primary btn"
            type="submit"
            onClick={() => send()}
            disabled={chatText.length === 0 || isLoading}
          >
            <PaperAirplaneIcon className="h-6 w-6" />
            <span className="ml-2 hidden sm:block">Send</span>
          </button>
        </div>
      )}
      {!interviewOpen && interviewType && (
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
