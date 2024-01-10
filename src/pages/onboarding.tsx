import {
  BriefcaseIcon,
  CheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import React, { useState } from "react";

import { Layout, Title } from "~/components";

import { api } from "~/lib/api";
import { cn } from "~/lib/utils";

const WelcomePage = () => {
  const {
    data: onboardingState,
    isLoading,
    isError,
  } = api.user.getOnboardingState.useQuery();

  return (
    <Layout title="Welcome to SmartApply">
      <div className="flex flex-col gap-4">
        <div>
          <Title className="text-center mb-0" title="Welcome to SmartApply!" />
          <p className="text-primary text-center text-lg">
            Follow the simple steps below to start using our tools.
          </p>
        </div>

        {!!onboardingState && (
          <>
            <div
              className={cn(
                "card border border-primary max-w-3xl w-full mx-auto",
                { "border-success": onboardingState.hasApplicant }
              )}
            >
              <div className=" flex gap-x-2">
                <UserIcon
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
                      className={cn("btn btn-primary w-48", {
                        "btn-outline btn-success pointer-events-none":
                          onboardingState.hasApplicant,
                      })}
                    >
                      {onboardingState.hasApplicant ? (
                        <CheckIcon className="h-6 w-6 font-bold" />
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
              className={cn(
                "card border border-primary max-w-3xl w-full mx-auto",
                {
                  "pointer-events-none opacity-50":
                    !onboardingState.hasApplicant,
                  "border-success": onboardingState.hasApplication,
                }
              )}
            >
              <div className=" flex gap-x-2">
                <BriefcaseIcon
                  className={cn("p-4 h-36 w-36 text-primary shrink-0", {
                    "text-success": onboardingState.hasApplication,
                  })}
                />
                {/* <div className="text-primary text-8xl">2</div> */}
                <div className="card-body ">
                  <div className="card-title">
                    Creeate your first job position
                  </div>
                  <div>
                    Found a job you like? Create your first position using
                    details from the job description.
                  </div>
                  <div className="card-actions justify-end">
                    <button
                      className={cn("btn btn-primary w-48", {
                        "btn-outline btn-success pointer-events-none":
                          onboardingState.hasApplication,
                      })}
                    >
                      {onboardingState.hasApplication ? (
                        <CheckIcon className="h-6 w-6 font-bold" />
                      ) : (
                        "Create Job"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chose your service */}
            <div
              className={cn(
                "card border border-primary max-w-3xl w-full mx-auto",
                {
                  "pointer-events-none opacity-50":
                    !onboardingState.hasApplicant ||
                    !onboardingState.hasApplication,
                }
              )}
            >
              <div className="flex gap-x-2">
                <CheckIcon className="p-4 h-36 w-36 text-primary shrink-0" />
                {/* <div className="text-primary text-8xl">2</div> */}
                <div className="card-body">
                  <div className="card-title">You are all set</div>
                  <div>
                    You find all your applications in the dashboard from where
                    you can start using the service you ned.
                  </div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary w-48">
                      View Dashboard
                    </button>
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
