import { PencilLine, Plus, Trash2, UserCircle } from "lucide-react";

import { useState } from "react";

import { type NextPage } from "next";

import { api } from "~/lib/api";
import { MAX_APPLICATIONS, MAX_APPLICATIONS_WO_PRO } from "~/lib/config";

import { Layout, Title } from "~/components";
import ServiceLinks from "~/components/ServiceLinks";
import { DeleteApplicationModal } from "~/components/modals";
import EditApplicationModal from "~/components/modals/EditApplicationModal";
import { ProMarker } from "~/components/utils";
import Spinner from "~/components/utils/Spinner";

import { useHasPro } from "~/hooks/useHasPro";
import { type ApplicationData } from "~/types/types";

const ApplicationsPage: NextPage = () => {
  const { hasPro } = useHasPro();

  const {
    data: applications,
    isLoading,
    isError,
  } = api.application.getAllForUser.useQuery();
  const [isDeleteApplicationOpen, setIsDeleteApplicationOpen] = useState(false);
  const [isEditApplicationOpen, setIsEditApplicationOpen] = useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationData>();

  const handleNew = () => {
    setSelectedApplication(undefined);
    setIsEditApplicationOpen(true);
  };

  const handleDelete = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsDeleteApplicationOpen(true);
  };

  const handleEdit = (application: ApplicationData) => {
    setSelectedApplication(application);
    setIsEditApplicationOpen(true);
  };

  const applicationsCount = applications?.length ?? Infinity;
  const maxAllowedApplications = hasPro
    ? MAX_APPLICATIONS
    : MAX_APPLICATIONS_WO_PRO;

  return (
    <Layout
      title="Dashboard"
      description="Access all your saved applications and their related content."
    >
      {selectedApplication && (
        <DeleteApplicationModal
          isOpen={isDeleteApplicationOpen}
          onClose={() => setIsDeleteApplicationOpen(false)}
          application={selectedApplication}
        />
      )}
      <EditApplicationModal
        isOpen={isEditApplicationOpen}
        onClose={() => setIsEditApplicationOpen(false)}
        application={selectedApplication}
      />
      <div className="flex items-center justify-between md:justify-start gap-x-4">
        <Title title="Dashboard" />
        <button
          className="btn text-accent no-underline disabled:bg-transparent btn-link font-bold flex gap-x-2 items-center hover:underline underline-offset-2"
          onClick={handleNew}
          disabled={applicationsCount >= maxAllowedApplications}
        >
          <Plus className="h-6 w-6 " />
          <p>Create New</p>
        </button>
      </div>

      {isError ? (
        <p className="font-semibold">Error loading saved applications</p>
      ) : (
        <>
          {isLoading && <Spinner text={"Loading Saved Applications"} />}
          {!isLoading && applicationsCount === 0 && (
            <p className="font-semibold">No saved applications</p>
          )}
          {!isLoading && applicationsCount !== 0 && (
            <>
              {applicationsCount >= maxAllowedApplications && (
                <p className="-mt-4 mb-4 text-sm">
                  You created {applicationsCount} of {maxAllowedApplications}{" "}
                  applications.
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {applications?.map((application) => (
                  <div
                    key={application.id}
                    className="card h-full w-full border border-primary xl:w-96"
                  >
                    <div className="card-body flex flex-col gap-y-2">
                      <h2 className="card-title">
                        {application.title}{" "}
                        {application.companyName
                          ? ` @ ${application.companyName}`
                          : ""}
                      </h2>
                      <div className="flex items-center gap-x-2">
                        <UserCircle className="h-6 w-6" />
                        <p>
                          {application.applicant.firstName}{" "}
                          {application.applicant.lastName} -{" "}
                          {application.applicant.jobTitle}
                        </p>
                      </div>

                      <div>
                        <div className="divider" />
                        {application.applicant.isMain || hasPro ? (
                          <ServiceLinks applicationId={application.id} />
                        ) : (
                          <ProMarker text="Change applicant or upgrade to pro to access all the features for this application." />
                        )}

                        <div className="divider" />
                      </div>
                      <div className="flex gap-y-2">
                        <div className="card-actions justify-center text-sm flex-1 ">
                          <button
                            className="font-bold uppercase text-secondary flex gap-x-2 items-center hover:underline underline-offset-2"
                            onClick={() => handleEdit(application)}
                          >
                            <PencilLine className="h-6 w-6" />
                            Edit
                          </button>
                        </div>
                        <div className="card-actions justify-center text-sm flex-1 ">
                          <button
                            className="font-bold flex gap-x-2 items-center uppercase text-error hover:underline underline-offset-2"
                            onClick={() => handleDelete(application)}
                          >
                            <Trash2 className="h-6 w-6" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default ApplicationsPage;
