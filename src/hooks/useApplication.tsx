import { useRouter } from "next/router";

import { api } from "~/lib/api";

export const useApplication = (applicationId: string) => {
  const router = useRouter();

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
