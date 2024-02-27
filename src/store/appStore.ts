import { create } from "zustand";

type AppStoreInitialState = {
  applicationId: string | undefined;
};

type AppStore = AppStoreInitialState & {
  setApplicationID: (applicationId: string | undefined) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  applicationId: "",
  setApplicationID: (applicationId) => set({ applicationId }),
}));
