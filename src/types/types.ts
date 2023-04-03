import { type z } from "zod";
import { type applicantSchema, type jobSchema } from "./schemas";

export type JobData = z.infer<typeof jobSchema>;
export type ApplicantData = z.infer<typeof applicantSchema>;
