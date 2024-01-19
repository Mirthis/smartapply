/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/lib/api";
import {
  APPL_EXP_MAX_LENGTH,
  APPL_RESUME_MAX_LENGTH,
  APPL_SKILLS_MAX_LENGTH,
  applicantSchema,
} from "~/types/schemas";
import { type ApplicantFormData } from "~/types/types";

import Spinner from "../utils/Spinner";

const ApplicantForm = ({
  applicant,
  forceNewOnEdit = false,
  onSuccess,
}: {
  applicant: ApplicantFormData | undefined;
  forceNewOnEdit?: boolean;
  onSuccess?: () => void;
}) => {
  const utils = api.useContext();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    defaultValues: applicant,
  });

  const { mutateAsync: upsertApplicant, isLoading: isSubmitting } =
    api.applicant.createOrUpdate.useMutation({
      onSuccess: () => {
        void utils.applicant.getForLoggedUser.invalidate();
        void utils.user.getOnboardingState.invalidate();
        onSuccess?.();
      },
    });

  const onSubmit = (data: ApplicantFormData) => {
    const setAsMain = !applicant || applicant.isMain;

    void upsertApplicant({
      applicant: data,
      setAsMain,
    });
  };

  useEffect(() => {
    reset(applicant);
  }, [applicant, reset]);

  const onSubmitInner = (data: ApplicantFormData) => {
    data.id = forceNewOnEdit && isDirty ? undefined : data.id;
    onSubmit(data);
  };

  const { resume, experience, skills } = watch();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitInner)}>
        <div className="flex flex-col gap-y-4">
          <input type="hidden" {...register("id")} />
          <div>
            <div className="flex gap-x-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="peer input-bordered input-secondary input block w-full focus:outline-offset-0"
                  placeholder=" "
                  id={"firstName"}
                  {...register("firstName")}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="firstName"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  First Name *
                </label>
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  id="lastName"
                  className="peer input-bordered input-secondary input block w-full focus:outline-offset-0"
                  placeholder=" "
                  {...register("lastName")}
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="lastName"
                  className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
                >
                  Last Name *
                </label>
              </div>
            </div>
            {errors.firstName && (
              <p className="text-error">{errors.firstName.message}</p>
            )}
            {errors.lastName && (
              <p className="text-error">{errors.lastName.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                type="text"
                id="title"
                className="peer input-bordered input-secondary input block w-full focus:outline-offset-0"
                placeholder=" "
                {...register("jobTitle")}
                disabled={isSubmitting}
              />
              <label
                htmlFor="title"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
              >
                Job Title *
              </label>
            </div>
            {errors.jobTitle && (
              <p className="text-error">{errors.jobTitle.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="resume"
                className="peer textarea-bordered textarea-secondary scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 textarea w-full  focus:outline-offset-0"
                placeholder=" "
                {...register("resume")}
                disabled={isSubmitting}
                rows={4}
              />
              <label
                htmlFor="resume"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
              >
                Resume *
              </label>
            </div>
            {errors.resume && (
              <p className="text-error">
                {errors.resume.message}
                {resume.length > APPL_RESUME_MAX_LENGTH && (
                  <span> ({resume.length} used)</span>
                )}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="skills"
                className="peer textarea-bordered textarea-secondary scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 textarea w-full  focus:outline-offset-0"
                placeholder=" "
                {...register("skills")}
                disabled={isSubmitting}
                rows={4}
              />
              <label
                htmlFor="skills"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
              >
                Skills
              </label>
            </div>
            {errors.skills && (
              <p className="text-error">
                {errors.skills.message}

                {(skills?.length ?? 0) > APPL_SKILLS_MAX_LENGTH && (
                  <span> ({skills?.length} used)</span>
                )}
              </p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="experience"
                className="peer textarea-bordered textarea-secondary textarea w-full  focus:outline-offset-0 scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300"
                placeholder=" "
                {...register("experience")}
                disabled={isSubmitting}
                rows={4}
              />
              <label
                htmlFor="experience"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 font-extralight duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:font-normal peer-focus:text-primary"
              >
                Experience
              </label>
            </div>
            {errors.experience && (
              <p className="text-error">
                {errors.experience.message}

                {(experience?.length ?? 0) > APPL_EXP_MAX_LENGTH && (
                  <span> ({experience?.length} used)</span>
                )}
              </p>
            )}
          </div>

          <button
            disabled={!isValid || isSubmitting || !isDirty}
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
    </>
  );
};

export default ApplicantForm;
