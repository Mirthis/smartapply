/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormStep, useFormStore } from "~/store/formStore";
import { useAppStore } from "~/store/store";
import { type JobData } from "~/types/types";
import { jobSchema } from "~/types/schemas";

const JobForm: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
    mode: "onTouched",
  });

  const job = useAppStore((state) => state.job);
  const setJob = useAppStore((state) => state.setJob);
  const setFormStep = useFormStore((state) => state.setStep);

  const onSubmit = (data: JobData) => {
    setJob(data);
    setFormStep(FormStep.Applicant);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-4">
        <input
          type="text"
          className="input-bordered input"
          placeholder="Job Title"
          defaultValue={job?.jobTitle ?? ""}
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p className="text-error">{errors.jobTitle.message}</p>
        )}
        <textarea
          className="textarea-bordered textarea"
          placeholder="Job Description"
          defaultValue={job?.jobDescription ?? ""}
          {...register("jobDescription")}
        />
        {errors.jobDescription && (
          <p className="text-error">{errors.jobDescription.message}</p>
        )}
        <input
          type="text"
          className="input-bordered input"
          placeholder="Hiring Company"
          {...register("companyName")}
          defaultValue={job?.companyName ?? ""}
        />
        {errors.companyName && (
          <p className="text-error">{errors.companyName.message}</p>
        )}
        <textarea
          className="textarea-bordered textarea"
          placeholder="Company Description"
          {...register("companyDetails")}
          defaultValue={job?.companyDetails ?? ""}
        />
        {errors.companyDetails && (
          <p className="text-error">{errors.companyDetails.message}</p>
        )}
        <button disabled={!isValid} type="submit" className="btn-primary btn">
          Submit
        </button>
      </div>
    </form>
  );
};

export default JobForm;
