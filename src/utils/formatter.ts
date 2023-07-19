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
