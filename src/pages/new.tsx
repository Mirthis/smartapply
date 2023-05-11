/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";

import ApplicantForm from "~/components/forms/ApplicantForm";
import JobForm from "~/components/forms/JobForm";
import { FormStep } from "~/types/types";
import { useState } from "react";
import Head from "next/head";
import ServiceCard from "~/components/ServiceCard";
import { serviceCardData } from "~/utils/constants";

const NewApplication: NextPage = () => {
  // state for application form
  const [step, setStep] = useState<FormStep>(FormStep.Job);

  // move to next form step
  const nextStep = () => {
    if (step === FormStep.Job) {
      setStep(FormStep.Applicant);
    } else if (step === FormStep.Applicant) {
      setStep(FormStep.Complete);
    }
  };

  return (
    <>
      <Head>
        <title>SmartApply - New Job Application</title>
        <meta
          property="og:title"
          content="SmartApply - New Job Application"
          key="title"
        />
      </Head>
      {/* Step progress and navigation */}
      <div className="text-center">
        <ul className="steps steps-horizontal mx-auto w-full sm:w-96">
          <li className={"step-primary step"}>
            <button onClick={() => setStep(FormStep.Job)}>Job</button>
          </li>
          <li className={`${step !== FormStep.Job ? "step-primary" : ""} step`}>
            {step !== FormStep.Job ? (
              <button onClick={() => setStep(FormStep.Applicant)}>
                <span>Applicant</span>
              </button>
            ) : (
              <span>Applicant</span>
            )}
          </li>
          <li
            className={`${
              step === FormStep.Complete ? "step-primary" : ""
            } step`}
          >
            Service
          </li>
        </ul>
      </div>
      <div className="mb-4" />
      <div className="flex flex-col gap-y-4">
        {/* First step Job Form */}
        {step === FormStep.Job && <JobForm onSuccess={nextStep} />}
        {/* Second step Applicant Form */}
        {step === FormStep.Applicant && (
          <ApplicantForm onSuccess={nextStep} type="application" />
        )}
        {/* Third step Option Cards  */}
        {step === FormStep.Complete && (
          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {serviceCardData.map((card) => (
              <ServiceCard Icon={card.icon} key={card.url} {...card} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NewApplication;
