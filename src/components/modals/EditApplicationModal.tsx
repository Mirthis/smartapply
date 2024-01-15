/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "~/lib/api";
import { cn } from "~/lib/utils";
import { appplicationSchema } from "~/types/schemas";
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
    resolver: zodResolver(appplicationSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    setValue("title", application?.title ?? "");
    setValue("description", application?.description ?? "");
    setValue("companyName", application?.companyName ?? "");
    setValue("companyDetails", application?.companyDetails ?? "");
    setValue("applicantId", application?.applicant.id ?? "");
  }, [application, setValue]);

  const onSubmit = async (data: EditApplicationData) => {
    await upsertApplication({
      applicationId: applicationId,
      job: data,
      applicantId: data.applicantId,
    });
  };

  // const submitCreate = async (data: JobData) => {
  //   if (!applicant?.id) return;
  //   await upsertApplication({
  //     applicationId: undefined,
  //     job: data,
  //     applicantId: applicant.id,
  //   });
  // };

  // const submitUpdate = async (data: JobData) => {
  //   if (!applicationId || !applicant?.id) return;

  //   await upsertApplication({
  //     applicationId,
  //     job: data,
  //     applicantId: applicant.id,
  //   });
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Details">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-4">
          {/* <label className="label">
              <span className="label-text font-semibold text-primary">
                Select an applicant from your profile
              </span>
            </label> */}
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
            // value={applicantId ?? "N/A"}
            // defaultValue={applicantId ?? "N/A"}
            {...register("applicantId")}
          >
            <option value="">-- Select an applicant --</option>
            {applicants?.map((applicant) => (
              <option key={applicant.id} value={applicant.id}>
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
            <p className="text-error">
              An error occurred. Please try again later.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditApplicationModal;
