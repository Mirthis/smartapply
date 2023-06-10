import React from "react";
import CurrentJobCard from "./CurrentJobCard";
import ApplicantCard from "./ApplicantCard";
import Title from "./Title";
import { type ApplicationData } from "~/types/types";

export const ApplicationDetails = ({
  application,
}: {
  application: ApplicationData;
}) => {
  return (
    <>
      <Title title="Application Details" type="section" />
      <div className="gao-y-4 flex flex-col gap-x-4 gap-y-2 lg:flex-row">
        <CurrentJobCard application={application} />
        <ApplicantCard application={application} />
      </div>
    </>
  );
};
