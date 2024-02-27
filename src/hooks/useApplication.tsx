import { useRouter } from "next/router";

import { api } from "~/lib/api";

import { useAppStore } from "~/store/appStore";
import { useCoverLettersStore } from "~/store/coverLettersStore";
import { useInterviewStore } from "~/store/interviewStore";
import { useTestStore } from "~/store/testStore";

export const useApplication = (applicationId: string | undefined) => {
  const router = useRouter();
  const {
    applicationId: storeApplicationId,
    setApplicationID: setStoreApplicationID,
  } = useAppStore((state) => state);

  const resetCoverLetters = useCoverLettersStore((state) => state.reset);
  const resetTest = useTestStore((state) => state.resetTest);
  const resetInterview = useInterviewStore((state) => state.resetInterview);

  if (applicationId !== storeApplicationId) {
    resetCoverLetters();
    resetTest();
    resetInterview();
    setStoreApplicationID(applicationId);
  }

  const { data, isFetching } = api.application.get.useQuery(
    {
      id: applicationId ?? "N/A",
    },
    {
      enabled: !!applicationId,

      onError: (error) => {
        if (error.message === "No Application found") {
          void router.replace("/");
        }
      },
    }
  );
  return { application: data, isFetching };
};
