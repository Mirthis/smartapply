import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { type NextApiRequest, type NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const evt = req.body as WebhookEvent;
  switch (evt.type) {
    case "user.created": // this is typed
      console.log("event data");
      console.log(evt.data);
  }
  return res.status(200).send("ok");
};

export default handler;
