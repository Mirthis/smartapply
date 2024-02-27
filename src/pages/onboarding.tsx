import { Briefcase, Check, UserCircle } from "lucide-react";

import React, { useState } from "react";

import Link from "next/link";

import { api } from "~/lib/api";
import { cn } from "~/lib/utils";

import { Layout, Title } from "~/components";
import { EditProfileApplicantModal } from "~/components/modals";
import EditApplicationModal from "~/components/modals/EditApplicationModal";
import { Spinner } from "~/components/utils";

const WelcomePage = () => {
  const {
    data: onboardingState,
    isLoading,
    isError,
  } = api.user.getOnboardingState.useQuery(undefined, {
    keepPreviousData: true,
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);

  return (
    <Layout title="Welcome to SmartApply">
      <EditProfileApplicantModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <EditApplicationModal
        isOpen={isEditApplicationOpen}
        onClose={() => setIsEditApplicationOpen(false)}
      />
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        <div>
          <Title className="text-center mb-0" title="Welcome to SmartApply!" />
          <p className="text-primary text-center text-lg">
            Follow the simple steps below to start using our tools.
          </p>
        </div>

        {isError && (
          <div className="alert alert-error">
            Something went wrong while loading your data. Please try again
            later.
          </div>
        )}
        {isLoading && !onboardingState && (
          <div className="flex justify-center">
            <Spinner text="Loading onboarding state" />
          </div>
        )}
        {!!onboardingState && (
          <>
            <div
              className={cn("card border border-primary  w-full", {
                "border-success": onboardingState.hasApplicant,
              })}
            >
              <div className=" flex gap-x-2">
                <UserCircle
                  className={cn("p-4 h-36 w-36 text-primary shrink-0", {
                    "text-success": onboardingState.hasApplicant,
                  })}
                />
                {/* <div className="text-primary text-8xl">2</div> */}
                <div className="card-body">
                  <div className="card-title">Fill in your profile</div>
                  <div>
                    Tell us about you and your professional career. This will
                    make sure the generated content is tailored to you.
                  </div>
                  <div className="card-actions justify-end">
                    <button
                      aria-label="Update Profile"
                      className={cn("btn btn-primary w-48", {
                        "btn-outline btn-success pointer-events-none":
                          onboardingState.hasApplicant,
                      })}
                      onClick={() => setIsEditProfileOpen(true)}
                    >
                      {onboardingState.hasApplicant ? (
                        <Check className="h-6 w-6 font-bold" />
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Application */}
            <div
              className={cn("card border border-primary w-full", {
                "pointer-events-none opacity-50": !onboardingState.hasApplicant,
                "border-success": onboardingState.hasApplication,
              })}
            >
              <div className=" flex gap-x-2">
                <Briefcase
                  className={cn("p-4 h-36 w-36 text-primary shrink-0", {
                    "text-success": onboardingState.hasApplication,
                  })}
                />
                {/* <div className="text-primary text-8xl">2</div> */}
                <div className="card-body ">
                  <div className="card-title">
                    Create your first job position
                  </div>
                  <div>
                    Found a job you like? Create your first position using
                    details from the job description.
                  </div>
                  <div className="card-actions justify-end">
                    <button
                      aria-label="Create Application"
                      className={cn("btn btn-primary w-48", {
                        "btn-outline btn-success pointer-events-none":
                          onboardingState.hasApplication,
                      })}
                      onClick={() => setIsEditApplicationOpen(true)}
                    >
                      {onboardingState.hasApplication ? (
                        <Check className="h-6 w-6 font-bold" />
                      ) : (
                        "Create Application"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chose your service */}
            <div
              className={cn("card border border-primary max-w-3xl w-full", {
                "pointer-events-none opacity-50":
                  !onboardingState.hasApplicant ||
                  !onboardingState.hasApplication,
              })}
            >
              <div className="flex gap-x-2">
                <Check className="p-4 h-36 w-36 text-primary shrink-0" />
                {/* <div className="text-primary text-8xl">2</div> */}
                <div className="card-body">
                  <div className="card-title">You are all set</div>
                  <div>
                    You find all your applications in the dashboard from where
                    you can start using the service you ned.
                  </div>
                  <div className="card-actions justify-end">
                    <Link className="btn btn-primary w-48" href="/dashboard">
                      View Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WelcomePage;
