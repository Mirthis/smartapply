import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";

import { useState } from "react";

import { type NextPage } from "next";
import Link from "next/link";

import { api } from "~/utils/api";

import { Layout, Title } from "~/components";
import { DeleteApplicationModal } from "~/components/modals";
import Spinner from "~/components/utils/Spinner";

import { type ApplicationData } from "~/types/types";

const ApplicationsPage: NextPage = () => {
  const {
    data: applications,
    isLoading,
    isError,
  } = api.application.getAllForUser.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationData>();

  const handleDelete = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsOpen(true);
  };

  return (
    <Layout title="Saved Applications">
      {selectedApplication && (
        <DeleteApplicationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          application={selectedApplication}
        />
      )}
      <div className="flex items-center gap-x-4">
        <Title title="Saved Applications" />
        <Link href="/new">
          <button className="btn-ghost btn flex gap-x-2 text-accent underline">
            <PlusIcon className="h-6 w-6 " />
            <p>Create New</p>
          </button>
        </Link>
      </div>
      {isError ? (
        <p className="font-semibold">Error loading saved applications</p>
      ) : (
        <>
          {isLoading && <Spinner text={"Loading Saved Applications"} />}
          {!isLoading && applications?.length === 0 && (
            <p className="font-semibold">No saved applications</p>
          )}
          {!isLoading && applications?.length !== 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {applications?.map((application) => (
                <div
                  key={application.id}
                  className="card h-full w-full bg-base-200 xl:w-96"
                >
                  <div className="card-body flex flex-col gap-y-4">
                    <h2 className="card-title">
                      {application.job.title} @ {application.job.companyName}
                    </h2>
                    <div className="flex items-center gap-x-2">
                      <UserIcon className="h-6 w-6" />
                      <p>
                        {application.applicant.firstName}{" "}
                        {application.applicant.lastName} -{" "}
                        {application.applicant.jobTitle}
                      </p>
                    </div>

                    <div className="divider" />
                    <div className="grid w-full grid-cols-3">
                      <Link href={`/coverletter/${application.id}`}>
                        <div className="flex flex-col items-center gap-y-2 text-primary-focus hover:bg-base-300">
                          <DocumentTextIcon className="h-6 w-6" />
                          <p>Cover Letters</p>
                        </div>
                      </Link>
                      <Link href={`/interview/${application.id}`}>
                        <div className="flex flex-col items-center gap-y-2 text-primary-focus hover:bg-base-300">
                          <ChatBubbleLeftRightIcon className="h-6 w-6" />
                          <p>Interview</p>
                        </div>
                      </Link>
                      <Link href={`/test/${application.id}`}>
                        <div className="flex flex-col items-center gap-y-2 text-primary-focus hover:bg-base-300">
                          <ClipboardDocumentCheckIcon className="h-6 w-6" />
                          <p>Test</p>
                        </div>
                      </Link>
                    </div>
                    <div className="card-actions mt-2 justify-center text-sm ">
                      <button
                        className="font-bold uppercase text-error hover:underline"
                        onClick={() => handleDelete(application)}
                      >
                        Delete Application
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default ApplicationsPage;
