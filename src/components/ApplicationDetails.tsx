import React from "react";

import { type ApplicationData } from "~/types/types";

import Title from "./Title";

const ApplicationDetails = ({
  application,
}: {
  application: ApplicationData;
}) => {
  return (
    <>
      <Title title="Application Details" type="section" />
      <div className="gao-y-4 flex flex-col gap-x-4 gap-y-2 lg:flex-row">
        <p>{application.applicant.firstName}</p>
        <p>{application.job.title}</p>
      </div>
    </>
  );
};

export default ApplicationDetails;
