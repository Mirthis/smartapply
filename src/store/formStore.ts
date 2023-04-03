import { create } from "zustand";

export enum FormStep {
  Job = "job",
  Applicant = "applicant",
  Complete = "complete",
}

type FormStore = {
  step: FormStep;
  setStep: (step: FormStep) => void;
};

export const useFormStore = create<FormStore>((set) => ({
  step: FormStep.Job,
  setStep: (step) => set({ step }),
}));
