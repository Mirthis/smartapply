import { PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link";
import { DeleteApplictionbModal } from "~/components/modals/DeleteApplicationModal";
import { useState } from "react";
import { type ApplicationData } from "~/types/types";
import Head from "next/head";
import Title from "~/components/Title";
import Spinner from "~/components/utils/Spinner";

const ApplicationsPage: NextPage = () => {
  const { data: applications, isLoading } =
    api.application.getAllForUser.useQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationData>();

  const handleDelete = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsOpen(true);
  };

  return (
    <>
      <Head>
        <title>SmartApply - Cover Letter Generator</title>
        <meta
          property="og:title"
          content="SmartApply - Saved Applications"
          key="title"
        />
      </Head>
      {selectedApplication && (
        <DeleteApplictionbModal
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
                <div className="card-actions mt-2 justify-center text-sm  ">
                  <button
                    className="text-error hover:underline"
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
  );
};

export default ApplicationsPage;
