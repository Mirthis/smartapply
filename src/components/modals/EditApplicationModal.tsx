/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/lib/api";
import { cn } from "~/lib/utils";

import { useHasPro } from "~/hooks/useHasPro";
import { applicationSchema } from "~/types/schemas";
import { type ApplicationData, type EditApplicationData } from "~/types/types";

import Spinner from "../utils/Spinner";
import Modal from "./Modal";

const EditApplicationModal = ({
  isOpen,
  onClose,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  application?: ApplicationData;
}) => {
  const applicationId = application?.id;
  const utils = api.useContext();
  const { hasPro } = useHasPro();

  const { data: applicants, isLoading: isLoadingApplicants } =
    api.applicant.getForLoggedUser.useQuery(undefined, {
      onSuccess: (data) => {
        const mainApplicant = data.find((a) => a.isMain);
        if (mainApplicant && !application?.applicant.id) {
          setValue("applicantId", mainApplicant.id);
        }
      },
    });

  const {
    mutateAsync: upsertApplication,
    isLoading: isSubmitting,
    isError: isSubmitError,
  } = api.application.createOrUpdate.useMutation({
    onSuccess: () => {
      void utils.application.getAllForUser.invalidate();
      void utils.user.getOnboardingState.invalidate();

      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<EditApplicationData>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    setValue("title", application?.title ?? "");
    setValue("description", application?.description ?? "");
    setValue("companyName", application?.companyName ?? "");
    setValue("companyDetails", application?.companyDetails ?? "");

    setValue(
      "applicantId",
      application && (application.applicant.isMain || hasPro)
        ? application.applicant.id
        : ""
    );
  }, [application, setValue, hasPro]);

  const onSubmit = async (data: EditApplicationData) => {
    await upsertApplication({
      applicationId: applicationId,
      job: data,
      applicantId: data.applicantId,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Details">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          {applicants && applicants?.length === 0 && (
            <p className="alert alert-warning">
              You need to add an applicant to your profile before you can create
              a job.
            </p>
          )}
          <select
            disabled={isLoadingApplicants}
            className={cn("select-bordered select select-primary w-full", {
              "animate-pulse": isLoadingApplicants,
            })}
            aria-label="Select an applicant"
            // value={applicantId ?? "N/A"}
            // defaultValue={applicantId ?? "N/A"}
            {...register("applicantId")}
          >
            <option value="">-- Select an applicant --</option>
            {applicants?.map((applicant) => (
              <option
                key={applicant.id}
                value={applicant.id}
                // disabled={!applicant.isMain && !hasPro}
                className={applicant.isMain || hasPro ? "" : "hidden"}
              >
                {applicant.jobTitle} - {applicant.firstName}{" "}
                {applicant.lastName}
              </option>
            ))}
          </select>

          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                id="title"
                className="peer input-bordered input-secondary input block w-full focus:outline-offset-0"
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
                className="peer textarea-bordered textarea-secondary scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 textarea w-full focus:outline-offset-0"
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
                className="peer input-bordered input-secondary input block w-full focus:outline-offset-0"
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
                className="peer textarea-bordered textarea-secondary scrollbar-thin scrollbar-thumb-secondary hover:scrollbar-thumb-secondary/50 scrollbar-track-base-300 textarea w-full focus:outline-offset-0"
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
            aria-label="Save Application Data"
            disabled={!isValid || isSubmitting || !isDirty}
            type="submit"
            className="btn-primary btn"
          >
            {isSubmitting ? (
              <>
                <Spinner text="Saving..." />
              </>
            ) : (
              <span>Save Application Data</span>
            )}
          </button>
          {isSubmitError && (
            <div className="alert alert-error text-error-content">
              Oops! Something went wrong while saving your data. Please try
              again.
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditApplicationModal;
