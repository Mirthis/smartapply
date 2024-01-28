import { type Application } from "@prisma/client";
import { type ChatCompletionMessageParam } from "openai/resources";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import {
  type ApplicantFormData,
  type ApplicationData,
  type InterviewHookRequest,
  type JobData,
  type RefineMode,
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
  messages?: ChatCompletionMessageParam[];
};

export const useStreamingApi = <T>(
  fetchFn: (args: T & FetchStdArgs) => Promise<Response>,
  options?: {
    onSuccess: (data: string, args: T) => void;
    initMessages?: ChatCompletionMessageParam[];
  }
) => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>(
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

    const newMessage: ChatCompletionMessageParam = {
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
    if (newMessage.content && newMessage.content.endsWith("*END*")) {
      newMessage.content = newMessage.content.replace("*END*", "");
      setMessages((prevMessages) => {
        return prevMessages.slice(0, -1).concat(newMessage);
      });
    }
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
  const fn = (args: { application: Application }) =>
    fetch("/api/newCoverLetter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application: args.application,
      }),
    });

  return useStreamingApi(fn, options);
};

export const useInterview = (options?: {
  onSuccess: (data: string) => void;
  initMessages?: ChatCompletionMessageParam[];
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

type ExtractApplicantArgs = {
  resumeText: string;
};

export const useExtractApplicant = (options?: {
  onSuccess: (data: string, args: ExtractApplicantArgs) => void;
}) => {
  const fn = (args: ExtractApplicantArgs) =>
    fetch("/api/extractApplicant", {
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
  application: ApplicationData;
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
    applicant: ApplicantFormData;
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

export const useInterval = (
  callback: () => void,
  delay: number,
  stop: boolean
) => {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    if (!stop) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, stop]);
};

export default useStore;
