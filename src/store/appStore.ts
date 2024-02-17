import { create } from "zustand";

type AppStoreInitialState = {
  applicationId: string;
};

type AppStore = AppStoreInitialState & {
  setApplicationID: (applicationId: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  applicationId: "",
  setApplicationID: (applicationId) => set({ applicationId }),
}));
