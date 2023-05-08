/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";

import ApplicantForm from "~/components/forms/ApplicantForm";
import JobForm from "~/components/forms/JobForm";
import { FormStep } from "~/types/types";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

const NewApplication: NextPage = () => {
  const [step, setStep] = useState<FormStep>(FormStep.Job);

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
        {/* {formStep !== FormStep.Job && <CurrentJobCard />}
        {formStep === FormStep.Complete && <ApplicantCard />} */}
        {step === FormStep.Job && <JobForm onSuccess={nextStep} />}
        {step === FormStep.Applicant && (
          <ApplicantForm onSuccess={nextStep} type="application" />
        )}
        {/* Option Cards  */}
        {step === FormStep.Complete && (
          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {/* Card - Create Cover letter  */}
            <Link href="/coverletter">
              <div className="card h-full w-full bg-base-200 hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <DocumentTextIcon className="h-16 w-16" />
                  <h2 className="card-title">Personalized Cover Letter</h2>
                  <p>
                    Instantly get a professionally written cover letter based on
                    the job and applicant details provided. You can further
                    refine the generated cover letter after it is created.
                  </p>
                </div>
              </div>
            </Link>
            {/* Card - Job Interview  */}
            <Link href="/interview">
              <div className="card h-full w-full bg-base-200  hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">Interview Simulation</h2>
                  <p>
                    Choose the type of interview you want to take part in (HR,
                    tech or leadership) and have a relatistic conversation with
                    our chat bot.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card - Test  */}
            <Link href="/test">
              <div className="card h-full w-full bg-base-200  hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <ClipboardDocumentCheckIcon className="h-16 w-16" />
                  <h2 className="card-title">Multiple Choice Questions</h2>
                  <p>
                    Test your knowledge with multiple choice questions relevant
                    to the job and role. Get immediate feedback and explanations
                    for each answer.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NewApplication;
