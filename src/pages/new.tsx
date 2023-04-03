/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";

import ApplicantForm from "~/components/forms/ApplicantForm";
import JobForm from "~/components/forms/JobForm";
import { FormStep, useFormStore } from "~/store/formStore";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

const NewApplication: NextPage = () => {
  const formStep = useFormStore((state) => state.step);
  console.log(formStep);

  return (
    <>
      <div className="text-center">
        <ul className="steps steps-horizontal mx-auto">
          <li className={"step-primary step"}>Job Details</li>
          {formStep !== FormStep.Job ? (
            <li className={"step-primary step"}>Applicant Details</li>
          ) : (
            <li className={"step"}>Applicant Details</li>
          )}

          <li
            className={`${
              formStep === FormStep.Complete ? "step-primary" : ""
            } step`}
          >
            Tool selection
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-y-4">
        {/* {formStep !== FormStep.Job && <CurrentJobCard />}
        {formStep === FormStep.Complete && <ApplicantCard />} */}
        {formStep === FormStep.Job && <JobForm />}
        {formStep === FormStep.Applicant && <ApplicantForm />}
        {/* Option Cards  */}
        {formStep === FormStep.Complete && (
          <div className="flex flex-col justify-center gap-x-4 gap-y-4 lg:flex-row">
            {/* Card - Create Cover letter  */}
            <Link href="/coverletter">
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <DocumentTextIcon className="h-16 w-16" />
                  <h2 className="card-title">Create Cover Letter</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
                  </p>
                </div>
              </div>
            </Link>
            {/* Card - Job Interview  */}
            <Link href="/new">
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16" />
                  <h2 className="card-title">Start Job Interview</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
                  </p>
                </div>
              </div>
            </Link>

            {/* Card - Test  */}
            <Link href="/new">
              <div className="card w-full bg-neutral text-neutral-content hover:bg-neutral-focus lg:w-96">
                <div className="card-body items-center text-center">
                  <ClipboardDocumentCheckIcon className="h-16 w-16" />
                  <h2 className="card-title">Test Your Knowledge</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam
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
