import React from "react";

import { useRouter } from "next/router";

import { interviewTypeCardData } from "~/lib/constants";

import { InterviewType } from "~/types/types";

import BasicCard from "../BasicCard";

const InterviewTypeSelector = ({
  hasPro,
  onChangeInterviewType,
}: {
  hasPro: boolean;
  onChangeInterviewType: (type: InterviewType) => void;
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-2">
      {interviewTypeCardData.map((card) => (
        <BasicCard
          onClick={
            card.type !== InterviewType.generic && !hasPro
              ? () => router.push("/upgrade")
              : () => onChangeInterviewType(card.type)
          }
          title={card.title}
          description={card.description}
          Icon={card.icon}
          key={card.title}
          restrictToPro={card.type !== InterviewType.generic && !hasPro}
        />
      ))}
    </div>
  );
};

export default InterviewTypeSelector;
