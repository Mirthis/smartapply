/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormStep, useFormStore } from "~/store/formStore";
import { useAppStore } from "~/store/store";
import { applicantSchema } from "~/types/schemas";
import { type ApplicantData } from "~/types/types";

const ApplicantForm: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
  });

  const [applicant, setApplicant] = useAppStore((state) => [
    state.applicant,
    state.setApplicant,
  ]);
  const setFormStep = useFormStore((state) => state.setStep);

  const onSubmit = (data: ApplicantData) => {
    setApplicant(data);
    setFormStep(FormStep.Complete);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <input
          type="text"
          className="input-bordered input"
          placeholder="First Name"
          defaultValue={applicant?.firstName ?? ""}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p className="text-error">{errors.firstName.message}</p>
        )}

        <input
          type="text"
          className="textarea-bordered textarea"
          placeholder="Last Name"
          defaultValue={applicant?.lastName ?? ""}
          {...register("lastName")}
        />
        {errors.lastName && (
          <p className="text-error">{errors.lastName.message}</p>
        )}

        <input
          type="text"
          className="textarea-bordered textarea"
          placeholder="Title (e.g. Software Engineer)"
          defaultValue={applicant?.title ?? ""}
          {...register("title")}
        />
        {errors.title && <p className="text-error">{errors.title.message}</p>}

        <textarea
          className="textarea-bordered textarea"
          placeholder="Resume"
          defaultValue={applicant?.resume || ""}
          {...register("resume")}
        />
        {errors.resume && <p className="text-error">{errors.resume.message}</p>}
        <button disabled={!isValid} type="submit" className="btn-primary btn">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ApplicantForm;
