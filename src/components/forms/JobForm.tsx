/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type JobData } from "~/types/types";
import { jobSchema } from "~/types/schemas";
import Spinner from "../utils/Spinner";

const JobForm = ({
  job,
  onSubmit,
}: {
  job: JobData | undefined;
  onSubmit: (jobData: JobData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<JobData>({
    resolver: zodResolver(jobSchema),
    mode: "onTouched",
    defaultValues: {
      title: job?.title ?? "",
      description: job?.description ?? "",
      companyName: job?.companyName ?? "",
      companyDetails: job?.companyDetails ?? "",
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                id="title"
                className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
                placeholder=" "
                {...register("title")}
              />
              <label
                htmlFor="title"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Job Title *
              </label>
            </div>
            {errors.title && (
              <p className="text-error">{errors.title.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="description"
                className="peer textarea-bordered textarea-primary textarea w-full focus:outline-offset-0"
                placeholder=" "
                {...register("description")}
                rows={5}
              />
              <label
                htmlFor="description"
                className="absolute left-1 top-1 z-10 origin-[0] -translate-y-4 scale-75 transform bg-base-100 px-2 duration-300 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary"
              >
                Job Description *
              </label>
            </div>
            {errors.description && (
              <p className="text-error">{errors.description.message}</p>
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
