import { useCallback, useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  type RefineMode,
  type ApplicantData,
  type JobData,
} from "~/types/types";

export const useRecaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [captchaToken, setCaptchToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.error("Execute recaptcha not yet available");
      return;
    }
    try {
      const token = await executeRecaptcha("yourAction");
      if (token) {
        setCaptchToken(token);
      } else {
        setCaptchaError("Captcha failed");
      }
      return token;
    } catch (err) {
      console.error(err);
      setCaptchaError("Captcha failed");
    }
    // setCaptchToken(token);
  }, [executeRecaptcha]);

  return {
    captchaReady: executeRecaptcha,
    captchaToken,
    captchaError,
    handleReCaptchaVerify,
  };
};

export const useStreamingApi = <T>(
  fetchFn: (args: T) => Promise<Response>,
  options?: {
    onSuccess: (data: string, args: T) => void;
  }
) => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const execute = async (args: T) => {
    setIsLoading(true);
    setIsError(false);
    const response = await fetchFn(args);

    const data = response.body;

    if (!response.ok || !data) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let currentResponse: string[] = [];
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      currentResponse = [...currentResponse, chunkValue];
      setResult(currentResponse.join(""));
    }
    // breaks text indent on refresh due to streaming
    // localStorage.setItem('response', JSON.stringify(currentResponse));
    setIsLoading(false);

    if (options?.onSuccess) options.onSuccess(currentResponse.join(""), args);

    return currentResponse.join("");
  };

  return {
    execute,
    isLoading,
    isError,
    text: result,
  };
};

export const useGenerateCoverLetter = (options?: {
  onSuccess: (data: string) => void;
}) => {
  const fn = (args: { job: JobData; applicant: ApplicantData }) =>
    fetch("/api/newCoverLetter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        job: args.job,
        applicant: args.applicant,
      }),
    });

  return useStreamingApi(fn, options);
};

type RefineCoverLetterArgs = {
  job: JobData;
  applicant: ApplicantData;
  srcCoverLetter: string;
  refineMode: RefineMode;
  refineText: string;
};

export const useRefineCoverLetter = (options?: {
  onSuccess: (data: string, args: RefineCoverLetterArgs) => void;
}) => {
  const fn = (args: RefineCoverLetterArgs) =>
    fetch("/api/refineCoverLetter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...args,
      }),
    });

  return useStreamingApi(fn, options);
};

export const useValidateTestResponse = (options?: {
  onSuccess: (data: string) => void;
}) => {
  const fn = (args: {
    job: JobData;
    applicant: ApplicantData;
    question: string;
    answer: string;
  }) =>
    fetch("/api/validateTestResponse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...args,
      }),
    });
  return useStreamingApi(fn, options);
};

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
