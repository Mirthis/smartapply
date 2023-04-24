/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";

import ApplicantForm from "~/components/forms/ApplicantForm";
import JobForm from "~/components/forms/JobForm";
import { FormStep } from "~/store/formStore";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useState } from "react";

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
      <div className="text-center">
        <ul className="steps steps-horizontal mx-auto">
          <li className={"step-primary step"}>Job Details</li>
          {step !== FormStep.Job ? (
            <li className={"step-primary step"}>Applicant Details</li>
          ) : (
            <li className={"step"}>Applicant Details</li>
          )}

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
        {step === FormStep.Applicant && <ApplicantForm onSuccess={nextStep} />}
        {/* Option Cards  */}
        {step === FormStep.Complete && (
          <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
            {/* Card - Create Cover letter  */}
            <Link href="/coverletter">
              <div className="card h-full w-full bg-neutral text-neutral-content hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <DocumentTextIcon className="h-16 w-16" />
                  <h2 className="card-title">Create Cover Letter</h2>
                  <p>
                    Instantly get a professionally written cover letter based on
                    the job details and applicant details provide. You can
                    further refine the generated cover letter.
                  </p>
                </div>
              </div>
            </Link>
            {/* Card - Job Interview  */}
            <Link href="/new">
              <div className="card h-full w-full bg-neutral text-neutral-content hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">Start Job Interview</h2>
                  <p>
                    Simulate a job interview by having a realistic conversation
                    with the chat bot. You can choose between generic HR, tech
                    focused or leadership interview.
                  </p>
                </div>
              </div>
            </Link>

            {/* Card - Test  */}
            <Link href="/new">
              <div className="card h-full w-full bg-neutral text-neutral-content hover:bg-base-300 lg:w-96">
                <div className="card-body items-center text-center">
                  <ClipboardDocumentCheckIcon className="h-16 w-16" />
                  <h2 className="card-title">Test Your Knowledge</h2>
                  <p>
                    Test your knowledge with multiple choice questions relevant
                    to the job and role. Explanation are provided for each
                    answer.
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
