import React from "react";

import { InterviewType } from "~/types/types";

import Title from "../Title";

const interviewTitle = (type: InterviewType) => {
  switch (type) {
    case InterviewType.hr:
      return "HR Interview";
    case InterviewType.tech:
      return "Technical Interview";
    case InterviewType.lead:
      return "Lead Interview";
    case InterviewType.generic:
      return "Standard Interview";
  }
};

const InterViewTitle = ({
  interviewType,
}: {
  interviewType: InterviewType;
}) => {
  return <Title title={interviewTitle(interviewType)} type="section" />;
};

export default InterViewTitle;
