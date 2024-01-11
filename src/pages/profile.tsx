import {
  ArrowUpTrayIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useState } from "react";

import { type NextPage } from "next";

import { Layout, Title } from "~/components";
import {
  DeleteProfileApplicantModal,
  EditProfileApplicantModal,
} from "~/components/modals";
import Spinner from "~/components/utils/Spinner";

import { api } from "~/lib/api";
import { type ApplicantData } from "~/types/types";

const ProfilePage: NextPage = () => {
  const utils = api.useContext();

  const {
    isLoading,
    data: applicants,
    isError,
  } = api.applicant.getForLoggedUser.useQuery({ isInProfile: true });

  const { mutate: setApplicantAsMain, isLoading: settingAsMain } =
    api.applicant.setAsMain.useMutation({
      onSuccess: () => {
        void utils.applicant.getForLoggedUser.invalidate();
      },
    });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [modalApplicant, setModalApplicant] = useState<ApplicantData>();
  const mainApplicant = applicants?.find((a) => a.isMain);
  const otherApplicants = applicants?.filter((a) => a.id !== mainApplicant?.id);

  const handleNewApplicant = () => {
    setModalApplicant(undefined);
    setIsEditOpen(true);
  };

  const handleEditApplicant = (selectedApplicant: ApplicantData) => {
    setModalApplicant(selectedApplicant);
    setIsEditOpen(true);
  };

  const handleRemoveApplicant = (selectedApplicant: ApplicantData) => {
    setModalApplicant(selectedApplicant);
    setIsRemoveOpen(true);
  };

  const handleSetAsMain = (selectedApplicant: ApplicantData) => {
    // TODO: fix typing so that id is not optional
    if (selectedApplicant.id) {
      void setApplicantAsMain({ id: selectedApplicant.id });
    }
  };

  return (
    <Layout title="Profile">
      <EditProfileApplicantModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        applicant={modalApplicant}
      />
      {modalApplicant && (
        <DeleteProfileApplicantModal
          isOpen={isRemoveOpen}
          onClose={() => setIsRemoveOpen(false)}
          applicant={modalApplicant}
        />
      )}

      <Title title="Profile" />
      <div className="flex items-center gap-x-4">
        <Title title="Saved Applicants" type="section" />
        <button
          className="btn-ghost btn flex gap-x-2 text-accent underline"
          onClick={handleNewApplicant}
        >
          <PlusIcon className="h-6 w-6 " />
          <p>Add new</p>
        </button>
      </div>
      {isError && (
        <p className="text-error">
          An error occurred while fetching applicant data.
        </p>
      )}
      {/* TODO: add skeleton for loader */}
      {isLoading && <Spinner text="Loading applicant data..." />}
      {!isLoading && applicants?.length === 0 && (
        <p>No applicant details saved.</p>
      )}
      {mainApplicant && (
        <>
          <div className="flex items-center gap-x-4">
            <Title title="Main Applicant" type="subsection" />
            <button
              className="btn-ghost btn-circle btn"
              onClick={() => handleEditApplicant(mainApplicant)}
            >
              <PencilSquareIcon className="h-6 w-6 text-accent" />
            </button>
          </div>
          <div>
            <p className="text-lg font-semibold">{mainApplicant.jobTitle}</p>
            <p className="text-lg">
              {mainApplicant.firstName} {mainApplicant.lastName}
            </p>
            <Title title="Resume" type="subsubsection" />
            <p>{mainApplicant.resume}</p>
            {mainApplicant.skills && (
              <>
                <Title title="Skills" type="subsubsection" />
                <p>{mainApplicant.skills}</p>
              </>
            )}
            {mainApplicant.experience && (
              <>
                <Title title="Experience" type="subsubsection" />
                <p>{mainApplicant.experience}</p>
              </>
            )}
          </div>
        </>
      )}
      {otherApplicants && otherApplicants.length > 0 && (
        <>
          <div className="divider" />
          <Title title="Other Applicants" type="subsection" />
          <div className="flex flex-col">
            {otherApplicants.map((applicant, i) => (
              <>
                <div
                  key={applicant.id}
                  className="flex items-center justify-between"
                >
                  <p>
                    <span className="font-semibold">{applicant.jobTitle}</span>
                    <br />
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <div className="flex">
                    <button
                      className="btn-ghost btn-circle btn"
                      onClick={() => handleEditApplicant(applicant)}
                    >
                      <PencilSquareIcon className="h-6 w-6 text-accent" />
                    </button>

                    <button
                      className="btn-ghost btn-circle btn"
                      onClick={() => handleSetAsMain(applicant)}
                      disabled={settingAsMain}
                    >
                      {settingAsMain ? (
                        <Spinner className="h-6 w-6 text-success" />
                      ) : (
                        <ArrowUpTrayIcon className="h-6 w-6 text-success" />
                      )}
                    </button>

                    <button
                      className="btn-ghost btn-circle btn"
                      onClick={() => handleRemoveApplicant(applicant)}
                    >
                      <TrashIcon className="h-6 w-6 text-error" />
                    </button>
                  </div>
                </div>
                {i !== otherApplicants.length - 1 && (
                  <div className="divider" />
                )}
              </>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProfilePage;
