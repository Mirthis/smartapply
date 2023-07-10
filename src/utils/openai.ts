import { Configuration, OpenAIApi } from "openai";

import { env } from "~/env.mjs";

const configuration: Configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openaiClient = new OpenAIApi(configuration);
