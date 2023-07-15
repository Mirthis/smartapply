import ApplicantCard from "./ApplicantCard";
import CurrentJobCard from "./CurrentJobCard";
import Title from "./Title";

import React from "react";

import { type ApplicationData } from "~/types/types";

const ApplicationDetails = ({
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

export default ApplicationDetails;
