export const formatApiMessage = (message: string): string[] => {
  const messages = message.split("\n\n");
  return messages;
};
