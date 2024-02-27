import { TRPCError } from "@trpc/server";
import clsx, { type ClassValue } from "clsx";
import { type ParsedUrlQuery } from "querystring";
import { twMerge } from "tailwind-merge";

import { env } from "~/env.mjs";

export const addDelay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

type CaptchaVerifyResponse = {
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
    (await captchaResponse.json()) as CaptchaVerifyResponse;

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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") {
    return path;
  }
  if (env.SITE_DOMAIN) {
    return `https://${env.SITE_DOMAIN}${path}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export const getIdFromUrlQuery = (query: ParsedUrlQuery) => {
  return query.id && !Array.isArray(query.id) ? query.id : undefined;
};
