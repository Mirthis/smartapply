import { type NextPage } from "next";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import React from "react";
import Title from "~/components/Title";
import { ApplicationDetails } from "~/components/ApplicationDetails";
import { InterviewType } from "~/types/types";

const InterviewPage: NextPage = () => {
  const [interviewType, setInterviewType] = React.useState<InterviewType>();

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

  return (
    <>
      <Title title="Interview" />
      <ApplicationDetails />
      {!interviewType && (
        <>
          <h1 className="mb-2 mt-4 text-3xl">Select Interview Type</h1>
          <div className="md:columns-3">
            <button onClick={() => setInterviewType(InterviewType.hr)}>
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
            <button onClick={() => setInterviewType(InterviewType.tech)}>
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
            <button onClick={() => setInterviewType(InterviewType.lead)}>
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
          <div></div>
          {/* Chat Input */}
          <div className="flex items-end justify-start gap-x-2">
            <textarea
              className="textarea-bordered textarea w-full"
              placeholder="Type your message here"
            ></textarea>
            <button className="btn-primary btn">Send</button>
          </div>
        </>
      )}
    </>
  );
};

export default InterviewPage;
