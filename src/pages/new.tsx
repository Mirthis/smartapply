/* eslint-disable @typescript-eslint/no-misused-promises */
import { useAuth } from "@clerk/nextjs";

import { useEffect, useState } from "react";

import { type NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { serviceCardData } from "~/utils/constants";

import { BasicCard, Layout, Title } from "~/components";
import { ApplicantForm, JobForm } from "~/components/forms";
import { SignInModal } from "~/components/modals";
import Spinner from "~/components/utils/Spinner";

import { useAppStore } from "~/store/store";
import { type ApplicantData, FormStep, type JobData } from "~/types/types";

const NewApplication: NextPage = () => {
  // state for application form
  const [step, setStep] = useState<FormStep>(FormStep.Job);
  const router = useRouter();
  const {
    newApplication: { job: newJob, applicant: newApplicant },
    initFromLocalStore,
    application,
    setNewJob,
    setNewApplicant,
    setApplication,
    reset,
  } = useAppStore((state) => state);

  const [modalState, setModalState] = useState({
    isOpen: false,
    redirectUrl: "",
  });

  const { userId } = useAuth();

  // move to next form step
  const nextStep = () => {
    if (step === FormStep.Job) {
      setStep(FormStep.Applicant);
    } else if (step === FormStep.Applicant) {
      setStep(FormStep.Service);
    } else if (step === FormStep.Service) {
      setStep(FormStep.Complete);
    }
  };

  // set step based on url query
  useEffect(() => {
    if (router.query.step === undefined) {
      reset();
      setStep(FormStep.Job);
    } else if (router.query.step === "job") {
      setStep(FormStep.Job);
    } else if (router.query.step === "applicant") {
      setStep(FormStep.Applicant);
    } else if (router.query.step === "service") {
      setStep(FormStep.Service);
    } else if (router.query.step === "complete") {
      setStep(FormStep.Complete);
    }
  }, [router, reset]);

  const {
    mutate: createApplication,
    isLoading: creatingApplication,
    isSuccess: applicationCreated,
    isError: applicationCreationError,
  } = api.application.createOrUpdate.useMutation({
    onSuccess: (data) => {
      const url = router.query.action as string;
      if (!url) return;
      void router.push(`/${url}/${data.id}`);
      setApplication(data);
    },
  });

  // redirect to new application page if applicationId is available and
  // application creation has been already completed
  useEffect(() => {
    if (application && step !== FormStep.Complete) {
      void router.replace("/new");
    }
  }, [application, router, step]);

  const { isLoading, data: applicants } =
    api.applicant.getForLoggedUser.useQuery(
      { isInProfile: true },
      {
        enabled: !!userId,
        onSuccess: (data) => {
          if (!newApplicant && data.length) {
            const mainApplicant = data.find((applicant) => applicant.isMain);
            if (mainApplicant) {
              setFormApplicant(mainApplicant);
            }
          }
        },
      }
    );

  const [formApplicant, setFormApplicant] = useState(newApplicant);

  const handleProfileApplicantChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;
    const profileApplicant =
      applicants?.find((applicant) => applicant.id === id) ?? newApplicant;
    setFormApplicant(profileApplicant);
  };

  // Create a new application when data are available and user is logged in
  useEffect(() => {
    if (step === FormStep.Complete && userId && newJob && newApplicant) {
      if (newApplicant.id) {
        createApplication({
          job: newJob,
          applicantId: newApplicant.id,
        });
      } else {
        createApplication({
          job: newJob,
          applicant: newApplicant,
        });
      }
    }
  }, [newJob, newApplicant, step, userId, createApplication]);

  useEffect(() => {
    if (!newApplicant && !newJob) {
      initFromLocalStore();
    }
  }, [newApplicant, newJob, initFromLocalStore]);

  const onJobFormSubmit = (data: JobData) => {
    setNewJob(data);
    nextStep();
  };

  const onApplicantFormSubmit = (data: ApplicantData) => {
    setNewApplicant(data);
    nextStep();
  };

  const openModal = (redirectUrl: string) => {
    setModalState({ isOpen: true, redirectUrl });
  };

  return (
    <Layout
      title="New Job Application"
      description="Create a new job application."
    >
      {/* Login Modal */}
      <SignInModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, redirectUrl: "" })}
        redirectUrl={modalState.redirectUrl}
      />

      {/* Step progress and navigation */}
      <div className="text-center">
        <ul className="steps steps-horizontal mx-auto w-full sm:w-96">
          <li className={"step-primary step"}>
            <Link href="new?step=job">Job</Link>
          </li>
          <li className={`${step !== FormStep.Job ? "step-primary" : ""} step`}>
            {step !== FormStep.Job ? (
              <Link href="new?step=applicant">Applicant</Link>
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
      <Title title="New Application" />
      <div className="flex flex-col gap-y-4">
        {/* First step Job Form */}
        {step === FormStep.Job && (
          <>
            <Title title="Job Details" type="section" />
            <JobForm job={newJob} onSubmit={onJobFormSubmit} />
          </>
        )}
        {/* Second step Applicant Form */}
        {step === FormStep.Applicant && (
          <>
            {/* show select for profile applicants if there are any */}
            <Title title="Applicant Details" type="section" />

            {userId && isLoading && (
              <Spinner text="Loading applicant from profile" />
            )}
            {applicants && applicants.length > 0 && (
              <>
                <div className="flex flex-col  gap-2 md:flex-row">
                  <label className="label">
                    <span className="label-text font-semibold text-primary">
                      Select an applicant from your profile
                    </span>
                  </label>
                  <select
                    className="select-bordered select w-full md:w-fit"
                    value={formApplicant?.id ?? "N/A"}
                    // defaultValue="N/A"
                    onChange={handleProfileApplicantChange}
                  >
                    <option value="N/A">-- Select an applicant --</option>
                    {applicants.map((applicant) => (
                      <option key={applicant.id} value={applicant.id}>
                        {applicant.jobTitle} - {applicant.firstName}{" "}
                        {applicant.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="divider">Or</div>
              </>
            )}
            <ApplicantForm
              applicant={formApplicant}
              onSubmit={onApplicantFormSubmit}
              forceNewOnEdit={!!userId}
            />
          </>
        )}
        {/* Third step Option Cards  */}
        {step === FormStep.Service && (
          <>
            <Title title="Select Service" type="section" />

            <div className="grid grid-cols-1 justify-evenly gap-x-4 gap-y-4 md:grid-cols-3">
              {serviceCardData.map((card) => (
                <BasicCard
                  Icon={card.icon}
                  key={card.url}
                  title={card.title}
                  description={card.description}
                  url={card.url}
                  onClick={userId ? undefined : () => openModal(card.url)}
                />
              ))}
            </div>
          </>
        )}
        {step === FormStep.Complete && (
          <div>
            {creatingApplication && <Spinner text="Creating application..." />}
            {!creatingApplication && applicationCreated && (
              <div>
                <Spinner text="Redirecting you..." />
              </div>
            )}
            {applicationCreationError && (
              <p className="text-erorr">
                An error occurred while creating your application. Please try
                again later.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NewApplication;
