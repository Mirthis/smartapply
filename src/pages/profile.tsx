import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Title from "~/components/Title";
import { EditApplicantbModal } from "~/components/modals/EditApplicationModal";
import Spinner from "~/components/utils/Spinner";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { isLoading, data: applicant } =
    api.applicant.getForLoggedUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Head>
        <title>SmartApply - Profile</title>
        <meta property="og:title" content="SmartApply - Profile" key="title" />
      </Head>
      <EditApplicantbModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type="profile"
      />
      <Title title="Profile" />
      <div className="flex items-center gap-x-4">
        <Title title="Applicant Details" type="section" />
        <button
          className="btn-ghost btn-circle btn"
          onClick={() => setIsOpen(true)}
        >
          <PencilSquareIcon className="h-8 w-8 text-accent" />
        </button>
      </div>
      {/* TODO: add skeleton for loader */}
      {isLoading && <Spinner text="Loading applicant data..." />}
      {!isLoading && !applicant && <p>No applicant details saved.</p>}
      {applicant && (
        <div>
          <p className="text-lg font-semibold">
            {applicant.firstName} {applicant.lastName}
          </p>
          <p className="text-lg font-semibold">{applicant.jobTitle}</p>
          <Title title="Resume" type="subsection" />
          <p>{applicant.resume}</p>
          <Title title="Skills" type="subsection" />
          <p>{applicant.skills}</p>
          <Title title="Experience" type="subsection" />
          <p>{applicant.experience}</p>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
