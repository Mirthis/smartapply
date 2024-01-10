import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";

import { api } from "~/lib/api";
import { useAppStore } from "~/store/store";
import { applicantSchema } from "~/types/schemas";
import { type ApplicantData, type ApplicationData } from "~/types/types";

import Spinner from "../utils/Spinner";
import ConfirmApplicationChangeModal from "./ConfirmApplicationChangeModal";
import Modal from "./Modal";

const EditApplicantModal = ({
  isOpen,
  onClose,
  application,
}: {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationData;
}) => {
  const { applicant, job, id: applicationId } = application;

  const { setApplication } = useAppStore((state) => state);

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const router = useRouter();

  const { mutateAsync: upsertApplication } =
    api.application.createOrUpdate.useMutation({
      onSuccess: (data) => {
        setApplication(data);
        if (applicationId && data.id !== applicationId) {
          const newUrl = router.asPath.replace(applicationId, data.id);
          void router.push(newUrl);
        }
        onClose();
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isDirty },
  } = useForm<ApplicantData>({
    resolver: zodResolver(applicantSchema),
    mode: "onTouched",
    defaultValues: {
      id: applicant?.id ?? "",
      firstName: applicant?.firstName ?? "",
      lastName: applicant?.lastName ?? "",
      jobTitle: applicant?.jobTitle ?? "",
      experience: applicant?.experience ?? "",
      resume: applicant?.resume ?? "",
      skills: applicant?.skills ?? "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpenConfirm(true);
  };

  const submitCreate = async (data: ApplicantData) => {
    if (!job?.id) return;
    await upsertApplication({
      applicationId: undefined,
      applicant: data,
      jobId: job.id,
    });
  };

  const submitUpdate = async (data: ApplicantData) => {
    if (!applicationId || !job?.id) return;

    await upsertApplication({
      applicationId,
      applicant: data,
      jobId: job.id,
    });
  };

  const confirmChange = (mode: "create" | "update") => {
    if (mode === "create") {
      void handleSubmit(submitCreate)();
    } else {
      void handleSubmit(submitUpdate)();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Applicant Details">
      <ConfirmApplicationChangeModal
        isOpen={isOpenConfirm}
        onClose={() => setIsOpenConfirm(false)}
        onConfirm={confirmChange}
      />
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-4">
          <input type="hidden" {...register("id")} />
          <div>
            <div className="flex gap-x-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
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
                  className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
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
                className="peer input-bordered input-primary input block w-full focus:outline-offset-0"
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
                className="peer textarea-bordered textarea-primary textarea w-full  focus:outline-offset-0"
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
              <p className="text-error">{errors.resume.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="skills"
                className="peer textarea-bordered textarea-primary textarea w-full  focus:outline-offset-0"
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
              <p className="text-error">{errors.skills.message}</p>
            )}
          </div>
          <div>
            <div className="relative">
              <textarea
                id="experience"
                className="peer textarea-bordered textarea-primary textarea w-full  focus:outline-offset-0"
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
              <p className="text-error">{errors.experience.message}</p>
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
    </Modal>
  );
};

export default EditApplicantModal;
