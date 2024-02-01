import { api } from "~/lib/api";
import { IS_PRO_ENABLED } from "~/lib/config";

export const useHasPro = () => {
  return { hasPro: false, isLoading: false, isError: false };
  if (!IS_PRO_ENABLED) {
    return {
      hasPro: true,
      isLoading: false,
      isError: false,
      isConfirmed: true,
    };
  }
  const {
    data: proStatus,
    isLoading,
    isError,
  } = api.user.getProState.useQuery(undefined, {
    enabled: IS_PRO_ENABLED,
  });

  const hasPro = proStatus?.hasPro ?? false;
  return {
    hasPro,
    isLoading,
    isError,
    proStatus,
    isConfirmed: proStatus !== undefined,
  };
};
