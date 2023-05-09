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

  console.log("job", job);

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

      {/* <div class="relative">
    <input type="text" id="floating_outlined" class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
    <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Floating outlined</label>
</div> */}

      <form onSubmit={confirm ? confirmSubmit : handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                id="jobTitle"
                className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                placeholder=" "
                {...register("jobTitle")}
              />
              <label
                htmlFor="jobTitle"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Job Title
              </label>
            </div>
            {errors.jobTitle && (
              <p className="text-error">{errors.jobTitle.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="jobDescription"
                className="peer textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
                placeholder=" "
                {...register("jobDescription")}
                rows={5}
              />
              <label
                htmlFor="jobDescription"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Job Description
              </label>
            </div>
            {errors.jobDescription && (
              <p className="text-error">{errors.jobDescription.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <input
                id="companyName"
                type="text"
                className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                placeholder=" "
                {...register("companyName")}
              />
              <label
                htmlFor="companyName"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Hiring Company
              </label>
            </div>
            {errors.companyName && (
              <p className="text-error">{errors.companyName.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="companyDetails"
                className="peer textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
                placeholder=" "
                {...register("companyDetails")}
                rows={5}
              />
              <label
                htmlFor="companyDetails"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Company Description
              </label>
            </div>
            {errors.companyDetails && (
              <p className="text-error">{errors.companyDetails.message}</p>
            )}
          </div>
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
