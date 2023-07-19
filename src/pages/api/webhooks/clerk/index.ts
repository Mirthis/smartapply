import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const evt = req.body as WebhookEvent;
  switch (evt.type) {
    case "user.created": // this is typed
      const user = await prisma.user.create({
        data: {
          id: evt.data.id,
          email: evt.data.email_addresses[0]?.email_address,
        },
      });
      return res.status(200).json(user);
    default:
      console.warn("Clerk webhooks - unhandled event type: ", evt.type);
      return res.status(200).send("ok");
  }
};

export default handler;
