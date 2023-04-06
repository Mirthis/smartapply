import React from "react";
import CurrentJobCard from "./CurrentJobCard";
import ApplicantCard from "./ApplicantCard";
import Title from "./Title";

export const ApplicationDetails = () => {
  return (
    <>
      <Title title="Application Details" type="section" />
      <div className="gao-y-4 flex flex-col gap-x-4 lg:flex-row">
        <CurrentJobCard />
        <ApplicantCard />
      </div>
    </>
  );
};
