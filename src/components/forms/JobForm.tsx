/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppStore } from "~/store/store";
import { type JobData } from "~/types/types";
import { jobSchema } from "~/types/schemas";
import { ResetContent } from "../modals/ResetContent";
import { useState } from "react";
import Spinner from "../utils/Spinner";

const JobForm = ({
  onSuccess,
  confirm,
}: {
  onSuccess?: () => void;
  confirm?: boolean;
}) => {
  const { job, setJob, resetGenerated } = useAppStore((state) => state);
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
    mode: "onTouched",
    defaultValues: {
      jobTitle: job?.jobTitle ?? "",
      jobDescription: job?.jobDescription ?? "",
      companyName: job?.companyName ?? "",
      companyDetails: job?.companyDetails ?? "",
    },
  });

  const onSubmit = (data: JobData) => {
    setJob(data);
    if (onSuccess) {
      onSuccess();
    }
    resetGenerated();
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
      <form onSubmit={confirm ? confirmSubmit : handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          <input
            type="text"
            className="input-bordered input"
            placeholder="Job Title"
            {...register("jobTitle")}
          />
          {errors.jobTitle && (
            <p className="text-error">{errors.jobTitle.message}</p>
          )}
          <textarea
            className="textarea-bordered textarea"
            placeholder="Job Description"
            {...register("jobDescription")}
            rows={5}
          />
          {errors.jobDescription && (
            <p className="text-error">{errors.jobDescription.message}</p>
          )}
          <input
            type="text"
            className="input-bordered input"
            placeholder="Hiring Company"
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="text-error">{errors.companyName.message}</p>
          )}
          <textarea
            className="textarea-bordered textarea"
            placeholder="Company Description"
            {...register("companyDetails")}
            rows={5}
          />
          {errors.companyDetails && (
            <p className="text-error">{errors.companyDetails.message}</p>
          )}
          <button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="btn-primary btn"
          >
            {isSubmitting ? (
              <>
                <Spinner text="Saving..." />
              </>
            ) : (
              <span>Save Job Data</span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default JobForm;
