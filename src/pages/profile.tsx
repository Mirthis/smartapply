import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import Title from "~/components/Title";
import { EditApplicantbModal } from "~/components/modals/EditApplicationModal";
import Spinner from "~/components/utils/Spinner";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
  const { isLoading, data: applicants } =
    api.applicant.getForLoggedUser.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  const [isOpen, setIsOpen] = useState(false);
  const mainApplicant = applicants?.find((a) => a.isMain) ?? applicants?.[0];
  const otherApplicants = applicants?.filter((a) => a.id !== mainApplicant?.id);

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
      {!isLoading && !applicants && <p>No applicant details saved.</p>}
      {mainApplicant && (
        <div>
          <p className="text-lg font-semibold">
            {mainApplicant.firstName} {mainApplicant.lastName}
          </p>
          <p className="text-lg font-semibold">{mainApplicant.jobTitle}</p>
          <Title title="Resume" type="subsection" />
          <p>{mainApplicant.resume}</p>
          <Title title="Skills" type="subsection" />
          <p>{mainApplicant.skills}</p>
          <Title title="Experience" type="subsection" />
          <p>{mainApplicant.experience}</p>
        </div>
      )}
      {otherApplicants && otherApplicants.length > 0 && (
        <>
          <Title title="Other Applicants" type="section" />
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {applicants?.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>{applicant.jobTitle}</td>
                    <td>
                      <button>Edit</button>
                    </td>
                    <td>
                      <button>Delete</button>
                    </td>
                    <td>
                      <button>Make primary</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default ProfilePage;
