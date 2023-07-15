import { TRPCError } from "@trpc/server";

import { env } from "~/env.mjs";

export const addDelay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

type CapctchaVerifyResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  "error-codes": string[];
};

export const validateRecaptcha = async (token: string) => {
  const captchaResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );
  const captchaResponseData =
    (await captchaResponse.json()) as CapctchaVerifyResponse;

  const isHuman = captchaResponseData?.success;

  if (!isHuman) {
    throw new TRPCError({
      message: "Captcha validation failed",
      code: "BAD_REQUEST",
    });
  }
};

// TODO: Use for more complex responses or get rid of it
export const getFakeAiResponse = async (text: string): Promise<string> => {
  await addDelay(1000);
  return text;
};
