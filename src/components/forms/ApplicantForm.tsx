/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppStore } from "~/store/store";
import { applicantSchema } from "~/types/schemas";
import { type ApplicantData } from "~/types/types";
import { useState } from "react";
import { ResetContent } from "../modals/ResetContent";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Spinner from "../utils/Spinner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const ApplicantForm = ({
  onSuccess,
  confirm,
  type = "application",
}: {
  onSuccess?: () => void;
  confirm?: boolean;
  type?: "application" | "profile";
}) => {
  const {
    applicant: storeApplicant,
    setApplicant: setStoreApplicant,
    resetGenerated,
  } = useAppStore((state) => state);
  const { isLoaded, userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // if profile force update profile flag
  const [updateProfile, setUpdateProfile] = useState<boolean>(
    type === "profile"
  );
  // if profile don't use the applicant from the store
  // const [applicant, setApplicant] = useState<ApplicantData | undefined>(
  //   type !== "profile" ? storeApplicant : undefined
  // );

  const { isFetching: isLoadingProfile, refetch: refetchProfile } =
    api.applicant.getForLoggedUser.useQuery(undefined, {
      enabled: isLoaded && !!userId && (!storeApplicant || type === "profile"),
      onSuccess: (data) => {
        if (data) {
          // update displayed applicant after retrieving from db
          reset(data, { keepDefaultValues: true });
          setUpdateProfile(true);
        }
      },
      refetchOnWindowFocus: false,
    });

  const { mutate } = api.applicant.createOrUpdate.useMutation({
    onSuccess: () => {
      // if not profile update the applicant in the store
      if (type === "profile") {
        void refetchProfile();
      }
    },
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
  } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    defaultValues: {
      id: storeApplicant?.id ?? undefined,
      firstName: storeApplicant?.firstName ?? "",
      lastName: storeApplicant?.lastName ?? "",
      jobTitle: storeApplicant?.jobTitle ?? "",
      resume: storeApplicant?.resume ?? "",
      skills: storeApplicant?.skills ?? "",
      experience: storeApplicant?.experience ?? "",
    },
  });

  // TODO: Add loading state
  // TODO: Add error state
  // TODO: Add applicant if logged in, and updateProfile is false
  // TODO: Manage update to db when not dirty
  const onSubmit = (data: ApplicantData) => {
    // if profile update profile
    if (isLoaded && userId && updateProfile) {
      mutate({ applicant: data, saveInProfile: true });
    }
    // if not profile update applicant in store
    if (isDirty && type === "application") {
      setStoreApplicant(data);
      resetGenerated();
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  const confirmSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  // TODO: avoid form from disappearing when loading from profile
  return (
    <>
      <ResetContent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleSubmit(onSubmit)}
      />

      <div>
        {isLoaded && userId && type === "application" && (
          <div className="mb-2 text-center">
            <button
              className="btn-ghost btn   w-80 text-primary"
              onClick={() => refetchProfile()}
              title="Reload data from profile"
            >
              {isLoadingProfile ? (
                <>
                  <Spinner />
                  Loading profile...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="mr-2 h-4 w-4" />
                  Load data from profile
                </>
              )}
            </button>
          </div>
        )}
        <form
          onSubmit={
            confirm && isDirty && type === "application"
              ? confirmSubmit
              : handleSubmit(onSubmit)
          }
        >
          <div className="flex flex-col gap-y-4">
            <input type="hidden" {...register("id")} />
            <div className="flex gap-x-2">
              <input
                type="text"
                className="input-bordered input w-1/2"
                placeholder="First Name"
                {...register("firstName")}
                disabled={isLoadingProfile || isSubmitting}
              />

              <input
                type="text"
                className="input-bordered input w-1/2"
                placeholder="Last Name"
                {...register("lastName")}
                disabled={isLoadingProfile || isSubmitting}
              />
            </div>
            {errors.lastName && (
              <p className="text-error">{errors.lastName.message}</p>
            )}
            {errors.firstName && (
              <p className="text-error">{errors.firstName.message}</p>
            )}

            <input
              type="text"
              className="textarea-bordered textarea"
              placeholder="Title (e.g. Software Engineer)"
              {...register("jobTitle")}
              disabled={isLoadingProfile || isSubmitting}
            />
            {errors.jobTitle && (
              <p className="text-error">{errors.jobTitle.message}</p>
            )}

            <textarea
              className="textarea-bordered textarea"
              placeholder="Resume"
              {...register("resume")}
              disabled={isLoadingProfile || isSubmitting}
              rows={4}
            />
            {errors.resume && (
              <p className="text-error">{errors.resume.message}</p>
            )}
            <textarea
              className="textarea-bordered textarea"
              placeholder="Skills"
              {...register("skills")}
              disabled={isLoadingProfile || isSubmitting}
              rows={4}
            />
            {errors.skills && (
              <p className="text-error">{errors.skills.message}</p>
            )}
            <textarea
              className="textarea-bordered textarea"
              placeholder="Experience"
              {...register("experience")}
              disabled={isLoadingProfile || isSubmitting}
              rows={4}
            />
            {errors.experience && (
              <p className="text-error">{errors.experience.message}</p>
            )}
            {isLoaded && userId && type === "application" && (
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    Save details in your profile
                  </span>
                  <input
                    type="checkbox"
                    onChange={(e) => setUpdateProfile(e.target.checked)}
                    className="toggle-primary toggle"
                    defaultChecked={updateProfile}
                  />
                </label>
              </div>
            )}
            <button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="btn-primary btn"
            >
              {isSubmitting ? (
                <>
                  <Spinner text="Saving data..." />
                </>
              ) : (
                <span>Save Applicant Data</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ApplicantForm;
