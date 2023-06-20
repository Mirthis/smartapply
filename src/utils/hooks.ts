import { type ChatCompletionResponseMessage } from "openai";
import { useCallback, useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  type RefineMode,
  type ApplicantData,
  type JobData,
  type InterviewHookRequest,
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

type FetchStdArgs = {
  text?: string;
  messages?: ChatCompletionResponseMessage[];
};

export const useStreamingApi = <T>(
  fetchFn: (args: T & FetchStdArgs) => Promise<Response>,
  options?: {
    onSuccess: (data: string, args: T) => void;
    initMessages?: ChatCompletionResponseMessage[];
  }
) => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [messages, setMessages] = useState<ChatCompletionResponseMessage[]>(
    options?.initMessages ?? []
  );

  const execute = async (args: T & FetchStdArgs) => {
    setResult("");
    setIsLoading(true);
    setIsError(false);
    const requestMessages = messages;
    if (args.text) {
      requestMessages.push({
        content: args.text,
        role: "user",
      });
      setMessages(requestMessages);
    }

    const newMessage: ChatCompletionResponseMessage = {
      content: "",
      role: "assistant",
    };
    setMessages((prevMessages) => prevMessages.concat(newMessage));

    const response = await fetchFn({ ...args, messages: requestMessages });

    const data = response.body;

    if (!response.ok || !data) {
      setIsError(true);
      setIsLoading(false);
      setMessages((prevMessages) => prevMessages.slice(0, -1));
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
      const text = currentResponse.join("");
      setResult(text);
      newMessage.content = text;
      setMessages((prevMessages) => {
        return prevMessages.slice(0, -1).concat(newMessage);
      });
    }
    // breaks text indent on refresh due to streaming
    // localStorage.setItem('response', JSON.stringify(currentResponse));
    setIsLoading(false);

    if (options?.onSuccess) options.onSuccess(currentResponse.join(""), args);

    return currentResponse.join("");
  };

  const reset = () => {
    setResult("");
    setMessages([]);
  };

  return {
    execute,
    isLoading,
    isError,
    text: result,
    messages,
    reset,
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

export const useInterview = (options?: {
  onSuccess: (data: string) => void;
  initMessages?: ChatCompletionResponseMessage[];
}) => {
  const fn = (args: InterviewHookRequest) =>
    fetch("/api/interview", {
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
