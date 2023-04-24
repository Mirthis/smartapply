/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppStore } from "~/store/store";
import { applicantSchema } from "~/types/schemas";
import { type ApplicantData } from "~/types/types";
import { useState } from "react";
import { ResetContent } from "../modals/ResetContent";

const ApplicantForm = ({
  onSuccess,
  confirm,
}: {
  onSuccess?: () => void;
  confirm?: boolean;
}) => {
  const { applicant, setApplicant, resetGenerated } = useAppStore(
    (state) => state
  );
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: applicant?.firstName ?? "",
      lastName: applicant?.lastName ?? "",
      title: applicant?.title ?? "",
      resume: applicant?.resume ?? "",
      skills: applicant?.skills ?? "",
      experience: applicant?.experience ?? "",
    },
  });

  const onSubmit = (data: ApplicantData) => {
    if (isDirty) {
      setApplicant(data);
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

  return (
    <>
      <ResetContent
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleSubmit(onSubmit)}
      />
      <form
        onSubmit={confirm && isDirty ? confirmSubmit : handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4">
          <input
            type="text"
            className="input-bordered input"
            placeholder="First Name"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-error">{errors.firstName.message}</p>
          )}

          <input
            type="text"
            className="textarea-bordered textarea"
            placeholder="Last Name"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-error">{errors.lastName.message}</p>
          )}

          <input
            type="text"
            className="textarea-bordered textarea"
            placeholder="Title (e.g. Software Engineer)"
            {...register("title")}
          />
          {errors.title && <p className="text-error">{errors.title.message}</p>}

          <textarea
            className="textarea-bordered textarea"
            placeholder="Resume"
            {...register("resume")}
            rows={5}
          />
          {errors.resume && (
            <p className="text-error">{errors.resume.message}</p>
          )}
          <textarea
            className="textarea-bordered textarea"
            placeholder="Skills"
            {...register("skills")}
            rows={5}
          />
          {errors.skills && (
            <p className="text-error">{errors.skills.message}</p>
          )}
          <textarea
            className="textarea-bordered textarea"
            placeholder="Experience"
            {...register("experience")}
            rows={5}
          />
          {errors.experience && (
            <p className="text-error">{errors.experience.message}</p>
          )}
          <button disabled={!isValid} type="submit" className="btn-primary btn">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default ApplicantForm;
