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
      // Return user
      return res.status(200).json(user);
    // case "session.created":
    //   // create or update user, fail safe if user is not created during creation event
    //   const user2 = await prisma.user.upsert({
    //     where: {
    //       clerkId: evt.data.user_id,
    //     },
    //     update: {
    //       email: evt.data.email_addresses[0]?.email_address,
    //     },
    //     create: {
    //       clerkId: evt.data.user_id,
    //       email: evt.data.email_addresses[0]?.email_address,
    //     },
    //   });
    //   // Return user
    //   return res.status(200).json(user2);
    default:
      console.log("unhandled event type");
      console.log(evt.type);
      return res.status(200).send("ok");
  }
};

export default handler;
