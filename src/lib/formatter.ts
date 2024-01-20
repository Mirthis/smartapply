import { type TimeLeft } from "~/types/types";

export const formatApiMessage = (message: string): string[] => {
  const messages = message.split("\n");
  return messages;
};

// format number as a currency
export const formatCurrency = (
  value: number,
  currency: string,
  decimals = 2
): string => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: decimals,
    currencyDisplay: "narrowSymbol",
  });
  return formatter.format(value);
};

export const getTimeLeft = (date: Date): string => {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000;
  const days = Math.floor(diff / 60 / 60 / 24);
  const hours = Math.floor(diff / 60 / 60) % 24;
  const minutes = Math.floor(diff / 60) % 60;
  const seconds = Math.floor(diff) % 60;
  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};

// Calculate time left in days hours minutes seconds between a date and now. Return as object
export const getTimeLeftObject = (date: Date): TimeLeft => {
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000;
  const days = Math.floor(diff / 60 / 60 / 24);
  const hours = Math.floor(diff / 60 / 60) % 24;
  const minutes = Math.floor(diff / 60) % 60;
  const seconds = Math.floor(diff) % 60;
  return { days, hours, minutes, seconds };
};
